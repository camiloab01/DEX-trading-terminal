import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'

const ImpossibleQuoteToolTip = () => (
  <div className={`absolute left-3 -top-8 w-[180px] text-left bg-gray-750 border-gray-700 border rounded-lg p-2`}>
    <T3 color={colors.gray[300]}>May be due to server error or insufficient liquidity</T3>
  </div>
)

export default ImpossibleQuoteToolTip
