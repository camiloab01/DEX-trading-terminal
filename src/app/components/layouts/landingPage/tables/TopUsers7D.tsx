import { useMemo } from 'react'
import { UserTradeStats } from '@gfxlabs/oku'
import { createColumnHelper, getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'
import { T3 } from '../../../typography/Typography'
import { formatNumber } from '../../../numbers/FormatNumber'
import { FontWeightEnums } from '../../../../types/Enums'
import { RoundTokenLogo } from '../../../misc/RoundTokenLogo'
import shortenAddress from '../../../../util/shortenAddress'
import UserIcon from '../../../../assets/iconComponents/UserIcon'
import { Link } from 'react-router-dom'
import { CHAIN_INFO } from '../../../../constants/abi/chainInfo'
import { useConfigContext } from '../../../../context/ConfigContext'

export interface UserTradeStatsWithKey extends UserTradeStats {
  key: string
  logoUrl: string
}
export const TopUsers7D = ({ users }: { users: UserTradeStatsWithKey[] }) => {
  const ch = createColumnHelper<UserTradeStatsWithKey>()
  const { features } = useConfigContext()

  const columns = useMemo(
    () => [
      ch.accessor((x) => x.account, {
        id: 'user',
        header: 'User',
        cell: (cell) => {
          return (
            <div className="flex gap-x-4 items-center">
              <UserIcon address={cell.row.original.account} size={16} />
              <div className="absolute top-2 left-5">
                <RoundTokenLogo
                  tokenSymbol={cell.row.original.key}
                  logoUrl={cell.row.original.logoUrl || CHAIN_INFO[1].logoUrl}
                  size={12}
                />
              </div>
              <T3 weight={FontWeightEnums.SEMIBOLD}>{shortenAddress(cell.row.original.account, 4)}</T3>
            </div>
          )
        },
      }),
      ch.accessor((x) => x.volume, {
        id: 'volume',
        header: 'Swap Volume',
        cell: (cell) => {
          return <T3>${formatNumber({ num: cell.row.original.volume, notation: 'compact' })}</T3>
        },
      }),
    ],
    [users]
  )

  const table = useReactTable({
    data: users,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="h-full overflow-auto no-scrollbar outline-t outline-gray-dark">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white sticky top-0 z-[1] shadow-[0_1px_0_0] shadow-gray-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={` text-xs text-gray-400 font-normal py-2 
               ${(() => {
                 const x = {
                   volume: 'pr-2 text-end',
                   user: 'pl-2 text-start',
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className=" odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-750">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`relative ${(() => {
                    const x = {
                      volume: 'pr-2 text-end',
                      user: 'pl-2 text-start',
                    }[cell.column.id]
                    return x !== undefined ? x : 'pl-2'
                  })()} py-[10px]`}
                >
                  <Link
                    to={`${features.Analytics.url}/${row.original.key}/user/${row.original.account}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
  )
}
