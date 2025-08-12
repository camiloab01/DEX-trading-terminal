import { T1 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { OrderBannerEnums } from '../banners/OrderBanners'
import TransactionLoader from '../forms/OrderForms/Swap/TransactionLoader'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import ImpossibleQuoteToolTip from '../tooltip/ImpossibleQuote'
import { useChainLoader } from '../../route/loaderData'
import { getChainIdFromName } from '../../constants/abi/chainInfo'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface IOrderButton {
  orderAction: string
  onClick: () => void
  disabled?: boolean
  insufficientFunds?: boolean
  isTransactionPending?: boolean
  isApprovalPending?: boolean
  needsSignature?: boolean
  loadingPrice?: boolean
  isEmpty?: boolean
  orderFormState?: OrderBannerEnums | undefined
  isHighImpact?: boolean
}
export default function OrderButton(props: IOrderButton) {
  const {
    orderAction,
    onClick,
    disabled = false,
    insufficientFunds = false,
    loadingPrice = false,
    isEmpty,
    orderFormState,
    isHighImpact = false,
  } = props
  const { isConnected, chain } = useAccount()
  const { currentChainInfo, currentChain } = useChainLoader()
  const [hover, setHover] = useState(false)
  const isQuoteError = orderFormState === OrderBannerEnums.QUOTE_ERROR

  const shouldDisable = () => disabled //|| orderFormState !== undefined

  const shouldDeactivate = () =>
    !isConnected ||
    insufficientFunds ||
    disabled ||
    chain?.id !== currentChain ||
    getChainIdFromName(currentChainInfo.internalName || '') === 0

  const CurrentSplash = () => {
    if (loadingPrice) return <TransactionLoader />
    if (isQuoteError) return <ImpossibleQuote />
    if (!isConnected) {
      return (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Connect Wallet
        </T1>
      )
    }
    if (
      (chain && chain.id !== currentChain) ||
      (currentChainInfo.internalName && getChainIdFromName(currentChainInfo.internalName) === 0)
    ) {
      return (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Please change network
        </T1>
      )
    }
    if (isEmpty) {
      return (
        <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
          {orderAction}
        </T1>
      )
    }
    if (insufficientFunds) {
      return (
        <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
          Insufficient balance
        </T1>
      )
    }
    return (
      <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
        {orderAction} {isHighImpact && <>Anyway</>}
      </T1>
    )
  }
  return (
    <button
      disabled={shouldDisable() || shouldDeactivate()}
      onClick={() => {
        if (!(shouldDisable() || shouldDeactivate())) onClick()
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex w-full justify-center items-center h-10 rounded-[8px] text-[16px] font-semibold 
      ${shouldDeactivate() ? 'text-gray-500 bg-gray-800' : `text-gray-50 ${hover ? 'bg-blue-500' : 'bg-blue-400'}`}
      ${!shouldDeactivate() && 'border border-blue-500'} `}
    >
      <CurrentSplash />
    </button>
  )
}

const ImpossibleQuote = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div
      className="flex gap-x-2 items-center relative text-gray-600"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <ExclamationTriangleIcon width={20} height={20} color={colors.gray[600]} />
      <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
        Impossible to Quote
      </T1>
      {showTooltip && <ImpossibleQuoteToolTip />}
    </div>
  )
}
