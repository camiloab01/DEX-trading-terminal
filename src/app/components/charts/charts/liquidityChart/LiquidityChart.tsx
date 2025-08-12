import { PoolTokenInfo, useDataContext } from '../../../../context/DataContext'
import { topBarheight } from './constants'
import { IBounds } from './type'
import { getLiquidityDataFromSnapshot } from './util'
import { useCallback, useEffect, useRef, useState } from 'react'
import TopBarLiquidityChart from '../../tools/TopBarLiquidityChart'
import { getNearestTick, price2Tick, tick2Price } from '../../../../lib/liquidity'
import { BetweenNumbers } from '../../../../util/between'
import { useEchart } from '../../../../hooks/useEchart'
import { renderToStaticMarkup } from 'react-dom/server'
import { formatNumber } from '../../../numbers/FormatNumber'
import { useChartDataContext } from '../../context/ChartDataContext'
import { useMouseDrag } from '../../../../hooks/useMouseDrag'
import { colors } from '../../../../constants/colors'
import { parseColor, toRgba } from '../../../../util/colors'
import rgba from 'color-rgba'
import { useChainLoader } from '../../../../route/loaderData'
import { ElementEvent, graphic } from 'echarts/core'
import { MAX_TICK, MIN_TICK } from '../../../../v3-sdk'

interface LiquidityChartProps {
  topbar?: boolean
}

const calculateDefaultBounds = (tickSpacing: number, currentTick: number, token: PoolTokenInfo) => {
  if (token === undefined) return undefined
  const px = tick2Price(currentTick, token)
  const pxDiff = Math.min(0.6, tickSpacing / 250)
  const pxLow = px * (1 + pxDiff)
  const pxHigh = px * (1 - pxDiff)
  if (isNaN(pxHigh) || isNaN(pxLow)) return undefined
  const newBounds = {
    lower: price2Tick(pxLow, token),
    upper: price2Tick(pxHigh, token),
  }
  if (newBounds.lower > newBounds.upper) {
    ;[newBounds.lower, newBounds.upper] = [newBounds.upper, newBounds.lower]
  }
  return newBounds
}

