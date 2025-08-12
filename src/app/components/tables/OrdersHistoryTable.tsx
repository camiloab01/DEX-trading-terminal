import { Order } from '@gfxlabs/oku'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Link } from 'react-router-dom'
import { useResizeObserver } from 'usehooks-ts'
import { colors } from '../../constants/colors'
import useBreakpoint from '../../hooks/useBreakpoint'
import { useChainLoader } from '../../route/loaderData'
import { FeeTierEnums, FontWeightEnums, SortingOrder, SortingProperty } from '../../types/Enums'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import { linkExplorer } from '../../util/linkBlockexplorer'
import shortenAddress from '../../util/shortenAddress'
import { getMMDDYYYY } from '../../util/timeConvert'
import { PoolPairFromSymbol } from '../dropdown/PairDropdown'
import SelectTokenDropdown from '../dropdown/setTokenDropdown/SelectTokenDropdown'
import ManageOrder from '../orders/ManageOrder'
import { OrderBuyAmount, OrderPriceAmount, OrderSellAmount } from '../orders/OrdersInfo'
import { T2, T3 } from '../typography/Typography'
import { HeadTitle, SmallHeadTitle, SortableHeader } from './HeadTitle'
import Paginator from './Paginator'
import handleSorting from './sortHandler'
import { FeeFilterDropdown } from '../dropdown/FilterPositionsDropdown'
import { TokenSymbol } from '../misc/TokenSymbol'
import { IToken } from '../../lib/getToken'

