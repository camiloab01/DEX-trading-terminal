import { DEFAULT_LOCALE } from '../../constants/locales'
import SmallNumber, { getDigitsToShow, getZerosAfterDecimal } from './SmallNumber'

interface IFormatNumber {
  num: number | string
  smallNumberOn2Zeros?: boolean
  belowOneDecimalAmount?: number
  aboveOneDecimalAmount?: number
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
}

interface IFormatNumberByGranularity {
  num: number
  granularity: number
}

export const updateFormatNotation = (
  num: number,
  aboveOneDecimalAmount: number,
  belowOneDecimalAmount: number,
  notation: 'standard' | 'scientific' | 'engineering' | 'compact' | undefined
) => {
  const numberFormatOptions = {
    maximumFractionDigits: Math.abs(num) < 1 ? belowOneDecimalAmount : aboveOneDecimalAmount,
    minimumFractionDigits: Math.abs(num) < 1 ? belowOneDecimalAmount : aboveOneDecimalAmount,
    notation:
      notation === undefined
        ? Math.abs(num) >= Math.pow(10, 15)
          ? 'scientific'
          : Math.abs(num) > Math.pow(10, 4)
            ? 'compact'
            : 'standard'
        : notation,
  } as Intl.NumberFormatOptions
  return numberFormatOptions
}

export const formatNumber = (props: IFormatNumber) => {
  const { smallNumberOn2Zeros = false, aboveOneDecimalAmount = 2, belowOneDecimalAmount = 6, notation } = props
  let { num } = props
  if (typeof num === 'string') num = Number(num)
  if (num === 0) return belowOneDecimalAmount === 0 ? '0' : '0.00'
  if (isNaN(num)) return ''
  const numberFormatOptions = updateFormatNotation(num, aboveOneDecimalAmount, belowOneDecimalAmount, notation)
  if (Math.abs(num) < 0.000001 || (smallNumberOn2Zeros && Math.abs(num) < 0.01)) {
    return `${num < 0 ? '-0.0' : '0.0'}(${getZerosAfterDecimal(num)})${getDigitsToShow(num, belowOneDecimalAmount === 2, false)}`
  }
  const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, numberFormatOptions).format(num)
  return formatted
}

export const FormattedNumber = (props: IFormatNumber) => {
  const { smallNumberOn2Zeros = false, aboveOneDecimalAmount = 2, belowOneDecimalAmount = 6, notation } = props
  let { num } = props
  if (typeof num === 'string') num = Number(num)
  if (num === 0) return belowOneDecimalAmount === 0 ? <>0</> : <>0.00</>
  if (isNaN(num)) return <></>
  const numberFormatOptions = updateFormatNotation(num, aboveOneDecimalAmount, belowOneDecimalAmount, notation)
  if (Math.abs(num) < 0.000001 || (smallNumberOn2Zeros && Math.abs(num) < 0.01)) {
    return SmallNumber({ number: num, showOnly2Digits: belowOneDecimalAmount === 2 })
  }
  const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, numberFormatOptions).format(num)
  return <>{formatted}</>
}

export const FormatByGranularity = (props: IFormatNumberByGranularity) => {
  const { granularity } = props
  const { num } = props
  if (num === 0) return <>{'0.00'}</>
  if (!num || isNaN(num)) return <></>
  if (num < 0.000001) return <SmallNumber number={num} />

  let formatted: string
  if (num >= 0.0000001 && num <= 0.001) return <>{num.toFixed(granularity < 0 ? Math.abs(granularity) : 0)}</>
  else if (num >= 0.00001 && num < 0.1) return <>{num.toFixed(granularity < 0 ? Math.abs(granularity) : 0)}</>
  else if (num >= 0.1 && num < 1000000) formatted = num.toFixed(4)
  else if (num >= Math.pow(10, 4)) formatted = num.toExponential(2)
  else formatted = `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 0 })}`

  return (
    <>
      {granularity < 0 ? Number(formatted).toFixed(Math.abs(granularity)) : <FormattedNumber num={Number(formatted)} />}
    </>
  )
}

export const convertFromSciNot = (number: number) => {
  if (!number.toString().includes('e')) return number.toString()
  const decimalsPart = number.toString().split('.')?.[1] || ''
  const eDecimals = Number(decimalsPart?.split('e-')?.[1]) || 0
  const countOfDecimals = decimalsPart.length + eDecimals
  return Number(number).toFixed(countOfDecimals)
}
