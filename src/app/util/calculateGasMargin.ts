import { Address, Hex, PublicClient, SendTransactionParameters, WalletClient, zeroAddress } from 'viem'

/**
 * Returns the gas value plus a margin (30%) for unexpected or variable gas costs
 * @param value the gas value to pad
 */
export function calculateGasMargin(value: bigint): bigint {
  return (value * 130n) / 100n
}

export async function updateGasMargin(provider: PublicClient, transaction: SendTransactionParameters) {
  // build transaction
  const gasLimit = await provider.estimateGas(transaction)
  const gasMargin = calculateGasMargin(gasLimit)
  transaction.gas = gasMargin
  return transaction
}

export async function sendEncodedFunctionData(
  provider: PublicClient,
  signer: WalletClient,
  target: Address,
  data: Hex,
  options?: {
    value?: bigint
  }
) {
  const gasMargin = await updateGasMargin(provider, {
    to: target,
    data: data,
    chain: signer.chain,
    account: signer.account?.address || zeroAddress,
    value: options?.value,
  })

  return signer.sendTransaction(gasMargin)
}
