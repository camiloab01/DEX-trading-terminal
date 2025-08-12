// noinspection JSUnusedGlobalSymbols
import { Address, getAddress } from 'viem'

export interface IToken extends Token {
  logoURI: string
}

// noinspection JSUnusedGlobalSymbols
/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export abstract class BaseCurrency {
  /**
   * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
   */
  public abstract readonly isNative: boolean
  /**
   * Returns whether the currency is a token that is usable in Uniswap without wrapping
   */
  public abstract readonly isToken: boolean
  /**
   * The chain ID on which this currency resides
   */
  public readonly chainId: number
  /**
   * The decimals used in representing currency amounts
   */
  public readonly decimals: number
  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  public readonly symbol?: string
  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly name?: string
  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(chainId: number, decimals: number, symbol?: string, name?: string) {
    this.chainId = chainId
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
  /**
   * Returns whether this currency is functionally equivalent to the other currency
   * @param other the other currency
   */
  public abstract equals(other: Currency): boolean
  /**
   * Return the wrapped version of this currency that can be used with the Uniswap contracts. Currencies must
   * implement this to be used in Uniswap
   */
  public abstract get wrapped(): Token
}

// noinspection JSUnusedGlobalSymbols
export class Token extends BaseCurrency {
  public readonly isNative: false = false as const
  public readonly isToken: true = true as const
  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: Address
  /**
   *
   * @param chainId {@link BaseCurrency#chainId}
   * @param address The contract address on the chain on which this token lives
   * @param decimals {@link BaseCurrency#decimals}
   * @param symbol {@link BaseCurrency#symbol}
   * @param name {@link BaseCurrency#name}
   * @param bypassChecksum If true it only checks for length === 42, startsWith 0x and contains only hex characters
   */
  public constructor(chainId: number, address: string, decimals: number, symbol?: string, name?: string) {
    super(chainId, decimals, symbol, name)
    this.address = getAddress(address)
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return other.isToken && this.chainId === other.chainId && this.address === other.address
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Token {
    return this
  }
}

export abstract class NativeCurrency extends BaseCurrency {
  public readonly isNative: true = true as const
  public readonly isToken: false = false as const
}

export type Currency = NativeCurrency | Token
