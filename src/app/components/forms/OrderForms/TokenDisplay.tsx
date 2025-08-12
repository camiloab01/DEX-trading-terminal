import { useState } from 'react'
import { IToken } from '../../../v3-sdk'
import { colors } from '../../../constants/colors'
import { T2 } from '../../typography/Typography'
import { TokenSymbol } from '../../misc/TokenSymbol'

interface ITokenDisplay {
  token: IToken
}
const TokenDisplay = (props: ITokenDisplay) => {
  const { token } = props
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="flex flex-row gap-1 items-center relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <T2 color={colors.gray[100]}>
        <TokenSymbol address={token.address} fallback_name={token.symbol} shortenSymbol />
      </T2>
      {showTooltip && (
        <div className={`absolute z-10 left-5 top-4 bg-gray-750 rounded-lg p-2 border border-gray-700`}>
          <T2 color={colors.white}>
            <TokenSymbol address={token.address} fallback_name={token.symbol} />
          </T2>
        </div>
      )}
    </div>
  )
}

export default TokenDisplay
