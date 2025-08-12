import { T3 } from '../../components/typography/Typography'
import { FontWeightEnums } from '../../types/Enums'
import { GoChevronDown } from 'react-icons/go'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { useState } from 'react'

const factor = 10000
const feeTiers = [100, 500, 3000, 10000]

interface IFeeTierButton {
  fee: number
  setFee: (fee: number) => void
  setIsOpen: (value: boolean) => void
}

function CreatePoolFeeDropdown({ fee, setFee }: { setFee: (value: number) => void; fee: number | undefined }) {
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
    <div className="w-full relative">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="gap-1 text-white text-xs font-semibold border-[1px] py-2 px-2 bg-gray-dark hover:bg-hoverbackground border-gray-700 rounded-md flex justify-between cursor-pointer items-center h-[30px]"
      >
        <DropdownButton fee={fee} />
        <GoChevronDown />
      </div>
      {isOpen && (
        <div className="w-full mt-1" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div
            style={styles}
            className="w-full flex flex-col bg-gray-800 border-[1px] border-gray-700 rounded-md overflow-hidden"
          >
            <DropdownModal setFee={setFee} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  )
}

const DropdownModal = ({
  setFee,
  setIsOpen,
}: {
  setFee: (fee: number) => void
  setIsOpen: (value: boolean) => void
}) => {
  return (
    <>
      {feeTiers.map((fee, index) => (
        <FeeButton key={index} setFee={setFee} fee={fee} setIsOpen={setIsOpen} />
      ))}
    </>
  )
}

const DropdownButton = ({ fee }: { fee: number | undefined }) => {
  const factor = 10000
  return (
    <div className="">
      <T3>{fee != undefined ? (fee / factor).toString().concat('% Fee tier') : 'Select'}</T3>
    </div>
  )
}

const FeeButton = ({ fee, setFee, setIsOpen }: IFeeTierButton) => {
  return (
    <div
      className="px-2 py-2 hover:bg-gray-drophover w-full cursor-pointer "
      onClick={() => {
        setFee(fee)
        setIsOpen(false)
      }}
    >
      <div className="w-[56px] flex flex-start">
        <T3 weight={FontWeightEnums.MEDIUM}>{(fee / factor).toString().concat('%')}</T3>
      </div>
    </div>
  )
}

export default CreatePoolFeeDropdown
