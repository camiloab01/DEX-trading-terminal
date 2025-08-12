import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { T1, T2 } from '../../typography/Typography.tsx'
import { FontWeightEnums } from '../../../types/Enums.ts'
import { colors } from '../../../constants/colors.ts'
import { t, Trans } from '@lingui/macro'
import { XMarkIcon } from '@heroicons/react/24/solid'

export const PendingQuotesModal = ({
  open,
  handleClose,
}: {
  open: boolean
  handleClose: (shouldContinue: boolean) => void
}) => {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (open) => {
      if (!open) {
        handleClose(false)
      }
    },
  })
  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context)
  const { getFloatingProps } = useInteractions([click, dismiss, role])

  return (
    <FloatingPortal>
      {open && (
        <FloatingOverlay lockScroll className="z-20 flex justify-center bg-black/70">
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps({
                className: 'mt-[30vh] h-max',
              })}
            >
              <div className="rounded-xl bg-gray-900 border border-gray-800 w-full max-w-[414px] p-4">
                <div className="flex w-full justify-end">
                  <div
                    className={'w-min cursor-pointer text-gray-400 hover:text-gray-100  '}
                    onClick={() => handleClose(false)}
                  >
                    <XMarkIcon width={15} />
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <T1 color={colors.gray[100]} weight={FontWeightEnums.SEMIBOLD}>{t`Are you sure?`}</T1>
                </div>
                <div className="flex flex-col gap-8 mt-4">
                  <div className={'flex text-center px-5'}>
                    <T2 color={colors.gray[50]}>
                      <Trans>
                        We are still waiting to fetch a quote. Are you sure you want to proceed with the market order?
                      </Trans>
                    </T2>
                  </div>
                  <button
                    onClick={() => handleClose(true)}
                    className={
                      'flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold text-blue-400 bg-gray-800 hover:bg-blue-500 hover:text-gray-50'
                    }
                  >
                    {t`Yes`}
                  </button>
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  )
}
