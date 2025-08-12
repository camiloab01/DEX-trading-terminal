import { orderPath } from '../../util/pathHelper'
import { useNavigate } from 'react-router-dom'
import { useChainLoader } from '../../route/loaderData'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'

export default function ExpandOrderHistoryButton() {
  const navigate = useNavigate()
  const { currentChainInfo } = useChainLoader()
  return (
    <button
      className="flex items-center text-gray-400 hover:text-gray-300"
      onClick={() => navigate(orderPath(currentChainInfo.internalName), { state: 'order' })}
    >
      <ArrowTopRightOnSquareIcon width={16} />
    </button>
  )
}
