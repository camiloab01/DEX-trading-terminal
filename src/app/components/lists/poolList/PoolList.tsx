import { getTokenByAddress, IToken } from '../../../lib/getToken'
import { getMarketWatch, updateMarketWatch } from '../../../lib/marketWatch'
import { CHAIN_INFO } from '../../../constants/abi/chainInfo'
import { useDataContext } from '../../../context/DataContext'
import { SearchResponse } from '@gfxlabs/oku'
import { IPoolSummary, searchPoolsByList } from '../../../data/search_pools'
import PoolListItem from './PoolListItem'
import PoolListTitles from './PoolListTitles'
import { useEffect, useState } from 'react'
import { useCurrentClient } from '../../../hooks/useClient'
import { useChainLoader } from '../../../route/loaderData'
import { usePageName } from '../../../hooks/usePageName'

interface IPoolList {
  token: string
  searchResults: SearchResponse | undefined
  onClose: () => void
}

const PoolList = (props: IPoolList) => {
  const { token, searchResults, onClose } = props
  const { favoritePool, setFavoritePool } = useDataContext()
  const { currentChain } = useChainLoader()
  const [tokenResults, setTokenResults] = useState<{ [key: string]: IPoolSummary[] }>()
  const [allTokens, setAllTokens] = useState([] as IToken[])
  const [pools, setPools] = useState(getMarketWatch(currentChain))
  const { cushRpc } = useChainLoader()
  useEffect(() => {
    const allTokensSet = new Set<IToken>([])
    CHAIN_INFO[currentChain].tokenList.forEach((token) => {
      const res = getTokenByAddress(token.address, currentChain)
      allTokensSet.add(res)
      const allTokens = Array.from(allTokensSet)
      setAllTokens(allTokens)
    })
  }, [currentChain])
  const { data: topPools } = useCurrentClient('cush_searchPoolsByList', [pools])
  const { data: tokenPools } = useCurrentClient('cush_batchSearchAddresses', [
    allTokens.map((x) => x.address).filter((x) => x.length !== 0),
    {
      fee_tiers: [],
      result_offset: 0,
      sort_by: 'volume',
      result_size: 20,
      sort_order: false,
    },
  ])
  const { pageName } = usePageName()

  useEffect(() => {
    if (!topPools || !tokenPools) return
    const poolMap: { [key: string]: IPoolSummary[] } = {}
    poolMap['Watchlist'] = topPools.pools
    for (const key in tokenPools) {
      const token = allTokens.find((token) => key.toLowerCase() === token.address.toLowerCase())
      if (token && token.symbol) {
        poolMap[token.symbol.toLocaleUpperCase()] = tokenPools[key].pools
      }
    }
    setTokenResults(poolMap)
  }, [topPools, tokenPools])
  useEffect(() => {
    const pools = getMarketWatch(currentChain)
    setPools(pools)
  }, [favoritePool, currentChain])
  const togglePool = (address: string) => {
    if (pools.includes(address)) {
      const updatedList = updateMarketWatch('REMOVE', address, currentChain)
      setPools(updatedList)
      setFavoritePool(updatedList)
    } else {
      setPools(updateMarketWatch('ADD', address, currentChain))
      searchPoolsByList(cushRpc, getMarketWatch(currentChain))
        .then((res) => {
          res.pools.sort(function (a, b) {
            return getMarketWatch(currentChain).indexOf(a.address) - getMarketWatch(currentChain).indexOf(b.address)
          })
          setTokenResults((tokenRes) => {
            return { ...tokenRes, WATCH_LIST_TITLE: res.pools as IPoolSummary[] }
          })
        })
        .catch((err) => {
          window.log.error(err)
        })
    }
  }
  return (
    <div
      className={`${pageName === 'liquidity' ? 'bg-gray-800 max-h-[400px]' : 'bg-gray-800 xl:bg-gray-900 xl:border xl:border-gray-800'} rounded-xl flex flex-col flex-1 gap-y-2 pt-3 overflow-y-hidden`}
    >
      <PoolListTitles />
      <div className="overflow-y-scroll no-scrollbar overscroll-contain">
        {token === ''
          ? searchResults &&
            searchResults.pools.map((pool) => {
              return (
                <PoolListItem
                  key={pool.address}
                  pool={pool}
                  isStarred={pools.includes(pool.address)}
                  togglePool={togglePool}
                  onClose={onClose}
                />
              )
            })
          : tokenResults != undefined &&
            tokenResults[token] != undefined &&
            tokenResults[token].map((pool) => {
              return (
                <PoolListItem
                  key={pool.address}
                  pool={pool}
                  isStarred={pools.includes(pool.address)}
                  togglePool={togglePool}
                  onClose={onClose}
                />
              )
            })}
      </div>
    </div>
  )
}

export default PoolList
