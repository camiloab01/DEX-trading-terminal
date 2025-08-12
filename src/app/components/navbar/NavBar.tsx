import { useConfigContext } from '../../context/ConfigContext'
import { useDataContext } from '../../context/DataContext'
import HomeButton from '../buttons/HomeButton'
import NavButton from '../buttons/NavButton'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { getAddress, zeroAddress } from 'viem'
import { useChainLoader } from '../../route/loaderData'
import { useWindowSize } from 'usehooks-ts'

export default function NavBar() {
  const { currentChainInfo } = useChainLoader()
  const { features } = useConfigContext()
  const { poolSummary, poolAddress } = useDataContext()
  const { token0, token1 } = useParams()
  const windowSize = useWindowSize()
  const isDesktop = windowSize.width >= 768
  const [newPoolAddress, setNewPoolAddress] = useState(
    getAddress(currentChainInfo.defaultPool)
  )
  const [newToken0, setNewToken0] = useState(
    poolSummary?.t0 ? poolSummary.t0 : currentChainInfo.defaultToken0
  )
  const [newToken1, setNewToken1] = useState(
    poolSummary?.t1 ? poolSummary.t1 : currentChainInfo.defaultToken1
  )

  useEffect(() => {
    if (poolAddress) setNewPoolAddress(poolAddress)
  }, [poolAddress])

  useEffect(() => {
    if (token0 && token1) {
      setNewToken0(token0)
      setNewToken1(token1)
    } else if (
      poolSummary != undefined &&
      poolSummary.t0 !== zeroAddress &&
      poolSummary.t1 !== zeroAddress
    ) {
      setNewToken0(poolSummary.t0)
      setNewToken1(poolSummary.t1)
    } else if (!token0 && !token1) {
      setNewToken0(currentChainInfo.defaultToken0)
      setNewToken1(currentChainInfo.defaultToken1)
    }
  }, [poolSummary, token0, token1])

  const prependChain = `/app/${currentChainInfo.internalName}/`

  return (
    <div className="flex flex-row gap-4 justify-center items-center">
      <HomeButton />
      {isDesktop && (
        <div className="flex flex-row lg:gap-1 justify-center items-center">
          {features.Swap.enabled === 'true' && (
            <NavButton
              to={`${prependChain}swap/${newToken0}/${newToken1}`}
              relative="route"
              label={t`Swap`}
            />
          )}
          <NavButton
            to={`${prependChain}pool/${newPoolAddress}`}
            relative="route"
            label={t`Trade`}
          />
        </div>
      )}
    </div>
  )
}
