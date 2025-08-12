import { useModalContext } from './ModalContext'
import { useRpcBlockContext } from './RpcBlockContext'
import { IToken, NewDefaultToken } from '../lib/getToken'
import { getMarketWatch } from '../lib/marketWatch'
import { createToken } from '../util/createToken'
import { getTokenLogos } from '../util/getTokenLogo'
import { ITrade } from '../components/lists/orderBook/OrderBookItems'
import { PoolSummary, univ3_LiquiditySnapshot } from '@gfxlabs/oku'
import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PoolTokenInfo as PTI, usePoolTokenInfo } from '../hooks/usePoolTokenInfo'
import { useCurrentClient } from '../hooks/useClient'
import { CHAIN_INFO } from '../constants/abi/chainInfo'
import { zeroAddress, Address } from 'viem'
import { useChainLoader } from '../route/loaderData'

export type PoolTokenInfo = PTI

interface DataContextProps {
  setToken0: (value: IToken) => void
  setToken1: (value: IToken) => void
  poolAddress: Address
  liquidityChart?: univ3_LiquiditySnapshot
  tickSpacing?: number
  poolSummary: PoolSummary
  token0: IToken
  token1: IToken
  chosenValue?: { side: string; trade: ITrade }
  setChosenValue: (value: undefined | { side: string; trade: ITrade }) => void
  token: PoolTokenInfo
  setToken: (value: number) => void
  favoritePool: string[]
  setFavoritePool: (value: string[]) => void
  blockNumber: number
}

const DataContext = createContext({
  token: { selected: 1, sign: -1, flipped: true, decimals: 0 },
  token0: NewDefaultToken(1),
  token1: NewDefaultToken(1),
} as DataContextProps)

export const DataContextProvider = ({ children }: { children: any }) => {
  const { currentChain } = useChainLoader()
  const defaultToken = NewDefaultToken(currentChain)
  const [token0, setToken0] = useState<IToken>(defaultToken)
  const [token1, setToken1] = useState<IToken>(defaultToken)
  const defaultPoolAddress = CHAIN_INFO[currentChain]?.defaultPool
  const { blockNumber, blockNumberByChain } = useRpcBlockContext()
  const { poolAddress = defaultPoolAddress, token0: swapPageToken0, token1: swapPageToken1 } = useParams()
  const [currentPoolAddress, setCurrentPoolAddress] = useState<string>(defaultPoolAddress)
  const { token, setToken, setFullToken } = usePoolTokenInfo()
  const [chosenValue, setChosenValue] = useState<undefined | { side: string; trade: ITrade }>(undefined)
  const [favoritePool, setFavoritePool] = useState<string[]>(getMarketWatch(currentChain))
  const { data: searchPoolsResults } = useCurrentClient(
    'cush_search',
    [[swapPageToken0 || '', swapPageToken1 || ''].join('/')],
    { enabled: !!swapPageToken0 && !!swapPageToken1 }
  )

  useEffect(() => {
    // Only set currentPoolAddress when on Swap page. swapPageToken0 and swapPageToken1 are undefined on other pages.
    if (searchPoolsResults && searchPoolsResults?.result_size > 1 && swapPageToken0 && swapPageToken1) {
      setCurrentPoolAddress(searchPoolsResults.pools[0].address)
    }
  }, [searchPoolsResults])

  useEffect(() => setFavoritePool(getMarketWatch(currentChain)), [currentChain])

  useEffect(() => {
    if (poolAddress && poolAddress.toLocaleLowerCase() !== currentPoolAddress.toLocaleLowerCase()) {
      setCurrentPoolAddress(poolAddress)
    }
  }, [poolAddress])
  const { mutatedData: poolSummary } = useCurrentClient(
    [
      'cush_search',
      (data) => {
        const res = data?.pools[0]
        return res
          ? res
          : ({
              address: zeroAddress,
              t0: NewDefaultToken(1).address,
              t1: NewDefaultToken(1).address,
              t1_name: '...',
              t0_name: '...',
              t1_symbol: '...',
              t0_symbol: '...',
              t1_decimals: 0,
              t0_decimals: 1,
              is_preferred_token_order: false,
            } as PoolSummary)
      },
    ],
    [currentPoolAddress]
  )

  const { data: liquidityChart } = useCurrentClient('cush_simulatePoolLiquidity', [
    currentPoolAddress,
    blockNumberByChain,
  ])
  const { setIsLoading } = useModalContext()
  useEffect(() => {
    if (poolSummary == undefined || !poolSummary.address) return
    // prevents infinite loop
    if (
      currentPoolAddress.toLowerCase() === poolSummary.address.toLowerCase() ||
      currentPoolAddress.toLocaleLowerCase() === poolAddress.toLocaleLowerCase() ||
      poolSummary.address === zeroAddress
    ) {
      return
    }
    setCurrentPoolAddress(poolSummary.address)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolSummary])

  useEffect(() => {
    const tokens = {
      token0: createToken({
        address: poolSummary.t0 as any,
        symbol: poolSummary.t0_symbol,
        decimals: poolSummary.t0_decimals,
        name: poolSummary.t0_name,
        chainId: currentChain,
      }) as IToken,
      token1: createToken({
        address: poolSummary.t1 as any,
        symbol: poolSummary.t1_symbol,
        decimals: poolSummary.t1_decimals,
        name: poolSummary.t1_name,
        chainId: currentChain,
      }) as IToken,
    }
    getTokenLogos(tokens, currentChain)
    const selected = poolSummary.is_preferred_token_order ? 1 : 0
    const newToken = { selected, decimals: 0, sign: selected === 0 ? 1 : -1, flipped: selected === 0 }
    newToken.decimals = poolSummary.t1_decimals - poolSummary.t0_decimals
    setToken0(tokens.token0)
    setToken1(tokens.token1)
    setFullToken(newToken)
  }, [currentPoolAddress, poolSummary.address])

  return (
    <DataContext.Provider
      value={{
        setToken0,
        setToken1,
        poolAddress: currentPoolAddress as Address,
        liquidityChart,
        poolSummary,
        token0,
        token1,
        chosenValue,
        setChosenValue,
        token,
        setToken,
        favoritePool,
        setFavoritePool,
        blockNumber,
        tickSpacing: liquidityChart?.tick_spacing,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useDataContext = (): DataContextProps => {
  const context = useContext<DataContextProps>(DataContext)

  if (context === null) {
    throw new Error('"useDataContext" should be used inside a "DataContextProvider"')
  }
  return context
}
