import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums, TrendingPoolsEnums } from '../../types/Enums'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface ITrendPoolDropdown {
  setTrendType: (value: TrendingPoolsEnums) => void
  trendType: TrendingPoolsEnums
}

function TrendingPoolDropdown({ trendType, setTrendType }: ITrendPoolDropdown) {
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 1,
      transform: 'scale(0,0)',
    },
    common: {
      transformOrigin: `top`,
    },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  return (
    <div className="w-fit relative z-5">
      <div
        className="gap-4 text-xs font-semibold border py-2 px-2 min-w-[120px] bg-gray-900 border-gray-600 rounded-md flex hover:bg-hoverbackground justify-between cursor-pointer items-center"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <DropdownButton trendType={trendType} />
        <ChevronDownIcon width={12} height={12} color={colors.gray[400]} />
      </div>
      {isOpen && (
        <div className="w-full" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div
            style={styles}
            className="flex flex-col w-full bg-gray-750 border border-gray-700 rounded-lg overflow-hidden mt-1"
          >
            <DropdownModal setTrendType={setTrendType} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  )
}

const DropdownButton = ({ trendType }: { trendType: TrendingPoolsEnums }) => (
  <T3 weight={FontWeightEnums.REGULAR} color="text-gray-200">
    {getTitle(trendType)}
  </T3>
)

const DropdownModal = ({
  setIsOpen,
  setTrendType,
}: {
  setTrendType: (value: TrendingPoolsEnums) => void
  setIsOpen: (value: boolean) => void
}) => {
  const onClickHandler = (trend: TrendingPoolsEnums) => {
    setTrendType(trend)
    setIsOpen(false)
  }

  return (
    <>
      {Object.values(TrendingPoolsEnums).map((title, index) => (
        <ButtonItem key={index} onClick={onClickHandler} title={title} />
      ))}
    </>
  )
}

interface IButtonItem {
  onClick: (title: TrendingPoolsEnums) => void
  title: TrendingPoolsEnums
}

const ButtonItem = ({ onClick, title }: IButtonItem) => (
  <div onClick={() => onClick(title)} className="py-2 px-3  hover:bg-gray-drophover w-full cursor-pointer ">
    <T2 color={colors.gray[100]} className="whitespace-nowrap">
      {getTitle(title)}
    </T2>
  </div>
)

const getTitle = (trendType: TrendingPoolsEnums) => {
  switch (trendType) {
    case TrendingPoolsEnums.TOP_GAINERS:
      return 'Top Gainers'
    case TrendingPoolsEnums.TOP_LOSERS:
      return 'Top Losers'
    case TrendingPoolsEnums.TOTAL_SWAPS:
      return 'Total Swaps'
    case TrendingPoolsEnums.TVL:
      return 'TVL'
    case TrendingPoolsEnums.VOLUME:
      return 'Volume'
    default:
      return 'Volume'
  }
}

export default TrendingPoolDropdown
