import { useWindowSize } from 'usehooks-ts'
import { TokenSummmary, SearchFilterOpts } from '@gfxlabs/oku'
import CoinCarouselItem from './CoinCarouselItem'
import { useEffect, useState } from 'react'
import { useChainLoader } from '../../../route/loaderData'
import { useCurrentClient } from '../../../hooks/useClient'

export default function CoinCarousel() {
  const { chain } = useChainLoader()
  const [tokenListFetched, setTokenListFetched] = useState<boolean>(false)
  const searchFilterOptions: SearchFilterOpts = {
    result_size: 100,
    sort_by: 'tx_4h',
    sort_order: false,
    fee_tiers: [],
    result_offset: 0,
  }
  const [tokenList, setTokenList] = useState<TokenSummmary[]>([])
  const { data: searchTopTokensResult } = useCurrentClient('cush_searchTopTokens', [searchFilterOptions], {
    enabled: tokenListFetched !== true,
  })
  const windowSize = useWindowSize()
  const itemWidth = 100
  const carouselStyle =
    'items-center w-full relative flex bg-repeat-x animate-movingCarousel hover:[animation-play-state:paused]'
  const setWidth = (width: string) => document.documentElement.style.setProperty('--width', width)

  useEffect(() => {
    if (searchTopTokensResult && searchTopTokensResult?.results?.length > 0) {
      const newWidth = itemWidth * searchTopTokensResult.results.length
      setWidth(`-${newWidth}px`)
      setTokenList(addTokensToCarousel(searchTopTokensResult.results, windowSize.width, itemWidth))
      setTokenListFetched(true)
    }
  }, [windowSize.width, searchTopTokensResult])

  useEffect(() => {
    if (chain && searchTopTokensResult?.results) setTokenListFetched(false)
  }, [chain])

  return (
    <div className={carouselStyle}>
      {tokenList != undefined &&
        tokenList.length > 0 &&
        tokenList.map((tokenItem, index) => <CoinCarouselItem key={index} tokenItem={tokenItem}></CoinCarouselItem>)}
    </div>
  )
}

const addTokensToCarousel = (tokenList: TokenSummmary[], clientWidth: number, itemWidth: number) => {
  const itemsDisplayed = Math.ceil(clientWidth / itemWidth) + 275
  const loopTotal = Math.floor(itemsDisplayed / tokenList.length)
  let newList = [...tokenList]
  for (let i = 0; i <= loopTotal; i++) {
    newList = [...newList, ...tokenList.slice(0, itemsDisplayed - tokenList.length * i + 1)]
  }
  return newList
}
