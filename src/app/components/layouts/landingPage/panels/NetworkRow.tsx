import { Link } from 'react-router-dom'
import { useConfigContext } from '../../../../context/ConfigContext'

import { Row, flexRender } from '@tanstack/react-table'
import { AnalyticsProtocolOverviewWithKey } from './NetworkUsage'
const NetworkRow = ({
  row,
  refs,
}: {
  isLast: boolean
  row: Row<AnalyticsProtocolOverviewWithKey>
  refs?: React.RefObject<HTMLTableRowElement>
}) => {
  const { features } = useConfigContext()

  return (
    <tr
      ref={refs}
      key={row.id}
      className={`duration-75 odd:bg-gray-900 even:bg-gray-800 mb-1 transition-opacity w-full hover:bg-gray-750`}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className={`relative ${(() => {
            const x = {
              tvl: 'pr-3 text-end',
              volume: 'pr-2 text-end',
              chain: 'pl-2 text-start',
            }[cell.column.id]
            return x !== undefined ? x : 'pl-2'
          })()} py-[10px]
                `}
        >
          <Link
            to={`${features.Analytics.url}/${row.original.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute top-0 left-0 w-full h-full`}
          />
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}

export default NetworkRow
