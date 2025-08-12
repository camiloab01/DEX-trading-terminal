import { CushApi } from './client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const fetchERC20Symbol = async (cush: RpcClient<CushApi>, tokenAddress: string) => {
  try {
    return cush.call('cush_erc20Symbol', [tokenAddress])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
