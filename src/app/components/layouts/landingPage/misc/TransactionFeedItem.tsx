import { useEffect, useState } from 'react'
import { T3 } from '../../../typography/Typography'
import { formatNumber } from '../../../numbers/FormatNumber'
import { colors } from '../../../../constants/colors'
import { RoundTokenLogo } from '../../../misc/RoundTokenLogo'
import { OrderWithKey } from '../panels/TransactionFeed'
import { GoArrowSwitch } from 'react-icons/go'
import { getTokenLogoUrl } from '../../../../util/getTokenLogo'
import { zeroAddress } from 'viem'
import { IToken } from '../../../../v3-sdk'
import { NavLink } from 'react-router-dom'
import { getChainIdFromName } from '../../../../constants/abi/chainInfo'
import { TokenSymbol } from '../../../misc/TokenSymbol'

interface TransactionFeedItem {
  transaction: OrderWithKey
  isNew: boolean
  setFromToken?: (token: IToken) => void
  setToToken?: (token: IToken) => void
}

const TransactionFeedItem = ({ transaction, isNew }: TransactionFeedItem) => {
  const [isBlinking, setIsBlinking] = useState(false)
  useEffect(() => {
    setIsBlinking(isNew)
  }, [isNew])

  useEffect(() => {
    if (isBlinking) {
      setTimeout(() => {
        setIsBlinking(false)
      }, 500)
    }
  }, [isBlinking])
  const firstRowFont = isBlinking ? colors.blue[400] : colors.gray[100]
  const { fromToken, toToken, fromTokenAmount, toTokenAmount, fromTokenAddress, toTokenAddress } =
    determineFromAndToTokens(transaction)
  return (
    <NavLink to={`app/${transaction.key}/pool/${transaction.pool}`} className=" py-3">
      <div className="w-full">
        <div className={`flex flex-row w-full px-2 justify-around my-3 items-center`}>
          <RoundTokenLogo tokenSymbol={transaction.key} logoUrl={transaction.logoUrl} size={16} />
          <T3 color={firstRowFont ? firstRowFont : colors.gray[100]} className="w-[30%] text-end whitespace-pre">
            {formatNumber({ num: fromTokenAmount || 0, notation: 'compact' })}{' '}
            <TokenSymbol address={fromTokenAddress} fallback_name={fromToken} />
          </T3>
          <RoundTokenLogo
            tokenSymbol={fromToken}
            logoUrl={getTokenLogoUrl(fromTokenAddress as string, getChainIdFromName(transaction.key))}
            size={16}
          />
          <GoArrowSwitch color={colors.gray[500]} height={12} width={12} />
          <T3 color={firstRowFont ? firstRowFont : colors.gray[100]} className="w-[30%] text-end whitespace-pre">
            {formatNumber({ num: toTokenAmount, notation: 'compact' })}{' '}
            <TokenSymbol address={toTokenAddress} fallback_name={toToken} />
          </T3>
          <RoundTokenLogo
            tokenSymbol={toToken}
            logoUrl={getTokenLogoUrl(toTokenAddress as string, getChainIdFromName(transaction.key))}
            size={16}
          />
        </div>
      </div>
      {isBlinking && <div className="absolute inset-0 bg-blue-400 h-full" style={{ opacity: 0.05 }} />}
    </NavLink>
  )
}
export default TransactionFeedItem
function determineFromAndToTokens({
  base_currency,
  should_flip,
  quote_currency,
  avg_price = 0,
  side,
  amount_filled = '0',
  base_currency_address,
  quote_currency_address,
}: OrderWithKey) {
  let fromToken
  let toToken
  let fromTokenAmount
  let toTokenAmount
  let fromTokenAddress
  let toTokenAddress
  const amountFilled = parseFloat(amount_filled)

  const isBuySide = side?.toLowerCase() === 'buy'
  const flip = isBuySide ? should_flip : !should_flip

  fromToken = flip ? quote_currency : base_currency
  toToken = flip ? base_currency : quote_currency
  fromTokenAddress = flip ? quote_currency_address : base_currency_address
  toTokenAddress = flip ? base_currency_address : quote_currency_address
  fromTokenAmount = flip ? (amountFilled && avg_price ? amountFilled * avg_price : undefined) : amountFilled
  toTokenAmount = flip ? amountFilled : amountFilled && avg_price ? amountFilled * avg_price : undefined

  // Assign default values if undefined
  fromToken = fromToken || 'Token'
  toToken = toToken || 'Token'
  fromTokenAddress = fromTokenAddress || zeroAddress
  toTokenAddress = toTokenAddress || zeroAddress
  fromTokenAmount = fromTokenAmount !== undefined ? fromTokenAmount : 0
  toTokenAmount = toTokenAmount !== undefined ? toTokenAmount : 0
  return { fromToken, toToken, fromTokenAmount, toTokenAmount, fromTokenAddress, toTokenAddress }
}
