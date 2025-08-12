import { useConfigContext } from '../../../context/ConfigContext'
import { useModalContext } from '../../../context/ModalContext'
import { useTelemetryContext } from '../../../context/TelemetryContext'
import { removeLiquidity } from '../../../contracts/position'
import BaseModal from '../BaseModal'
import { ClosePosition } from './ActionStateModals'
import { UserPositions } from '@gfxlabs/oku'
import { useNetworkContext } from '../../../context/NetworkContext'
import { useChainLoader } from '../../../route/loaderData'
import { zarazTrack } from '../../../lib/zaraz'
import { usePageName } from '../../../hooks/usePageName'

interface IModal {
  showModal: boolean
  setShowModal: (value: boolean) => void
  position: UserPositions
}

function ClosePositionModal({ setShowModal, showModal, position }: IModal) {
  const { currentChain } = useChainLoader()
  const { currentChainInfo } = useChainLoader()
  const { setShowTransactionsModal, setTransactionContent } = useModalContext()
  const page = usePageName()
  const pageName = page.pageName !== undefined ? page.pageName : ''
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const { signer, provider } = useNetworkContext()
  const onClosePosition = async () => {
    setShowModal(false)
    setShowTransactionsModal(true)
    if (provider == undefined || signer == undefined) return
    try {
      // multicall to close and claim
      const claimAndRemoveTxn = await removeLiquidity({
        positionId: position.tokenId,
        user_address: position.user as `0x${string}`,
        contract: currentChainInfo.contracts.nftManager.address,
        provider,
        signer,
      })
      setTransactionContent({ transaction: claimAndRemoveTxn, state: 'PENDING', message: 'Closing your position' })
      const removeLiquidityReceipt = await provider.waitForTransactionReceipt({ hash: claimAndRemoveTxn })

      if (Telemetry.enabled) {
        await telemetryRpc.call('marq_recordOkuTelemetry', [
          currentChain,
          pageName,
          'close_position',
          position.user,
          removeLiquidityReceipt.transactionHash,
          {},
        ])
      }
      zarazTrack('close_position', {
        chain: currentChainInfo.name,
        position: position.tokenId,
        transaction: removeLiquidityReceipt.transactionHash,
      })
      setTransactionContent({
        state: 'SUCCESSFUL',
        message: 'Your position has been closed',
        transaction: removeLiquidityReceipt.transactionHash,
      })
    } catch (err) {
      window.log.error(err)
      setTransactionContent({ state: 'ERROR', message: 'Your position could not be closed' })
    }
  }
  return (
    <div>
      <BaseModal showModal={showModal} onClose={() => setShowModal(false)} showOverlay={true} showCloseButton={true}>
        <ClosePosition onClick={onClosePosition} position={position} />
      </BaseModal>
    </div>
  )
}

export default ClosePositionModal
