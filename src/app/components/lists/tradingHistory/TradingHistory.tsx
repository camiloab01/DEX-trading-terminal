import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useDataContext } from '../../../context/DataContext'
import { Hash, Swap } from '@gfxlabs/oku'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { useChainLoader } from '../../../route/loaderData'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRpcContext } from '../../../context/RpcContext'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import TradeHistoryRow from './TradeHistoryRow'
import styles from './tradeHistory.module.css'
import TradeHistoryTitles from './TradeHistoryTitles'
import { t } from '@lingui/macro'
import { TokenSymbol } from '../../misc/TokenSymbol'

export default function TradingHistory() {
  const { omniCush } = useRpcContext()
  const { currentChainInfo, chain } = useChainLoader()
  const { poolSummary, poolAddress, token } = useDataContext()
  const [shouldAnimate, setShouldAnimate] = useState<Hash[]>([])
  const lineHeight = 20
  const [currentList, setCurrentList] = useState<Hash[]>([])
  const { width } = useWindowSize()
  const fetchRecentSwaps = useCallback(
    async ({ pageParam }: any): Promise<Swap[]> => {
      const res = await omniCush.network(chain).call('cush_poolSwaps', [poolAddress, 50, pageParam, true])
      return res.swaps.reverse()
    },
    [omniCush, chain, poolAddress]
  )
  const {
    data: orderData,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery<any>({
    queryKey: ['orderHistory'],
    queryFn: ({ pageParam }): any => fetchRecentSwaps({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages) => (lastPage && lastPage.length === 50 ? pages.length * 50 : undefined),
  })
  useEffect(() => {
    refetch()
  }, [poolSummary, poolAddress, refetch, token.selected])

  useEffect(() => {
    if (!orderData) return
    const allSwaps = orderData.pages[0].slice(0, 20)
    const newSwaps = allSwaps.filter((swap: any) => !currentList.includes(swap.transaction))
    if (newSwaps.length > 0) {
      setShouldAnimate(newSwaps.map((swap: any) => swap.transaction))
      setCurrentList(allSwaps.map((swap: any) => swap.transaction))
    }
  }, [orderData, currentList])

  const flatData = useMemo(() => orderData?.pages.flatMap((page) => page).flat() ?? [], [orderData])
  const table = useReactTable({
    data: flatData,
    columns: [
      { accessorKey: 'avg_price' },
      { accessorKey: 'amount1' },
      { accessorKey: 'time' },
      { accessorKey: 'transaction' },
    ],
    getCoreRowModel: getCoreRowModel(),
  })
  const parentRef: any = useRef()
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => lineHeight, [lineHeight]),
    count: table.getRowModel().rows.length,
    overscan: 2,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })
  const observer: any = useRef()
  const lastElementRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage()
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )
  useEffect(() => {
    const isLastItemVisible = rowVirtualizer
      .getVirtualItems()
      .some((vi) => vi.index === rowVirtualizer.getTotalSize() - 1)
    setShouldAnimate([])
    if (isLastItemVisible && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [rowVirtualizer.getVirtualItems, hasNextPage, isFetchingNextPage, fetchNextPage])
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="bg-gray-900 w-full rounded-xl flex flex-col items-center outline outline-1 outline-gray-800 pt-3 pb-2 h-full"
      ref={ref}
    >
      <T3 color={colors.gray[50]}>{t`Trading History`}</T3>
      <TradeHistoryTitles
        baseSymbol={<TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />}
        quoteSymbol={<TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />}
      />
      <div
        className={`relative w-full overflow-y-scroll no-scrollbar overscroll-contain ${width < 700 ? 'h-[600px]' : 'h-full'}`}
        ref={parentRef}
      >
        <table className="relative md:absolute w-full">
          <tbody
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            className={`relative z-10 flex flex-row w-full px-2 justify-between`}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index]
              const isLastElement = virtualRow.index === table.getRowModel().rows.length - 1 // Check if it's the last row
              const shouldBlink = shouldAnimate.includes(row.original.transaction)
              return (
                <div
                  ref={isLastElement ? lastElementRef : null}
                  data-index={virtualRow.index}
                  key={virtualRow.key}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                  className={`absolute top-0 left-[1px] w-full ${shouldBlink ? styles.firstRowAnimation : ''} h-[22px]`}
                >
                  <TradeHistoryRow
                    key={row.id}
                    row={row}
                    isNew={shouldBlink}
                    currentChainInfo={currentChainInfo.internalName}
                  />
                </div>
              )
            })}
          </tbody>
        </table>
      </div>
      {isFetchingNextPage && (
        <T3 color={colors.gray[100]} className="pt-1">
          Fetching...
        </T3>
      )}
    </div>
  )
}
