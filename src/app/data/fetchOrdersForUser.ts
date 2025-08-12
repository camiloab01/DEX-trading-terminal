import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchOrdersForUsers = async (cush: RpcClient<CushApi>, walletAddress: `0x${string}`) => {
  if (!walletAddress) return []
  try {
    return cush.call('cush_ordersForUser', [walletAddress])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
