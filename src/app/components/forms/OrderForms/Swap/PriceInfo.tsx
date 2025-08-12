import { T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { FontWeightEnums } from '../../../../types/Enums'
import PriceLoader from './PriceLoader'
import React, { useMemo, useState } from 'react'
import { formatNumber } from '../../../numbers/FormatNumber'
import { CiWarning } from 'react-icons/ci'
import useBreakpoint from '../../../../hooks/useBreakpoint.tsx'
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
import { RouteTable } from './RouteTable.tsx'
import { PriceQuoteWithMarket } from '../../../../types/canoe'
import { PriceFlipper } from './PriceFlipper.tsx'
import { GasInfo } from './GasInfo.tsx'
import EngineName from './EngineName.ts'
import { SwapRoute } from '../../../../hooks/useSwapRouter.tsx'
import { useWindowSize } from 'usehooks-ts'
import { InfoTooltip } from './InfoTooltip.tsx'
import { t } from '@lingui/macro'

const EditButton = ({ children }: { children: React.ReactNode }) => {
  const fontSize = useBreakpoint({ base: '12px', sm: '12px' })
  const lineHeight = useBreakpoint({ base: '14px', sm: '14px' })

  return (
    <button
      className={'text-gray-400 hover:text-gray-300 font-medium'}
      style={{
        fontSize: fontSize,
        lineHeight: lineHeight,
      }}
    >
      {children}
    </button>
  )
}

interface IPriceInfo {
  loading?: boolean
  selectedRoute?: PriceQuoteWithMarket
  setSelectedRoute: (selectedRoute: PriceQuoteWithMarket | undefined) => void
  routes: SwapRoute[]
  showGas?: boolean
}

export const PriceInfo = (props: IPriceInfo) => {
  const { selectedRoute, setSelectedRoute, loading = false, showGas = false, routes } = props
  const failed = !loading && routes.length > 0 && selectedRoute === undefined
  const priceImpact: number | undefined = selectedRoute?.extra?.trade?.priceImpact
  const isHighPriceImpact = useMemo(() => (priceImpact ?? 0) > 5, [priceImpact])
  const [isOpen, setShowModal] = useState(false)
  const { refs, context } = useFloating({ open: isOpen, onOpenChange: setShowModal })
  const click = useClick(context)
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
  const role = useRole(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])
  const windowSize = useWindowSize()
  const isDesktop = windowSize.width >= 768
  return (
    <>
      <div className="w-full rounded-md overflow-hidden border border-gray-750">
        <div className={'w-full border-b px-2 py-2 border-gray-750'}>
          <div className="flex justify-between flex-row">
            <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
              {t`Route`}:
            </T3>
            <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[50]}>
              {loading ? (
                <PriceLoader />
              ) : failed ? (
                <T3 color={colors.red[300]}>Failed to fetch quote</T3>
              ) : selectedRoute?.market ? (
                <div className={'flex gap-2'}>
                  <div className={'flex gap-1 items-center'}>
                    <div>
                      {formatNumber({
                        num: Number(selectedRoute.isExactIn ? selectedRoute.outAmount : selectedRoute.inAmount),
                        aboveOneDecimalAmount: 3,
                      })}{' '}
                      via {EngineName(selectedRoute.market)}
                    </div>
                    {selectedRoute.market !== 'usor' && (
                      <InfoTooltip>
                        {t`Non-Uniswap v3 trades will temporarily not appear in your trading history on Oku.`}
                      </InfoTooltip>
                    )}
                  </div>
                  <div ref={refs.setReference} {...getReferenceProps()}>
                    <EditButton>EDIT</EditButton>
                  </div>
                </div>
              ) : (
                <>...</>
              )}
            </T3>
          </div>
        </div>
        <div className={'w-full p-1 flex flex-col'}>
          <div className="flex justify-between flex-row p-1">
            <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
              {t`Price`}:
            </T3>
            <PriceFlipper route={selectedRoute} loading={loading} />
          </div>
          <div
            className={`flex justify-between rounded-md p-1`}
            style={{ backgroundColor: isHighPriceImpact ? 'rgba(244, 114, 114, 0.2)' : '' }}
          >
            <T3
              weight={FontWeightEnums.MEDIUM}
              color={isHighPriceImpact ? colors.red[300] : colors.gray[400]}
              className="flex items-center"
            >
              {t`Price Impact`}
              {isHighPriceImpact ? (
                <>
                  {' '}
                  {t`Warning`}{' '}
                  <CiWarning height={12} className="inline-block ml-0.5 mt-[1px]" color={colors.red[300]} />
                </>
              ) : (
                <>:</>
              )}
            </T3>
            {loading ? (
              <PriceLoader />
            ) : (
              <T3 weight={FontWeightEnums.REGULAR} color={isHighPriceImpact ? colors.red[300] : colors.gray[50]}>
                {priceImpact != undefined
                  ? formatNumber({ num: priceImpact, belowOneDecimalAmount: 2, smallNumberOn2Zeros: true }) + '%'
                  : '...'}
              </T3>
            )}
          </div>
          {showGas ? (
            <div className="flex justify-between p-1">
              <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
                {t`Gas`}:
              </T3>
              <GasInfo
                gas={selectedRoute?.estimatedGas ? Number(selectedRoute.estimatedGas) : undefined}
                showGasPrice
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay lockScroll className="z-20 flex justify-center bg-black/70">
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                {...getFloatingProps({ className: `${isDesktop ? 'mt-[20vh]' : 'mt-[10vh]'} h-max px-1.5` })}
              >
                <RouteTable routes={routes} setSelectedRoute={setSelectedRoute} close={() => setShowModal(false)} />
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  )
}
