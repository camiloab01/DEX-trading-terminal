import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react'
import useBreakpoint from '../../hooks/useBreakpoint'
import { T2 } from '../typography/Typography'
import { useAccount, useEnsName } from 'wagmi'
import { useMemo, useState } from 'react'
import makeBlockie from 'ethereum-blockies-base64'
import { autoUpdate, useClick, useDismiss, useFloating, useInteractions, useTransitionStyles } from '@floating-ui/react'
import AppLayoutModal from '../modals/AppLayoutModal'
import { PiGearSix } from 'react-icons/pi'
import shortenAddress from '../../util/shortenAddress'

const useAccountInformation = () => {
  const { open: isOpen, selectedNetworkId } = useWeb3ModalState()
  const { address, isConnected } = useAccount()
  const blockie = useMemo(() => {
    if (address) return makeBlockie(address)
    return undefined
  }, [address])
  const { data } = useEnsName({ address, chainId: 1 })
  const ensName = data ? data : undefined
  return { blockie, ensName, address, isConnected, isOpen, selectedNetworkId }
}

export default function ConnectWalletButton(props: { additionalClass: string }) {
  const { additionalClass } = props
  const labelText = useBreakpoint({ base: 'Connect Wallet' })
  const { open } = useWeb3Modal()
  const { blockie, ensName, address, isConnected } = useAccountInformation()
  const ConnectButton = () => {
    return (
      <button
        className={`bg-blue-400 text-gray-100 text-[12px] lg:text-[14px] font-[500] leading-[14px] md:leading-[18px] rounded-md border border-blue-600 hover:bg-blue-500 w-full px-4 ${additionalClass}`}
        onClick={() => open()}
      >
        {labelText}
      </button>
    )
  }
  const ConnectedButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { refs, floatingStyles, context } = useFloating({
      whileElementsMounted: autoUpdate,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: 'bottom-end',
    })
    const { isMounted, styles } = useTransitionStyles(context, {
      initial: { opacity: 1, transform: 'scale(0.5,0)' },
      common: { transformOrigin: `top right` },
    })
    const dismiss = useDismiss(context)
    const click = useClick(context)
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
    return (
      <>
        <div ref={refs.setReference} {...getReferenceProps()}>
          <div
            className={`
            hover:cursor-pointer bg-gray-900 hover:bg-gray-700 duration-700 py-1 px-3 text-white rounded-md font-medium flex flex-row items-center
            border-gray-600 border gap-x-1.5 sm:gap-x-2 h-[37px] sm:h-8`}
          >
            <img className="h-[17px] w-[17px] sm:h-5 sm:w-5 rounded-full" src={blockie} />
            <T2 className="flex">{ensName ? ensName : shortenAddress(address)}</T2>
            <PiGearSix className="hidden sm:flex rotate-90 stroke-3 sm:h-5 sm:w-5" />
          </div>
        </div>
        {isOpen && (
          <div className="z-10" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <div
              className="z-10 mt-1 bg-gray-750 border border-gray-700 rounded-xl"
              style={{
                ...styles,
              }}
            >
              {isMounted && (
                <div className="flex flex-col w-full h-full sm:w-[257px] items-center p-3">
                  <AppLayoutModal />
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }
  return <div>{!isConnected ? <ConnectButton /> : <ConnectedButton />}</div>
}
