import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePageName } from '../hooks/usePageName'
import { useChainLoader } from './loaderData'
import { zarazTrack } from '../lib/zaraz'

export const TelemetrySender = () => {
  const { currentChainInfo } = useChainLoader()
  const { poolAddress, token0, token1 } = useParams()
  const { pageName } = usePageName()
  useEffect(() => {
    if (pageName != undefined) {
      if (pageName === 'swap') {
        zarazTrack(pageName + '_click', { chain: currentChainInfo.name, token0: token0, token1: token1 })
      } else {
        zarazTrack(pageName + '_click', { chain: currentChainInfo.name, address: poolAddress })
      }
    }
  }, [pageName])

  return <></>
}
