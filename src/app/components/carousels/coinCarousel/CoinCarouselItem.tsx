import { formatNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getTokenByAddress } from '../../../lib/getToken'
import { FontWeightEnums } from '../../../types/Enums'
import { RoundTokenLogo } from '../../misc/RoundTokenLogo'
import noTokenLogo from '../../../assets/no-token-logo.webp'
import { useChainLoader } from '../../../route/loaderData'
import { useSwapPageContext } from '../../../context/SwapPageContext'
import { TokenSummmary } from '@gfxlabs/oku'
import { NavLink } from 'react-router-dom'
import { zeroAddress } from 'viem'

interface ICoinCarouselItem {
  tokenItem: TokenSummmary
}

export default function CoinCarouselItem(props: ICoinCarouselItem) {
  const { tokenItem } = props
  const { currentChain } = useChainLoader()
  const tokenInfo = getTokenByAddress(tokenItem.contract, currentChain)
  const { token0 } = useSwapPageContext()
  return (
    <div className="bg-gray-dark">
      {tokenInfo.logoURI && tokenInfo.logoURI !== noTokenLogo && (
        <NavLink to={`../${token0?.address ?? zeroAddress}/${tokenInfo.address}`}>
          <button className="mx-3 p-[5px] h-[33px]">
            <div className="flex flex-row gap-x-1">
              <RoundTokenLogo logoUrl={tokenInfo.logoURI} tokenSymbol={tokenInfo.symbol} size={14} />
              <div className="flex flex-row gap-x-[6px]">
                <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
                  {formatNumber({ num: tokenItem.price, belowOneDecimalAmount: 2 })}
                </T3>
                <T3 color={tokenItem.change_24h < 0 ? colors.red[300] : colors.green[300]}>
                  {formatNumber({ num: tokenItem.change_24h, belowOneDecimalAmount: 2 })}%
                </T3>
              </div>
            </div>
          </button>
        </NavLink>
      )}
    </div>
  )
}
