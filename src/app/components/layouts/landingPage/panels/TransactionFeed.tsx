import { Hash, Order } from '@gfxlabs/oku'
import { useEffect, useState } from 'react'
import { useRpcContext } from '../../../../context/RpcContext'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import { colors } from '../../../../constants/colors'
import { T2 } from '../../../typography/Typography'
import { omniFlattenAndSort } from '../util'
import TransactionFeedItem from '../misc/TransactionFeedItem'
import { FontWeightEnums } from '../../../../types/Enums'
import styles from '../misc/transactionFeed.module.css'
import { useConfigContext } from '../../../../context/ConfigContext'

export interface OrderWithKey extends Order {
  key: string
  logoUrl: string
}

function TransactionFeed() {
  const [shouldAnimate, setShouldAnimate] = useState<Hash[]>([])
  const [currentList, setCurrentList] = useState<Hash[]>([])
  const [transactions, setTransactions] = useState<OrderWithKey[]>()
  const [isFetching, setIsFetching] = useState(false)
  const { omniCush } = useRpcContext()
  const { features } = useConfigContext()
  useEffect(() => {
    let isFirstFetch = true
    const fetchOrders = () => {
      if (isFetching) return
      setIsFetching(true)
      const resultSize = isFirstFetch ? 50 : 20
      isFirstFetch = false

      omniCush
        .network('omni')
        .call('cush_searchOrders', [{ result_size: resultSize, sort_by: 'time', sort_order: false }])
        .then((data) => {
          const converted = omniFlattenAndSort(data as Order[], 'time', false, features, 50) as OrderWithKey[]
          setTransactions((transactions) => {
            if (transactions && transactions.length > 0) {
              const newTransactions = converted.filter(
                (transaction) => !transactions.map((t) => t.transaction).includes(transaction.transaction)
              )
              return [...newTransactions, ...transactions].slice(0, 50)
            }
            return converted
          })
        })
        .catch((error) => {
          window.log.error('Line: #38', 'error', error)
        })
        .finally(() => {
          setIsFetching(false)
        })
    }

    fetchOrders()
    const intervalId = setInterval(fetchOrders, 500)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!transactions) {
      return
    }
    const newSwaps = transactions.filter((swap) => !currentList.includes(swap.transaction as Hash))
    if (newSwaps.length > 0 && transactions.length > 0) {
      setShouldAnimate(newSwaps.map((swap) => swap.transaction) as Hash[])
      setCurrentList(transactions.map((swap) => swap.transaction) as Hash[])
    }
  }, [transactions])

  return (
    <div className="bg-gray-900 w-full rounded-xl flex flex-col items-center outline outline-1 outline-gray-800 pt-3 pb-2 h-full">
      <T2 color={colors.gray[100]} weight={FontWeightEnums.MEDIUM}>
        Transaction Feed
      </T2>
      <div className={`relative w-full overflow-y-scroll no-scrollbar overscroll-contain mt-3 h-full`}>
        {transactions && transactions.length > 0 ? (
          <div className="w-full flex flex-col">
            {transactions.map((trade, index) => {
              let shouldBlink = shouldAnimate.includes(trade.transaction as Hash)
              return (
                <div
                  className={`relative hover:bg-gray-750 odd:bg-gray-900 even:bg-gray-800 ${shouldBlink ? styles.firstRowAnimation : ''} hover:bg-gray-750`}
                  onAnimationStart={() => (shouldBlink = false)}
                  key={index}
                >
                  <TransactionFeedItem transaction={trade} isNew={shouldBlink} />
                </div>
              )
            })}
          </div>
        ) : (
          <SkeletonLines lines={13} random />
        )}
      </div>
    </div>
  )
}

export default TransactionFeed