export default function OrdersHistoryTable(props: { historyData: Order[]; pageSize?: number; isOrdersPage: boolean }) {
  const { historyData, pageSize = 10, isOrdersPage } = props
  const [currentPage, setCurrentPage] = useState(1)
  const { currentChainInfo } = useChainLoader()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [feeFilter, setFeeFilter] = useState<string[]>([])
  const [tokenFilter, setTokenFilter] = useState<IToken | undefined>(undefined)
  const [sortingProperty, setSortingProperty] = useState<SortingProperty>(SortingProperty.DATE)
  const [sortingOrder, setSortingOrder] = useState<SortingOrder>(SortingOrder.DESC)
  const ref = useRef(null)
  const { width: containerWidth = 0 } = useResizeObserver({ ref })

  const filteredOrdersData = useMemo(() => {
    const convertedFees = feeFilter.map((fee) => Number(fee) * 10000)
    const dateFilteredOrders = historyData.filter((order) => {
      const orderTime = order.time
      const startCondition = startDate ? orderTime != undefined && orderTime >= startDate.getTime() : true
      const endCondition = endDate ? orderTime != undefined && orderTime <= endDate.getTime() : true
      return startCondition && endCondition
    })
    const feeFilteredOrders = dateFilteredOrders.filter(
      (order) => feeFilter.length === 0 || (order.fee != undefined && convertedFees.includes(order.fee))
    )
    if (tokenFilter === undefined) return feeFilteredOrders
    const tokenAddress = tokenFilter.address.toLowerCase()
    const tokenFilteredOrders = feeFilteredOrders.filter(
      (order) =>
        tokenFilter === undefined ||
        (order.base_currency_address && order.base_currency_address.toLowerCase() === tokenAddress) ||
        (order.quote_currency_address && order.quote_currency_address.toLowerCase() === tokenAddress)
    )
    return tokenFilteredOrders
  }, [feeFilter, historyData, tokenFilter, startDate, endDate])

  const sortedOrdersData = useMemo(() => {
    const sorted = [...filteredOrdersData].sort((a, b) => {
      if (sortingProperty === SortingProperty.DATE) {
        if (a?.time == undefined || b?.time == undefined) return 0
        return sortingOrder === SortingOrder.ASC ? a?.time - b?.time : b?.time - a?.time
      }
      if (sortingProperty === SortingProperty.TYPE) {
        if (!a?.type || !b?.type) return 0
        return sortingOrder === SortingOrder.ASC ? a.type?.localeCompare(b.type) : b.type?.localeCompare(a.type)
      }
      if (sortingProperty === SortingProperty.BUY_AMOUNT) {
        let a_amount = 0
        let b_amount = 0
        if (a.side === 'BUY') {
          a_amount = Number(a.amount_total) / Number(a.price)
          b_amount = Number(b.amount_total) / Number(b.price)
        } else {
          a_amount = Number(a.amount_total) * Number(a.price)
          b_amount = Number(b.amount_total) * Number(b.price)
        }
        return sortingOrder === SortingOrder.ASC ? a_amount - b_amount : b_amount - a_amount
      }
      if (sortingProperty === SortingProperty.SELL_AMOUNT) {
        return sortingOrder === SortingOrder.ASC
          ? Number(a.amount_total) - Number(b.amount_total)
          : Number(b.amount_total) - Number(a.amount_total)
      }
      if (sortingProperty === SortingProperty.PRICE) {
        if (a?.avg_price == undefined || b?.avg_price == undefined) return 0
        return sortingOrder === SortingOrder.ASC ? a.avg_price - b.avg_price : b.avg_price - a.avg_price
      }
      return 0
    })
    return sorted
  }, [filteredOrdersData, sortingOrder, sortingProperty])

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize
    const lastPageIndex = firstPageIndex + pageSize
    return sortedOrdersData.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, sortedOrdersData])

  const defaultVisibilityOrderPage = {
    buy_amount: false,
    sell_amount: false,
    type: false,
    date: false,
    status: false,
    transaction: false,
  }

  const ordersPageColumnVisibilitys = useBreakpoint({
    base: { ...defaultVisibilityOrderPage },
    sm: { ...defaultVisibilityOrderPage, transaction: true },
    md: { ...defaultVisibilityOrderPage, transaction: true, type: true, date: true },
    lg: { ...defaultVisibilityOrderPage, transaction: true, type: true, date: true },
    xl: {
      date: true,
      buy_amount: true,
      sell_amount: true,
      type: true,
      status: true,
      transaction: true,
    },
  })
  const tradePageColumnVisibility = useMemo(() => {
    const baseVisibility = {
      type: true,
      pool: true,
      price: true,
      sell_amount: true,
      buy_amount: true,
      date: true,
      fee: true,
      status: true,
    }
    if (containerWidth <= 522) return { ...baseVisibility, sell_amount: false, buy_amount: false, date: false }
    else if (containerWidth <= 900) return { ...baseVisibility, sell_amount: false, buy_amount: false }
    else return baseVisibility
  }, [containerWidth])
  const ordersPageColumnHelper = createColumnHelper<Order>()
  const ordersPageColumns = useMemo(
    () => [
      ordersPageColumnHelper.accessor((order) => order.time, {
        id: 'date',
        header: () => (
          <div className="flex justify-start">
            <SortableHeader
              title="Date"
              handleSortingToggle={() =>
                handleSorting(sortingProperty, SortingProperty.DATE, setSortingOrder, setSortingProperty)
              }
              sorting={SortingProperty.DATE === sortingProperty ? sortingOrder : undefined}
            />
          </div>
        ),
        cell: (cell) => (
          <T2 color={colors.gray[50]}>
            {cell.row.original.time != undefined ? getMMDDYYYY(cell.row.original.time) : ''}
          </T2>
        ),
      }),
      ordersPageColumnHelper.accessor((order) => order.base_currency_address + '/' + order.quote_currency_address, {
        id: 'pool',
        header: () => <HeadTitle title="Pool" classes="text-left" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex gap-1 whitespace-pre">
              <PoolPairFromSymbol
                token0Address={order.base_currency_address ? order.base_currency_address : ''}
                token1Address={order.quote_currency_address ? order.quote_currency_address : ''}
                token0Symbol={order.base_currency ? order.base_currency : ''}
                token1Symbol={order.quote_currency ? order.quote_currency : ''}
              />
              <div className="rounded-md p-1">
                <T2 color="text-gray-100">{order.fee != undefined && order.fee / 10000}%</T2>
              </div>
            </div>
          )
        },
      }),
      ordersPageColumnHelper.accessor((order) => order.transaction, {
        id: 'transaction',
        header: () => <HeadTitle title="Tx Hash" classes="text-left" />,
        cell: (cell) => {
          const tx_hash = cell.row.original.transaction
          return <T2 color={colors.blue[400]}>{shortenAddress(tx_hash as unknown as string)}</T2>
        },
      }),
      ordersPageColumnHelper.accessor((order) => order.type, {
        id: 'type',
        header: () => (
          <div className="flex justify-start">
            <SortableHeader
              title="Type"
              handleSortingToggle={() =>
                handleSorting(sortingProperty, SortingProperty.TYPE, setSortingOrder, setSortingProperty)
              }
              sorting={SortingProperty.TYPE === sortingProperty ? sortingOrder : undefined}
            />
          </div>
        ),
        cell: (cell) => (
          <T2 color={colors.gray[100]}>
            {cell.row.original.type ? capitalizeFirstLetter(cell.row.original.type) : ''}
          </T2>
        ),
      }),
      ordersPageColumnHelper.accessor((order) => order.base_currency, {
        id: 'buy_amount',
        header: () => (
          <div className="flex justify-start">
            <SortableHeader
              title="Buy Amount"
              handleSortingToggle={() =>
                handleSorting(sortingProperty, SortingProperty.BUY_AMOUNT, setSortingOrder, setSortingProperty)
              }
              sorting={SortingProperty.BUY_AMOUNT === sortingProperty ? sortingOrder : undefined}
            />
          </div>
        ),
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-start">
              <T2 color={colors.gray[100]}>
                <OrderBuyAmount order={order} />
              </T2>
            </div>
          )
        },
      }),
      ordersPageColumnHelper.accessor((order) => order.quote_currency, {
        id: 'sell_amount',
        header: () => (
          <div className="flex justify-start">
            <SortableHeader
              title="Sell Amount"
              handleSortingToggle={() =>
                handleSorting(sortingProperty, SortingProperty.SELL_AMOUNT, setSortingOrder, setSortingProperty)
              }
              sorting={SortingProperty.SELL_AMOUNT === sortingProperty ? sortingOrder : undefined}
            />
          </div>
        ),
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-start">
              <T2 color="text-gray-100">
                <OrderSellAmount order={order} />
              </T2>
            </div>
          )
        },
      }),
      ordersPageColumnHelper.accessor((order) => order.price, {
        id: 'price',
        header: () => (
          <div className="flex justify-start">
            <SortableHeader
              title="Price Amount"
              handleSortingToggle={() =>
                handleSorting(sortingProperty, SortingProperty.PRICE, setSortingOrder, setSortingProperty)
              }
              sorting={SortingProperty.PRICE === sortingProperty ? sortingOrder : undefined}
            />
          </div>
        ),
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-start">
              <T2 color={colors.gray[100]}>
                <OrderPriceAmount order={order} />
              </T2>
            </div>
          )
        },
      }),
      ordersPageColumnHelper.accessor((order) => order.status, {
        id: 'status',
        header: () => <HeadTitle title="Status" classes="text-center" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-center">
              <ManageOrder order={order} isOrderPage={true} />
            </div>
          )
        },
      }),
    ],
    [currentChainInfo, currentTableData]
  )
  const tradePageColumnHelper = createColumnHelper<Order>()
  const tradePageColumns = useMemo(
    () => [
      tradePageColumnHelper.accessor((order) => order.type, {
        id: 'type',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Type" classes="text-left" />,
        cell: (cell) => (
          <T3 color={colors.gray[100]}>
            {cell.row.original.type ? capitalizeFirstLetter(cell.row.original.type) : ''}
          </T3>
        ),
      }),
      tradePageColumnHelper.accessor((order) => order.base_currency_address + '/' + order.quote_currency_address, {
        id: 'pool',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Pool" classes="text-left" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex flex-nowrap">
              <T3 color={colors.gray[100]}>
                {order != undefined && order.base_currency_address && (
                  <TokenSymbol address={order.base_currency_address} fallback_name={order.base_currency} />
                )}
              </T3>
              <T3 className="whitespace-pre" color={colors.gray[400]}>
                /
                {order != undefined && order.quote_currency_address && (
                  <TokenSymbol address={order.quote_currency_address} fallback_name={order.quote_currency} />
                )}
              </T3>
            </div>
          )
        },
      }),
      tradePageColumnHelper.accessor((order) => order.time, {
        id: 'fee',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Fee" classes="text-left" />,
        cell: (cell) => (
          <T3 color={colors.gray[100]}>
            {cell.row.original.fee != undefined && cell.row.original.fee && cell.row.original.fee / 10000}%
          </T3>
        ),
      }),
      tradePageColumnHelper.accessor((order) => order.quote_currency, {
        id: 'sell_amount',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Sell Amount" classes="text-left" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-start">
              <T3 color={colors.gray[100]}>
                <OrderSellAmount order={order} />
              </T3>
            </div>
          )
        },
      }),
      tradePageColumnHelper.accessor((order) => order.base_currency, {
        id: 'buy_amount',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Buy Amount" classes="text-left" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-start">
              <T3 color={colors.gray[100]}>
                <OrderBuyAmount order={order} />
              </T3>
            </div>
          )
        },
      }),
      tradePageColumnHelper.accessor((order) => order.time, {
        id: 'date',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Date" classes="text-left" />,
        cell: (cell) => (
          <T3 color={colors.gray[100]}>
            {cell.row.original.time != undefined ? getMMDDYYYY(cell.row.original.time) : ''}
          </T3>
        ),
      }),
      tradePageColumnHelper.accessor((order) => order.price, {
        id: 'price',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Price" classes="text-left" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-start">
              <T3 color={colors.gray[100]}>
                <OrderPriceAmount order={order} />
              </T3>
            </div>
          )
        },
      }),
      tradePageColumnHelper.accessor((order) => order.status, {
        id: 'status',
        header: () => <SmallHeadTitle color={colors.gray[400]} title="Status" classes="text-center" />,
        cell: (cell) => {
          const order = cell.row.original
          return (
            <div className="flex justify-center">
              <ManageOrder order={order} isOrderPage={false} />
            </div>
          )
        },
      }),
    ],
    [currentChainInfo, historyData]
  )
  const ordersPageTable = useReactTable({
    data: currentTableData,
    columns: ordersPageColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: ordersPageColumnVisibilitys,
    },
  })
  const tradePageTable = useReactTable({
    data: historyData,
    columns: tradePageColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: tradePageColumnVisibility,
    },
  })
  const table = isOrdersPage ? ordersPageTable : tradePageTable
  const commonPadding: { [key: string]: string } = {
    pool: 'pl-2',
    tokenid: '',
    status: 'pl-4',
    range: 'pl-4',
    pair: 'pl-4',
    date: 'pl-3',
    control: 'px-0',
  }
  return (
    <div
      ref={ref}
      className={isOrdersPage ? `flex flex-col bg-gray-900 rounded-2xl border border-gray-800 w-full` : ''}
    >
      {isOrdersPage && (
        <div className="flex w-full h-fit justify-between items-center ">
          <T2 color="text-gray-100" weight={FontWeightEnums.MEDIUM} className="pl-3">
            Orders
          </T2>
          <div className={`flex gap-2 ${containerWidth <= 415 ? 'p-1' : 'p-3'} flex-wrap justify-end`}>
            <div className="flex justify-end gap-2 align-center">
              <T2 className="mt-2" color={colors.gray[400]}>
                Dates:
              </T2>
              <DatePicker
                wrapperClassName="analyticDatePicker"
                selected={startDate}
                showMonthDropdown
                showYearDropdown
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={'Start'}
                onChange={(date) => setStartDate(date)}
                closeOnScroll={true}
                dropdownMode="select"
                isClearable={startDate !== null}
                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                disabledKeyboardNavigation
              />
              <T3 color={colors.gray[200]} className="mt-2">
                to
              </T3>
              <DatePicker
                wrapperClassName="analyticDatePicker"
                selected={endDate}
                showMonthDropdown
                showYearDropdown
                placeholderText={'End'}
                onChange={(date) => setEndDate(date)}
                closeOnScroll={true}
                dropdownMode="select"
                isClearable={endDate !== null}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                disabledKeyboardNavigation
              />
            </div>
            <div className="flex gap-x-2">
              {setTokenFilter != undefined && (
                <div className="flex flex-row gap-2 items-center">
                  <SelectTokenDropdown setToken={setTokenFilter} token={tokenFilter} />
                </div>
              )}
              {feeFilter != undefined && setFeeFilter != undefined && (
                <FeeFilterDropdown
                  setFilter={setFeeFilter}
                  filter={feeFilter}
                  label={'Fee Tier'}
                  filterType={FeeTierEnums}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full h-full overflow-hidden gap-1.5">
        <table className="table-auto">
          <thead className={isOrdersPage ? `bg-gray-800` : ''}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={
                      isOrdersPage ? `py-3 mx-0 px-3 ${commonPadding[header.id] || 'pl-4'}` : 'pt-1 pb-2 mx-3 px-2'
                    }
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={
                  isOrdersPage
                    ? `odd:bg-gray-900 even:bg-gray-800 cursor-pointer hover:bg-gray-750 rounded-lg`
                    : 'cursor-pointer hover:bg-gray-800 rounded-lg'
                }
              >
                {row.getVisibleCells().map((cell) => {
                  return isOrdersPage ? (
                    <td
                      key={cell.id}
                      className={`${
                        {
                          ...commonPadding,
                          control: 'pl-0',
                        }[cell.column.id] || 'pl-4'
                      } px-3 py-3`}
                    >
                      {cell.column.id !== 'status' ? (
                        <Link
                          to={
                            cell.row.original.transaction
                              ? linkExplorer('tx', cell.row.original.transaction.toString(), currentChainInfo.id)
                              : ''
                          }
                          target={'_blank'}
                        >
                          <div className="w-full">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                        </Link>
                      ) : (
                        <div className="w-full">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      )}
                    </td>
                  ) : (
                    <td key={cell.id} className={`h-[32px] items-center px-2`}>
                      {cell.column.id !== 'status' ? (
                        <Link
                          to={
                            cell.row.original.transaction
                              ? linkExplorer('tx', cell.row.original.transaction.toString(), currentChainInfo.id)
                              : ''
                          }
                          target={'_blank'}
                          className={`w-full h-full flex flex-1 min-h-[32px] items-center`}
                        >
                          <div className="w-full">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                        </Link>
                      ) : (
                        <div className="w-full px-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {isOrdersPage && (
          <Paginator
            currentPage={currentPage}
            totalCount={sortedOrdersData.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  )
}
