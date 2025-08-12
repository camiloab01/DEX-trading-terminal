import { T2, T4 } from '../../typography/Typography'
import axios from 'axios'
import { z } from 'zod'
import { colors } from '../../../constants/colors'
import { IToken, getTokenByAddress } from '../../../lib/getToken'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { ReactNode, useEffect, useMemo, useState, useRef } from 'react'
import { RoundTokenLogo } from '../../misc/RoundTokenLogo'
import {
  autoUpdate,
  useClick,
  useFloating,
  useInteractions,
  useTransitionStyles,
  useDismiss,
  flip,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
} from '@floating-ui/react'
import { useChainLoader } from '../../../route/loaderData'
import { useQuery } from '@tanstack/react-query'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import { erc20Abi, formatUnits, zeroAddress } from 'viem'
import { FormattedNumber } from '../../numbers/FormatNumber.tsx'
import { useIsVisible } from '../../../hooks/useVisible.tsx'
import { useCurrentClient } from '../../../hooks/useClient.tsx'
import { InstantSearchSection } from './InstantSearchSection.tsx'
import noTokenLogo from '../../../assets/no-token-logo.webp'
import { useWindowSize } from 'usehooks-ts'
import { useConfigContext } from '../../../context/ConfigContext.tsx'
import { TokenSymbol } from '../../misc/TokenSymbol.tsx'

const FullscreenFloatingOverlay = ({ fullscreen, children }: { fullscreen: boolean; children: ReactNode }) => {
  return fullscreen ? (
    <FloatingOverlay lockScroll className={'z-20 flex justify-center bg-black/70'}>
      {children}
    </FloatingOverlay>
  ) : (
    <>{children}</>
  )
}

const DropdownButton = (props: { token: IToken | undefined }) => {
  const { token } = props
  const { currentChainInfo } = useChainLoader()
  const tokenLogo = token ? getTokenLogoUrl(token.address, currentChainInfo.id) : ''

  return token !== undefined ? (
    <button className="flex flex-row rounded-md h-fit w-fit p-1.5 items-center justify-center border rounded-[8px] border-gray-600 bg-gray-900">
      <RoundTokenLogo logoUrl={tokenLogo} tokenSymbol={token.symbol} size={16} />
      <div className="flex flex-row gap-2 ml-1">
        <T2>{token.symbol && token.symbol !== 'UNKN' ? token.symbol : <TokenSymbol address={token.address} />}</T2>
        <ChevronDownIcon color={colors.gray[50]} width={10} />
      </div>
    </button>
  ) : (
    <button className="flex flex-row rounded-[8px] h-fit gap-x-2 w-fit py-2 px-2 items-center justify-center border border-gray-600">
      <T2 color="text-gray-200">Tokens</T2>
      <ChevronDownIcon color={colors.gray[400]} width={12} height={12} />
    </button>
  )
}

export default function SelectTokenDropdown(props: {
  fullScreen?: boolean
  token?: IToken
  liquidityPage?: boolean
  OrdersPage?: boolean
  setToken: (value: IToken | undefined) => void
}) {
  const { token, setToken, liquidityPage } = props
  const [isExpandedDropdown, setIsExpandedDropdown] = useState(false)
  const windowSize = useWindowSize()
  const isDesktop = useMemo(() => windowSize.width >= 768, [windowSize.width])
  const fullScreen = props.fullScreen || !isDesktop
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: liquidityPage ? [] : [flip()],
    placement: fullScreen ? undefined : 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0,0)' },
    common: { transformOrigin: `top` },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  const { chain, chainID } = useChainLoader()
  const account = useAccount()
  const { isConnected } = useAccount()
  const {
    features: { Accounts },
  } = useConfigContext()
  const { data, refetch } = useQuery({
    queryKey: ['token_balances', chainID, account.address],
    enabled: !!account.address,
    staleTime: 5000,
    gcTime: 5000,
    queryFn: async () => {
      const balances = await axios.get(`${Accounts.url}/wallet/${account.address}/holdings?chain=${chain}`)
      const parsedBalances = z.record(z.string(), z.string()).parse(balances.data)
      return parsedBalances
    },
  })
  const balanceTokens = useMemo(() => {
    if (!data) return []
    let xs = Object.keys(data).map((x) => {
      return getTokenByAddress(x, chainID)
    })
    xs.unshift(getTokenByAddress(zeroAddress, chainID))
    xs = isConnected ? xs.filter((x) => x.symbol !== 'UNKN') : xs.filter((x) => x.address === zeroAddress || x.isNative)
    return xs
  }, [data, chainID, isConnected])

  useEffect(() => {
    refetch()
  }, [isOpen, chainID])

  return (
    <div className="flex flex-col items-end gap-2">
      <div ref={refs.setReference} {...getReferenceProps()}>
        <DropdownButton token={token} />
      </div>
      {isOpen && (
        <FloatingPortal>
          <FullscreenFloatingOverlay fullscreen={fullScreen}>
            <FloatingFocusManager context={context}>
              <div
                {...getFloatingProps({
                  style: fullScreen ? undefined : floatingStyles,
                  className: `${fullScreen ? `${isDesktop ? 'mt-[20vh]' : 'mt-[10vh]'} h-max px-1.5` : `py-1 ml-2`} z-10`,
                })}
                ref={refs.setFloating}
              >
                <div style={fullScreen ? undefined : styles}>
                  <Dropdown
                    setToken={setToken}
                    selectedToken={token}
                    balanceTokens={balanceTokens}
                    isExpandedDropdown={isExpandedDropdown}
                    setIsExpandedDropdown={setIsExpandedDropdown}
                    setIsOpen={setIsOpen}
                    liquidityPage={liquidityPage}
                    ordersPage={props.OrdersPage}
                  />
                </div>
              </div>
            </FloatingFocusManager>
          </FullscreenFloatingOverlay>
        </FloatingPortal>
      )}
    </div>
  )
}

