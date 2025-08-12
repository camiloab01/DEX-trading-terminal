import { T1 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import { FontWeightEnums } from '../../types/Enums'
import { usePositionMakerContext } from '../../context/PositionMakerContext'
import { useAccount } from 'wagmi'
import { useChainLoader } from '../../route/loaderData'
import { getChainIdFromName } from '../../constants/abi/chainInfo'
import { TokenSymbol } from '../misc/TokenSymbol'

interface IButton {
  onClick: () => void
  disabled: boolean
  isInsufficientT0: boolean
  isInsufficientT1: boolean
  token0: IToken
  token1: IToken
  highlightBounds: { lower: number; upper: number } | undefined
}

export default function DeployPositionButton(props: IButton) {
  const { onClick, disabled, isInsufficientT0, isInsufficientT1, token0, token1, highlightBounds } = props
  const { editPosition, updatePosition } = usePositionMakerContext()
  const { isConnected, chain } = useAccount()
  const { currentChainInfo, currentChain } = useChainLoader()
  const isNotDecreasePosition = !updatePosition || !editPosition
  const shouldDeactivate = () => {
    return (
      !isConnected ||
      disabled ||
      (isNotDecreasePosition && isInsufficientT0) ||
      (isNotDecreasePosition && isInsufficientT1) ||
      (chain && chain.id !== currentChain) ||
      (currentChainInfo.internalName && getChainIdFromName(currentChainInfo.internalName) === 0)
    )
  }
  return (
    <button
      disabled={shouldDeactivate()}
      onClick={onClick}
      className="w-full h-[38px] flex items-center justify-center rounded-[8px] text-gray-50 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-blue-400"
    >
      {!isConnected ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[500]}>
          Connect wallet
        </T1>
      ) : (chain && chain.id !== currentChain) ||
        (currentChainInfo.internalName && getChainIdFromName(currentChainInfo.internalName) === 0) ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[500]}>
          Please change network
        </T1>
      ) : isInsufficientT0 && isNotDecreasePosition ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[500]}>
          Insufficient <TokenSymbol address={token0.address} fallback_name={token0.symbol} shortenSymbol /> Balance
        </T1>
      ) : isInsufficientT1 && isNotDecreasePosition ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[500]}>
          Insufficient <TokenSymbol address={token1.address} fallback_name={token1.symbol} shortenSymbol /> Balance
        </T1>
      ) : !highlightBounds ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[500]}>
          Select Range
        </T1>
      ) : !editPosition ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
          Deploy Position
        </T1>
      ) : updatePosition ? (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Decrease Position
        </T1>
      ) : (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Increase Position
        </T1>
      )}
    </button>
  )
}
