import { colors } from '../../../constants/colors'
import { T3 } from '../../typography/Typography'
import { FontWeightEnums } from '../../../types/Enums'
import { formatNumber } from '../../numbers/FormatNumber'
import { GetBalanceData } from 'wagmi/query'
import { FaWallet } from 'react-icons/fa'
import { Trans } from '@lingui/macro'

interface IBalanceInfo {
  balance: GetBalanceData | undefined
  onClick: (() => void) | undefined
}

const BalanceInfo = (props: IBalanceInfo) => {
  const { balance, onClick } = props
  const balanceValue = balance?.formatted ? balance.formatted : 0
  return (
    <div className="flex flex-row items-center gap-x-1 ">
      <FaWallet color={colors.gray[300]} size={10} className=" mt-0.5" />
      {balance && balance.formatted ? (
        <T3
          className="overflow-hidden max-w-[70px] whitespace-nowrap overflow-ellipsis"
          color={colors.gray[500]}
          weight={FontWeightEnums.SEMIBOLD}
        >
          {formatNumber({ num: balanceValue })}
        </T3>
      ) : (
        <T3 color={colors.gray[500]}>0</T3>
      )}
      {onClick != undefined && (
        <button onClick={onClick} className={' text-blue-400 hover:text-blue-500 rounded-md color-red-200'}>
          <T3 color="inherit">
            <Trans>Max</Trans>
          </T3>
        </button>
      )}
    </div>
  )
}

export default BalanceInfo
