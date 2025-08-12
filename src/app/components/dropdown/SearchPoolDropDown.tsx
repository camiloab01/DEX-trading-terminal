import { FormattedNumber } from '../numbers/FormatNumber'
import { T1, T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import useBreakpoint from '../../hooks/useBreakpoint'
import { useDataContext } from '../../context/DataContext'
import { PoolSummary } from '@gfxlabs/oku'
import StarButton from '../buttons/StarButton'
import { ClockIcon, SparklesIcon, Square3Stack3DIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useModalContext } from '../../context/ModalContext'
import { useCurrentClient } from '../../hooks/useClient'
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  FloatingOverlay,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { RoundTokenLogoPair } from '../misc/RoundTokenLogo'
import { togglePool } from '../../lib/togglePool'
import { getTokenLogoUrl } from '../../util/getTokenLogo'
import { useDebounceValue } from 'usehooks-ts'
import { useChainLoader } from '../../route/loaderData'
import StarSVG from '../../assets/star.svg'
import SearchPoolsTable from '../tables/SearchPools'
import { getLocalStorageItem } from '../../lib/localStorage'
import { Divider } from '../misc/Divider'
import { TokenSymbol } from '../misc/TokenSymbol'
const Search = 'https://assets.oku.trade/search.svg'
const SearchBlue = 'https://assets.oku.trade/search-blue.svg'

export default function SearchPoolDropDown() {
  const [isOpen, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setShowModal,
  })
  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])
  const showColumn = useBreakpoint({ base: false, sm: true })
  const { setShowCreatePoolModal } = useModalContext()
  const { currentChain } = useChainLoader()
  const { favoritePool, setFavoritePool } = useDataContext()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { data: searchResults } = useCurrentClient('cush_search', [
    searchTerm.toString(),
    {
      fee_tiers: [],
      result_offset: 0,
      sort_by: 'total_volume_7d_usd',
      result_size: 50,
      sort_order: false,
    },
  ])
  const recentSearches = useMemo(() => getLocalStorageItem(`recent_search_${currentChain}`), [currentChain, isOpen])
  const { data: recentSearchPools } = useCurrentClient('cush_searchPoolsByList', [recentSearches ? recentSearches : []])
  const { data: watchListPools } = useCurrentClient('cush_searchPoolsByList', [favoritePool])
  const ch = createColumnHelper<PoolSummary>()
  const columns = useMemo<ColumnDef<PoolSummary, any>[]>(
    () => [
      ch.accessor((pool) => pool.address, {
        id: 'pool',
        header: () => (
          <div className="text-start flex flex-nowrap pl-[14px] gap-x-1 w-[200px]">
            <img src={StarSVG} alt="star" className="w-4 h-4" />
            <T2 color={colors.gray[400]}>
              <Trans>Pools</Trans>
            </T2>
          </div>
        ),
        cell: (props) => {
          const pool = props.row.original
          return (
            <div className="flex flex-row items-center gap-x-1 px-3 my-1 w-[200px]">
              <StarButton
                onClick={(e) => {
                  togglePool(
                    pool.address,
                    favoritePool.includes(pool.address.toLowerCase()),
                    currentChain,
                    setFavoritePool
                  )
                  e.stopPropagation()
                  e.preventDefault()
                }}
                isStarred={favoritePool.includes(pool.address.toLowerCase())}
              />
              <div className="flex flex-row items-center w-fit">
                <RoundTokenLogoPair
                  token0LogoUrl={getTokenLogoUrl(pool.t0, currentChain)}
                  token0Symbol={pool.t0_symbol}
                  token1LogoUrl={getTokenLogoUrl(pool.t1, currentChain)}
                  token1Symbol={pool.t1_symbol}
                />
                <div className="flex flex-row items-center whitespace-pre">
                  <T3>
                    <TokenSymbol address={pool.t0} fallback_name={pool.t0_symbol} />
                  </T3>
                  <T3 color={colors.gray[100]}>
                    {'/'}
                    <TokenSymbol address={pool.t1} fallback_name={pool.t1_symbol} />
                  </T3>
                  <T3 color={colors.gray[100]} className="ml-2">
                    {pool.fee / 10000}%
                  </T3>
                </div>
              </div>
            </div>
          )
        },
      }),
      ch.accessor((pool) => pool.tvl_usd, {
        id: 'tvl_usd',
        cell: (props) => {
          return (
            <T3 color={colors.gray[200]}>
              <FormattedNumber num={props.getValue()} />
            </T3>
          )
        },
        header: () => (
          <T3 color={colors.gray[400]}>
            <Trans>TVL</Trans>
          </T3>
        ),
      }),
      ch.accessor((pool) => pool.t0_volume, {
        id: 'volume',
        cell: (props) => (
          <T3 color={colors.gray[200]}>
            <FormattedNumber num={props.getValue()} />
          </T3>
        ),
        header: () => (
          <T3 color={colors.gray[400]}>
            <Trans>Vol 24H</Trans>
          </T3>
        ),
      }),
      ch.accessor((pool) => pool.last_price, {
        id: 'price',
        cell: (props) => (
          <T3 color={colors.gray[200]}>
            <FormattedNumber num={props.getValue()} />
          </T3>
        ),
        header: () => (
          <T3 color={colors.gray[400]}>
            <Trans>Price</Trans>
          </T3>
        ),
      }),
    ],
    [currentChain, favoritePool]
  )
  const searchResultsTable = useReactTable({
    data: searchResults?.pools ? searchResults.pools : [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const watchListTable = useReactTable({
    data: watchListPools?.pools ? watchListPools.pools : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const recentSearchTable = useReactTable({
    data: recentSearchPools?.pools ? recentSearchPools.pools : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    watchListTable.setColumnVisibility({
      volume: showColumn,
      price: showColumn,
    })
    searchResultsTable.setColumnVisibility({
      volume: showColumn,
      price: showColumn,
    })
    recentSearchTable.setColumnVisibility({
      volume: showColumn,
      price: showColumn,
    })
  }, [showColumn])

  const { rows: watchListRows } = useMemo(watchListTable.getRowModel, [watchListPools?.pools, currentChain])
  const watchListRowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: watchListRows.length,
    overscan: 10,
    estimateSize: () => 20,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })

  const { rows } = useMemo(searchResultsTable.getRowModel, [searchResults])
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 20,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })
  const { rows: recentSearchRows } = useMemo(recentSearchTable.getRowModel, [recentSearchPools?.pools, currentChain])
  const recentSearchRowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: recentSearchRows.length,
    overscan: 10,
    estimateSize: () => 20,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })
  const { getVirtualItems: virtualRecentSearchRows } = recentSearchRowVirtualizer
  const { getVirtualItems: virtualWatchlistRows } = watchListRowVirtualizer
  const { getVirtualItems: virtualRows } = rowVirtualizer
  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex justify-center items-center mt-[7px] lg:mt-0 pr-2 pl-2 lg:pr-0 lg:pl-0"
      >
        <SearchDropdownButton />
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay lockScroll className="z-20 flex items-center justify-center bg-black/70">
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()}>
                <div
                  className="flex flex-col bg-gray-800 rounded-md  border-b-[1px] border-gray-700  overflow-hidden text-white drop-shadow-xl"
                  ref={tableContainerRef}
                >
                  <SearchDropdownInput setSearchTerm={setSearchTerm} setShowModal={setShowModal} />

                  {searchTerm !== '' && rows.length > 0 ? (
                    <div className="border-x-[1px] border-gray-700 rounded-b-md">
                      <div className="p-4 flex gap-x-1 ">
                        <Square3Stack3DIcon color={colors.gray[400]} width={12} height={12} />
                        <T2 color={colors.gray[50]}>Results</T2>
                      </div>
                      <SearchPoolsTable
                        tablePoolSummary={searchResultsTable}
                        virtualRows={virtualRows}
                        rows={rows}
                        setShowModal={setShowModal}
                        isFullHeight
                      />
                    </div>
                  ) : searchTerm !== '' && rows.length === 0 ? (
                    <div className="border-x-[1px] border-gray-700 rounded-b-md">
                      <div className="p-4 flex gap-x-1 ">
                        <Square3Stack3DIcon color={colors.gray[400]} width={12} height={12} />
                        <T2 color={colors.gray[50]}>Results</T2>
                      </div>
                      <div className="flex justify-center overflow-y w-[500px] h-14">
                        <T1 color={colors.gray[400]}>No results</T1>
                      </div>
                    </div>
                  ) : (
                    <>
                      {recentSearchRows.length > 0 ? (
                        <div className=" border-x-[1px] border-gray-700 ">
                          <div className="p-4 flex gap-x-1">
                            <ClockIcon color={colors.gray[50]} width={13} />
                            <T2 color={colors.gray[50]}>Recent</T2>
                          </div>
                          <SearchPoolsTable
                            tablePoolSummary={recentSearchTable}
                            virtualRows={virtualRecentSearchRows}
                            rows={recentSearchRows}
                            setShowModal={setShowModal}
                          />
                          <Divider containerClasses="mt-4" />
                        </div>
                      ) : (
                        <></>
                      )}
                      {watchListRows.length > 0 && (
                        <div className=" border-x-[1px] border-gray-700 rounded-b-md ">
                          <div className="flex flex-row justify-between items-center p-4">
                            <div>
                              <div className="flex gap-x-1">
                                <SparklesIcon color={colors.gray[50]} width={16} height={16} />
                                <T2 color={colors.gray[50]}>Watchlist</T2>
                              </div>
                            </div>
                            <div>
                              <div
                                className="flex cursor-pointer flex-row gap-x-1 items-center py-1"
                                onClick={() => {
                                  setShowCreatePoolModal(true)
                                  setShowModal(false)
                                }}
                              >
                                <PlusCircleIcon color={colors.gray[400]} width={16} height={16} />
                                <T2 color={colors.gray[400]}>Create Pool</T2>
                              </div>
                            </div>
                          </div>
                          <SearchPoolsTable
                            isFullHeight={searchTerm === '' && recentSearchRows.length === 0}
                            tablePoolSummary={watchListTable}
                            virtualRows={virtualWatchlistRows}
                            rows={watchListRows}
                            setShowModal={setShowModal}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  )
}

export const SearchDropdownInput = ({
  setSearchTerm,
  setShowModal,
}: {
  setSearchTerm: (val: string) => void
  setShowModal: (val: boolean) => void
}) => {
  const [focus, setFocus] = useState(false)
  const [hover, setHover] = useState(false)
  return (
    <div
      className="flex flex-row justify-between rounded-t-md border"
      style={{
        backgroundColor: colors.gray[800],
        borderBottomColor: hover || focus ? colors.blue[400] : colors.gray[700],
        borderColor: colors.gray[700],
        paddingLeft: 32,
        marginTop: 0,
        backgroundImage: `url(${hover || focus ? SearchBlue : Search})`,
        backgroundSize: '12px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '10px center',
      }}
    >
      <DebounceInput
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`w-full grow text-white placeholder:text-gray-500 h-[33px] focus:outline-none placeholder:text-md placeholder:font-normal `}
        placeholder={focus ? '' : `Search a token or pool`}
        style={{
          backgroundColor: colors.gray[800],
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onInputChange={(val) => setSearchTerm(val)}
      />
      <XMarkIcon className="w-4 h-4 text-gray-300 cursor-pointer mt-2 mr-3" onClick={() => setShowModal(false)} />
    </div>
  )
}

interface IDebounceInput extends React.InputHTMLAttributes<HTMLInputElement> {
  onInputChange: (value: string) => void
  reset?: boolean
}
const DebounceInput = ({ onInputChange, reset, ...props }: IDebounceInput) => {
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebounceValue(value, 500)

  useEffect(() => {
    onInputChange(debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  useEffect(() => {
    reset && setValue('')
  }, [reset])
  return <input value={value} {...props} onChange={(e) => setValue(e.target.value)} />
}

export const SearchDropdownButton = () => {
  const [hover, setHover] = useState(false)
  const SearchImage = useMemo(
    () =>
      hover ? (
        <img src={SearchBlue} alt="search" className="w-[14px] h-[14px] mx-[1px]" />
      ) : (
        <img src={Search} alt="search" className="w-4 h-4" />
      ),
    [hover]
  )

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`h-[42px] sm:h-8 pl-2 text-gray-500 rounded-md border border-gray-600 hover:border-blue-400 bg-gray-900 flex items-center gap-x-2 w-full lg:w-[164px]`}
    >
      {SearchImage}
    </button>
  )
}
