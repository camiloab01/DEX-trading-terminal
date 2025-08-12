export const getZerosAfterDecimal = (number: number): number => -Math.floor(Math.log10(Math.abs(number)) + 1)

export const getDigitsToShow = (number: number, showOnly2Digits: boolean, removeTrailingZeros: boolean): string => {
  let digitsToShow = (Math.abs(number) * Math.pow(10, getZerosAfterDecimal(number) + 4)).toPrecision(4)
  digitsToShow = digitsToShow.includes('.')
    ? `${digitsToShow.slice(0, digitsToShow.indexOf('.'))} ${removeTrailingZeros ? '' : '000'}`
    : digitsToShow
  digitsToShow = showOnly2Digits ? digitsToShow.substring(0, digitsToShow.length - 2) : digitsToShow
  return digitsToShow
}

interface ISmallNumber {
  number: number
  showOnly2Digits?: boolean
  minimumNumber?: number
  removeTrailingZeros?: boolean
}

function SmallNumber(props: ISmallNumber) {
  const { number, showOnly2Digits = false, minimumNumber = 1e-2, removeTrailingZeros = false } = props
  const isNumberNegative = number < 0
  const isNumberSmallEnough = Math.abs(number) < minimumNumber
  return (
    <span>
      {isNumberSmallEnough && number !== 0 ? (
        <>
          <span>{isNumberNegative ? '-0.0' : '0.0'}</span>
          <sub>{`${getZerosAfterDecimal(number)}`}</sub>
          <span>{getDigitsToShow(number, showOnly2Digits, removeTrailingZeros)}</span>
        </>
      ) : (
        number
      )}
    </span>
  )
}

export default SmallNumber
