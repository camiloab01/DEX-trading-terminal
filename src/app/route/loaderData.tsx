import { OmniCush } from '../context/RpcContext'
import { CHAIN_INFO, getChainIdFromName } from '../constants/abi/chainInfo'
import { useRouteLoaderData } from 'react-router-dom'

export const useChainLoader = (): Awaited<ReturnType<typeof chainDataLoader>> => {
  const parentData = useRouteLoaderData('parent')
  const childData = useRouteLoaderData('chain')
  return childData ? (childData as any) : (parentData as any)
}
export const chainDataLoader = (omniCush: OmniCush, { params, request }: any) => {
  const url = new URL(request.url)
  const swapChain = url.searchParams.get('swap_chain')

  const chain = swapChain || params.chain || 'ethereum'
  const chainID = getChainIdFromName(chain)
  const currentChainInfo = CHAIN_INFO[chainID] != undefined ? CHAIN_INFO[chainID] : CHAIN_INFO[1]
  const cushRpc = omniCush.network(currentChainInfo.internalName)
  return {
    currentChain: chainID,
    chain,
    cushRpc,
    currentChainInfo,
    chainID,
    omniCush,
    isOmniChain: params.chain === undefined,
  }
}
