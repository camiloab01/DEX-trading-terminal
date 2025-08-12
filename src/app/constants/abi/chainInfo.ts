import { MAINNET_CHAINS as chains } from '@gfxlabs/oku-chains'

export const CHAINS_LIST = Object.values(chains)

export const WETH9_ADDRESS = Object.fromEntries(CHAINS_LIST.map((obj) => [obj.id, obj.contracts.weth9.address]))

export const CHAIN_INFO = Object.fromEntries(CHAINS_LIST.map((obj) => [obj.id, obj]))

const idMap = Object.fromEntries(CHAINS_LIST.map((obj) => [obj.internalName, obj.id]))

export const getChainIdFromName = (name = 'ethereum') => {
  return idMap[name.toLowerCase()] ? idMap[name.toLowerCase()] : 0
}

export const isValidChain = (chain: number) => typeof CHAIN_MAP_ID[chain.toString()] !== 'undefined'
export const isValidChainName = (chain?: string) => {
  if (!chain) {
    return false
  }
  return typeof CHAIN_MAP_INTERNALNAME[chain] !== 'undefined'
}
export const CHAIN_MAP_INTERNALNAME = Object.fromEntries(
  Object.values(CHAIN_INFO).map((x) => {
    return [x.internalName, x]
  })
)

export const CHAIN_MAP_ID = Object.fromEntries(
  Object.values(CHAIN_INFO).map((x) => {
    return [x.id.toString(), x]
  })
)

export const isStableCoin = (networkId: number, address: string) => {
  return CHAIN_INFO[networkId].stables.some((x) => x.toLowerCase() === address.toLowerCase())
}

export const isWrappedNativeToken = (networkId: number, address: string) => {
  return WETH9_ADDRESS[networkId].toLowerCase() === address.toLowerCase()
}
