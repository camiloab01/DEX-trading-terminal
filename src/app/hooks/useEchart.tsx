import { useCallback, useEffect, useState } from 'react'
// echarts dynamic imports
import { use, init, ECharts } from 'echarts/core'
// chart types
import { BarChart, LineChart, GraphChart, CustomChart, CandlestickChart } from 'echarts/charts'
import {
  VisualMapComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  BrushComponent,
  DataZoomComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  ToolboxComponent,
  MarkAreaComponent,
  MarkPointComponent,
  SingleAxisComponent,
  AxisPointerComponent,
  LegendComponent,
  LegendPlainComponent,
  TransformComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useResizeObserver } from 'usehooks-ts'
import { EChartsOption } from 'echarts/types/dist/shared.js'

use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BrushComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  CandlestickChart,
  DataZoomComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  ToolboxComponent,
  MarkAreaComponent,
  MarkPointComponent,
  SingleAxisComponent,
  AxisPointerComponent,
  LegendComponent,
  LegendPlainComponent,
  GraphChart,
  CustomChart,
  VisualMapComponent,
])

interface useEchartProps {
  chartRef: React.RefObject<HTMLDivElement>
  theme?: any
  options?: EChartsOption
}
export const useEchart = ({ chartRef, theme, options }: useEchartProps) => {
  const [echart, setEchart] = useState<ECharts | undefined>()
  const [zoom, setZoom] = useState([0, 100])
  const [firstChild, setFirstChild] = useState<Element | undefined>(undefined)
  const resizeChart = useCallback(() => {
    echart?.resize()
  }, [echart])
  const size = useResizeObserver({ ref: chartRef })

  useEffect(() => {
    if (resizeChart != undefined) {
      resizeChart()
    }
  }, [resizeChart, size])

  useEffect(() => {
    // Initialize chart
    if (chartRef.current === null) {
      return
    }
    const chart = init(chartRef.current, theme)
    if (chart === undefined) {
      return
    }
    chart.on('datazoom', (params: any) => {
      params?.batch?.map((x: any) => {
        setZoom([x.start, x.end])
      })
    })
    const firstChild = chartRef.current?.children[0]
    setFirstChild(firstChild)
    if (options) {
      chart.setOption(options)
    }
    setEchart(chart)
    // Return cleanup function
    return () => {
      chart?.dispose()
      setEchart(undefined)
      setFirstChild(undefined)
    }
  }, [theme, chartRef])
  return {
    echart,
    zoom,
    firstChild,
    resizeChart,
  }
}
