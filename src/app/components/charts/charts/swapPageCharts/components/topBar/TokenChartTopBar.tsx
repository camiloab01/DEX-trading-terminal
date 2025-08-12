import { T1, T2 } from '../../../../../typography/Typography'
import { colors } from '../../../../../../constants/colors'
import { getTokenLogoUrl } from '../../../../../../util/getTokenLogo'
import TokenChartTimeDropdown from '../../../../../dropdown/TokenChartTimeDropdown'
import { ITokenChartHeader, ITokenChartTopBar } from '../../types'
import { RoundTokenLogo } from '../../../../../misc/RoundTokenLogo'
import { useChainLoader } from '../../../../../../route/loaderData'
import { FormattedNumber } from '../../../../../numbers/FormatNumber'

export const TokenChartTopBar = (props: ITokenChartTopBar) => {
  const { token, tokenPriceUSD, timeIncrement, setTimeIncrement } = props

  return (
    <div className=" w-full h-fit flex flex-row justify-between">
      <TokenChartHeader token={token} tokenPriceUSD={tokenPriceUSD} />
      <div className="flex flex-row  gap-3">
        <TokenChartTimeDropdown timeIncrement={timeIncrement} setTimeIncrement={setTimeIncrement} />
      </div>
    </div>
  )
}

export const TokenChartHeader = (props: ITokenChartHeader) => {
  const { token, tokenPriceUSD } = props
  const { currentChainInfo } = useChainLoader()
  const tokenLogo = token != undefined && token.symbol ? getTokenLogoUrl(token.address, currentChainInfo.id) : ''
  return (
    <div className="flex flex-col h-[48px]">
      <div className="flex flex-col gap-[6px]">
        <div className="flex flex-row items-center gap-[6px]">
          <RoundTokenLogo logoUrl={tokenLogo} tokenSymbol={token.symbol} size={14} />
          <T1>Price</T1>
        </div>
        {tokenPriceUSD != undefined && <T2 color={colors.gray[300]}>${FormattedNumber({ num: tokenPriceUSD })}</T2>}
      </div>
    </div>
  )
}
