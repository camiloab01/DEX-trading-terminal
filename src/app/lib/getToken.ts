import { DefaultTokenList } from '../../config'
import noTokenLogo from '../assets/no-token-logo.webp'
import { CHAIN_INFO, WETH9_ADDRESS } from '../constants/abi/chainInfo'
import { createToken } from '../util/createToken'
import { getTokenLogoUrl } from '../util/getTokenLogo'
import { TokenInfo, TokenList } from './tokenList'
import { Token } from '../v3-sdk'
import { zeroAddress } from 'viem'

export interface IToken extends Token {
  logoURI: string
  isImported: boolean
}

const nullToken = (symbol: string) => {
  return {
    chainId: 1,
    address: zeroAddress,
    decimals: 18,
    name: 'UNKNOWN TOKEN',
    symbol: symbol,
    logoURI: noTokenLogo,
    isNative: false,
    isToken: true,
  } as any
}

const unknownToken = (address: string, chainID: number) => {
  return {
    chainId: chainID,
    address: address,
    decimals: 18,
    name: address.slice(0, 4) + '..' + address.slice(-4),
    symbol: 'UNKN',
    logoURI: noTokenLogo,
    isNative: false,
    isToken: false,
  } as any
}

const locallyImportedToken = (token: any): IToken => {
  return { ...token, isImported: true, isToken: true }
}

const formKey = (symbol: string, chain: number): string => {
  return `${symbol.toUpperCase()}_${chain}`
}

const indexTokenList = (t: TokenList): Map<string, TokenInfo> => {
  const o = new Map()
  t.tokens.forEach((tok) => {
    if (tok.logoURI) {
      if (tok.logoURI.includes('ipfs://')) {
        tok.logoURI = tok.logoURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
      }
    }
    o.set(formKey(tok.symbol.toUpperCase(), tok.chainId), tok)
    o.set(formKey(tok.address.toLowerCase(), tok.chainId), tok)
  })
  return o
}

const defaultTokenListIndex = indexTokenList(DefaultTokenList)

export const NewDefaultToken = (chainId: number) => {
  return getTokenByAddress('', chainId)
}

export const getTokenByAddress = (addr: string, chain: number): IToken => {
  if (CHAIN_INFO[chain] == undefined || CHAIN_INFO[chain] == null) {
    return nullToken('NO CHAIN')
  }
  if (!addr || addr == '' || addr === zeroAddress) {
    // return native token
    // TODO: pick another coin to return when other is set
    const { decimals, name, symbol } = CHAIN_INFO[chain].nativeCurrency
    const WETH9Address = WETH9_ADDRESS[chain]
    const SDKtoken = createToken({ chainId: chain, address: zeroAddress, decimals, name, symbol }) as IToken
    const logoURI = getTokenLogoUrl(WETH9Address, chain)
    SDKtoken.logoURI = logoURI || noTokenLogo //token.logoURI || noTokenLogo
    return SDKtoken
  }
  const token = defaultTokenListIndex.get(formKey(addr, chain))
  if (!token) {
    const storedToken = localStorage.getItem(`Token_${chain}_${addr}`)
    return storedToken ? locallyImportedToken(JSON.parse(storedToken)) : unknownToken(addr, chain)
  }
  const { chainId, address: tokenAddress, decimals, name, symbol } = token
  const address = tokenAddress as `0x${string}`
  const SDKtoken = createToken({ chainId, address, decimals, name, symbol }) as IToken
  SDKtoken.logoURI = token.logoURI || noTokenLogo
  return SDKtoken
}
