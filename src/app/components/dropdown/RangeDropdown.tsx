import { T3 } from '../typography/Typography'
import { getNearestTick, price2Tick } from '../../lib/liquidity'
import { FontWeightEnums } from '../../types/Enums'
import { useDataContext } from '../../context/DataContext'
import { useChartDataContext } from '../charts/context/ChartDataContext'
import { useEffect, useState } from 'react'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { GoChevronDown } from 'react-icons/go'
import { colors } from '../../constants/colors'

const RANGE = [0.1, 1, 12.5, 25, 50, 75, 100]

interface IRangeButton {
  range: number
  setRange: (range: number) => void
  setIsOpen: (value: boolean) => void
}

function RangeDropdown({
  range,
  setRange,
}: {
  range: number | undefined
  setRange: (range: number | undefined) => void
}) {
  const { highlightBounds, setHighlightBounds } = useChartDataContext()
  const { poolSummary, token, liquidityChart: liquidityData } = useDataContext()
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0,0)' },
    common: { transformOrigin: `top` },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  // if highlightbounds are cleared, clear the range of this input
  useEffect(() => {
    if (highlightBounds === undefined) {
      setRange(undefined)
    }
  }, [highlightBounds])

  useEffect(() => {
    if (!(poolSummary.t1_price !== undefined && liquidityData && range != undefined)) return
    const price = token.selected === 1 ? poolSummary.t0_price : poolSummary.t1_price
    const rangeHalf = range / 2
    const tickSpacing = liquidityData?.tick_spacing
    const tickMin = price * (1 - rangeHalf / 100)
    const tickMax = price * (1 + rangeHalf / 100)

    setHighlightBounds({
      lower: getNearestTick(price2Tick(tickMin, token), tickSpacing, token),
      upper: getNearestTick(price2Tick(tickMax, token), tickSpacing, token),
    })
  }, [range, token])

  return (
    <div className="relative">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="gap-1 outline text-xs font-semibold outline-1 py-2 px-3 bg-gray-900 hover:outline-gray-800 outline-gray-750 rounded-lg flex justify-between cursor-pointer items-center"
      >
        <DropdownButton range={range} /> <GoChevronDown color={colors.gray[400]} />
      </div>
      {isOpen && (
        <div className="w-full mt-1" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div style={styles} className="w-full flex flex-col bg-gray-750 border border-gray-700 rounded-lg">
            <DropdownModal setRange={setRange} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RangeDropdown

const RangeButton = (props: IRangeButton) => {
  const { range, setRange, setIsOpen } = props
  const onClickHandler = (range: number) => {
    setRange(range)
    setIsOpen(false)
  }
  return (
    <div
      className="text-white flex px-2 py-1 w-full hover:bg-gray-drophover cursor-pointer rounded-lg"
      key={range}
      onClick={() => onClickHandler(range)}
    >
      <T3 weight={FontWeightEnums.MEDIUM}>{range.toString().concat('%')}</T3>
    </div>
  )
}

const DropdownButton = ({ range }: { range: number | undefined }) => (
  <T3 className="w-[80px]" color="text-gray-200">
    {range != undefined ? range.toString().concat('%') : 'Select'}
  </T3>
)

const DropdownModal = ({
  setRange,
  setIsOpen,
}: {
  setRange: (range: number) => void
  setIsOpen: (value: boolean) => void
}) => {
  return (
    <>
      {RANGE.map((range, index) => (
        <RangeButton key={index} range={range} setRange={setRange} setIsOpen={setIsOpen} />
      ))}
    </>
  )
}
