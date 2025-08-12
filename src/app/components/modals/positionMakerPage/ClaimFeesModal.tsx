import { useConfigContext } from '../../../context/ConfigContext'
import { useModalContext } from '../../../context/ModalContext'
import { useTelemetryContext } from '../../../context/TelemetryContext'
import { useDataContext } from '../../../context/DataContext'
import { claimLiquidityFees } from '../../../contracts/position'
import BaseModal from '../BaseModal'
import { ClaimFees } from './ActionStateModals'
import { UserPositions } from '@gfxlabs/oku'
import { useAccount } from 'wagmi'
import { MaxUint256 } from '../../../v3-sdk'
import { useNetworkContext } from '../../../context/NetworkContext'
import { useChainLoader } from '../../../route/loaderData'
import { zarazTrack } from '../../../lib/zaraz'
interface IModal {
  showModal: boolean
  setShowModal: (value: boolean) => void
  position: UserPositions
}
function ClaimFeesModal({ setShowModal, showModal, position }: IModal) {
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { telemetryRpc } = useTelemetryContext()
  const { currentChain, currentChainInfo } = useChainLoader()
  const { signer, provider } = useNetworkContext()
  const { address } = useAccount()
  const { token0, token1 } = useDataContext()
  const { setShowTransactionsModal, setTransactionContent } = useModalContext()
  const onClaimFees = async () => {
    setShowModal(false)
    try {
      if (provider == undefined || position == undefined || position.tokenId == undefined) return
      if (position.total_collect_amounts == undefined || address == undefined || signer == undefined) return
      setShowTransactionsModal(true)
      const txn = await claimLiquidityFees({
        provider,
        positionId: position.tokenId,
        signer,
        token0,
        token1,
        token0ExpectedOwed: MaxUint256,
        token1ExpectedOwed: MaxUint256,
        user_address: address,
        contract: currentChainInfo.contracts.nftManager.address,
      })
      setTransactionContent({ state: 'PENDING', message: 'Claiming fees', transaction: txn })
      const txnResult = await provider.waitForTransactionReceipt({ hash: txn })
      if (Telemetry.enabled) {
        await telemetryRpc.call('marq_recordOkuTelemetry', [
          currentChain,
          'order',
          'claim_fees',
          address,
          txnResult.transactionHash,
          {},
        ])
      }
      zarazTrack('claim_fees', {
        chain: currentChainInfo.name,
        position: position.tokenId,
        transaction: txnResult.transactionHash,
      })
      setTransactionContent({
        state: 'SUCCESSFUL',
        message: 'Fees claimed',
        transaction: txnResult.transactionHash,
      })
    } catch (err) {
      const error = err
      window.log.log(error)
      setTransactionContent({ state: 'ERROR', message: 'Error claiming fees' })
    }
  }
  return (
    <div>
      <BaseModal showModal={showModal} onClose={() => setShowModal(false)} showOverlay={true} showCloseButton={true}>
        <ClaimFees onClaim={onClaimFees} position={position} />
      </BaseModal>
    </div>
  )
}
export default ClaimFeesModal
