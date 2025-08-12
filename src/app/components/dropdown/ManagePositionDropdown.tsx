import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { usePositionMakerContext } from '../../context/PositionMakerContext'
import { useChartDataContext } from '../charts/context/ChartDataContext'
import ClaimFeesModal from '../modals/positionMakerPage/ClaimFeesModal'
import ClosePositionModal from '../modals/positionMakerPage/ClosePositionModal'

import { UserPositions } from '@gfxlabs/oku'
import { ArrowUpTrayIcon, EllipsisHorizontalIcon, FaceSmileIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  autoUpdate,
  useClick,
  useFloating,
  useInteractions,
  useTransitionStyles,
  useDismiss,
  flip,
  shift,
} from '@floating-ui/react'
import { blockExplorerName, linkExplorer } from '../../util/linkBlockexplorer'
import { IChainInfo } from '@gfxlabs/oku-chains'
import { useChainLoader } from '../../route/loaderData'
import { ConfigFeatures, useConfigContext } from '../../context/ConfigContext'

function ManagePositionDropdown({ position }: { position: UserPositions }) {
  const { features } = useConfigContext()
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), shift()],
    placement: 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 1,
      transform: 'scale(0,0)',
    },
    common: {
      transformOrigin: `top`,
    },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  const { setHighlightBounds } = useChartDataContext()
  const { currentChainInfo } = useChainLoader()
  const { setEditPosition, setPosition, setInputToken0, setInputToken1, setSlidePercent, setLastInput } =
    usePositionMakerContext()
  const navigate = useNavigate()
  const onClaim = () => {
    setShowClaimModal(true)
    setIsOpen(false)
  }
  const onClose = () => {
    setShowCloseModal(true)
    setIsOpen(false)
  }

  // TODO: replace this with an action, and use that to navigate and set bounds, manage state via query args.
  const onEdit = () => {
    setInputToken0('')
    setInputToken1('')
    setSlidePercent('0')
    setLastInput('')
    navigate(`/app/${currentChainInfo.internalName}/liquidity/${position.pool}/${position.tokenId}`)
    setEditPosition(true)
    setPosition(position)
    setHighlightBounds({ lower: position.tickLower, upper: position.tickUpper })
    setIsOpen(false)
  }

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`gap-1 text-white text-xs font-semibold stroke-gray-400 hover:stroke-gray-100 rounded-lg cursor-pointer ${'px-2 py-1  w-fit'}`}
      >
        <EllipsisHorizontalIcon width={12} className="m-0 " />
      </div>

      {isOpen && (
        <div className=" mt-1" style={{ ...floatingStyles }} {...getFloatingProps()} ref={refs.setFloating}>
          <div style={styles} className="flex flex-col bg-gray-750 border border-gray-700 rounded-lg">
            <DropdownModal
              onClosePosition={onClose}
              onClaim={onClaim}
              onEdit={onEdit}
              isClaimDisabled={false}
              isEditDisabled={position.tokenId === '0'}
              isCloseDisabled={position.current_liquidity === '0x0' || position.tokenId === '0'}
              currentChainInfo={currentChainInfo}
              position={position}
              features={features}
            />
          </div>
        </div>
      )}
      <ClaimFeesModal showModal={showClaimModal} setShowModal={setShowClaimModal} position={position} />
      <ClosePositionModal showModal={showCloseModal} setShowModal={setShowCloseModal} position={position} />
    </>
  )
}

export default ManagePositionDropdown

interface IDropdownModal {
  onClosePosition: () => void
  onClaim: () => void
  onEdit: () => void
  isCloseDisabled: boolean
  isClaimDisabled: boolean
  isEditDisabled: boolean
  currentChainInfo: IChainInfo
  position: UserPositions
  features: ConfigFeatures
}

const DropdownModal = (props: IDropdownModal) => {
  const {
    onClosePosition,
    onClaim,
    onEdit,
    isCloseDisabled,
    isClaimDisabled,
    isEditDisabled,
    currentChainInfo,
    position,
    features,
  } = props
  return (
    <>
      <button className="pt-3 pb-2 px-3 hover:bg-gray-drophover text-start rounded-t-lg group">
        <a
          href={linkExplorer('tx', position.starting_amounts.mint_tx, currentChainInfo.id)}
          target="_blank"
          rel="noreferrer"
        >
          <T3 color="text-gray-200" className="group-focus:text-blue-400">
            {blockExplorerName(currentChainInfo.id)}
          </T3>
        </a>
      </button>
      <button className="pt-3 pb-2 px-3 hover:bg-hoverbackground text-start rounded-t-lg group">
        <a
          href={`${features.Analytics.url}/${currentChainInfo.internalName}/position/${position.tokenId}`}
          target="_blank"
          rel="noreferrer"
        >
          <T3 color="text-gray-200" className="group-focus:text-blue-400">
            Analytics
          </T3>
        </a>
      </button>
      <button
        className={`flex flex-row w-full justify-between px-3 pt-3 ${isEditDisabled ? 'opacity-40' : ''} pb-2 hover:bg-gray-drophover gap-x-3 group`}
        onClick={onEdit}
        disabled={isEditDisabled}
      >
        <T3 color="text-gray-200" className="group-focus:text-blue-400">
          Edit Position
        </T3>
        <ArrowUpTrayIcon width={12} fill={colors.gray[200]} />
      </button>
      <button
        className={`flex flex-row w-full justify-between px-3 py-2 ${isClaimDisabled ? 'opacity-40' : ''}  hover:bg-gray-drophover group`}
        disabled={isClaimDisabled}
        onClick={onClaim}
      >
        <T3 color="text-gray-200" className="group-focus:text-blue-400">
          Claim Fees
        </T3>
        <FaceSmileIcon width={12} fill={colors.gray[200]} />
      </button>
      <button
        className={`flex flex-row w-full justify-between px-3 pb-3 pt-2  ${isCloseDisabled ? 'opacity-40' : ''} hover:bg-gray-drophover rounded-b-lg group`}
        disabled={isCloseDisabled}
        onClick={onClosePosition}
      >
        <T3 color="text-gray-200" className="group-focus:text-blue-400">
          Close
        </T3>
      </button>
    </>
  )
}
