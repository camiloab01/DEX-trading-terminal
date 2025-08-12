import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { cancelOrder, claimOrder } from '../../contracts/limitOrder'
import { Order } from '@gfxlabs/oku'
import { OrderBannerEnums } from '../banners/OrderBanners'
import { useAccount } from 'wagmi'
import { useNetworkContext } from '../../context/NetworkContext'
import { useChainLoader } from '../../route/loaderData'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import { FontWeightEnums } from '../../types/Enums'
import { useTransactions, TransactionType, ITransaction } from '../../context/TransactionsContext'

export default function ManageOrder(props: {
  order: Order
  setIsOpen?: (value: boolean) => void
  isOrderPage: boolean
}) {
  const { order, setIsOpen, isOrderPage } = props
  const { address } = useAccount()
  const { currentChain, currentChainInfo } = useChainLoader()
  const { signer, provider } = useNetworkContext()
  const transactions = useTransactions()

  const onClaim = async (order: Order) => {
    setIsOpen && setIsOpen(false)
    const batchId = order.limit_order_full?.batch_id
    if (signer == undefined || batchId == undefined || address == undefined || provider == undefined) return
    if (currentChainInfo?.contracts?.limitOrder == undefined) return
    const executeClaim = async function (this: ITransaction): Promise<`0x${string}`> {
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_CLAIM)
      const claimOrderTx = await claimOrder({
        userDataId: batchId,
        userAddress: address,
        signer,
        provider,
        contract: currentChainInfo.contracts.limitOrder.address,
      })
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_CLAIM_IN_PROGRESS, false, claimOrderTx)
      return claimOrderTx
    }
    transactions.add({
      type: TransactionType.CLAIM_LIMIT_ORDER,
      fn: executeClaim,
      signer: signer,
      provider: provider,
      pool: order.pool as `0x${string}`,
    })
  }

  const onCancel = async (order: Order) => {
    setIsOpen && setIsOpen(false)
    const direction = order.limit_order_full?.direction
    const targetTick = !direction ? order.limit_order_full?.tick_lower : order.limit_order_full?.tick_upper
    const poolAddress = order.pool
    window.log.log(poolAddress, targetTick, direction, currentChain, poolAddress, order.side)
    if (signer == undefined || poolAddress == undefined || address == undefined || provider == undefined) return
    if (direction == undefined || targetTick == undefined) return
    if (currentChainInfo.contracts.limitOrder == undefined) return
    const executeCancel = async function (this: ITransaction) {
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_CANCEL)
      const cancelOrderTx = await cancelOrder({
        pool: poolAddress,
        provider,
        targetTick,
        direction,
        signer,
        contract: currentChainInfo.contracts.limitOrder.address,
      })
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_CANCEL_IN_PROGRESS, false, cancelOrderTx)
      return cancelOrderTx
    }
    transactions.add({
      type: TransactionType.CANCEL_LIMIT_ORDER,
      fn: executeCancel,
      signer: signer,
      provider: provider,
      pool: order.pool as `0x${string}`,
    })
  }

  return (
    <>
      {order != undefined && order.type === 'LIMIT' && order.status === 'OPEN' ? (
        <div className="flex items-center justify-center">
          <button
            className="px-4 h-5 items-center flex justify-center rounded-[4px] hover:bg-gray-500 rounded-[6px]"
            onClick={() => onCancel(order)}
          >
            {isOrderPage ? (
              <T2 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[50]}>
                Close
              </T2>
            ) : (
              <T3 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[50]}>
                Close
              </T3>
            )}
          </button>
        </div>
      ) : order != undefined && order.type === 'LIMIT' && order.status === 'FILLED' ? (
        <div className="flex items-center justify-center">
          <button
            className="px-4 h-5 items-center flex justify-center rounded-[4px] hover:bg-blue-500 bg-blue-400 rounded-[6px]"
            onClick={() => onClaim(order)}
          >
            {isOrderPage ? (
              <T2 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
                Claim
              </T2>
            ) : (
              <T3 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
                Claim
              </T3>
            )}
          </button>
        </div>
      ) : (
        <div className="py-1 flex items-center justify-center">
          {isOrderPage ? (
            <T2 color={colors.gray[400]}>{capitalizeFirstLetter(order.status ? order.status : 'Unknown')}</T2>
          ) : (
            <T3 color={colors.gray[400]}>{capitalizeFirstLetter(order.status ? order.status : 'Unknown')}</T3>
          )}
        </div>
      )}
    </>
  )
}
