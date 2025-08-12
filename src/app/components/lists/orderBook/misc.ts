export const orderBookSize = (size: string, decimals: number) => Number(parseFloat(size) * 10 ** -decimals)
export const orderBookTotal = (size: string, price: string, amountDecimals: number, priceDecimals: number) =>
  orderBookSize(size, amountDecimals) * (Number(price) * 10 ** -priceDecimals)
export const createBarBackground = (pct: number, bgColor: string) => {
  return `linear-gradient(90deg, rgba(255,0,0,0) 0%, rgba(255,0,0,0) ${100 - pct}%, ${bgColor} ${
    100 - Math.floor((pct * 5) / 8)
  }%, ${bgColor} 100%)`
}
