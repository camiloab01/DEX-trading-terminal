import { useEffect, useMemo, useRef, useState } from 'react'
import { useRpcContext } from '../../../../context/RpcContext'
import { AnalyticsProtocolOverview } from '@gfxlabs/oku'
import { createColumnHelper, getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'
import { T2, T3 } from '../../../typography/Typography'
import { formatNumber } from '../../../numbers/FormatNumber'
import { capitalizeFirstLetter } from '../../../../util/capitalizeFirstLetter'
import { FontWeightEnums } from '../../../../types/Enums'
import { RoundTokenLogo } from '../../../misc/RoundTokenLogo'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import { removeError } from '../util'
import { CHAIN_INFO } from '../../../../constants/abi/chainInfo'
import NetworkRow from './NetworkRow'
import { useConfigContext } from '../../../../context/ConfigContext'
export interface AnalyticsProtocolOverviewWithKey extends AnalyticsProtocolOverview {
  key: string
  logoUrl: string
}
const NetworkUsage = () => {
  const { omniCush } = useRpcContext()
  const ch = createColumnHelper<AnalyticsProtocolOverviewWithKey>()
  const [networkData, setNetworkData] = useState<AnalyticsProtocolOverviewWithKey[]>([])
  const [showGradient, setShowGradient] = useState(true) // State to control gradient visibility
  const lastRowRef = useRef<HTMLTableRowElement>(null) // Ref for the last row
  const { features } = useConfigContext()
  const columns = useMemo(
    () => [
      ch.accessor((x) => x.key, {
        id: 'chain',
        header: 'Chain',
        cell: (cell) => (
          <div className="flex gap-x-1 items-center">
            <RoundTokenLogo
              tokenSymbol={cell.row.original.key}
              logoUrl={cell.row.original.logoUrl || CHAIN_INFO[1].logoUrl}
              size={16}
            />
            <T2 weight={FontWeightEnums.SEMIBOLD}>{capitalizeFirstLetter(cell.row.original.key)}</T2>
          </div>
        ),
      }),
      ch.accessor((x) => x.tvl_usd, {
        id: 'tvl',
        header: 'TVL',
        cell: (cell) => <T3>${formatNumber({ num: cell.row.original.tvl_usd, notation: 'compact' })}</T3>,
      }),
      ch.accessor((x) => x.total_volume_usd, {
        id: 'volume',
        header: 'Vol 24H',
        cell: (cell) => <T3>${formatNumber({ num: cell.row.original.total_volume_usd, notation: 'compact' })}</T3>,
      }),
    ],
    [networkData]
  )

  const table = useReactTable({
    data: networkData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    omniCush
      .network('omni')
      .call('cush_analyticsProtocolOverview', [])
      .then((data) => {
        const removedError = removeError(data)
        const entries = Object.entries(removedError).filter((chain) => !features.Chains.hidden.includes(chain[0]))

        const result = entries.map(([key, value]) => {
          const chain = Object.values(CHAIN_INFO).find((x) => x.internalName === key)
          const logoUrl = chain !== undefined ? chain.logoUrl : CHAIN_INFO[1].logoUrl

          if (typeof value === 'object' && value !== null) {
            return { key, logoUrl, ...value }
          } else {
            return { key, logoUrl, value }
          }
        }) as unknown as AnalyticsProtocolOverviewWithKey[]
        // sort array by 'total_volume_usd'
        result.sort((a, b) => b.total_volume_usd - a.total_volume_usd)
        setNetworkData(result)
      })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowGradient(!entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    )

    if (lastRowRef.current) {
      observer.observe(lastRowRef.current)
    }

    return () => {
      if (lastRowRef.current) {
        observer.unobserve(lastRowRef.current)
      }
    }
  }, [networkData.length])

  return (
    <div className="h-full overflow-auto no-scrollbar bg-gray-900 border rounded-xl border-gray-800 relative">
      {networkData.length > 0 ? (
        <>
          <table className="table-auto w-full">
            <thead className="bg-gray-900 text-white sticky top-0 z-[1]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`
                text-xs text-gray-400 font-normal py-2
               ${(() => {
                 const x = {
                   tvl: 'pr-3 text-end',
                   volume: 'pr-2 text-end',
                   chain: 'pl-2 text-start',
                 }[header.id]
                 return x !== undefined ? x : ''
               })()}`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => {
                const isLast = table.getRowModel().rows.length === index + 1
                return (
                  <NetworkRow
                    key={row.id}
                    row={row}
                    isLast={table.getRowModel().rows.length === index}
                    refs={isLast ? lastRowRef : undefined}
                  />
                )
              })}
            </tbody>
          </table>
          <div
            style={{
              backgroundImage: showGradient
                ? 'linear-gradient(to bottom, hsla(222, 37%, 12%, 0.7) 0%, hsla(225, 30%, 8%, 0.7) 100%'
                : 'none',
              width: '100%',
              height: showGradient ? '60px' : '0px',
              position: 'sticky',
              left: '0',
              bottom: '0',
              zIndex: '1',
              opacity: '1',
            }}
          ></div>
        </>
      ) : (
        <SkeletonLines lines={8} />
      )}
    </div>
  )
}

export default NetworkUsage
