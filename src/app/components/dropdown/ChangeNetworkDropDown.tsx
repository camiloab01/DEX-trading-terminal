import { T2, T3 } from '../typography/Typography'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums } from '../../types/Enums'
import { CHAIN_INFO } from '../../constants/abi/chainInfo'
import {
  NavLink,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useConfigContext } from '../../context/ConfigContext'
import { useState } from 'react'
import {
  autoUpdate,
  useClick,
  useFloating,
  useInteractions,
  useTransitionStyles,
  useDismiss,
  FloatingPortal,
} from '@floating-ui/react'
import { GoChevronDown } from 'react-icons/go'
import { IChainInfo } from '@gfxlabs/oku-chains'
import { colors } from '../../constants/colors'
import { useRpcBlockContext } from '../../context/RpcBlockContext'
import { useMatchingRoute } from '../../hooks/useMatchingRoute'
import { useChainLoader } from '../../route/loaderData'
import { Chain } from 'viem'
import { BsCheckLg } from 'react-icons/bs'

function ChangeNetworkDropDown() {
  const { currentChainInfo } = useChainLoader()
  const { isMobile } = useMobile()

  const [isOpen, setIsOpen] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const {
    features: { Chains },
  } = useConfigContext()
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { isMounted, styles } = useTransitionStyles(context, {
    common: {
      transformOrigin: `top`,
    },
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ])

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="h-[37px] sm:h-8 cursor-pointer select-none flex items-center justify-between sm:gap-1 bg-gray-900 border border-gray-600 px-2 sm:px-1 rounded-md hover:opacity-70">
          <div className="w-fit flex flex-1">
            {!isMobile && (
              <T2
                className="flex whitespace-nowrap select-none"
                weight={FontWeightEnums.REGULAR}
              >
                <BlockNumberTag showTooltip={isHover && !isOpen} />
              </T2>
            )}
          </div>
          <GoChevronDown className="fill-gray-200 w-3 h-3 md:w-5 sm:h-5" />
        </div>
      </div>
      {isOpen && (
        <div
          className="z-[100]"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div
            className="z-10 mt-1 bg-gray-750 border border-gray-700 rounded-md w-full grid grid-cols-1 sm:grid-cols-three-narrow p-2 sm:gap-2"
            style={{
              ...styles,
            }}
          >
            {isMounted &&
              Object.values(CHAIN_INFO)
                .sort((a, b) => {
                  if (
                    Chains.comingsoon.includes(a.internalName) <
                    Chains.comingsoon.includes(b.internalName)
                  ) {
                    return -1
                  }
                  if (
                    Chains.featured != undefined &&
                    Chains.featured.includes(a.internalName) <
                      Chains.featured.includes(b.internalName)
                  ) {
                    return 1
                  }
                  if (a.sortIndex < b.sortIndex) {
                    return -1
                  } else if (a.id === b.id) {
                    return 0
                  }
                  return 1
                })
                .filter(
                  (network) => !Chains.hidden.includes(network.internalName)
                )
                .map((network) => {
                  return (
                    <div
                      onClick={() => {
                        setIsOpen(false)
                      }}
                      key={network.id}
                      className={`hover:bg-gray-drophover cursor:pointer hover:rounded-md`}
                    >
                      <NetworkButton
                        key={network.id}
                        chain_info={network}
                        chain={currentChainInfo}
                        comingSoon={Chains.comingsoon.includes(
                          network.internalName
                        )}
                      />
                    </div>
                  )
                })}
          </div>
        </div>
      )}
    </>
  )
}

export const BlockNumberTag = ({ showTooltip }: { showTooltip: boolean }) => {
  const { blockNumber } = useRpcBlockContext()
  const { currentChainInfo } = useChainLoader()
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: showTooltip,
    placement: 'bottom',
  })
  const { styles } = useTransitionStyles(context, {
    common: {
      transformOrigin: `top right`,
    },
  })
  const { getReferenceProps, getFloatingProps } = useInteractions()

  return (
    <div>
      <div
        className="flex flex-row items-center"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <T2
          className={`whitespace-nowrap`}
          color={blockNumber > 0 ? colors.gray[300] : colors.yellow[400]}
        >
          {blockNumber > 0 ? currentChainInfo.name : 'DISCONNECTED'}
        </T2>
      </div>
      {showTooltip && (
        <FloatingPortal>
          <div
            className="z-50"
            ref={refs.setFloating}
            style={{ ...floatingStyles }}
            {...getFloatingProps()}
          >
            <div
              className="z-50 mt-3 mr-10 bg-gray-750 border border-gray-700 rounded-lg"
              style={{ ...styles }}
            >
              <div className="p-2 flex flex-col gap-y-2 text-gray-50">
                <T3>Current chain: {currentChainInfo.name}</T3>
                <T3>Block number: {blockNumber}</T3>
                <T3>
                  Block time: ~{currentChainInfo.blockTimeSeconds} seconds
                </T3>
                <T3>Native token: {currentChainInfo.nativeCurrency.symbol}</T3>
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

const NetworkButton = ({
  chain_info,
  chain,
  comingSoon,
}: {
  chain_info: IChainInfo
  comingSoon: boolean
  chain:
    | (Chain & {
        unsupported?: boolean | undefined
      })
    | undefined
}) => {
  useLocation()
  const shouldDisable = comingSoon || chain_info.id === chain?.id
  const { chain: chainPath } = useParams()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { match } = useMatchingRoute()
  let target = ''
  if (match && match !== 'landing') {
    target = `/app/${chain_info.internalName}/${match}/`
  } else if (pathname === '/' || searchParams.get('swap_chain')) {
    target = `?swap_chain=${chain_info.internalName}`
  } else {
    const newPath = pathname.replace(
      chainPath ? chainPath : 'ethereum',
      chain_info.internalName
    )
    target = newPath
  }

  return (
    <NavLink
      aria-disabled={shouldDisable}
      className={`text-gray-100 ${comingSoon ? 'line-through' : ''} flex items-center px-2 py-2 gap-x-1 text-sm font-medium leading-none`}
      to={target}
      key={chain_info.id}
    >
      {chain_info.name}
      {chain_info.internalName === chainPath && (
        <BsCheckLg color={colors.green[300]} className="ml-auto sm:ml-0" />
      )}
    </NavLink>
  )
}

export default ChangeNetworkDropDown
