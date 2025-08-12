import { CushApi, PoolSummary, SearchFilterOpts } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export type IPoolSummary = PoolSummary
export const searchPoolsByList = async (cush: RpcClient<CushApi>, token_list: string[]) => {
  try {
    return cush.call('cush_searchPoolsByList', [token_list])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}

export const search = async (cush: RpcClient<CushApi>, term: string) => {
  const opts: SearchFilterOpts = {
    fee_tiers: [],
    result_offset: 0,
    sort_by: 'tvl_usd',
    result_size: 20,
    sort_order: false,
  }
  try {
    return cush.call('cush_search', [term, opts])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
