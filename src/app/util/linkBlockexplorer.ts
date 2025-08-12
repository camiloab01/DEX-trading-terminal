import { CHAIN_INFO } from '../constants/abi/chainInfo'

export function linkExplorer(type: string, value: string, chainID: number): string {
  return [CHAIN_INFO[chainID].blockExplorers?.default.url, type, value].join('/')
}

export function blockExplorerName(chainID: number): string {
  const explorers = CHAIN_INFO[chainID].blockExplorers
  return explorers != undefined ? explorers.default.name : 'UNDEFINED'
}
