import { useEffect, useState } from 'react'
import { useRpcContext } from '../../../../context/RpcContext'
import MultiLineChart from '../../../charts/charts/landing/MultiLineWrapper'
import { HistoricProtocolStatistics } from '@gfxlabs/oku'
import { getMultiLineChartData, YDataItem } from '../util'
import { ChartSwitch } from '../../../charts/charts/landing/ChartSwitch'
import { useConfigContext } from '../../../../context/ConfigContext'

export interface HistoricProtocolStatisticsData {
  [key: string]: HistoricProtocolStatistics[]
}
export type AggregatedDataKey = 'fees' | 'volume' | 'tvl'
export type AggregatedDataObject = {
  [K in AggregatedDataKey]: number
}

export type AggregatedData = {
  [time: number]: {
    fees: number
    volume: number
    tvl: number
  }
}

const LandingCharts = () => {
  const { omniCush } = useRpcContext()
  const [chartDataX, setChartDataX] = useState<string[]>([])
  const [chartDataY, setChartDataY] = useState<YDataItem[]>([])
  const [chartData, setChartData] = useState<HistoricProtocolStatistics[]>()
  const [tab, setTab] = useState<AggregatedDataKey>('tvl')
  const { features } = useConfigContext()

  useEffect(() => {
    omniCush
      .network('omni')
      .call('cush_analyticsProtocolHistoric', [-1 * 60000 * 60 * 24 * 7 * 1800, 0, 60000 * 60 * 24 * 7])
      .then((data) => {
        setChartData(data)
      })
  }, [])

  useEffect(() => {
    if (chartData) {
      const chartDataXY = getMultiLineChartData(chartData as unknown as HistoricProtocolStatisticsData, tab, features)
      const xData = chartDataXY.xData.map((time) => new Date(time).toLocaleDateString())
      setChartDataX(xData)
      setChartDataY(chartDataXY.yData)
    }
  }, [chartData, tab])

  return (
    <div className="relative h-full border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex justify-end items-center w-full absolute p-2 z-10 right-0">
        <ChartSwitch chart={tab} setChart={setTab} chartList={['tvl', 'fees', 'volume']} />
      </div>
      <MultiLineChart xData={chartDataX} yData={chartDataY} isLoading={!chartData} />
    </div>
  )
}

export default LandingCharts
