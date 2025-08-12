import { T2 } from '../typography/Typography'
import { IToken } from '../../lib/getToken'
import { getTokenLogoUrl } from '../../util/getTokenLogo'
import { useDataContext } from '../../context/DataContext'
import PoolSection from '../lists/poolList/PoolSection'
import { SkeletonLines } from '../loadingStates/SkeletonLines'
import { CopyText } from '../misc/CopyText'
import BaseDropdown from './BaseDropdown'
import { useEffect, useState } from 'react'
import { RoundTokenLogoPair } from '../misc/RoundTokenLogo'
import BaseModal from '../modals/BaseModal'
import { useChainLoader } from '../../route/loaderData'
import { useThemeContext } from '../../context/ThemeContext'
import { TokenSymbol } from '../misc/TokenSymbol'

export default function PairDropdown(props: { showCopyIcon?: boolean; isTradePage?: boolean }) {
  const { showCopyIcon = true, isTradePage = false } = props
  const { token, token0, token1, poolSummary } = useDataContext()
  const [showModal, setShowModal] = useState(false)
  const poolFee = poolSummary !== undefined && poolSummary !== null ? (poolSummary.fee / 10000).toString() : undefined
  const { appLayout } = useThemeContext()
  const isDefault = appLayout === 'default'
  return token0 != undefined && token1 != undefined ? (
    <BaseDropdown
      showModal={showModal}
      setShowModal={setShowModal}
      buttonContent={
        <PairDropdownButton
          poolFee={poolFee}
          token0Info={token.flipped ? token1 : token0}
          token1Info={token.flipped ? token0 : token1}
          showCopyIcon={showCopyIcon}
        />
      }
      modalContent={
        <BaseModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          offsetLeft={isDefault || isTradePage ? 10 : 'auto'}
          offsetRight={isDefault && !isTradePage ? 'auto' : 10}
          offsetTop={90}
        >
          <div className="p-2 rounded-xl text-white flex flex-col flex-1 w-[400px] border border-gray-750 bg-gray-800">
            <PoolSection onClose={() => setShowModal(false)} isModal={true} />
          </div>
        </BaseModal>
      }
      fullWidthModal
    />
  ) : (
    <SkeletonLines lines={1} />
  )
}

interface PairDropdownButtonProps {
  poolFee?: string
  token0Info: IToken
  token1Info: IToken
  showCopyIcon?: boolean
}
const PairDropdownButton = ({ token0Info, token1Info, poolFee, showCopyIcon = true }: PairDropdownButtonProps) => (
  <span className="h-fit w-fit">
    <PoolPair poolFee={poolFee} token0Info={token0Info} token1Info={token1Info} showCopyIcon={showCopyIcon} />
  </span>
)

interface PoolPairProps {
  token0Info?: IToken
  token1Info?: IToken
  poolFee?: string
  showCopyIcon?: boolean
}
export const PoolPair = ({ token0Info, token1Info, poolFee, showCopyIcon = false }: PoolPairProps) => {
  return token0Info && token1Info ? (
    <h1 className="flex flex-row items-center w-fit" title="Token Pool">
      <div className="flex relative z-0">
        <RoundTokenLogoPair
          token0LogoUrl={token0Info.logoURI}
          token0Symbol={token0Info.symbol}
          token1LogoUrl={token1Info.logoURI}
          token1Symbol={token1Info.symbol}
        />
      </div>
      <div className="flex flex-row gap-1 items-center">
        {showCopyIcon ? (
          <>
            <div className="text-white font-semibold text-sm flex items-center gap-x-1">
              <TokenSymbol address={token0Info.address} fallback_name={token0Info.symbol} />{' '}
              <CopyText copyText={token0Info.address} />
            </div>
            <div className={`text-gray-400 font-semibold text-sm flex items-center gap-x-1`}>/</div>
            <div className={`text-gray-400 font-semibold text-sm flex items-center gap-x-1`}>
              <TokenSymbol address={token1Info.address} fallback_name={token1Info.symbol} />
              <CopyText copyText={token1Info.address} />
            </div>
          </>
        ) : (
          <div className="flex gap-0 items-center">
            <div className="text-white font-semibold text-sm">
              <TokenSymbol address={token0Info.address} fallback_name={token0Info.symbol} />
            </div>
            <div className={`text-gray-400 font-semibold text-sm`}>/</div>
            <div className={`text-gray-400 font-semibold text-sm`}>
              <TokenSymbol address={token1Info.address} fallback_name={token1Info.symbol} />
            </div>
          </div>
        )}
        {poolFee && (
          <div className="py-1 mr-1">
            <div className="text-sm text-white">{poolFee + '%'}</div>
          </div>
        )}
      </div>
    </h1>
  ) : (
    <SkeletonLines lines={1} />
  )
}

interface PoolPairFromSymbolProps {
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
  isLink?: boolean
}
export const PoolPairFromSymbol = ({
  token0Symbol,
  token1Symbol,
  token0Address,
  token1Address,
  isLink,
}: PoolPairFromSymbolProps) => {
  const { currentChainInfo } = useChainLoader()
  const [token0Logo, setToken0Logo] = useState<string>()
  const [token1Logo, setToken1Logo] = useState<string>()

  useEffect(() => {
    setToken0Logo(getTokenLogoUrl(token0Address, currentChainInfo.id))
    setToken1Logo(getTokenLogoUrl(token1Address, currentChainInfo.id))
  }, [token0Symbol, token1Symbol])

  return token0Logo && token1Logo ? (
    <div className="flex flex-row items-center w-fit gap-[12px]">
      <RoundTokenLogoPair
        token0LogoUrl={token0Logo}
        token1LogoUrl={token1Logo}
        token0Symbol={token0Symbol}
        token1Symbol={token1Symbol}
      />
      <div className="flex flex-row items-center">
        <T2 color={`${isLink ? 'group-hover:text-blue-400' : ''} text-gray-100`}>{token0Symbol}</T2>
        <T2 color={`${isLink ? 'group-hover:text-blue-400' : ''} text-gray-400`}>/{token1Symbol}</T2>
      </div>
    </div>
  ) : (
    <SkeletonLines lines={1} />
  )
}
