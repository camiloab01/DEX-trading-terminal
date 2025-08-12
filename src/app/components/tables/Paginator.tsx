import { colors } from '../../constants/colors'
import { DOTS, usePagination } from '../../hooks/usePagination'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

interface IPaginator {
  onPageChange: (nextPage: number) => void
  totalCount: number
  siblingCount?: number
  currentPage: number
  pageSize: number
  isOrdersPage?: boolean
}
export default function Paginator(props: IPaginator) {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, isOrdersPage } = props
  const paginationRange = usePagination({ currentPage, totalCount, siblingCount, pageSize })
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) return <div className="pb-10"></div>
  const onPageUpdate = (change: number) => onPageChange(currentPage + change)
  const lastPage = paginationRange && paginationRange[paginationRange.length - 1]
  return (
    <div className={`flex justify-center items-center gap-2 ${!isOrdersPage ? 'h-[44px] md:h-[47px]' : 'h-fit'}`}>
      <button disabled={currentPage === 1} onClick={() => onPageUpdate(-1)}>
        <ChevronLeftIcon width={14} color={colors.blue[400]} />
      </button>
      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) return <span key={index}>{DOTS}</span>
        return (
          <button
            className={`${pageNumber === currentPage ? 'text-white bg-gray-700' : 'text-gray-300'} hover:text-white rounded-[4px] w-6 h-6`}
            onClick={() => onPageChange(Number(pageNumber))}
            key={`pageCaps-${index}`}
          >
            <p className="text-xs md:text-sm">{pageNumber}</p>
          </button>
        )
      })}
      <button disabled={currentPage === lastPage} onClick={() => onPageUpdate(1)}>
        <ChevronRightIcon width={14} color={colors.blue[400]} />
      </button>
    </div>
  )
}
