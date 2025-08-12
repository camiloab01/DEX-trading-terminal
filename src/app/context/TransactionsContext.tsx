import axios from 'axios'
import { ReactElement, createContext, useContext, useEffect, useRef, useState } from 'react'
import { PublicClient, TransactionReceipt } from 'viem'
import { OrderBannerEnums, useBanners } from '../components/banners/OrderBanners'
import { CHAIN_INFO } from '../constants/abi/chainInfo'
import { usePageName } from '../hooks/usePageName'
import { zarazTrack } from '../lib/zaraz'
import { useChainLoader } from '../route/loaderData'
import { PriceQuoteWithMarket } from '../types/canoe'
import { useConfigContext } from './ConfigContext'
import { WalletClientWithAccount } from './NetworkContext'
import { useTelemetryContext } from './TelemetryContext'
import { useUserOrderContext } from './UserOrderContext'

export enum TransactionType {
  MARKET = 'Market Order',
  LIMIT = 'Limit Order',
  CLAIM_LIMIT_ORDER = 'Claim Limit Order',
  CANCEL_LIMIT_ORDER = 'Cancel Limit Order',
  DEPLOY_POSITION = 'Deploy Position',
  ADD_LIQUIDITY = 'Add Liquidity',
  REMOVE_LIQUIDITY = 'Remove Liquidity',
  CREATE_POOL = 'Create Pool',
  CLAIM_FEES = 'Claim Fees',
  CLOSE_POSITION = 'Close Position',
}

export interface TransactionInfo {
  type: TransactionType
  fn(...x: any): Promise<`0x${string}`>
  signer: WalletClientWithAccount
  provider: PublicClient
  hash?: `0x${string}`
  currentRoute?: PriceQuoteWithMarket // only exists for swaps
  pool?: `0x${string}` // only for limit orders and positions
  extra?: any // tx info for info tracking
}

export interface ITransaction extends TransactionInfo {
  id: number
  banner_id: number // id of banner assoc. with this tx
  changeBanner(state: OrderBannerEnums, newBanner?: boolean, hash?: string): number
}

function getEvent(type: TransactionType): string {
  switch (type) {
    case TransactionType.MARKET:
      return 'router_swap'
    case TransactionType.LIMIT:
      return 'create_limit_order'
    case TransactionType.CLAIM_LIMIT_ORDER:
      return 'claim_limit_order'
    case TransactionType.CANCEL_LIMIT_ORDER:
      return 'cancel_limit_order'
    case TransactionType.DEPLOY_POSITION:
      return 'deploy_position'
    case TransactionType.ADD_LIQUIDITY:
      return 'add_liquidity'
    case TransactionType.REMOVE_LIQUIDITY:
      return 'remove_liquidity'
    case TransactionType.CREATE_POOL:
      return 'create_pool'
    default:
      return ''
  }
}

const TransactionsContext = createContext<{
  add: (tx: TransactionInfo) => void
  isCompleted: boolean
  setIsCompleted: (value: boolean) => void
  txState: OrderBannerEnums | undefined
}>({ add: () => 0, isCompleted: false, setIsCompleted: () => false, txState: undefined })

