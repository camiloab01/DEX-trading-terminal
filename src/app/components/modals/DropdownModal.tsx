import ModalOverlay from './ModalOverlay'
import { ReactNode } from 'react'

interface IDropdownModal {
  showModal: boolean
  setShowModal: (value: boolean) => void
  children: ReactNode
  offset?: [number | undefined, number | undefined, number | undefined, number | undefined]
  showOverlay?: boolean
}

function DropdownModal(props: IDropdownModal) {
  const { showModal, setShowModal, children, offset = [0, 0, 0, 0], showOverlay = true } = props
  return (
    <div className="z-50 absolute">
      {showModal && (
        <div className={`z-30 flex flex-1`}>
          <ModalOverlay onClose={() => setShowModal(false)} showOverlay={showOverlay}></ModalOverlay>
          <div
            className=" h-fit  ml-auto mr-auto mb-auto mt-auto z-30 animate-slide-down"
            style={{ right: offset[0], left: offset[1], top: offset[2], bottom: offset[3] }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownModal
