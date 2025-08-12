import { graphic } from 'echarts'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { colors } from '../../../../constants/colors'
import { formatNumber } from '../../../numbers/FormatNumber'
import { createChartGradientLines } from '../../../layouts/landingPage/util'
import { useEchart } from '../../../../hooks/useEchart'

export interface IReactEChartWrapper {
  xData: any[]
  yData: any[]
  style?: CSSProperties
  isLoading?: boolean
}
const MultiLineWrapper = (props: IReactEChartWrapper) => {
  const { xData, yData, style, isLoading } = props
  const [reset, setReset] = useState(false)
  const initStepSize = 10
  const totalSteps = Math.floor(Number(style?.width) / initStepSize)
  const startValue = xData[xData.length - totalSteps]
  const chartRef = useRef<HTMLDivElement>(null)
  const { echart } = useEchart({
    chartRef,
    options: {
      animationDuration: 300,
      backgroundColor: colors.gray[900],
      dataZoom: [
        {
          show: true,
          xAxisIndex: [0, 1],
          start: 50,
          end: 100,
          left: 30,
        },
        {
          minValueSpan: 10,
          startValue: startValue ? startValue : undefined,
          type: 'slider',
          start: 50,
          end: 100,
          left: 30,
        },
      ],
      grid: { bottom: 70, left: 60, right: 10, top: 40 },
      series: yData.map((item, index) => {
        return {
          name: item.name,
          data: item.data,
          type: 'line',
          stack: 'Total',
          lineStyle: {
            width: 0,
          },
          colorBy: 'data',
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          colors: createChartGradientLines(index, 0),
          areaStyle: {
            color: new graphic.LinearGradient(0, 0.4, 0, 1, [
              {
                color: createChartGradientLines(index, 0),
                offset: 0,
              },
              {
                color: createChartGradientLines(index, 1),
                offset: 1,
              },
            ]),
            opacity: 0.8,
          },
        }
      }),
      tooltip: {
        formatter: (params: any) => {
          // Determine the number of columns based on screen width
          const screenWidth = window.innerWidth
          const columns = screenWidth >= 1024 ? '1fr' : '1fr 1fr' // Adjust the breakpoint as needed
          let result = `<div>${params[0].axisValueLabel}</div><div style="display:grid;grid-template-columns: ${columns}; column-gap: 1em;">`
          params
            .sort((a: any, b: any) => b.value - a.value)
            .forEach((param: any) => {
              if (param.value != 0) {
                result += `<div style="display:flex;justify-content:space-between;gap:8px;">
                 <div><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${createChartGradientLines(
                   param.seriesIndex,
                   0
                 )};"></span> ${param.seriesName}: </div>
                 <span style="margin-left:auto;">$
                 ${formatNumber({ num: param.value, notation: 'compact' })}
                 </span></div>`
              }
            })
          result += '</div>'
          return result
        },
        axisPointer: {
          crossStyle: {},
          lineStyle: {},
        },
        backgroundColor: colors.gray[800],
        padding: 4,
        borderColor: colors.gray[700],
        borderWidth: 1,
        borderRadius: 8,
        trigger: 'axis',
        textStyle: {
          color: colors.gray[200],
        },
        confine: true,
      },
      xAxis: {
        axisLabel: {
          interval: 12,
          color: colors.gray[200],
          formatter(value) {
            const date = new Date(value)
            const month = (date.getMonth() + 1).toString().padStart(2, '0')

            const year = date.getFullYear()
            return `${month}/${year}`
          },
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
          interval: 12,
        },
        boundaryGap: true,
        data: [],
        type: 'category',
      },
      yAxis: {
        axisLabel: {
          color: colors.gray[200],
          formatter: function (value: number) {
            return `$${formatNumber({ num: value, notation: 'compact' })}`
          },
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: false,
        },
        position: 'left',
        scale: true,
        splitLine: {
          show: false,
        },
        type: 'value',
        z: 10,
      },
    },
  })
  useEffect(() => {
    if (!echart) {
      return
    }
    setReset(false)
    echart.setOption({
      dataZoom: [
        {
          minValueSpan: 10,
          startValue: startValue ? startValue : undefined,
          type: 'inside',
          start: 50,
          end: 100,
        },
      ],
    })
  }, [reset])
  useEffect(() => {
    if (!echart) return

    echart.setOption({
      xAxis: {
        data: xData,
      },
      series: yData.map((item, index) => {
        return {
          name: item.name,
          data: item.data,
          type: 'line',
          stack: 'Total',
          lineStyle: {
            width: 2.5,
            color: createChartGradientLines(index, 0, true),
          },

          colorBy: 'series',
          showSymbol: false,
          colors: createChartGradientLines(index, 0),
          areaStyle: {
            color: new graphic.LinearGradient(0, 0.2, 0, 1.1, [
              {
                color: createChartGradientLines(index, 0),
                offset: 0,
              },
              {
                color: createChartGradientLines(index, 1),
                offset: 0.4,
              },

              {
                color: colors.gray.dark,
                offset: 0.85,
              },
            ]),
            opacity: 0.5,
          },
          emphasis: {
            focus: 'series',
          },
        }
      }),
    })
  }, [yData, xData, reset, echart])
  useEffect(() => {
    if (!echart) {
      return
    }
    if (!isLoading) {
      echart.hideLoading()
    } else {
      echart.showLoading('default', { color: 'white', textColor: 'white', maskColor: colors.gray[900] })
    }
  }, [isLoading, echart])
  useEffect(() => {
    if (!echart) {
      return
    }
    setReset(true)
  }, [startValue])
  return (
    <div
      onDoubleClick={() => {
        setReset(true)
      }}
      ref={chartRef}
      style={{
        height: '100%',
        maxWidth: style?.width,
        width: style?.width,
        minWidth: style?.width,
        ...style,
      }}
    />
  )
}
export default MultiLineWrapper
