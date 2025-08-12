// Definition: Interfaces for canoe

interface TransactionPayload {
  chainId?: number
  accessList?: Record<string, any>
  value?: string
  to?: string
  data?: string
}

interface ApprovalPayload {
  chainId?: number
  approvee: string
  address: string
  amount: string
}

export interface ExecutionInformation {
  approvals?: Array<ApprovalPayload>
  transactions?: Array<TransactionPayload>
  trade: TransactionPayload
  extra?: Record<string, any>
}

interface PermitDetails {
  token: string
  amount: string
  expiration: string
  nonce: string
}

interface PermitSingle {
  details: PermitDetails
  spender: string
  sigDeadline: string
}

interface PermitSignature {
  permit: PermitSingle
  signature: string
}

interface RawTypedData {
  domain: Record<string, any>
  values: Record<string, any>
}

interface TypedDataSignature {
  payload: RawTypedData
  signature?: string
}

interface SigningRequest {
  typedData?: Array<TypedDataSignature>
  permit2Address?: string
  permitSignature?: Array<PermitSignature>
}

interface TokenMetadata {
  chainId: number
  address: string
  name?: string
  symbol?: string
  decimals: number
}

interface TradePath {
  dexCode: string
  swapToken: string
  inAmount: string
  outAmount: string
}

export type PriceQuoteWithMarket = {
  market: string
  chainId: number
  isExactIn: boolean
  inToken: TokenMetadata
  outToken: TokenMetadata
  inAmount: string
  outAmount: string
  inUsdValue: number
  outUsdValue: number
  humanPrice: number
  candidateTrade?: TransactionPayload
  slippage: number
  coupon: Record<string, any>
  signingRequest?: SigningRequest
  estimatedGas?: string
  path?: Array<TradePath>
  extra?: Record<string, any>
}
