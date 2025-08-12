import { useMemo } from 'react'
import { createColumnHelper, getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'
import { T3 } from '../../../typography/Typography'
import { formatNumber } from '../../../numbers/FormatNumber'
import { FontWeightEnums } from '../../../../types/Enums'
import { RoundTokenLogo } from '../../../misc/RoundTokenLogo'
import { colors } from '../../../../constants/colors'
import { shortenTokenSymbol } from '../../../../util/shortenTokenSymbol'
import { TokenSummmary } from '@gfxlabs/oku'
import { Link } from 'react-router-dom'
import { CHAIN_INFO, getChainIdFromName } from '../../../../constants/abi/chainInfo'
import { LuPlus } from 'react-icons/lu'
import { TopTokensWithLogos } from '../util'

export interface TokenSearchResponseWithKey extends TokenSummmary {
  key: string
  logoUrl: string
}

export const TopTokens = ({ tokens }: { tokens: TopTokensWithLogos[] }) => {
  const ch = createColumnHelper<TopTokensWithLogos>()
  const columns = useMemo(
    () => [
      ch.accessor((x) => x.symbol, {
        id: 'token',
        header: 'Token',
        cell: (cell) => {
          return (
            <div className="flex gap-x-4 items-center">
              <RoundTokenLogo tokenSymbol={cell.row.original.symbol} logoUrl={cell.row.original.logoUrl} size={16} />
              <div className="absolute top-2 left-5">
                <RoundTokenLogo
                  tokenSymbol={cell.row.original.key}
                  logoUrl={CHAIN_INFO[cell.row.original.chainId].logoUrl}
                  size={12}
                />
              </div>
              <T3 weight={FontWeightEnums.SEMIBOLD}>{shortenTokenSymbol(cell.row.original.symbol, 4)}</T3>
            </div>
          )
        },
      }),
      ch.accessor((x) => x.price, {
        id: 'price',
        header: 'Price',
        cell: (cell) => <T3>${formatNumber({ num: cell.row.original.price, notation: 'compact' })}</T3>,
      }),
      ch.accessor((x) => x.change_24h, {
        id: 'change_24h',
        header: '∆ 24h',
        cell: (cell) => {
          const color = cell.row.original.change_24h >= 0 ? colors.green[400] : colors.red[350]
          return (
            <T3 color={color}>
              {cell.row.original.change_24h >= 0 ? (
                <LuPlus color={colors.green[400]} className="inline-flex mb-[2px] translate-x-0.5" height="10px" />
              ) : (
                ''
              )}
              {formatNumber({ num: cell.row.original.change_24h, notation: 'compact' })}%
            </T3>
          )
        },
      }),
      ch.accessor((x) => x.volume_24h, {
        id: 'volume',
        header: 'Vol 24H',
        cell: (cell) => <T3>${formatNumber({ num: cell.row.original.volume_24h, notation: 'compact' })}</T3>,
      }),
    ],
    [tokens]
  )
  const table = useReactTable({
    data: tokens,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div className="h-full overflow-auto no-scrollbar outline-t outline-gray-dark">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white sticky top-0 z-[1]  shadow-[0_1px_0_0] shadow-gray-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`text-xs text-gray-400 font-normal py-2
               ${(() => {
                 const x = {
                   volume: 'pr-2 text-end',
                   token: 'pl-2 text-start',
                   price: 'pr-2 text-end',
                   change_24h: 'pr-2 text-end',
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
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className=" odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-750">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`relative ${(() => {
                      const x = {
                        volume: 'pr-2 text-end',
                        token: 'pl-2 text-start',
                        price: 'pr-2 text-end',
                        change_24h: 'pr-2 text-end',
                      }[cell.column.id]
                      return x !== undefined ? x : 'pl-2'
                    })()} py-[10px]`}
                  >
                    {' '}
                    <Link
                      to={`app/${row.original.key}/swap/${row.original.contract}/${CHAIN_INFO[getChainIdFromName(row.original.key)].token.usdcAddress}`}
                      className={`absolute top-0 left-0 w-full h-full`}
                    />
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
