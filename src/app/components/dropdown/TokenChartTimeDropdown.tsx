import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { tokenChartTimeIncrementEnums } from '../../types/Enums'
import { useState } from 'react'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { GoChevronDown } from 'react-icons/go'

interface ITokenChartTimeDropdown {
  timeIncrement: tokenChartTimeIncrementEnums
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
}

const TokenChartTimeDropdown = (props: ITokenChartTimeDropdown) => {
  const { timeIncrement, setTimeIncrement } = props
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
  })
  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 1,
      transform: 'scale(0.5,0)',
    },
    common: {
      transformOrigin: `top`,
    },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  return (
    <>
      <div
        className="bg-gray-900 border border-gray-600 flex gap-x-2 rounded-md h-fit py-1 px-2 cursor-pointer"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <T2 color={colors.gray[200]}>{timeIncrement}</T2>
        <GoChevronDown color={colors.gray[400]} />
      </div>

      {isOpen && (
        <div {...getFloatingProps()} ref={refs.setFloating} style={floatingStyles} className="z-10">
          <div style={{ ...styles }}>
            <ModalContent setIsOpen={setIsOpen} setTimeIncrement={setTimeIncrement} />
          </div>
        </div>
      )}
    </>
  )
}

interface IModalContent {
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
  setIsOpen: (value: boolean) => void
}

const ModalContent = ({ setTimeIncrement, setIsOpen }: IModalContent) => {
  const onClickHandler = (timeIncrement: tokenChartTimeIncrementEnums) => {
    setTimeIncrement(timeIncrement)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col w-[56px] rounded-[6px] mt-1 bg-gray-750 border-[1px] border-gray-700">
      {Object.values(tokenChartTimeIncrementEnums).map((title, index) => (
        <ItemButton key={index} onClick={onClickHandler} title={title} />
      ))}
    </div>
  )
}

const ItemButton = ({
  onClick,
  title,
}: {
  onClick: (time: tokenChartTimeIncrementEnums) => void
  title: tokenChartTimeIncrementEnums
}) => (
  <button
    onClick={() => onClick(title)}
    className="flex justify-start w-full h-full hover:bg-gray-drophover px-3 py-[6px] rounded-[6px]"
  >
    <T3>{title}</T3>
  </button>
)

export default TokenChartTimeDropdown
