import { T1, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { OrderBannerEnums } from '../banners/OrderBanners'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { IMinToken } from '../forms/OrderForms/LimitOrderForm'
import InvalidLimitOrderPool from '../tooltip/InvalidLimitOrderPool'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { RoundTokenLogo } from '../misc/RoundTokenLogo'
import { useChainLoader } from '../../route/loaderData'
import { FormattedNumber } from '../numbers/FormatNumber'
import { getChainIdFromName } from '../../constants/abi/chainInfo'
import { useTransactions } from '../../context/TransactionsContext'
import { TokenSymbol } from '../misc/TokenSymbol'

interface ILimitOrderButton {
  orderAction: string
  onClick: () => void
  isValidPool?: boolean
  minToken?: IMinToken
  order: { token0: string; token1: string }
  isPreferredTokenOrder: boolean
  priceEntered: boolean
  balance0?: number
  balance1?: number
  orderFormState?: OrderBannerEnums
  isEmpty: boolean
}

export default function LimitOrderButton(props: ILimitOrderButton) {
  const {
    orderAction,
    onClick,
    isValidPool = true,
    minToken = undefined,
    order,
    isPreferredTokenOrder,
    priceEntered,
    balance0,
    balance1,
    isEmpty,
  } = props
  const { isConnected, chain } = useAccount()
  const { currentChain, currentChainInfo } = useChainLoader()
  const { txState } = useTransactions()
  const [hover, setHover] = useState(false)
  const isDefault = order.token0 === '' || order.token1 === ''
  const isMinTokenValid =
    !isDefault &&
    minToken !== undefined &&
    (!isPreferredTokenOrder ? Number(order.token0) >= minToken.amount : Number(order.token1) >= minToken.amount)
  const isSufficientFunds =
    balance0 !== undefined &&
    balance1 !== undefined &&
    isMinTokenValid &&
    (!isPreferredTokenOrder ? Number(order.token0) <= balance0 : Number(order.token1) <= balance1)
  const shouldChangeChain =
    (chain && chain.id !== currentChain) ||
    (currentChainInfo.internalName && getChainIdFromName(currentChainInfo.internalName) === 0)

  let disabled
  if (isConnected) {
    disabled =
      !isValidPool ||
      isDefault ||
      !isMinTokenValid ||
      !(priceEntered && isSufficientFunds) ||
      shouldChangeChain ||
      txState === 0 ||
      txState === 1 ||
      txState === 5
  } else disabled = true

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        color: disabled ? colors.gray[500] : hover ? getHoverColor(colors.white) : colors.white,
        backgroundColor: disabled ? colors.gray[800] : hover ? getHoverColor(colors.blue[400]) : colors.blue[400],
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex w-full justify-center items-center h-[42px] rounded-[8px] text-[16px] font-semibold"
    >
      {isConnected && !isValidPool && <InvalidLimitOrderPool />}
      <div>
        {isConnected ? (
          shouldChangeChain ? (
            <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
              Please change network
            </T1>
          ) : isValidPool ? (
            isEmpty ? (
              orderAction === 'Buy' ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
                  Buy
                </T1>
              ) : (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.blue[400]}>
                  Sell
                </T1>
              )
            ) : isMinTokenValid ? (
              !isSufficientFunds ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  Insufficient balance
                </T1>
              ) : orderAction === 'Buy' ? (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
                  Buy
                </T1>
              ) : (
                <T1 weight={FontWeightEnums.SEMIBOLD} color={'inherit'}>
                  Sell
                </T1>
              )
            ) : (
              <div className="flex flex-row gap-1.5">
                <T3 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  Minimum order size is{' '}
                  <FormattedNumber num={minToken?.amount ?? 0} aboveOneDecimalAmount={2} belowOneDecimalAmount={4} />
                </T3>
                <RoundTokenLogo logoUrl={minToken?.token.logoURI} size={12} tokenSymbol={minToken?.token.symbol} />
                <T3 weight={FontWeightEnums.SEMIBOLD} color="inherit">
                  {minToken && <TokenSymbol address={minToken.token.address} fallback_name={minToken.token.symbol} />}
                </T3>
              </div>
            )
          ) : (
            <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
              Limit orders not available for this market
            </T1>
          )
        ) : (
          <T1 weight={FontWeightEnums.SEMIBOLD} color="inherit">
            Connect Wallet
          </T1>
        )}
      </div>
    </button>
  )
}
