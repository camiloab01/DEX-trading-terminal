import { useEffect, useMemo, useState } from 'react'
import { isWrappedNativeToken } from '../constants/abi/chainInfo'
import { IToken, NewDefaultToken } from '../lib/getToken'
import { zkSync } from 'viem/chains'
import {
  Address,
  PublicClient,
  SendTransactionParameters,
  erc20Abi,
  getContract,
  maxUint160,
  parseAbi,
  parseUnits,
  zeroAddress,
} from 'viem'
import { getPermitData } from '../v3-sdk'
import { WalletClientWithAccount } from '../context/NetworkContext'
import { OrderBannerEnums } from '../components/banners/OrderBanners'
import { IChainInfo } from '@gfxlabs/oku-chains'
import { useQueries } from '@tanstack/react-query'
import { permit2Abi } from '../../generated'
import { useTransactions, TransactionType, ITransaction } from '../context/TransactionsContext'
import { useSearchParams } from 'react-router-dom'
import { useSilentLogin } from './useSilentLogin.tsx'
import { useConfigContext } from '../context/ConfigContext.tsx'
import axios, { CancelTokenSource } from 'axios'
import { ExecutionInformation, PriceQuoteWithMarket } from '../types/canoe'
import { useDebounceCallback } from 'usehooks-ts'

interface MarketOverview {
  status: {
    name: string
    active: boolean
    report?: {
      chains: string[]
    }
  }[]
}
export interface RequestQuoteParams {
  chain: string
  tokenAmount: string
  isExactIn: boolean
  gasPrice?: number
  slippage: number
}
export interface SwapRoute {
  market: string
  loading: boolean
  quote?: PriceQuoteWithMarket
}