interface DropdownProps {
  isExpandedDropdown: boolean
  setIsExpandedDropdown: (value: boolean) => void
  setToken: (value: IToken | undefined) => void
  selectedToken: IToken | undefined
  balanceTokens: IToken[] | undefined
  setIsOpen: (value: boolean) => void
  liquidityPage?: boolean
  ordersPage?: boolean
}
const Dropdown = (props: DropdownProps) => {
  return (
    <div className="z-[20] relative h-fit bg-gray-750 border border-gray-700 rounded-xl w-full">
      <DropdownLarge {...props} />
    </div>
  )
}

const DropdownLarge = (props: DropdownProps) => {
  const { balanceTokens, setIsOpen, setToken, selectedToken, liquidityPage } = props
  const [input, setInput] = useState('')
  const [changeToken] = useState(() => {
    return (token: IToken) => {
      setToken(token)
      setIsOpen(false)
    }
  })

  return (
    <div className="w-full min-w-[300px] sm:min-w-80">
      <div className="flex flex-row gap-2 p-2 justify-between">
        <T2>Select Token</T2>
      </div>
      <div className="my-2">
        <div className="">
          <InstantSearchSection
            input={input}
            setInput={setInput}
            setToken={changeToken}
            selectedToken={selectedToken}
            balanceTokens={balanceTokens}
            liquidityPage={liquidityPage}
          />
        </div>
      </div>
    </div>
  )
}

export function TokenValueCalc({ token, visible }: { token: IToken; visible?: boolean }) {
  const account = useAccount()
  const { data: nativeBalance } = useBalance({
    address: account.address,
    chainId: token.chainId,
    query: { enabled: visible && token.address === zeroAddress },
  })
  const { data } = useReadContracts({
    allowFailure: false,
    contracts: [
      { address: token.address, abi: erc20Abi, functionName: 'balanceOf', args: [account.address || zeroAddress] },
    ],
    query: {
      enabled: !!account.address && visible && token.address !== zeroAddress,
    },
  })
  const [balance, setBalance] = useState(0n)
  const [balanceNumber, setBalanceNumber] = useState(0)

  useEffect(() => {
    if (token.address === zeroAddress && nativeBalance) {
      setBalance(nativeBalance.value)
      return
    }
    if (token.address !== zeroAddress && data) {
      setBalance(data[0])
      return
    }
  }, [nativeBalance, data])

  useEffect(() => {
    const bal = balance ? Number(formatUnits(balance, token.decimals)) : 0
    if (balanceNumber != bal) {
      setBalanceNumber(bal)
    }
  }, [balance])

  const usdValue = useCurrentClient('cush_tokenUsdPrice', [token.address, 0])
  const valueNumber = useMemo(() => (usdValue.data?.usd_price ?? 0) * balanceNumber, [balanceNumber, usdValue])
  return { balanceNumber, valueNumber }
}

export const TokenWithBalance = ({
  token,
  setToken,
  isSelected,
}: {
  token: IToken
  setToken: (value: IToken | undefined) => void
  isSelected: boolean
}) => {
  const { isConnected } = useAccount()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useIsVisible(ref)
  const { balanceNumber, valueNumber } = TokenValueCalc({ token, visible })
  return (
    <button
      type="button"
      className="flex p-2 gap-x-2 cursor-pointer hover:bg-gray-700 w-full"
      onClick={() => (isSelected ? setToken(undefined) : setToken(token))}
    >
      <div ref={ref} className="w-full">
        <div className="flex flex-row">
          <div className="mt-1 mr-2">
            <RoundTokenLogo
              logoUrl={token.logoURI !== '' ? token.logoURI : noTokenLogo}
              tokenSymbol={token.symbol}
              size={14}
            />
          </div>
          <div className="flex flex-col gap-y-1 items-start">
            <T2 className="whitespace-pre" color={colors.gray[100]}>
              {token.name && token.name.trim().length > 0
                ? token.name.length > 24
                  ? token.name.slice(0, 16) + '...' + token.name.slice(-4).trim()
                  : token.name
                : token.address}
            </T2>
            <T4 className="whitespace-pre" color={colors.gray[400]}>
              {token.isNative || token.address == zeroAddress ? 'Native Token' : token.symbol}
            </T4>
          </div>
        </div>
      </div>
      {isConnected && !isSelected && (
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-1 items-end">
            <T2 className="whitespace-pre" color={colors.gray[100]}>
              <FormattedNumber num={balanceNumber} />
            </T2>
            <T4 className="whitespace-pre" color={colors.gray[400]}>
              {valueNumber > 0 ? (
                <>
                  $<FormattedNumber num={valueNumber} />
                </>
              ) : (
                ''
              )}
            </T4>
          </div>
        </div>
      )}
      {isSelected && <CheckIcon className="mt-2" width={18} height={18} color={colors.green[300]} />}
    </button>
  )
}
