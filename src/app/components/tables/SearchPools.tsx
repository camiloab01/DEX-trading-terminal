import { NavLink } from 'react-router-dom'
import { PoolSummary } from '@gfxlabs/oku'
import { Row, Table, flexRender } from '@tanstack/react-table'
import { VirtualItem } from '@tanstack/react-virtual'
import { useMatchingRoute } from '../../hooks/useMatchingRoute'
import { getLocalStorageItem } from '../../lib/localStorage'
import { useChainLoader } from '../../route/loaderData'

interface SearchPoolsTableProps {
  tablePoolSummary: Table<PoolSummary>
  virtualRows: () => VirtualItem[]
  rows: Row<PoolSummary>[]
  setShowModal: (value: boolean) => void
  isFullHeight?: boolean
}

const SearchPoolsTable = ({
  tablePoolSummary,
  virtualRows,
  rows,
  setShowModal,
  isFullHeight = false,
}: SearchPoolsTableProps) => {
  const { match } = useMatchingRoute()
  const { chainID, currentChainInfo } = useChainLoader()
  const targetPage = ['liquidity', 'pool'].includes(match) ? match : 'pool'

  return (
    <div className="overflow-y w-full">
      <table className="table-auto block h-fit">
        <thead>
          {tablePoolSummary.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`pr-4 text-end mb-3 ${header.column.id === 'pool' ? 'w-40 sm:w-72' : 'w-24'}`}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={`overflow-y-auto block ${isFullHeight ? 'max-h-[280px]' : 'max-h-[280px]'} no-scrollbar`}>
          {virtualRows().length > 0 &&
            virtualRows().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<PoolSummary>
              return (
                <tr key={row.id} className="hover:bg-gray-800">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`text-end p-1 pr-4 ${cell.column.id === 'pool' ? 'w-40 sm:w-72' : 'w-24'}
                  ${(() => {
                    const x = {}[cell.column.id]
                    return x !== undefined ? x : ''
                  })()}`}
                    >
                      <NavLink
                        to={`app/${currentChainInfo.internalName}/${targetPage}/${row.original.address}`}
                        relative="path"
                        onClick={() => {
                          setShowModal(false)
                          const recent_searches = getLocalStorageItem(`recent_search_${chainID}`)

                          if (recent_searches) {
                            const new_recent_searches = recent_searches.filter((pool) => pool !== row.original.address)
                            new_recent_searches.unshift(row.original.address)
                            localStorage.setItem(
                              `recent_search_${chainID}`,
                              JSON.stringify(new_recent_searches.slice(0, 5))
                            )
                          } else {
                            localStorage.setItem(`recent_search_${chainID}`, JSON.stringify([row.original.address]))
                          }
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </NavLink>
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
export default SearchPoolsTable
