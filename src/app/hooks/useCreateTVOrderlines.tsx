import { Hash, Order } from '@gfxlabs/oku'
import { IChartingLibraryWidget, IOrderLineAdapter } from '../../../vendor/charting_library/charting_library'
import { useRef } from 'react'
import { colors } from '../constants/colors'
import { formatNumber } from '../components/numbers/FormatNumber'
import { useChainLoader } from '../route/loaderData'
import { useNetworkContext } from '../context/NetworkContext'
import { useAccount } from 'wagmi'
import { ITransaction, TransactionType, useTransactions } from '../context/TransactionsContext'
import { OrderBannerEnums } from '../components/banners/OrderBanners'
import { cancelOrder, claimOrder } from '../contracts/limitOrder'

function useCreateOrderLine(chartRef: React.MutableRefObject<IChartingLibraryWidget | undefined>) {
  const { signer, provider } = useNetworkContext()
  const { currentChain, currentChainInfo } = useChainLoader()
  const { address } = useAccount()
  const transactions = useTransactions()
  const orderLines = useRef<Map<string | Hash, IOrderLineAdapter>>(new Map())
  const drawLine = (order: Order, isQuoteFlipped: boolean) => {
    const id = order.transaction?.toString()
    const side = order.side === 'SELL' ? 'sell' : 'buy'
    const amount = side === 'buy' ? Number(order.amount_total) / Number(order.price) : Number(order.amount_total)
    const options = {
      price: !isQuoteFlipped
        ? !order.should_flip
          ? parseFloat(order.price!)
          : 1 / parseFloat(order.price!)
        : parseFloat(order.price!),
      quantity: formatNumber({ num: amount.toString() }),
      text: order.status === 'OPEN' ? `${side.toUpperCase()} ${order.base_currency}` : 'CLAIM ORDER',
      color: order.status === 'OPEN' ? colors.blue[400] : colors.green[400],
      priceTooltipText: order.status === 'OPEN' ? order.price!.toString() : 'Click X to Claim',
      cancelTooltipText: order.status === 'OPEN' ? 'Close Order' : 'Claim Order',
      cancelFn: order.status === 'OPEN' ? onCancel : onClaim,
      textColor: colors.gray[50],
      orderId: id!,
    }
    try {
      const activeChart = chartRef.current?.activeChart()
      const orderLine = activeChart?.createOrderLine({})
      if (orderLine === undefined) return
      return orderLine
        .setPrice(options.price)
        .setQuantity(options.quantity)
        .setText(options.text)
        .setQuantityBackgroundColor(options.color)
        .setQuantityBorderColor(options.color)
        .setLineColor(options.color)
        .setQuantityTextColor(options.textColor)
        .setBodyBorderColor(options.color)
        .setBodyTextColor(options.textColor)
        .setCancelButtonBorderColor(options.color)
        .setCancelButtonIconColor(options.textColor)
        .setModifyTooltip(options.orderId)
        .setCancelButtonBackgroundColor(options.color)
        .setCancelTooltip(options.cancelTooltipText)
        .onCancel(() => options.cancelFn(order))
        .setBodyBackgroundColor(options.color)
        .setTooltip(options.priceTooltipText)
    } catch (error) {
      window.log.error(error)
    }
  }
  const onClaim = async (order: Order) => {
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
  const drawLinesForLimitOrders = (orders: Order[], isQuoteFlipped: boolean = false) => {
    const newOrderLines = new Map()
    for (const order of orders) {
      newOrderLines.set(order.transaction?.toString(), drawLine(order, isQuoteFlipped))
    }
    orderLines.current = newOrderLines
  }
  const deleteLines = () => {
    if (orderLines.current.size === 0) return
    const orderLinesToDelete = orderLines.current
    orderLinesToDelete.forEach((_: IOrderLineAdapter, key: string | Hash) => {
      orderLinesToDelete.get(key)?.remove()
    })
    orderLines.current = new Map()
  }
  return { deleteLines, drawLinesForLimitOrders }
}

export default useCreateOrderLine
