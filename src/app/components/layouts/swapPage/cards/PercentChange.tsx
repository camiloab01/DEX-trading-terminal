import { FormattedNumber } from '../../../numbers/FormatNumber'
import { T2 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'

export const PercentChangeCard = ({ time, percent }: { time: string; percent: number }) => {
  const color = percent > 0 ? colors.green[400] : colors.red[350]
  const Icon = percent > 0 ? <T2 color={colors.green[400]}>+</T2> : <></>
  return (
    <div className="flex sm:flex-col md:flex-row bg-gray-800 border border-gray-750 rounded-[10px] py-4 px-3 gap-2 justify-between sm:justify-center items-center">
      <T2 color={colors.gray[100]}>{time}</T2>
      <div className="flex">
        {Icon}
        <T2 color={color}>
          <FormattedNumber num={(percent * 100).toFixed(2)} belowOneDecimalAmount={2} />%
        </T2>
      </div>
    </div>
  )
}