export const TransactionsContextProvider = ({ children }: { children: ReactElement | ReactElement[] }) => {
  const { setUpdateUserInfo } = useUserOrderContext()
  const { telemetryRpc } = useTelemetryContext()
  const {
    features: { Telemetry, Accounts },
  } = useConfigContext()
  const { currentChainInfo } = useChainLoader()
  const page = usePageName()
  const pageName = page.pageName !== undefined ? page.pageName : ''
  const banners = useBanners()
  const transactions = useRef<ITransaction[]>([])
  const count = useRef(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [txState, setTxState] = useState<OrderBannerEnums | undefined>(undefined)

  useEffect(() => {
    if (transactions.current.length === 0) {
      count.current = 0
    }
  }, [transactions])

  function removeById(id: number) {
    const tmp = transactions.current
    transactions.current = tmp.filter((tx) => tx.id !== id)
  }

  function changeBanner(this: ITransaction, state: OrderBannerEnums, newBanner?: boolean, hash?: string) {
    setTxState(state)
    if (this.banner_id === -1 || newBanner === true) {
      // means banner doesn't exist
      return banners.add({ state: state, type: this.type, txHash: hash, chainId: currentChainInfo.id })
    } else {
      return banners.replace(this.banner_id, {
        state: state,
        type: this.type,
        txHash: hash,
        chainId: currentChainInfo.id,
      })
    }
  }

  function add(tx: TransactionInfo) {
    const { fn, ...rest } = tx
    const newTx: ITransaction = {
      id: count.current,
      banner_id: -1,
      changeBanner: changeBanner,
      fn: async function (this: ITransaction) {
        const boundFn = fn.bind(this)
        boundFn()
          .then(async (hash) => {
            this.hash = hash
            const receipt: TransactionReceipt = await this.provider.waitForTransactionReceipt({ hash: hash })
            if (receipt.status === 'reverted') {
              window.log.error(receipt)
              this.changeBanner(OrderBannerEnums.EXECUTE_TRADE_ERROR, false, hash)
            } else {
              this.changeBanner(OrderBannerEnums.EXECUTE_TRANSACTION_SUCCESS, false, hash)
              setUpdateUserInfo(true) // will update at next block
              setIsCompleted(true)
            }
            return hash
          })
          .catch((err) => {
            // error in executing tx or getting receipt
            window.log.error(err)
            const message = err.message.toString()
            const slippageSubStrs = ['min return', 'slippage', 'return amount', 'minimum amount']
            const errorBannerToShow = slippageSubStrs.some((subStr) => message.toLowerCase().includes(subStr))
              ? OrderBannerEnums.EXECUTE_SLIPPAGE_ERROR
              : OrderBannerEnums.EXECUTE_TRANSACTION_ERROR
            this.changeBanner(errorBannerToShow, false, this.hash)
          })
          .finally(async () => {
            // all tracking here
            if (this.hash !== undefined) {
              const event = getEvent(tx.type)
              if (tx.currentRoute) {
                let swapValue = 0
                if (tx.currentRoute.inUsdValue > 0 && tx.currentRoute.outUsdValue > 0) {
                  swapValue = (tx.currentRoute.inUsdValue + tx.currentRoute.outUsdValue) / 2
                } else if (tx.currentRoute.inUsdValue > 0) {
                  swapValue = tx.currentRoute.inUsdValue
                } else if (tx.currentRoute.outUsdValue > 0) {
                  swapValue = tx.currentRoute.outUsdValue
                }
                if (CHAIN_INFO[tx.currentRoute.chainId] != undefined) {
                  zarazTrack(event, {
                    address: tx.signer.account.address,
                    chain: currentChainInfo.name,
                    tokenIn: tx.currentRoute.inToken.address,
                    tokenInSymbol: tx.currentRoute.inToken.symbol,
                    tokenOut: tx.currentRoute.outToken.address,
                    tokenOutSymbol: tx.currentRoute.outToken.symbol,
                    amountIn: tx.currentRoute.inAmount,
                    value: Math.abs(swapValue),
                    market: tx.currentRoute.market,
                    transaction: this.hash,
                  })
                }
              } else if (tx.pool) {
                zarazTrack(event, { chain: currentChainInfo.name, pool: tx.pool, transaction: this.hash })
              } else {
                // i dont think this ever hits but wtv
                zarazTrack(event, { chain: currentChainInfo.name, transaction: this.hash })
              }
              if (Telemetry.enabled) {
                const { quote_id, ...extra } = this.extra
                const obj = {
                  chain_id: currentChainInfo.id,
                  current_page: pageName,
                  feature: getEvent(this.type),
                  sender: tx.signer.account.address,
                  transaction: this.hash,
                  quote_id,
                  extra,
                }
                await axios.post(Accounts.url + '/telemetry/entry', obj)
                await telemetryRpc.call('marq_recordOkuTelemetry', [
                  obj.chain_id,
                  pageName,
                  obj.feature,
                  obj.sender,
                  obj.transaction,
                  extra,
                ])
              }
            }
          })
        return '0x'
      },
      ...rest,
    }
    transactions.current = [...transactions.current, newTx]
    count.current = count.current + 1
    newTx.fn().then(() => removeById(newTx.id))
  }
  return (
    <TransactionsContext.Provider value={{ add, isCompleted, setIsCompleted, txState }}>
      {children}
    </TransactionsContext.Provider>
  )
}
export const useTransactions = () => useContext(TransactionsContext)
