export const tickerToString = (ticker: string | Array<number> | undefined): string | undefined => {
  if (!ticker?.length) return undefined
  const hex = ticker.toString() //force conversion
  let str = ''
  for (let i = 2; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16)
    if (byte === 0) {
      break
    }
    str += String.fromCharCode(byte)
  }
  return str
}
