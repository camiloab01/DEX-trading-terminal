import { colors } from '../../constants/colors'
import { IToken } from '../../lib/getToken'
import { useDataContext } from '../../context/DataContext'
import PoolSection from '../lists/poolList/PoolSection'
import BaseModal from '../modals/BaseModal'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { PoolPair } from './PairDropdown'
import { T1 } from '../typography/Typography'
import { useWindowSize } from 'usehooks-ts'

function PairPullUp() {
  const { token0, token1, token, poolSummary } = useDataContext()
  const [showModal, setShowModal] = useState(false)
  const windowSize = useWindowSize()
  const [startY, setStartY] = useState(0)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const modalElement = modalRef.current
    if (modalElement) {
      modalElement.addEventListener('touchstart', (e) => handleTouchStart(e, setStartY))
      modalElement.addEventListener('touchend', (e) => handleTouchEnd(e, startY, setShowModal))
    }
    return () => {
      if (modalElement) {
        modalElement.removeEventListener('touchstart', (e) => handleTouchStart(e, setStartY))
        modalElement.removeEventListener('touchend', (e) => handleTouchEnd(e, startY, setShowModal))
      }
    }
  }, [startY])
  const poolFee = poolSummary !== undefined ? (poolSummary.fee / 10000).toString() : undefined
  return (
    <div className="z-30" style={{ zIndex: showModal ? 100 : 0 }} ref={modalRef}>
      <PairDropdownButton
        onClick={() => setShowModal(true)}
        poolFee={poolFee}
        token0Info={token.flipped ? token1 : token0}
        token1Info={token.flipped ? token0 : token1}
      />
      <BaseModal showModal={showModal} onClose={() => setShowModal(false)} offsetLeft={0} offsetTop={0}>
        <div
          className="pt-4 px-2  text-white  flex flex-col  border-[1px] "
          style={{
            borderColor: colors.gray[700],
            backgroundColor: colors.gray.dark,
            width: windowSize.width,
            height: '100vh',
          }}
        >
          <div className="flex justify-between mb-3">
            <T1 className="whitespace-nowrap	">Pool Picker</T1>
            <XMarkIcon height={16} color={colors.gray[500]} onClick={() => setShowModal(false)} />
          </div>
          <PoolSection isModal={true} onClose={() => setShowModal(false)} />
        </div>
      </BaseModal>
    </div>
  )
}

export default PairPullUp

const PairDropdownButton = ({
  token0Info,
  token1Info,
  poolFee,
  onClick,
}: {
  token0Info: IToken
  token1Info: IToken
  poolFee?: string
  onClick: () => void
}) => {
  return (
    <button onClick={onClick} className=" h-fit w-fit flex flex-row items-center gap-2 ">
      <PoolPair poolFee={poolFee} token0Info={token0Info} token1Info={token1Info} showCopyIcon={false} />
      <ChevronDownIcon color={colors.white} width={16} />
    </button>
  )
}

const handleTouchEnd = (e: TouchEvent, startY: number, setShowModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const endY = e.changedTouches[0].clientY
  if (endY - startY > 50) {
    setShowModal(false)
  }
}
const handleTouchStart = (e: TouchEvent, setStartY: React.Dispatch<React.SetStateAction<number>>) => {
  setStartY(e.touches[0].clientY)
}
