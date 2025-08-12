import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import { Divider } from '../misc/Divider'
import NumberInput from './NumberInput'
import { useEffect, useState } from 'react'
import BalanceInfo from '../forms/OrderForms/BalanceInfo'
import TokenDisplay from '../forms/OrderForms/TokenDisplay'
import { RoundTokenLogo } from '../misc/RoundTokenLogo'
import { GetBalanceData } from 'wagmi/query'
import { useInputSideAndAmountQueryParam } from '../../hooks/useQueryParams.ts'

interface ILimitOrderFormInput {
  placeHolder?: string
  token: IToken
  loading?: boolean
  action: string
  setFocus: (value: string) => void
  focus: string
  isToken0?: boolean
  disabled?: boolean
  stateRef?: React.MutableRefObject<{
    token0: string
    token1: string
  }>
  orderInput: string
  setOrderInput: (value: string, token: IToken) => void
  balance: GetBalanceData | undefined
}

function LimitOrderFormInput(props: ILimitOrderFormInput) {
  const {
    placeHolder,
    token,
    loading = false,
    action,
    setFocus,
    focus,
    disabled = false,
    balance,
    orderInput,
    setOrderInput,
  } = props
  const [hover, setHover] = useState(false)
  const isSellToken = action === 'Sell'
  const [value, setValue] = useState('')
  const [setInputSide, inputSideQuery, setInputAmountAndInputSide] = useInputSideAndAmountQueryParam(
    'inputSide',
    'inputAmount'
  )
  const onValueChange = (value: string) => {
    if (value === '') setOrderInput('', token)
    if (value === orderInput) return
    setOrderInput(value, token)
    setFocus(action)
  }
  useEffect(() => {
    if (value !== orderInput) setValue(orderInput)
  }, [orderInput])

  useEffect(() => {
    if (inputSideQuery === 'Buy') {
      setFocus(inputSideQuery)
    } else {
      setFocus(focus)
    }
  }, [inputSideQuery])
  const setMax = () => {
    if (balance) setOrderInput(balance.formatted, token)
  }
  return (
    <div className="flex flex-col">
      <div
        onFocus={() => {
          setFocus(action)
          setInputAmountAndInputSide(value, action)
          setInputSide(action)
        }}
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
        className="flex flex-row justify-between rounded-[10px] border-[1px] p-2.5 border-gray-750 hover:border-blue-400"
        style={{ borderColor: (!disabled && focus === action) || hover ? colors.blue[400] : colors.gray[750] }}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between gap-1.5">
            <div className={'flex flex-grow flex-col gap-0.5'}>
              {loading ? (
                <div className="h-5">
                  <div className="w-20 mt-0.5 h-4 rounded-sm bg-gradient-to-r from-gray-700 to-gray-900 animte-shimmer overflow-hidden">
                    <div className="animate-shimmer w-20 h-4 bg-gradient-to-r from-gray-900 to-transparent"></div>
                  </div>
                </div>
              ) : (
                <NumberInput
                  onUserInput={onValueChange}
                  value={value}
                  placeholder={placeHolder}
                  decimals={token.decimals}
                  disabled={disabled || loading}
                  classes="text-sm font-medium text-gray-50 pb-4"
                />
              )}
            </div>
            <div className="flex justify-end mb-1 items-center gap-1">
              <RoundTokenLogo tokenSymbol={token.symbol} logoUrl={token.logoURI} />
              {focus && <T3 color={focus === action ? colors.blue[400] : colors.gray[400]}>{action}</T3>}
            </div>
          </div>
          <Divider containerClasses={'pt-1.5 pb-2.5'} />
          <div className="flex flex-row justify-between items-center gap-x-1 w-full">
            <BalanceInfo
              onClick={isSellToken && balance && balance.formatted > value ? setMax : undefined}
              balance={balance}
            />
            <TokenDisplay token={token} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default LimitOrderFormInput
