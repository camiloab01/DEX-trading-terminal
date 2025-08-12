import { graphic } from 'echarts'
import { CSSProperties, useEffect, useRef } from 'react'
import { colors } from '../../../../../constants/colors'
import { useEchart } from '../../../../../hooks/useEchart'

export interface IReactEChartWrapper {
  xData: any[]
  yData: any[]
  style?: CSSProperties
  isLoading?: boolean
}
const PriceWrapper = (props: IReactEChartWrapper) => {
  const { xData, yData, style, isLoading } = props
  const chartRef = useRef<HTMLDivElement>(null)

  const hasPriceWentUp = yData[0] < yData[yData.length - 1]

  const { echart } = useEchart({
    chartRef,
    options: {
      grid: { bottom: 0, left: 0, right: 0, top: 0 },
      series: [
        {
          areaStyle: {
            color: new graphic.LinearGradient(0, 0.4, 0, 1, [
              {
                color: hasPriceWentUp ? colors.price_chart.shadow0 : colors.price_chart.negative_shadow0,
                offset: 0,
              },
              {
                color: hasPriceWentUp ? colors.price_chart.shadow1 : colors.price_chart.negative_shadow1,
                offset: 1,
              },
            ]),
            opacity: 0.8,
          },
          lineStyle: { color: hasPriceWentUp ? colors.green[300] : colors.red[300] },
          showSymbol: false,
          type: 'line',
        },
      ],
      tooltip: {
        show: false,
      },
      xAxis: {
        show: false,
        type: 'category',
      },
      yAxis: {
        show: false,
      },
      legend: {
        show: false,
      },
    },
  })

  useEffect(() => {
    if (!echart) {
      return
    }
    echart.setOption({
      xAxis: {
        data: xData,
      },
      series: [
        {
          data: yData,
        },
      ],
    })
  }, [yData, xData, echart])
  useEffect(() => {
    if (!echart) return
    if (!isLoading) {
      echart.hideLoading()
    } else {
      echart.showLoading('default', { color: 'white', textColor: 'white', maskColor: 'rgba(0,0,0,0.4)' })
    }
  }, [isLoading, echart])

  return (
    <div
      ref={chartRef}
      style={{
        height: style ? style.height : '100%',
        maxWidth: style?.width,
        width: style?.width,
        minWidth: style?.width,
        ...style,
      }}
    />
  )
}
export default PriceWrapper
