import { T4 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums } from '../../../types/Enums'
import { useDataContext } from '../../../context/DataContext'
import { Trans } from '@lingui/macro'

export default function TradeHistoryTitles({
  baseSymbol,
  quoteSymbol,
}: {
  baseSymbol: JSX.Element
  quoteSymbol: JSX.Element
}) {
  const { token } = useDataContext()

  return (
    token != undefined && (
      <div className="flex flex-row w-full px-2 text-gray-300 pt-3 pb-2 justify-between">
        <div className="flex min-w-[64px] items-center">
          <T4 className="flex items-center" weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>Price</Trans> ({token.selected === 0 ? baseSymbol : quoteSymbol})
          </T4>
        </div>
        <div className="flex min-w-[72px] items-center justify-end">
          <T4 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>Amount</Trans> ({token.selected === 0 ? baseSymbol : quoteSymbol})
          </T4>
        </div>
        <div className="flex min-w-[48px] items-center justify-end">
          <T4 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>Time</Trans>
          </T4>
        </div>
        <div className="flex min-w-[13px] items-center justify-end">
          <T4 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
            <Trans>TX</Trans>
          </T4>
        </div>
      </div>
    )
  )
}
