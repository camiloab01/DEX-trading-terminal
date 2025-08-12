import { getTokenByAddress, IToken } from '../lib/getToken'

interface Tokens {
  token0: IToken
  token1: IToken
}

export const getTokenLogos = (tokens: Tokens, chain: number) => {
  tokens.token0.logoURI = getTokenByAddress(tokens.token0.address, chain).logoURI
  tokens.token1.logoURI = getTokenByAddress(tokens.token1.address, chain).logoURI
  return { ...tokens }
}

export const getTokenLogoUrl = (token_address: string, chain: number) => {
  return getTokenByAddress(token_address, chain).logoURI
}
