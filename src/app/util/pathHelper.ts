/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param poolAddress address of the pool
 * @param currentChain current chain selected
 */
export function liquidityPath(poolAddress: string, currentChain: string): string {
  return `/app/${currentChain.replace(' ', '').toLowerCase()}/liquidity/${poolAddress}`
}

/**
 * Given the protocol address and the chain, returns the url for the liquidity
 * @param currentChain current chain selected
 */
export function orderPath(currentChain: string): string {
  return `/app/${currentChain.replace(' ', '').toLowerCase()}/order`
}
