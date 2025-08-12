import { colors } from '../../../../constants/colors'
import { formatNumber } from '../../../numbers/FormatNumber'
import { T3 } from '../../../typography/Typography'
import { LuPlus } from 'react-icons/lu'
const PoolStat = ({
  stat,
  change,
  pre = '',
  post = '',
}: {
  stat: JSX.Element | string
  change?: number
  pre?: string
  post?: string
}) => {
  return (
    <div className="text-end whitespace-pre">
      <T3 color={colors.gray[100]}>
        {pre}
        {stat} {post}
      </T3>
      {change !== undefined || change === 0 ? (
        <T3 color={change >= 0 ? colors.green[400] : colors.red[350]} className="">
          {change >= 0 ? <LuPlus color={colors.green[400]} className="inline-flex mb-[2px]" height="10px" /> : ''}
          {formatNumber({ num: change, aboveOneDecimalAmount: 2, belowOneDecimalAmount: 2 })}%
        </T3>
      ) : null}
    </div>
  )
}

export default PoolStat
