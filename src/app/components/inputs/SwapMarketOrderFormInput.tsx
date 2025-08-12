import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import SelectTokenDropdown from '../dropdown/setTokenDropdown/SelectTokenDropdown'
import NumberInput from './NumberInput'
import { useMemo } from 'react'
import BalanceInfo from '../forms/OrderForms/BalanceInfo'
import { GetBalanceData } from 'wagmi/query'
import { WETH9_ADDRESS } from './../../constants/abi/chainInfo'
import { zeroAddress } from 'viem'
import { MarketOrderFormInputWeth9Dropdown } from '../dropdown/MarketOrderFormInputWETH9.tsx'
import TokenDisplay from '../forms/OrderForms/TokenDisplay.tsx'
import { Divider } from '../misc/Divider.tsx'
import { useChainLoader } from '../../route/loaderData.tsx'
import { RoundTokenLogo } from '../misc/RoundTokenLogo.tsx'
import { getTokenLogoUrl } from '../../util/getTokenLogo.ts'
import { formatNumber } from '../numbers/FormatNumber.tsx'
import { useInputSideAndAmountQueryParam } from '../../hooks/useQueryParams.ts'
import { RequestQuoteParams } from '../../hooks/useSwapRouter.tsx'

interface ISwapMarketOrderFormInput {
  placeHolder?: string
  token: IToken
  setToken: (value?: IToken) => void
  loading?: boolean
  action: string
  setFocus: (value: string) => void
  focus: string
  disabled?: boolean
  balance: GetBalanceData | undefined
  allowTokenSelection?: boolean
  fullScreenTokenSelection?: boolean
  usdValue?: number
  value: string
  setValue: (value: string) => void
  setCurrentRequest: (params: RequestQuoteParams) => void
}
function SwapMarketOrderFormInput(props: ISwapMarketOrderFormInput) {
  const {
    placeHolder,
    token,
    setToken,
    value,
    setValue,
    loading = false,
    action,
    setFocus,
    focus,
    disabled = false,
    balance,
    allowTokenSelection = false,
    fullScreenTokenSelection = false,
    usdValue,
    setCurrentRequest,
  } = props
  const { currentChainInfo } = useChainLoader()
  const [setInputSide] = useInputSideAndAmountQueryParam('inputSide', 'inputAmount')
  const onValueChange = (value: string) => {
    if (value === '') setValue('')
    setFocus(action)
    setValue(value)
    setCurrentRequest({
      tokenAmount: '',
      isExactIn: false,
      chain: '',
      slippage: 0,
    })
  }
  const setMax = () => {
    if (balance) setValue(balance.formatted)
  }
  const tokenLogo = useMemo(() => {
    return token.address === zeroAddress
      ? getTokenLogoUrl(WETH9_ADDRESS[currentChainInfo.id], currentChainInfo.id)
      : token.logoURI
        ? token.logoURI
        : getTokenLogoUrl(token.address, currentChainInfo.id)
  }, [token.address, currentChainInfo.id])
  return (
    <div className="flex flex-col">
      <div
        onFocus={() => {
          setFocus(action)
          setInputSide(action)
        }}
        className="flex flex-row justify-between rounded-[10px] border-[1px] p-2.5 border-gray-750 hover:border-blue-400"
        style={{ borderColor: !disabled && focus === action ? colors.blue[400] : undefined }}
      >
        <div className={'flex flex-col w-full'}>
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
                  classes="text-sm font-medium text-gray-50"
                />
              )}
              <T3 color={colors.gray[500]}>
                {usdValue !== undefined
                  ? `~$${formatNumber({
                      num: usdValue,
                      belowOneDecimalAmount: 2,
                      notation: 'standard',
                    })} USD`
                  : '...'}
              </T3>
            </div>
            {!allowTokenSelection ? (
              <div className={'flex justify-end mb-1 items-center gap-1'}>
                <RoundTokenLogo tokenSymbol={token.symbol} logoUrl={tokenLogo} />
                {focus && <T3 color={focus === action ? colors.blue[400] : colors.gray[400]}>{action}</T3>}
              </div>
            ) : (
              <div className={'pt-px'}>
                {focus && <T3 color={focus === action ? colors.blue[400] : colors.gray[400]}>{action}</T3>}
              </div>
            )}
          </div>
          {!allowTokenSelection && <Divider containerClasses={'pt-1.5 pb-1.5'} />}
          <div className="flex flex-row justify-between items-center gap-x-1 w-full">
            <BalanceInfo onClick={action === 'Sell' && balance ? setMax : undefined} balance={balance} />
            {allowTokenSelection ? (
              <SelectTokenDropdown fullScreen={fullScreenTokenSelection} token={token} setToken={setToken} />
            ) : token.address.toLowerCase() === WETH9_ADDRESS[currentChainInfo.id].toLowerCase() ||
              (token.address.toLowerCase() === zeroAddress && setToken != undefined) ? (
              <MarketOrderFormInputWeth9Dropdown token={token} setFromToken={setToken} disabled={loading} />
            ) : (
              <TokenDisplay token={token} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapMarketOrderFormInput
