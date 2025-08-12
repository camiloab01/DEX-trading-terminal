import { InformationCircleIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { autoUpdate, flip, shift, useFloating, useInteractions } from '@floating-ui/react'

export const InfoTooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [flip({ fallbackPlacements: ['bottom-end'] }), shift()],
    placement: 'bottom-start',
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([])
  return (
    <>
      <InformationCircleIcon
        ref={refs.setReference}
        {...getReferenceProps({
          className: 'text-gray-400',
          width: 14,
        })}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      />
      {open && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps({
            style: floatingStyles,
            className: 'z-10 px-2 py-0.5 w-96',
          })}
        >
          <div className={'bg-gray-750 border-gray-700 border rounded-lg p-3'}>{children}</div>
        </div>
      )}
    </>
  )
}
