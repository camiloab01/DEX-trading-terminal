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
import React, { useState } from 'react'
import { T1, T2 } from '../../typography/Typography.tsx'
import { FontWeightEnums } from '../../../types/Enums.ts'
import { colors } from '../../../constants/colors.ts'
import { useWindowSize } from 'usehooks-ts'
import { t, Trans } from '@lingui/macro'
import { useSilentLogin } from '../../../hooks/useSilentLogin.tsx'
import TransactionLoader from '../../forms/OrderForms/Swap/TransactionLoader.tsx'

const ListBullet = ({ children }: { children: React.ReactNode }) => {
  return (
    <li>
      <div className={'flex flex-row gap-2'}>
        <T2 color={colors.gray[50]}>&bull;</T2>
        <T2 color={colors.gray[50]}>{children}</T2>
      </div>
    </li>
  )
}

const TextLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return (
    <a href={href} target={'_blank'} rel={'noreferrer'} className={'text-blue-400 hover:text-blue-500'}>
      {children}
    </a>
  )
}

export const TermsModal = ({ open, close }: { open: boolean; close?: (successful: boolean) => void }) => {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (open) => {
      if (!open) {
        close?.(false)
      }
    },
  })
  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context)
  const { getFloatingProps } = useInteractions([click, dismiss, role])
  const windowSize = useWindowSize()
  const isDesktop = windowSize.width >= 768
  const { login } = useSilentLogin()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  return (
    <FloatingPortal>
      {open && (
        <FloatingOverlay lockScroll className="z-20 flex justify-center bg-black/70">
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps({
                className: `max-w-[475px] ${isDesktop ? 'mt-[20vh]' : 'mt-[10vh]'} h-max px-1.5`,
              })}
            >
              <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden w-full md:min-w-[350px] lg:min-w-[475px] xl:min-w-[360px]">
                <div className={'items-center p-4'}>
                  <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[50]}>
                    {t`Welcome to Oku!`}
                  </T1>
                </div>
                <div className={'p-4 flex flex-col gap-8'}>
                  <div className={'flex flex-col gap-4'}>
                    <T2 color={colors.gray[50]}>
                      <Trans>
                        By clicking &quot;Agree and Continue&quot; you certify that you have read, understood, and agree
                        to GFX Labs&apos;{' '}
                        <TextLink href={'https://cdn.gfx.xyz/GFX_Labs_Master_ToS.pdf'}>Terms of Service</TextLink>,{' '}
                        <TextLink href={'https://cdn.gfx.xyz/GFX_Labs_Master_Privacy_Policy.pdf'}>
                          Privacy Policy
                        </TextLink>
                        , and the following
                      </Trans>
                    </T2>
                    <ul className={'flex flex-col gap-4'}>
                      <ListBullet>
                        {t`Oku is an entirely non-custodial application, meaning we do not have custody, possession, or control over your crypto assets at any point.`}
                      </ListBullet>
                      <ListBullet>
                        {t`You alone are responsible for securely managing your crypto assets, wallets, private keys, and trades.`}
                      </ListBullet>
                      <ListBullet>
                        {t`You understand that Oku merely communicates your trades to the DEX aggregator that you select and cannot guarantee estimated prices and times for trades.`}
                      </ListBullet>
                      <ListBullet>
                        {t`You represent and warrant that you are not located in or a resident of any country subject to United States sanctions.`}
                      </ListBullet>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      if (isLoggingIn) {
                        return
                      }
                      setIsLoggingIn(true)
                      login()
                        .then(() => {
                          close?.(true)
                        })
                        .finally(() => {
                          setIsLoggingIn(false)
                        })
                    }}
                    className={
                      'flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold text-gray-50 disabled:bg-gray-800 bg-blue-400 hover:bg-blue-500'
                    }
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? <TransactionLoader /> : t`Agree and Continue`}
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
