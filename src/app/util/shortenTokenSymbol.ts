export const shortenTokenSymbol = (symbol: string, maxChars = 6): string =>
  symbol.length <= maxChars ? symbol : `${symbol.slice(0, maxChars)}...`
