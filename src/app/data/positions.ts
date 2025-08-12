import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchPositions = async (
  cush: RpcClient<CushApi>,
  {
    user_address,
    pool_address,
    token_id,
  }: { user_address?: string | `0x${string}`; pool_address?: string; token_id?: number }
) => {
  try {
    const payload: any = { limit: 0 }
    if (user_address) {
      payload.user = user_address
    }
    if (pool_address) {
      payload.pool = pool_address
    }
    if (token_id != undefined) {
      payload.token_id = token_id
    }
    return cush.call('cush_getPositions', [payload])
  } catch (err) {
    const error = err as Error
    throw new Error(error.message)
  }
}