function LiquidityChart({ topbar }: LiquidityChartProps) {
  const { token, liquidityChart, tickSpacing, poolSummary } = useDataContext()
  const { currentChain } = useChainLoader()
  const [lastPoolAddress, setLastPoolAddress] = useState('')
  const [currentTick, setCurrentTick] = useState<undefined | number>(undefined)
  const { highlightBounds, setHighlightBounds } = useChartDataContext()
  const [liqData, setLiqData] = useState<
    { ticks: { tick: number; price: number; amount: number }[]; currentTick: number; tickSpacing: number } | undefined
  >()
  const [zoomEvent, setZoomEvent] = useState(0)
  const defaultBounds = useCallback(() => {
    if (liquidityChart === undefined || token === undefined) return undefined
    return calculateDefaultBounds(liquidityChart.tick_spacing, liquidityChart.current_pool_tick, token)
  }, [liquidityChart, token])
  const [bounds, setBoundsRaw] = useState<IBounds | undefined>(defaultBounds)
  const setBounds = (v?: IBounds) => {
    if (v === undefined) {
      setBoundsRaw(defaultBounds())
      return
    }
    if (isNaN(v.upper) || isNaN(v.lower)) {
      return
    }
    if (liquidityChart) {
      if (v.upper - v.lower < liquidityChart.tick_spacing * 4) {
        return
      }
    }
    if ([v.upper > MAX_TICK, v.upper < MIN_TICK, v.lower < MIN_TICK].some((x) => x)) {
      return
    }
    setBoundsRaw(v)
  }
  const chartRef = useRef<HTMLDivElement>(null)
  const { zoom, firstChild, echart } = useEchart({
    chartRef,
    options: {
      animationDuration: 250,
      visualMap: [],
      grid: {
        top: 10,
        left: 30,
        right: 60,
      },
      dataZoom: [
        {
          id: 'dataZoomX1',
          show: true,
          type: 'inside',
          realtime: true,
          start: 25,
          end: 75,
          xAxisIndex: [0],
          moveOnMouseMove: 'shift',
          minSpan: 5,
          preventDefaultMouseMove: false,
        },
        {
          id: 'dataZoomX2',
          show: true,
          showDataShadow: false,
          type: 'slider',
          realtime: true,
        },
      ],
      toolbox: {
        show: false,
      },
      brush: {
        brushMode: 'single',
        xAxisIndex: 'all',
        brushLink: 'all',
        brushStyle: {
          color: toRgba(rgba(colors.blue[300]), 0.25),
        },
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (x) => {
            return formatNumber({ num: x })
          },
        },
      },
      yAxis: {
        type: 'value',
        position: 'right',
        min: 0,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'liquidityfull',
          type: 'line',
          xAxisIndex: 0,
          step: 'end',
          symbol: 'none',
        },
        {
          name: 'liquidityone',
          type: 'line',
          xAxisIndex: 0,
          step: 'end',
          symbol: 'none',
        },
        {
          name: 'liquiditytwo',
          type: 'line',
          xAxisIndex: 0,
          step: 'start',
          symbol: 'none',
        },
      ],
    },
  })

  useEffect(() => {
    if (!firstChild || !echart) {
      return
    }
    const zoomCb = (e: Event) => {
      setZoomEvent(e.timeStamp)
    }
    firstChild.addEventListener('wheel', zoomCb)
    return () => {
      firstChild.removeEventListener('wheel', zoomCb)
    }
  }, [firstChild, echart])

  const { dragStartTick, setDragStartTick, dragStopTick, setDragStopTick } = useMouseDrag()

  useEffect(() => {
    // When dragging whole highlighted box
    if (tickSpacing === undefined || dragStartTick == undefined) {
      return
    }
    const startTick = getNearestTick(dragStartTick, tickSpacing, token)
    let endTick = startTick + tickSpacing
    if (dragStopTick !== undefined) {
      endTick = getNearestTick(dragStopTick, tickSpacing, token)
    }
    if (startTick == endTick) {
      endTick = startTick + tickSpacing
    }
    setHighlightBounds({
      lower: startTick,
      upper: endTick,
    })
  }, [dragStartTick, dragStopTick, tickSpacing])

  useEffect(() => {
    if (echart === undefined || tickSpacing === undefined) return
    const getAdjacentTick = (tick: number, tickSize: number, token: PoolTokenInfo, isNext: boolean) => {
      const adjacentTick = tick + (isNext ? tickSize : -tickSize)
      return getNearestTick(adjacentTick, tickSize, token)
    }
    const cb1 = (params: any) => {
      let priceRange = params?.areas?.pop()?.coordRange
      if (!priceRange || !priceRange.length || priceRange.length < 2) {
        priceRange = [0, 0]
      }
      const priceUpper = priceRange[1]
      const priceLower = priceRange[0]
      if (priceRange[0] == priceRange[1]) return
      let tickUpper = getNearestTick(price2Tick(priceUpper, token), tickSpacing, token)
      let tickLower = getNearestTick(price2Tick(priceLower, token), tickSpacing, token)
      if (tickSpacing === 1) {
        const currentTickUpper = getNearestTick(price2Tick(priceUpper, token), tickSpacing, token)
        const currentTickLower = getNearestTick(price2Tick(priceLower, token), tickSpacing, token)
        const nextTickUpper = getAdjacentTick(currentTickUpper, tickSpacing, token, true)
        const nextTickLower = getAdjacentTick(currentTickLower, tickSpacing, token, true)
        const prevTickUpper = getAdjacentTick(currentTickUpper, tickSpacing, token, false)
        const prevTickLower = getAdjacentTick(currentTickLower, tickSpacing, token, false)

        tickUpper = currentTickUpper
        tickLower = currentTickLower

        // Compare the priceUpper to the next tick price, current tick price, and previous tick price
        if (
          Math.abs(priceUpper - tick2Price(nextTickUpper, token)) <
            Math.abs(priceUpper - tick2Price(currentTickUpper, token)) &&
          Math.abs(priceUpper - tick2Price(nextTickUpper, token)) <
            Math.abs(priceUpper - tick2Price(prevTickUpper, token))
        ) {
          tickUpper = nextTickUpper
        } else if (
          Math.abs(priceUpper - tick2Price(prevTickUpper, token)) <
          Math.abs(priceUpper - tick2Price(currentTickUpper, token))
        ) {
          tickUpper = prevTickUpper
        }
        // Compare the priceLower to the next tick price, current tick price, and previous tick price
        if (
          Math.abs(priceLower - tick2Price(nextTickLower, token)) <
            Math.abs(priceLower - tick2Price(currentTickLower, token)) &&
          Math.abs(priceLower - tick2Price(nextTickLower, token)) <
            Math.abs(priceLower - tick2Price(prevTickLower, token))
        ) {
          tickLower = nextTickLower
        } else if (
          Math.abs(priceLower - tick2Price(prevTickLower, token)) <
          Math.abs(priceLower - tick2Price(currentTickLower, token))
        ) {
          tickLower = prevTickLower
        }
      }
      if (tickLower === tickUpper) {
        tickLower = tickLower + tickSpacing
      }
      setHighlightBounds({
        upper: tickUpper,
        lower: tickLower,
      })
    }
    echart.on('click', (e) => {
      window.log.log(e)
    })
    const cb2 = (e: any) => {
      if (e && e.command === 'clear') {
        setHighlightBounds(undefined)
      }
    }
    const zr = echart.getZr()
    const mouseDown = (params: ElementEvent) => {
      if (params.which === 3 || params.event.shiftKey) return
      if (highlightBounds) return
      const pointInPixel = [params.offsetX, params.offsetY]
      const pointInGrid = echart.convertFromPixel('grid', pointInPixel)
      if (!echart.containPixel('grid', pointInPixel)) return
      // convert the price back to a tick
      // and create a 1 wide position  at the point of the click
      const startTick = price2Tick(pointInGrid[0], token)
      setDragStartTick(startTick)
    }
    const mouseUp = (params: ElementEvent) => {
      if (params.which === 3 || params.event.shiftKey) return
      const pointInPixel = [params.offsetX, params.offsetY]
      const pointInGrid = echart.convertFromPixel('grid', pointInPixel)
      if (!echart.containPixel('grid', pointInPixel)) return
      const tick = price2Tick(pointInGrid[0], token)
      setDragStopTick(tick)
      setDragStartTick(undefined)
    }
    const mouseMove = (params: ElementEvent) => {
      if (params.which === 3 || params.event.shiftKey) return
      const pointInPixel = [params.offsetX, params.offsetY]
      const pointInGrid = echart.convertFromPixel('grid', pointInPixel)
      if (!echart.containPixel('grid', pointInPixel)) return
      const tick = price2Tick(pointInGrid[0], token)
      setDragStopTick(tick)
    }
    zr?.on('mousemove', mouseMove)
    zr?.on('mousedown', mouseDown)
    zr?.on('mouseup', mouseUp)
    echart.on('brush', cb2)
    echart.on('brushEnd', cb1)
    return () => {
      echart.off('brush', cb1)
      echart.off('brushEnd', cb1)
      try {
        zr?.off('mousemove', mouseMove)
        zr?.off('mousedown', mouseDown)
        zr?.off('mouseup', mouseUp)
      } catch (e) {
        return
      }
    }
  }, [echart, token, tickSpacing, highlightBounds])

  useEffect(() => {
    if (!liquidityChart) {
      return
    }
    const newVal = liquidityChart.pool
    if (newVal !== lastPoolAddress) {
      // reset bounds if pool changed.
      setBounds(undefined)
      setLastPoolAddress(newVal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityChart])

  // when we zoom out and the zoom is fully out, we increase the bounds, which is the amount we wish to fetch
  // this allows us to use the native functionality from echarts for zooming while also doing our fast initial load.
  useEffect(() => {
    if (bounds && (zoom[0] === 0 || zoom[1] == 100)) {
      let zoomPercent = 0.07
      if (Math.abs(bounds.upper - bounds.lower) < 250) {
        zoomPercent = 0.005
      }
      const upperPrice = tick2Price(bounds.upper, token)
      const lowerPrice = tick2Price(bounds.lower, token)
      const delta = ((upperPrice + lowerPrice) / 2) * zoomPercent * -token.sign
      const newBounds = {
        lower: price2Tick(lowerPrice - delta, token),
        upper: price2Tick(upperPrice + delta, token),
      }
      setBounds(newBounds)
    }
  }, [zoom, zoomEvent])

  useEffect(() => {
    if (!echart) {
      return
    }
    const zoom1: any = {
      id: 'dataZoomX1',
      show: true,
      type: 'inside',
      realtime: true,
      xAxisIndex: [0],
      moveOnMouseMove: 'shift',
      minSpan: 5,
      preventDefaultMouseMove: false,
    }
    const zoom2: any = {
      id: 'dataZoomX2',
      show: true,
      showDataShadow: false,
      type: 'slider',
      realtime: true,
    }
    const currentOptions = echart.getOption()?.dataZoom as any
    if (!currentOptions || !currentOptions.length || currentOptions.length < 1) {
      return
    }
    const currentZoom = currentOptions[0]
    let start, end, startValue, endValue
    if (!currentZoom || !currentZoom.startValue || !currentZoom.endValue) {
      start = 25
      end = 75
    } else {
      endValue = 1 / currentZoom.startValue
      startValue = 1 / currentZoom.endValue
    }
    if (start !== undefined && end !== undefined) {
      zoom1.start = start
      zoom1.end = end
      zoom2.start = start
      zoom2.end = end
    }
    if (startValue !== undefined && endValue !== undefined) {
      zoom1.startValue = startValue
      zoom1.endValue = endValue
      zoom2.startValue = startValue
      zoom2.end = endValue
    }
    window.log.log('new zoom', zoom1, zoom2)
    echart.setOption({
      dataZoom: [zoom1, zoom2],
    })
  }, [token])

  useEffect(() => {
    if (bounds === undefined) {
      setBounds(undefined)
    }
    if (liquidityChart !== undefined && token !== undefined) {
      const nearestTick = liquidityChart.current_pool_tick
      setCurrentTick(nearestTick)
      const ans = getLiquidityDataFromSnapshot(token, liquidityChart)
      setLiqData({
        ticks: ans,
        currentTick: liquidityChart.current_pool_tick,
        tickSpacing: liquidityChart.tick_spacing,
      })
    }
    if (bounds === undefined) {
      setBounds(undefined)
    }
  }, [liquidityChart, token])

  useEffect(() => {
    if (!echart) {
      return
    }
    if (!highlightBounds) {
      echart.dispatchAction({
        type: 'brush',
        areas: [],
      })
      return
    }
    const [a, b] = [tick2Price(highlightBounds.lower, token), tick2Price(highlightBounds.upper, token)]
    echart.dispatchAction({
      type: 'brush',
      areas: [
        {
          brushType: 'lineX',
          xAxisIndex: 0,
          coordRange: [a, b],
        },
      ],
    })
  }, [highlightBounds, echart, token])

  useEffect(() => {
    if (!liqData || !bounds) {
      return
    }
    if (liqData.ticks.length === 0) {
      return
    }
    const startBoundTick = { ...liqData.ticks[0] }
    startBoundTick.tick = startBoundTick.tick - liqData.tickSpacing
    startBoundTick.amount = 0
    const endBoundTick = { ...liqData.ticks[liqData.ticks.length - 1] }
    endBoundTick.tick = endBoundTick.tick + liqData.tickSpacing
    endBoundTick.amount = 0
    const liqDataTicks = [...liqData.ticks]
    liqDataTicks.push(endBoundTick)
    liqDataTicks.unshift(startBoundTick)
    const vLower = getNearestTick(bounds.lower, liqData.tickSpacing, token) - liqData.tickSpacing * 3
    const vUpper = getNearestTick(bounds.upper, liqData.tickSpacing, token) + liqData.tickSpacing * 3
    const chartData = liqDataTicks
      .filter((x) => {
        return BetweenNumbers(vLower, vUpper, x.tick)
      })
      .map((x) => {
        return { ...x }
      })
    if (
      !chartData.find((x) => {
        return x.tick === Math.floor(vUpper)
      })
    ) {
      chartData.push({
        tick: vUpper,
        price: tick2Price(vUpper, token),
        amount: 0,
      })
    }
    if (
      !chartData.find((x) => {
        return x.tick === Math.floor(vLower)
      })
    ) {
      chartData.unshift({
        tick: vLower,
        price: tick2Price(vLower, token),
        amount: 0,
      })
    }
    // chartData is sorted - and we can be happy with knowing that
    chartData.sort((a, b) => {
      const nameA = a.tick
      const nameB = b.tick
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      // names must be equal
      return 0
    })
    // the center tick is two sided - merge it
    for (let i = chartData.length; i > 0; i--) {
      if (chartData[i] === undefined) {
        continue
      }
      if (chartData[i].tick == chartData[i - 1].tick) {
        chartData[i - 1].amount += chartData[i].amount
        chartData.splice(i, 1)
      }
    }
    // if there is a currentTick, inject the currentTick as a fake tick.
    if (currentTick !== undefined) {
      for (const [idx, dat] of chartData.entries()) {
        const curDiff = currentTick - dat.tick
        if (curDiff == 0) {
          break
        }
        // the first time the currentTick is smaller than the actual tick, we have reached the center and it isn't 0
        if (curDiff < 0) {
          const midPrice = tick2Price(currentTick || 0, token)
          const entry = {
            tick: currentTick,
            price: midPrice,
            amount: 0,
          }
          chartData.splice(idx, 0, entry)
          break
        }
      }
    }
    const echartsData = chartData.map((x) => {
      const amount = x.amount > 0 ? x.amount : 0
      return [x.price, amount, x.tick]
    })
    if (!echart) {
      return
    }
    const b = parseColor(token.flipped ? colors.green[600] : colors.red[600]) || [0, 0, 0, 0]
    const a = parseColor(token.flipped ? colors.red[600] : colors.green[600]) || [0, 0, 0, 0]
    echart.setOption({
      series: [
        {
          name: 'liquidityfull',
          data: echartsData,
          lineStyle: {
            color: 'rgba(0,0,0,0)',
          },
          xAxisIndex: 0,
          areaStyle: {
            color: 'rgba(0,0,0,0)',
          },
        },
        {
          name: 'liquidityone',
          data: echartsData.filter((x) => x[2] <= (currentTick !== undefined ? currentTick : 0)),
          lineStyle: {
            color: token.flipped ? colors.red[400] : colors.green[400],
          },
          xAxisIndex: 0,
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: toRgba([a[0], a[1], a[2], 1]),
              },
              {
                offset: 1,
                color: toRgba([a[0], a[1], a[2], 0.25]),
              },
            ]),
          },
        },
        {
          name: 'liquiditytwo',
          data: echartsData.filter((x) => x[2] >= (currentTick !== undefined ? currentTick : 0)),
          lineStyle: {
            color: token.flipped ? colors.green[400] : colors.red[400],
          },
          xAxisIndex: 0,
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: toRgba([b[0], b[1], b[2], 1]),
              },
              {
                offset: 1,
                color: toRgba([b[0], b[1], b[2], 0.25]),
              },
            ]),
          },
        },
      ],
    })
    colors.gray
    if (echartsData.length > 0) {
      const first = echartsData[0][0]
      const last = echartsData[echartsData.length - 1][0]
      echart.setOption({
        xAxis: {
          min: token.flipped ? last : first,
          max: token.flipped ? first : last,
        },
      })
    }
    echart.setOption({
      tooltip: {
        trigger: 'axis',
        position: [0, 0],
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        formatter: (params: any) => {
          if (Array.isArray(params)) {
            if (params.length === 0) {
              return ``
            }
            const p = params[0]
            const dat: [number, number, number] = p.data as any
            return renderToStaticMarkup(
              <div className="flex flex-col gap-1 border-gray-700 border bg-gray-750 p-2 rounded-md">
                <div className="text-xs text-gray-300 flex flex-row whitespace-pre">{`Tick ${dat[2]}`}</div>
                <div className="text-white text-sm justify-between text-xs flex flex-row gap-12">
                  <div className="flex flex-row gap-1">
                    {token.selected === 1 ? poolSummary.t0_symbol : poolSummary.t1_symbol}
                    <div>Price:</div>
                  </div>
                  {formatNumber({ num: tick2Price(dat[2], token) })}
                </div>
                <div className="text-white text-sm justify-between text-xs flex flex-row">
                  <div className="flex flex-row gap-1">
                    {token.selected === 1 ? poolSummary.t1_symbol : poolSummary.t0_symbol}
                    <div>Price:</div>
                  </div>
                  {formatNumber({ num: 1 / tick2Price(dat[2], token) })}
                </div>
                {dat[1] > 0 && (
                  <div className="text-white text-sm justify-between text-xs flex flex-row">
                    <div className="flex flex-row gap-1">
                      <div>Value:</div>
                    </div>
                    {formatNumber({ num: dat[1] })}
                  </div>
                )}
              </div>
            )
          }
          return `No Tooltip`
        },
      },
    })
  }, [bounds, liqData, token, echart, poolSummary, currentChain])
  return (
    <div
      className="flex flex-1 w-full flex-col"
      onContextMenu={(e) => {
        e.preventDefault()
        setHighlightBounds(undefined)
      }}
    >
      {topbar && <TopBarLiquidityChart height={topBarheight} />}
      <div className="grow h-fit overflow-hidden relative">
        <div ref={chartRef} className="w-full h-full absolute" />
      </div>
    </div>
  )
}

export default LiquidityChart
