import { useEffect, useRef, useState } from 'react'
import { useInfiniteHits } from 'react-instantsearch'
import { TokenWithBalance } from './SelectTokenDropdown'
import { T2 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { isAddress, erc20Abi } from 'viem'
import { useChainLoader } from '../../../route/loaderData'
import { useNetworkContext } from '../../../context/NetworkContext'
import { IToken, getTokenByAddress } from '../../../lib/getToken'
import { usePageName } from '../../../hooks/usePageName'
const Loader = 'https://assets.oku.trade/loader.svg'

export function InfiniteHits({ setToken, ...props }: any) {
  const { hits, isLastPage, showMore } = useInfiniteHits(props)
  const { input, balanceTokens, setTokenToImport, selectedToken } = props
  const [isLoading, setIsLoading] = useState(true)
  const sentinelRef = useRef(null)
  const { currentChain } = useChainLoader()
  const { provider } = useNetworkContext()
  const { pageName } = usePageName()

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        setIsLoading(true)
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage && hits.length > 0) showMore()
          else if (isLastPage) setIsLoading(false)
        })
      })
      observer.observe(sentinelRef.current)
      return () => observer.disconnect()
    }
  }, [isLastPage, showMore, hits.length])
  useEffect(() => {
    setTokenToImport(undefined)
    if (hits.length === 0) {
      fetchRPCToken(input as string)
    }
  }, [hits.length])

  const userTokenAddresses = balanceTokens.map((token: IToken) => token.address.toLowerCase())
  const withoutUserTokenHits = hits.filter(
    (hit: any) => !userTokenAddresses.includes(hit.address.toString().toLowerCase())
  )
  const storedTokenString = localStorage.getItem(`Token_${currentChain}_${(input as string).toLowerCase()}`)
  const storedToken = storedTokenString ? (JSON.parse(storedTokenString) as unknown as IToken) : undefined
  const fetchRPCToken = async (tokenContractAddress: string) => {
    if (!isAddress(tokenContractAddress) || getTokenByAddress(tokenContractAddress, currentChain).isToken) return
    const tokenNamePromise = provider.readContract({
      address: tokenContractAddress,
      abi: erc20Abi,
      functionName: 'name',
    })
    const tokenSymbolPromise = provider.readContract({
      address: tokenContractAddress,
      abi: erc20Abi,
      functionName: 'symbol',
    })
    const tokenDecimalsPromise = provider.readContract({
      address: tokenContractAddress,
      abi: erc20Abi,
      functionName: 'decimals',
    })
    Promise.all([tokenNamePromise, tokenSymbolPromise, tokenDecimalsPromise]).then(
      ([tokenName, tokenSymbol, tokenDecimal]) => {
        setTokenToImport({
          name: tokenName,
          address: tokenContractAddress,
          chainId: currentChain,
          decimals: tokenDecimal,
          symbol: tokenSymbol,
        } as IToken)
      }
    )
  }

  return (
    <div className={`flex flex-col overflow-scroll no-scrollbar ${pageName === 'liquidity' ? 'max-h-60' : 'max-h-96'}`}>
      {selectedToken && <TokenWithBalance token={selectedToken} setToken={setToken} isSelected />}
      {input === '' && balanceTokens && balanceTokens.length > 0 && (
        <>
          {balanceTokens
            .filter((hit: any) => (selectedToken ? hit.address !== selectedToken.address : true))
            .map((token: IToken) => {
              return (
                <div key={token.address}>
                  <TokenWithBalance token={token} setToken={setToken} isSelected={false} />
                </div>
              )
            })}
        </>
      )}
      <T2 className="text-gray-400 text-[12px] leading-[14px] pt-1 pl-2" color={colors.gray[400]}>
        {input === '' ? '' : 'Search Results'}
      </T2>
      {withoutUserTokenHits.length > 0 && input === '' ? (
        withoutUserTokenHits
          .filter((hit: any) => (selectedToken ? hit.address !== selectedToken.address : true))
          .map((hit) => {
            return (
              <div key={hit.objectID} className="ais-InfiniteHits-item">
                <TokenWithBalance token={hit as any} setToken={setToken} isSelected={false} />
              </div>
            )
          })
      ) : (
        <>
          {hits.map((hit) => {
            return (
              <div key={hit.objectID} className="ais-InfiniteHits-item">
                <TokenWithBalance token={hit as any} setToken={setToken} isSelected={false} />
              </div>
            )
          })}
          {storedToken && <TokenWithBalance token={storedToken} setToken={setToken} isSelected={false} />}
        </>
      )}
      {isLoading && <img src={Loader} alt="spinning loader" className="h-[16px] center mx-auto my-4 animate-spin" />}
      <div className="ais-InfiniteHits-sentinel" ref={sentinelRef} aria-hidden="true" />
    </div>
  )
}
