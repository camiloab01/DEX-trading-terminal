import { useState } from 'react'
import AppLayoutModal from '../modals/AppLayoutModal'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import SettingsButton from '../buttons/SettingsButton'

function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      opacity: 1,
      transform: 'scale(0,0)',
    },
    common: {
      transformOrigin: `top right`,
    },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <div className="flex rounded-full">
          <SettingsButton />
        </div>
      </div>
      {isOpen && (
        <div className="z-20" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <div
            className="z-10 mt-1 bg-gray-900 outline outline-gray-600 outline-1 rounded-lg"
            style={{
              ...styles,
            }}
          >
            {isMounted && (
              <div className="right-10 flex flex-col p-4 pb-2 gap-1 ">
                <AppLayoutModal />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SettingsDropdown
