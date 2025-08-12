import { tokenChartTimeIncrementEnums, LayoutEnums } from '../../../../../types/Enums'
import { ITokenChartContainer } from '../types'
import { useEffect, useRef, useState } from 'react'
import { WETH9_ADDRESS } from '../../../../../constants/abi/chainInfo'
import { zeroAddress } from 'viem'
import { useEchart } from '../../../../../hooks/useEchart'
import { useCurrentClient } from '../../../../../hooks/useClient'
import { formatNumber } from '../../../../numbers/FormatNumber'
import { useThemeContext } from '../../../../../context/ThemeContext'
import { renderToStaticMarkup } from 'react-dom/server'
import { colors } from '../../../../../constants/colors'
import { useChainLoader } from '../../../../../route/loaderData'
import { createChartDate } from '../../../../../util/createChartDate'

const TokenChartContainer = (props: ITokenChartContainer) => {
  const { timeIncrement, token, setIsEnoughData } = props
  const chartRef = useRef<HTMLDivElement>(null)
  const [startTime, setStartTime] = useState(Date.now() - timeSwitch(timeIncrement) * 500)
  const [endTime, setEndTime] = useState(Date.now())
  const [granularity, setGranularity] = useState(timeSwitch(timeIncrement))
  const { currentChainInfo } = useChainLoader()
  const [tokenAddresses, setTokenAddresses] = useState([
    token.address === zeroAddress ? WETH9_ADDRESS[currentChainInfo.id].toLowerCase() : token.address,
  ])

  const {
    mutatedData: chartData,
    isFetched,
    isPlaceholderData: isPreviousData,
  } = useCurrentClient(
    [
      'cush_swapChart',
      (x) => {
        if (x) {
          const item = Object.values(x.token_candles).pop()
          return item as any[]
        }
        return undefined
      },
    ],
    [tokenAddresses, granularity, startTime, endTime]
  )

  useEffect(() => {
    chartData ? (chartData.length === 0 ? setIsEnoughData(false) : setIsEnoughData(true)) : setIsEnoughData(undefined)
  }, [chartData])

  useEffect(() => {
    setTokenAddresses([
      token.address === zeroAddress ? WETH9_ADDRESS[currentChainInfo.id].toLowerCase() : token.address,
    ])
    setGranularity(timeSwitch(timeIncrement))
    setStartTime(Date.now() - timeSwitch(timeIncrement) * 500)
    setEndTime(Date.now())
  }, [token, timeIncrement, currentChainInfo])

  const { colors: themeColors, appLayout } = useThemeContext()
  const { echart } = useEchart({
    chartRef,
    options: {
      animationDuration: 250,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            show: false,
          },
        },
        valueFormatter: (x) => {
          return `${formatNumber({ num: Number(x) })}`
        },
      },
      grid: {
        top: 10,
        left: 0,
        right: 10,
      },
      dataZoom: [
        {
          show: true,
          type: 'inside',
          realtime: true,
          moveOnMouseMove: true,
          preventDefaultMouseMove: false,
          start: 75,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          realtime: true,
        },
      ],
      toolbox: {
        show: false,
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: [],
        boundaryGap: false,
      },
      yAxis: [
        {
          name: 'oclh',
          scale: true,
          show: true,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          name: 'volume',
          scale: false,
          show: false,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          max: function (value) {
            return value.max * 3
          },
        },
        {
          name: 'tvl',
          scale: false,
          show: false,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          max: function (value) {
            return value.max * 1.3
          },
          min: function (value) {
            return value.min
          },
        },
      ],
      series: [
        {
          name: 'volume',
          type: 'bar',
          itemStyle: {
            opacity: 0.8,
            color: '#089981',
          },
          stack: 'true',
          data: [],
          yAxisIndex: 1,
        },
        {
          name: 'tvl',
          type: 'bar',
          stack: 'true',
          data: [],
          yAxisIndex: 1,
          itemStyle: {
            opacity: 0.8,
            color: colors.blue[400],
          },
        },
        {
          name: 'oclh',
          type: 'candlestick',
          itemStyle: {
            color0: appLayout === LayoutEnums.DEFAULT ? '#F23645' : themeColors.neg_color,
            color: appLayout === LayoutEnums.DEFAULT ? '#089981' : themeColors.pos_color,
            borderColor0: appLayout === LayoutEnums.DEFAULT ? '#F23645' : themeColors.neg_color,
            borderColor: appLayout === LayoutEnums.DEFAULT ? '#089981' : themeColors.pos_color,
          },
          yAxisIndex: 0,
          data: [],
          z: 10,
        },
      ],
    },
  })
  useEffect(() => {
    if (!echart) return
    if (isFetched || isPreviousData) echart.hideLoading()
    else echart.showLoading('default', { color: 'white', textColor: 'white', maskColor: colors.gray[900] })
  }, [isFetched, echart])

  useEffect(() => {
    if (!(chartData && echart)) return

    const ohlcData = chartData.map((x) => {
      return [x.open, x.close, x.low, x.high]
    })
    const xAxisData = chartData.map((x) => {
      return createChartDate(x.time, granularity)
    })
    const volumeData = chartData.map((x) => {
      return x.volume
    })
    const tvlData = chartData.map((x) => {
      return x.tvl
    })
    echart.setOption({
      xAxis: {
        data: xAxisData,
      },
      series: [
        { name: 'oclh', data: ohlcData },
        { name: 'volume', data: volumeData },
        { name: 'tvl', data: tvlData },
      ],
    })
    echart.setOption({
      tooltip: {
        trigger: 'axis',
        position: [0, 0],
        backgroundColor: 'rgba(0,0,0,0,0)',
        borderWidth: 0,
        formatter: (params: any) => {
          if (Array.isArray(params)) {
            const cs = params.find((x: any) => {
              return x.seriesName == 'oclh'
            })
            const tvl = params.find((x: any) => {
              return x.seriesName == 'tvl'
            })
            const volume = params.find((x: any) => {
              return x.seriesName == 'volume'
            })
            return renderToStaticMarkup(
              <div className="flex flex-col gap-1">
                <div className="text-xs flex flex-row whitespace-pre">{xAxisData[cs.value[0]]}</div>
                <div className="flex flex-row gap-1">
                  <div className="text-white text-sm justify-between flex flex-row gap-12">
                    <div className="flex flex-row gap-1">
                      <div>O:</div>
                      <div style={{ color: cs.color }}>
                        {formatNumber({
                          num: cs.value[1],
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-sm justify-between flex flex-row">
                    <div className="flex flex-row gap-1">
                      <div>H:</div>
                      <div style={{ color: cs.color }}>
                        {formatNumber({
                          num: cs.value[4],
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-sm justify-between flex flex-row">
                    <div className="flex flex-row gap-1">
                      <div>L:</div>
                      <div style={{ color: cs.color }}>
                        {formatNumber({
                          num: cs.value[3],
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-sm justify-between flex flex-row">
                    <div className="flex flex-row gap-1">
                      <div>C:</div>
                      <div style={{ color: cs.color }}>
                        {formatNumber({
                          num: cs.value[2],
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-1">
                  <div className="text-white text-sm justify-between flex flex-row">
                    <div className="flex flex-row gap-1">
                      <div>Volume:</div>
                      <div style={{ color: cs.color }}>
                        {formatNumber({
                          num: volume.value,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-sm justify-between flex flex-row">
                    <div className="flex flex-row gap-1">
                      <div>TVL:</div>
                      <div style={{ color: cs.color }}>
                        {formatNumber({
                          num: tvl.value,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          return `No Tooltip`
        },
      },
    })
  }, [chartData])

  return (
    <div className="grow h-fit overflow-hidden relative">
      <div ref={chartRef} className="w-full h-full absolute" />
    </div>
  )
}

export default TokenChartContainer

const timeSwitch = (timeIncrement: tokenChartTimeIncrementEnums) => {
  switch (timeIncrement) {
    case tokenChartTimeIncrementEnums.MINUTE_5:
      return 60000 * 5
    case tokenChartTimeIncrementEnums.HOUR_1:
      return 60000 * 60 * 1
    case tokenChartTimeIncrementEnums.DAY_1:
      return 60000 * 60 * 24
    case tokenChartTimeIncrementEnums.DAY_7:
      return 60000 * 60 * 24 * 7
    case tokenChartTimeIncrementEnums.DAY_14:
      return 60000 * 60 * 24 * 14
    case tokenChartTimeIncrementEnums.DAY_30:
      return 60000 * 60 * 24 * 30
    case tokenChartTimeIncrementEnums.YEAR_1:
      return 60000 * 60 * 24 * 365
    default:
      return 60000
  }
}
