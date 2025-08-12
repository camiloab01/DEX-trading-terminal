import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { FontWeightEnums } from '../../../../types/Enums'
import { getChartTitle } from '../../../layouts/landingPage/util'
import { AggregatedDataKey } from '../../../layouts/landingPage/panels/Charts'

interface IChartSwitch {
  chart: AggregatedDataKey
  setChart: (value: AggregatedDataKey) => void
  chartList: AggregatedDataKey[]
}

export const ChartSwitch = (props: IChartSwitch) => {
  const { chart, setChart, chartList } = props
  return (
    <div className={`h-fit flex flex-row justify-center items-center border rounded-md border-gray-750 bg-gray-800`}>
      {chartList.map((item, index) => {
        return <SwitchButton key={index} title={item} onClick={() => setChart(item)} focus={chart === item} />
      })}
    </div>
  )
}

interface ISwitchbutton {
  title: AggregatedDataKey
  focus: boolean
  onClick: () => void
}

export const SwitchButton = (props: ISwitchbutton) => {
  const { title, onClick, focus } = props
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2 py-1`}
      style={{ backgroundColor: focus ? colors.gray[750] : '', width: 64 }}
    >
      <T3 color={focus ? colors.gray[50] : colors.gray[300]} weight={FontWeightEnums.REGULAR}>
        {getChartTitle(title)}
      </T3>
    </button>
  )
}
