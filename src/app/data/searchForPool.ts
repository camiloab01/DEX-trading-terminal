import { CushApi, SearchResponse } from './client'
import { search } from './search_pools'
import { RpcClient } from '@gfxlabs/jsrpc'

export const searchForPool = async (cush: RpcClient<CushApi>, searchQuery: string): Promise<SearchResponse> => {
  try {
    return await search(cush, searchQuery)
  } catch (err) {
    const error = err as Error
    window.log.error(error)
    throw new Error(error.message)
  }
}
