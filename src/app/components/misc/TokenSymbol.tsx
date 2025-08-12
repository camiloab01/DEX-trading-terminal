import { useEffect, useState } from 'react'
import { NewDefaultToken, getTokenByAddress } from '../../lib/getToken'
import { useChainLoader } from '../../route/loaderData'
import { fetchERC20Symbol } from '../../data/fetchERC20Symbol'
import { shortenTokenSymbol } from '../../util/shortenTokenSymbol'

interface ITokenSymbol {
  address: string
  fallback_name?: string
  shortenSymbol?: boolean
}
export const TokenSymbol = (props: ITokenSymbol) => {
  const { address, fallback_name, shortenSymbol } = props
  const [symbol, setSymbol] = useState<string>()
  const { currentChain, cushRpc } = useChainLoader()

  useEffect(() => {
    const fetchSymbol = async () => {
      const symbol = await fetchERC20Symbol(cushRpc, address)
      setSymbol(symbol)
      return
    }
    let token_symbol = getTokenByAddress(address, currentChain).symbol
    if (!token_symbol || token_symbol === 'NULL' || token_symbol === 'UNKN') {
      if (fallback_name && fallback_name.trim() !== '' && fallback_name !== 'UNKN') {
        token_symbol = fallback_name
      } else {
        fetchSymbol()
      }
      if (!token_symbol) {
        token_symbol = NewDefaultToken(currentChain).symbol
      }
      if (!token_symbol) {
        token_symbol = 'NULL'
      }
    }
    setSymbol(token_symbol)
  }, [address, fallback_name])

  return <>{symbol && symbol !== '' ? (shortenSymbol ? shortenTokenSymbol(symbol) : symbol) : 'UNKN'}</>
}