export const useSwapRouter = (args: {
  chainInfo: IChainInfo
  signer?: WalletClientWithAccount
  provider?: PublicClient
}) => {
  const {
    features: {
      Router: { url: routerUrl },
      Accounts,
    },
  } = useConfigContext()
  const [searchParams] = useSearchParams()
  const canoeRemote = searchParams.get('canoeRemote')
  const canoeUrl = canoeRemote ? canoeRemote : routerUrl
  const { chainInfo, signer, provider } = args
  const defaultToken = NewDefaultToken(chainInfo.id)
  const [fromToken, setFromTokenRaw] = useState<IToken>(defaultToken)
  const [toToken, setToTokenRaw] = useState<IToken>(defaultToken)
  const [currentRequest, setCurrentRequest] = useState<RequestQuoteParams | undefined>(undefined)
  const debouncedCurrentRequest = useDebounceCallback(setCurrentRequest, 50)
  const { authenticated } = useSilentLogin()
  const [markets, setMarkets] = useState<string[]>([])
  const [overwriteSelectedRoute, setSelectedRoute] = useState<PriceQuoteWithMarket | undefined>(undefined)
  const [userManuallySetRoute, setUserManuallySetRoute] = useState<boolean>(false)
  const [freezedRoute, setFreezedRoute] = useState<PriceQuoteWithMarket>()
  const transactions = useTransactions()

  useEffect(() => {
    axios
      .get(`${canoeUrl}/market/overview`)
      .then((response) => {
        const result: MarketOverview = response.data
        setMarkets(
          result.status
            .filter((market) => market.active && market.report?.chains.includes(chainInfo.internalName))
            .map((market) => market.name)
        )
      })
      .catch((err) => window.log.error(err))
  }, [canoeUrl, chainInfo.internalName])

  useEffect(() => setFreezedRoute(undefined), [overwriteSelectedRoute])

  const setFromToken = (t?: IToken) => {
    if (t) setFromTokenRaw(t)
    else setFromTokenRaw(defaultToken)
  }
  const setToToken = (t?: IToken) => {
    if (t) setToTokenRaw(t)
    else setToTokenRaw(defaultToken)
  }
  const routeQueryResults = useQueries({
    queries: markets.map((market) => {
      return {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
        queryKey: ['swap_order_quote', market, currentRequest, fromToken, toToken],
        queryFn: async ({ signal }: any) => {
          const args = currentRequest
          if (fromToken == undefined || fromToken == null || toToken == undefined || toToken == null) return null
          if (args == undefined || currentRequest == undefined || currentRequest == null) return null
          if (currentRequest.tokenAmount === '' || fromToken.address.toLowerCase() === toToken.address.toLowerCase())
            return null
          window.log.log('query to', market)
          const { chain, tokenAmount, isExactIn } = args
          const payload = {
            chain: chain,
            account: signer?.account.address || zeroAddress,
            inTokenAddress: fromToken.address,
            outTokenAddress: toToken.address,
            isExactIn: isExactIn,
            gasPrice: args.gasPrice,
            slippage: args.slippage,
          } as any
          if (isExactIn) payload.inTokenAmount = tokenAmount.toString()
          else payload.outTokenAmount = tokenAmount.toString()
          const source: CancelTokenSource = axios.CancelToken.source()
          const axiosRequest = axios
            .post(`${canoeUrl}/market/${market}/swap_quote`, payload, { cancelToken: source.token })
            .then((response) => response.data)

          signal?.addEventListener('abort', () => source.cancel())
          return axiosRequest
        },
      }
    }),
  })
  let lastUpdated = 0
  for (const result of routeQueryResults) {
    if (result.dataUpdatedAt > lastUpdated) lastUpdated = result.dataUpdatedAt
    if (result.errorUpdatedAt > lastUpdated) lastUpdated = result.errorUpdatedAt
  }
  const routes = useMemo(() => {
    const routeArray = routeQueryResults
      .map<SwapRoute>((result, i) => ({
        market: markets[i],
        loading: result.isFetching,
        quote: result.isFetching ? undefined : result.data !== null ? result.data : undefined,
      }))
      .sort((a, b) => {
        if (a.quote !== undefined) {
          if (b.quote === undefined) return -1
          // compare quotes
          let diff
          if (currentRequest?.isExactIn)
            diff = b.quote.outUsdValue / b.quote.inUsdValue - a.quote.outUsdValue / a.quote.inUsdValue
          else diff = a.quote.inUsdValue - b.quote.inUsdValue
          if (diff !== 0) return diff
        } else if (b.quote !== undefined) {
          return 1
        } else if (a.loading) {
          if (!b.loading) return -1
        } else if (b.loading) return 1
        // fall back to sorting by name
        if (a.market < b.market) return -1
        else return 1
      })
    if (currentRequest === undefined || !(Number(currentRequest.tokenAmount) > 0)) return []
    return routeArray
  }, [lastUpdated, currentRequest, fromToken, toToken])

  const checkedMarkets = JSON.parse(window.localStorage.getItem('checkedMarkets') || '[]')
  const selectedRoute = useMemo(() => {
    if (overwriteSelectedRoute && checkedMarkets.includes(overwriteSelectedRoute.market)) return overwriteSelectedRoute
    if (routes.length > 0) {
      setUserManuallySetRoute(false)
      return routes.find((route) => checkedMarkets.includes(route.market))?.quote
    }
    return undefined
  }, [overwriteSelectedRoute, routes, checkedMarkets])

  const isFetchingPrice =
    currentRequest !== undefined &&
    Number(currentRequest.tokenAmount) > 0 &&
    routes.length > 0 &&
    routes.find((route) => checkedMarkets.includes(route.market))?.loading

  useEffect(() => {
    setSelectedRoute(undefined)
    routeQueryResults.map(async (result) => await result.refetch())
  }, [canoeUrl, currentRequest, fromToken, toToken])

  const [resolveTerms, setResolveTerms] = useState<undefined | ((success: boolean) => void)>()
  // executeTrade executes the trade
  const executeTrade = async (route: PriceQuoteWithMarket) => {
    // make sure they have accepted terms
    if (!authenticated) {
      // i hope god will forgive me of this sin
      try {
        await new Promise((resolve, reject) => {
          setResolveTerms(() => {
            return (success: boolean) => {
              setResolveTerms(undefined)
              if (success) resolve(undefined)
              else reject(new Error('user rejected terms'))
            }
          })
        })
      } catch (e) {
        return
      }
    }
    let createPermitSignature = false
    // if fetching, don't do anything
    if (!signer || !provider) return
    const routeData = route
    if (routeData.coupon?.swapConfig?.recipient === zeroAddress) {
      routeData.coupon.swapConfig.recipient = signer.account.address
      createPermitSignature = true
    }
    const currentRoute = { ...routeData }
    // if chainmismatch dont do anything
    if (provider?.chain?.id != currentRoute.chainId) {
      window.log.error('attempting to execute trade on incorrect chain', provider.chain, currentRoute.chainId)
      setFreezedRoute(undefined)
      return
    }
    // now populate any signatures that exist
    // TODO: we only support one permit signature. supporting more is sorta complicated so we will not do that for now.
    const execute = async function (this: ITransaction): Promise<`0x${string}`> {
      const id = currentRoute.chainId + '_' + signer.account.address + '_' + Date.now()
      await axios.post(Accounts.url + '/canoe/quote_info', {
        id: id,
        market: currentRoute.market,
        chainId: currentRoute.chainId,
        inToken: currentRoute.inToken.address,
        outToken: currentRoute.outToken.address,
        inUsdValue: currentRoute.inUsdValue,
        outUsdValue: currentRoute.outUsdValue,
        sender: signer.account.address,
        calldata: currentRoute.candidateTrade ? currentRoute.candidateTrade.data : '',
      })
      const coupon = { ...currentRoute.coupon }
      const signingRequest = { ...currentRoute.signingRequest }
      if (signingRequest != undefined && signingRequest.permit2Address && signingRequest.permitSignature) {
        const thisPermit = signingRequest.permitSignature[0]
        const expiration = Number(signingRequest.permitSignature[0].permit.details.expiration) + 604800
        signingRequest.permitSignature[0].permit.details.expiration = expiration.toString()
        signingRequest.permitSignature[0].permit.details.amount = maxUint160.toString()
        if ((thisPermit != undefined && !thisPermit.signature) || createPermitSignature) {
          const permit2Contract = getContract({
            address: signingRequest.permit2Address as `0x${string}`,
            abi: permit2Abi,
            client: { wallet: signer, public: provider },
          })
          const permit2Allowance = await permit2Contract.read.allowance([
            signer.account.address,
            signingRequest.permitSignature[0].permit.details.token as `0x${string}`,
            signingRequest.permitSignature[0].permit.spender as `0x${string}`,
          ])
          // If the permit2 allowance is not enough or expired, request a new permit2,
          if (
            permit2Allowance[0] < parseUnits(routeData.inAmount, routeData.inToken.decimals) ||
            permit2Allowance[1] < Math.floor(new Date().getTime() / 1000)
          ) {
            thisPermit.permit.details.nonce = permit2Allowance[2].toString()
            const args = getPermitData(
              signer.account.address,
              thisPermit.permit,
              signingRequest.permit2Address,
              currentRoute.chainId,
              expiration
            )
            this.banner_id = this.changeBanner(OrderBannerEnums.SIGNATURE_IN_PROGRESS)
            // created signature for permit2
            const signature = await signer.signTypedData(args)
            this.banner_id = this.changeBanner(OrderBannerEnums.SIGNATURE_SUCCESS)
            signingRequest.permitSignature[0].signature = signature
          }
        }
      }
      const executionRequest = { coupon: coupon, signingRequest: signingRequest }
      // obtain the execution info after returning the correctly signed permit2
      const executionInfo = await axios
        .post(`${canoeUrl}/market/${currentRoute.market}/execution_information`, executionRequest)
        .then((response) => response.data as ExecutionInformation)
      // first do any approvals
      if (executionInfo.approvals) {
        for (const approval of executionInfo.approvals) {
          const tokenInContract = getContract({
            address: approval.address as `0x${string}`,
            abi: erc20Abi,
            client: { wallet: signer, public: provider },
          })
          if (tokenInContract.address == zeroAddress) continue
          let currentApproved = await tokenInContract.read.allowance([
            signer.account.address,
            approval.approvee as `0x${string}`,
          ])
          // if there is not enough, request approval
          while (parseUnits(currentRoute.inAmount, currentRoute.inToken.decimals) > currentApproved) {
            this.banner_id = this.changeBanner(OrderBannerEnums.TOKEN_APPROVAL, true)
            const approving = await tokenInContract.write.approve([approval.approvee as Address, 2n ** 192n], {
              chain: signer.chain,
              account: signer.account,
            })
            this.banner_id = this.changeBanner(OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS, false, approving)
            await provider.waitForTransactionReceipt({ hash: approving })
            this.banner_id = this.changeBanner(OrderBannerEnums.TOKEN_APPROVAL_SUCCESS, false, approving)
            currentApproved = await tokenInContract.read.allowance(
              [signer.account.address, approval.approvee as `0x${string}`],
              { blockTag: 'pending' }
            )
          }
        }
      }
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_TRADE, true)
      const swapTxn = executionInfo.trade
      const transaction: SendTransactionParameters = {
        data: swapTxn.data as `0x${string}`,
        to: swapTxn.to as `0x${string}`,
        value: swapTxn.value ? BigInt(swapTxn.value) : undefined,
        account: signer.account.address,
        gasPrice: undefined,
        chain: signer.chain,
      }
      if (currentRoute.chainId !== zkSync.id && swapTxn.accessList) transaction.accessList = swapTxn.accessList as any
      const gasEstimate = await provider.estimateGas(transaction)
      transaction.gas = (gasEstimate * 12n) / 10n
      if (
        currentRoute.market == 'usor' &&
        !isWrappedNativeToken(currentRoute.chainId, transaction.to as `0x${string}`)
      ) {
        const routerAbi = parseAbi([
          'function supportsInterface(bytes4 interfaceID) external view returns (bool)' as const,
        ])
        const routerContract = getContract({
          address: transaction.to as `0x${string}`,
          abi: routerAbi,
          client: { wallet: signer, public: provider },
        })
        const correctAddress = await routerContract.read.supportsInterface(['0x01ffc9a7'] as const)
        if (!correctAddress) throw new Error('attempting to send to incorrect address')
      }
      this.extra = {
        calldata: transaction.data,
        to: transaction.to,
        gas: transaction.gas.toString(),
        value: transaction.value?.toString(),
        quote_id: id,
      }
      const tx = await signer.sendTransaction(transaction)
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS, false, tx)
      setFreezedRoute(undefined)
      return tx
    }
    transactions.add({
      type: TransactionType.MARKET,
      fn: execute,
      signer: signer,
      provider: provider,
      currentRoute: routeData,
    })
  }
  return {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    routes,
    selectedRoute,
    setSelectedRoute,
    userManuallySetRoute,
    setUserManuallySetRoute,
    isFetchingPrice,
    currentRequest,
    showTerms: resolveTerms !== undefined,
    acceptTerms: resolveTerms,
    setCurrentRequest: debouncedCurrentRequest,
    executeTrade,
    markets,
    freezedRoute,
    setFreezedRoute,
  }
}
