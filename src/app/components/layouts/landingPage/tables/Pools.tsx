import { useMemo } from 'react'
import { CandleResponse, PoolSummary } from '@gfxlabs/oku'
import { createColumnHelper, getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'
import { T3 } from '../../../typography/Typography'
import { formatNumber } from '../../../numbers/FormatNumber'
import { FontWeightEnums } from '../../../../types/Enums'
import { RoundTokenLogo } from '../../../misc/RoundTokenLogo'
import PoolStat from '../misc/PoolStat'
import useBreakpoint from '../../../../hooks/useBreakpoint'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import { Link } from 'react-router-dom'
import { LandingPoolPair } from '../misc/PoolPair'
import { CHAIN_INFO, getChainIdFromName } from '../../../../constants/abi/chainInfo'

export interface PoolSummaryWithKey extends PoolSummary {
  key: string
  logoUrl: string
  isVisible: boolean
}

export interface PoolSummaryWithKeyAndCandles extends PoolSummaryWithKey {
  candles: CandleResponse
}
export const Pools = ({ pools, isVisible }: { pools: PoolSummaryWithKey[]; isVisible: boolean }) => {
  const ch = createColumnHelper<PoolSummaryWithKey>()
  const columnVisibility: any = useBreakpoint({
    base: {
      pool: true,
      tvl: true,
      price: false,
      vol_24h: false,
      vol_7d: false,
      fees: false,
      tx_count: false,
      price_7D: false,
    },
    sm: {
      pool: true,
      tvl: true,
      price: true,
      vol_24h: true,
      vol_7d: false,
      fees: false,
      tx_count: false,
      price_7D: true,
    },
    md: {
      pool: true,
      tvl: true,
      price: true,
      vol_24h: true,
      vol_7d: false,
      fees: false,
      tx_count: false,
      price_7D: true,
    },
    lg: {
      pool: true,
      tvl: true,
      price: true,
      vol_24h: true,
      vol_7d: false,
      fees: false,
      tx_count: false,
      price_7D: true,
    },
    xl: {
      pool: true,
      tvl: true,
      price: true,
      vol_24h: true,
      vol_7d: true,
      fees: true,
      tx_count: true,
      price_7D: true,
    },
  })

  const columns = useMemo(
    () => [
      ch.accessor((x) => x.address, {
        id: 'pool',
        header: 'Pools',
        cell: (cell) => {
          const chainId = getChainIdFromName(cell.row.original.key)
          return (
            <div className="flex gap-x-2 items-center whitespace-pre">
              <LandingPoolPair pool={cell.row.original} currentChain={chainId} />
              <div className="absolute top-2 left-7">
                <RoundTokenLogo
                  tokenSymbol={cell.row.original.key}
                  logoUrl={cell.row.original.logoUrl || CHAIN_INFO[1].logoUrl}
                  size={12}
                />
              </div>
              <T3 weight={FontWeightEnums.SEMIBOLD}>{cell.row.original.fee / 10000}%</T3>
            </div>
          )
        },
      }),
      ch.accessor((x) => x.tvl_usd, {
        id: 'tvl',
        header: 'TVL',
        cell: (cell) => (
          <div>
            <PoolStat
              pre="$"
              stat={formatNumber({ num: cell.row.original.tvl_usd, notation: 'compact' })}
              change={cell.row.original.tvl_usd_change}
            />
          </div>
        ),
      }),
      ch.accessor((x) => x.tx_count, {
        id: 't0_tvl',
        header: 'Token 0 TVL',
        cell: (cell) => (
          <div>
            <PoolStat pre={'$'} stat={formatNumber({ num: cell.row.original.t0_tvl_usd })} />
          </div>
        ),
      }),
      ch.accessor((x) => x.tx_count, {
        id: 't1_tvl',
        header: 'Token 1 TVL',
        cell: (cell) => (
          <div>
            <PoolStat pre={'$'} stat={formatNumber({ num: cell.row.original.t1_tvl_usd })} />
          </div>
        ),
      }),
      ch.accessor((x) => x.t0_price, {
        id: 'price',
        header: 'Current Price',
        cell: (cell) => (
          <div>
            <PoolStat
              post={cell.row.original.t1_symbol}
              stat={formatNumber({ num: cell.row.original.t0_price, notation: 'compact' })}
              change={cell.row.original.t0_change * 100}
            />
          </div>
        ),
      }),
      ch.accessor((x) => x.t0_volume_usd, {
        id: 'vol_24h',
        header: 'Vol 24H',
        cell: (cell) => (
          <div>
            <PoolStat
              pre="$"
              stat={formatNumber({
                num: cell.row.original.t0_volume_usd + cell.row.original.t1_volume_usd,
                notation: 'compact',
              })}
              change={((cell.row.original.t0_volume_change + cell.row.original.t1_volume_change) / 2) * 100}
            />
          </div>
        ),
      }),
      ch.accessor((x) => x.total_volume_7d_usd, {
        id: 'vol_7d',
        header: 'Vol 7D',
        cell: (cell) => (
          <div>
            <PoolStat
              pre="$"
              stat={formatNumber({ num: cell.row.original.total_volume_7d_usd, notation: 'compact' })}
              change={((cell.row.original.t0_volume_change_7d + cell.row.original.t1_volume_change_7d) / 2) * 100}
            />
          </div>
        ),
      }),
      ch.accessor((x) => x.total_fees_usd, {
        id: 'fees',
        header: 'Fees 24H',
        cell: (cell) => (
          <div>
            <PoolStat
              pre="$"
              stat={formatNumber({ num: cell.row.original.total_fees_usd, notation: 'compact' })}
              change={((cell.row.original.t0_volume_change + cell.row.original.t1_volume_change) / 2) * 100}
            />
          </div>
        ),
      }),
      ch.accessor((x) => x.tx_count, {
        id: 'tx_count',
        header: 'TXs 24H',
        cell: (cell) => (
          <div>
            <PoolStat
              stat={formatNumber({ num: cell.row.original.tx_count, notation: 'standard', aboveOneDecimalAmount: 0 })}
            />
          </div>
        ),
      }),
    ],
    [pools]
  )

  const table = useReactTable({
    data: pools,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  })

  return pools.length > 0 ? (
    <div className={`h-full overflow-auto no-scrollbar outline-t outline-gray-dark ${isVisible ? 'block' : 'hidden'}`}>
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white sticky top-0 z-[1] shadow-[0_1px_0_0] shadow-gray-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`text-xs text-gray-400 font-normal py-2 relative
                 ${(() => {
                   const x = {
                     pool: 'pl-2 text-start',
                     price_7D: 'pr-2 2xl:pl-4 2xl:pr-2 text-end',
                   }[header.id]
                   return x !== undefined ? x : 'pr-2 2xl:px-4 text-end'
                 })()}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className=" odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-750">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`relative ${(() => {
                    const x = {
                      pool: 'pl-2 text-start',
                      price_7D: 'pr-2 2xl:pl-4 2xl:pr-2 text-end',
                    }[cell.column.id]
                    return x !== undefined ? x : 'pr-2 2xl:px-4 text-end'
                  })()} py-[10px]`}
                >
                  <Link
                    to={`app/${row.original.key}/pool/${row.original.address}`}
                    className={`absolute top-0 left-0 w-full h-full`}
                  />
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <SkeletonLines lines={6} />
  )
}
