import useBreakpoint from '../../hooks/useBreakpoint'
import { useDataContext } from '../../context/DataContext'
import StarButton from '../buttons/StarButton'
import PairDropdown, { PoolPair } from '../dropdown/PairDropdown'
import PairPullUp from '../dropdown/PairPullUp'
import InfoBar from './InfoBar'
import { useEffect, useState } from 'react'
import { togglePool } from '../../lib/togglePool'
import { useChainLoader } from '../../route/loaderData'
import { useWindowSize } from 'usehooks-ts'

export default function PairRow() {
  const { favoritePool, setFavoritePool, poolSummary, token0, token1 } = useDataContext()
  const { currentChain } = useChainLoader()
  const poolGap = useBreakpoint({ base: '4px', md: '8px' })
  const [pools, setPools] = useState(favoritePool)
  const windowSize = useWindowSize()
  const poolFee = poolSummary !== undefined ? (poolSummary.fee / 10000).toString() : undefined
  const PairComponent = windowSize.width < 640 ? PairPullUp : windowSize.width < 1400 ? PairDropdown : PoolPair
  const pairProps =
    windowSize.width < 1400
      ? { isTradePage: true }
      : { poolFee, token0Info: token0, token1Info: token1, showCopyIcon: true }

  useEffect(() => setPools(favoritePool), [favoritePool])

  return (
    pools != undefined && (
      <div className="outline outline-1 outline-gray-800 rounded-lg flex flex-row flex-wrap items-center gap-x-4 px-[18px] bg-gray-900">
        <div className="w-fit flex items-center md:flex-row gap-x-2" style={{ gap: poolGap }}>
          <PairComponent {...(windowSize.width >= 640 ? pairProps : {})} />
          <StarButton
            isStarred={pools.includes(poolSummary.address)}
            onClick={() =>
              togglePool(
                poolSummary.address,
                pools.includes(poolSummary.address),
                currentChain,
                setFavoritePool,
                setPools
              )
            }
          />
        </div>
        <div className="overflow-x-auto no-scrollbar w-fit flex flex-row flex-wrap items-center gap-x-4">
          <InfoBar />
        </div>
      </div>
    )
  )
}
