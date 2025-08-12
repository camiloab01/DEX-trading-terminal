import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FeeTierEnums, OpenPositionStatusEnums, PositionStatusEnums } from '../../types/Enums'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  autoUpdate,
  useClick,
  useFloating,
  useInteractions,
  useTransitionStyles,
  useDismiss,
  offset,
  flip,
} from '@floating-ui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { Divider } from '../misc/Divider'

export function FeeFilterDropdown({
  setFilter,
  filter,
  label,
  filterType,
}: {
  setFilter: Dispatch<SetStateAction<string[]>>
  filter: string[]
  label: string
  filterType: typeof FeeTierEnums
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset({ crossAxis: -55 }), flip()],
    placement: 'bottom',
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(1,0.2)' },
    common: { transformOrigin: 'top' },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return (
    <div className="relative">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="gap-1 text-white text-xs font-semibold outline-1 outline-gray-700 rounded-lg flex justify-between cursor-pointer items-center"
      >
        <DropdownButton label={label} />
      </div>
      {isOpen && (
        <div className="w-full mt-1 z-10" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div style={styles} className="w-full flex flex-col">
            <FeesDropdownModal filter={filter} setFilter={setFilter} filterType={filterType} />
          </div>
        </div>
      )}
    </div>
  )
}

export function StatusFilterDropdown({
  setFilter,
  filter,
  label,
  filterType,
}: {
  setFilter: Dispatch<SetStateAction<string>>
  filter: string
  label: string
  filterType: typeof PositionStatusEnums
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset({ crossAxis: -55 }), flip()],
    placement: 'bottom',
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(1,0.2)' },
    common: { transformOrigin: 'top' },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return (
    <div className="relative">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="gap-1 text-white text-xs font-semibold outline-1 outline-gray-700 rounded-lg flex justify-between cursor-pointer items-center"
      >
        <DropdownButton label={label} />
      </div>
      {isOpen && (
        <div className="w-full mt-1 z-10" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div style={styles} className="w-full flex flex-col">
            <StatusDropdownModal filter={filter} setFilter={setFilter} filterType={filterType} />
          </div>
        </div>
      )}
    </div>
  )
}

const DropdownButton = ({ label }: { label: string }) => {
  return (
    <button className="flex flex-row items-center gap-3 justify-center border rounded-[8px] w-[91px] h-[33px] border-gray-600">
      <T2 color="text-gray-200">{label}</T2>
      <ChevronDownIcon width={12} height={12} color={colors.gray[400]} />
    </button>
  )
}

const FeesDropdownModal = ({
  setFilter,
  filter,
  filterType,
}: {
  filter: string[]
  setFilter: Dispatch<SetStateAction<string[]>>
  filterType: typeof FeeTierEnums
}) => {
  const toggleFilter = (filter: string) => {
    setFilter((filters: string[]) => {
      const newFilters = filters.includes(filter) ? filters.filter((f) => f !== filter) : [...filters, filter]
      return newFilters
    })
  }
  const filterOptions = getEnumValues(filterType)

  return (
    <div className="bg-gray-750 rounded-md h-fit border border-gray-700 text-white flex flex-col w-fit overflow-hidden">
      <div className="flex flex-row justify-end pr-3 py-3 w-[147px]">
        <button onClick={() => setFilter([])}>
          <T3 color={colors.blue[400]}>Clear all</T3>
        </button>
      </div>
      <Divider containerClasses="px-3" />
      <div className="flex flex-col">
        {filterOptions.map((option) => {
          return (
            <FilterItem
              key={option}
              onClick={() => toggleFilter(option)}
              title={option}
              selected={filter.includes(option)}
            />
          )
        })}
      </div>
    </div>
  )
}

const StatusDropdownModal = ({
  setFilter,
  filter,
  filterType,
}: {
  filter: string
  setFilter: Dispatch<SetStateAction<string>>
  filterType: typeof PositionStatusEnums
}) => {
  const filterOptions = getEnumValues(filterType)

  return (
    <div className="bg-gray-750 rounded-md h-fit border border-gray-700 text-white flex flex-col w-fit overflow-hidden">
      <div className="flex flex-row justify-end pr-3 py-3 w-[147px]">
        <button onClick={() => setFilter('')}>
          <T3 color={colors.blue[400]}>Clear all</T3>
        </button>
      </div>
      <Divider containerClasses="px-3" />
      <div className="flex flex-col">
        {filterOptions.map((option) => {
          return (
            <FilterItem
              key={option}
              onClick={() => setFilter(option)}
              title={option}
              selected={filter.includes(option)}
            />
          )
        })}
      </div>
    </div>
  )
}

interface IItemButton {
  onClick: () => void
  title: FeeTierEnums | OpenPositionStatusEnums
  selected: boolean
}
const FilterItem = (props: IItemButton) => {
  const { onClick, title, selected } = props
  const titleString = formatEnumTitle(title)

  return (
    <button onClick={onClick} className="flex justify-between items-center w-full p-3 hover:bg-gray-drophover">
      <T3>{`${titleString}`}</T3>
      {selected ? <CheckIcon width={12} height={12} color={colors.green[300]} /> : <></>}
    </button>
  )
}
const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
const formatEnumTitle = (title: string) => {
  return Object.values(FeeTierEnums).includes(title as FeeTierEnums)
    ? `${title}%`
    : title
        .split('_')
        .map((word) => capitalizeFirstLetter(word))
        .join(' ')
}

function getEnumValues(enumType: object): Array<any> {
  return Object.entries(enumType)
    .filter(([, value]) => typeof value !== 'number')
    .map(([, value]) => value)
}
