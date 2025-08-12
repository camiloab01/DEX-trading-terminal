import { TransactionContent, useModalContext } from '../../../context/ModalContext'
import BaseModal from '../BaseModal'
import { blockExplorerName, linkExplorer } from '../../../util/linkBlockexplorer'
import { IChainInfo } from '@gfxlabs/oku-chains'
import { useChainLoader } from '../../../route/loaderData'
const Error = 'https://assets.oku.trade/error.svg'
const Loader = 'https://assets.oku.trade/loader.svg'
const Check = 'https://assets.oku.trade/check.svg'

function TransactionModal() {
  const { setShowTransactionsModal, showTransactionsModal, transactionContent } = useModalContext()
  const { currentChainInfo } = useChainLoader()
  return (
    <BaseModal
      showModal={showTransactionsModal}
      onClose={() => setShowTransactionsModal(false)}
      showOverlay={false}
      showCloseButton={true}
    >
      <div className="transaction-modal flex flex-col gap-y-4 w-80 items-center text-white bg-gray-dark p-5 rounded-lg border-2 border-gray-800">
        {TransactionStateSwitch(transactionContent, currentChainInfo)}
        <button
          className="transaction-modal-footer-button-close w-full px-8 py-1 bg-blue-400 rounded-lg text-s font-semibold"
          onClick={() => setShowTransactionsModal(false)}
        >
          Close
        </button>
      </div>
    </BaseModal>
  )
}

export default TransactionModal

const TransactionStateSwitch = (transaction: TransactionContent | undefined, currentChain: IChainInfo) => {
  if (!transaction)
    return (
      <>
        <img src={Loader} alt="spinning loader" className="center mx-auto my-4 animate-spin" />
        <div className="transaction-modal-body-title">Confirm Transaction in wallet</div>
      </>
    )
  switch (transaction.state) {
    case 'PENDING':
      return (
        <>
          <img src={Loader} alt="spinning loader" className="center mx-auto my-4 animate-spin" />
          <div className="transaction-modal-body-title">Confirm Transaction in wallet</div>
          <div className="transaction-modal-body-description">{transaction.message}</div>
        </>
      )
    case 'SUBMITTED':
      return (
        <>
          <img src={Loader} alt="spinning loader" className="center mx-auto my-4 animate-spin" />
          <div className="transaction-modal-body-title">Transaction Submitted</div>
          <div className="transaction-modal-body-description">Your status will appear soon.</div>
        </>
      )
    case 'SUCCESSFUL':
      return (
        <>
          <img src={Check} alt="check" className="center mx-auto my-4" />
          <div className="transaction-modal-body-title">Success!</div>
          {transaction.transaction ? (
            <a
              className="transaction-modal-body-description text-blue-400 underline"
              href={linkExplorer('tx', transaction.transaction.toString(), currentChain.id)}
              target="_blank"
              rel="noreferrer"
            >
              View on {blockExplorerName(currentChain.id)}
            </a>
          ) : (
            <></>
          )}
        </>
      )
    case 'ERROR':
      return (
        <>
          <img src={Error} alt="error" className="center mx-auto my-4" />
          <div className="transaction-modal-body-title">Transaction Error</div>
          <div className="transaction-modal-body-description">{transaction.message}</div>
          {transaction.transaction ? (
            <a
              className="transaction-modal-body-description text-blue-400 underline"
              href={linkExplorer('tx', transaction.transaction.toString(), currentChain.id)}
              target="_blank"
              rel="noreferrer"
            >
              View on {blockExplorerName(currentChain.id)}
            </a>
          ) : (
            <></>
          )}
        </>
      )
    default:
      return (
        <>
          <img src={Error} alt="error" className="center mx-auto my-4" />
          <div>Please try again later</div>
        </>
      )
  }
}
