import { T2 } from '../typography/Typography'
import { Trans } from '@lingui/macro'

export default function ClearAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className={' text-blue-400 hover:text-blue-500 rounded-md color-red-200'}>
      <T2 color="inherit">
        <Trans>Clear all</Trans>
      </T2>
    </button>
  )
}
