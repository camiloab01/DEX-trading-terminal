import { T2 } from '../typography/Typography'
import { FontWeightEnums } from '../../types/Enums'
import { useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { GoChevronDown } from 'react-icons/go'
import { useAccount } from 'wagmi'
import { CheckIcon } from '@heroicons/react/24/solid'
import { colors } from '../../constants/colors'

const FILTER = ['All', 'Open', 'Filled', 'Market', 'Limit']

interface IOrderHistoryDropdown {
  filter: string
  setFilter: (value: string) => void
}
export default function OrderHistoryDropDown(props: IOrderHistoryDropdown) {
  const { filter, setFilter } = props
  const containerRef = useRef(null)
  const { width } = useResizeObserver({ ref: containerRef })
  const { isConnected } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
  })
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0.5,0)' },
    common: { transformOrigin: `top` },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context, { enabled: isConnected })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return (
    <div ref={containerRef} className="w-full" tabIndex={0}>
      <div
        className={`gap-1 border text-white text-xs font-semibold py-2 px-4 ${isOpen ? 'bg-gray-800' : 'bg-gray-900'} border-gray-800 hover:bg-gray-800 
        rounded-md flex justify-between cursor-pointer items-center`}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div>{filter}</div>
        {isConnected && <GoChevronDown />}
      </div>
      {isOpen && (
        <div
          className={`border w-full bg-gray-750 border-gray-700 rounded-lg h-fit text-white flex z-50 mt-1`}
          style={{ width: width, ...floatingStyles }}
          {...getFloatingProps()}
          ref={refs.setFloating}
        >
          {isMounted && (
            <div className="w-full flex flex-col" style={styles}>
              {FILTER.map((filterOption, index) => (
                <FilterButton
                  key={index}
                  filter={filterOption}
                  selectedFilter={filter}
                  setFilter={setFilter}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface IFilterButton {
  filter: string
  selectedFilter: string
  setFilter: (value: string) => void
  onClose: () => void
}
const FilterButton = (props: IFilterButton) => {
  const { filter, selectedFilter, setFilter, onClose } = props

  return (
    <button
      className="flex justify-between text-white text-left px-3 py-2 hover:bg-gray-drophover"
      key={filter}
      onClick={() => {
        setFilter(filter)
        onClose()
      }}
    >
      <T2 color={colors.gray[200]} weight={FontWeightEnums.REGULAR}>
        {filter}
      </T2>
      {selectedFilter === filter ? <CheckIcon width={16} height={16} color={colors.green[300]} /> : <></>}
    </button>
  )
}
