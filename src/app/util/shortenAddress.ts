const shortenAddress = (x?: string, numOfCharsAfter0x = 2) => {
  if (!x) {
    return ''
  }
  if (x.length > 10) {
    return x.substring(0, 2 + numOfCharsAfter0x) + '...' + x.slice(-4)
  }
  return x
}
export default shortenAddress
