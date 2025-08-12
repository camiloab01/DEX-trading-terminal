import ModalOverlay from './ModalOverlay'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ReactNode } from 'react'

export interface IModal {
  showModal: boolean
  onClose: () => void
  children: ReactNode
  offsetLeft?: number | string
  offsetRight?: number | string
  offsetBottom?: number | string
  offsetTop?: number | string
  showOverlay?: boolean
  showCloseButton?: boolean
}

function BaseModal(props: IModal) {
  const {
    showModal,
    onClose,
    children,
    offsetLeft = 'auto',
    offsetTop = '40vh',
    offsetRight = 'auto',
    offsetBottom = 'auto',
    showOverlay = true,
    showCloseButton = false,
  } = props

  return (
    <>
      {showModal && (
        <div className="fixed z-20  h-full w-full flex" style={{ left: 0, top: 0 }}>
          <ModalOverlay onClose={onClose} showOverlay={showOverlay} />
          <div
            className="relative w-fit h-fit"
            style={{
              zIndex: 2,
              marginLeft: offsetLeft,
              marginRight: offsetRight,
              marginTop: offsetTop,
              marginBottom: offsetBottom,
            }}
          >
            {showCloseButton && (
              <XMarkIcon
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 cursor-pointer absolute md:h-fit w-fit right-3 top-3"
                width={16}
              />
            )}
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default BaseModal
