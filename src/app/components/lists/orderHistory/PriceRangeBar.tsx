import { colors } from '../../../constants/colors'

interface IPriceRangeBar {
  currentPrice: number
  rangeLower: number
  rangeUpper: number
  isClosed: boolean
}
function PriceRangeBar(props: IPriceRangeBar) {
  const { currentPrice, rangeLower, rangeUpper, isClosed } = props
  const width = 97
  const height = 8
  const radius = 1
  const displayFactor = 0.2
  const [lower, upper] = rangeLower < rangeUpper ? [rangeLower, rangeUpper] : [rangeUpper, rangeLower]
  const { barStartLocation, barEndLocation, currentValueLocation } = getBarInfo(
    lower,
    upper,
    currentPrice,
    width,
    displayFactor
  )
  const barWidth = barEndLocation - barStartLocation
  const maxBarWidth = width - barStartLocation
  return (
    <div className="flex items-center h-4 overflowX relative" style={{ width: width }}>
      <div
        className="absolute "
        style={{
          height: height,
          width: width,
          backgroundColor: colors.blue[800],
          borderRadius: radius,
          borderColor: colors.blue[600],
          borderWidth: ' 0.5px',
          borderStyle: 'solid',
          overflowX: 'hidden',
        }}
      ></div>
      <div
        className="absolute "
        style={{
          height: height - 2,
          maxWidth: maxBarWidth,
          width: barWidth >= width ? maxBarWidth : barWidth,
          marginLeft: barStartLocation,
          backgroundColor: isClosed ? colors.gray[700] : colors.blue[500],
        }}
      ></div>
      <div className="absolute h-3 w-[1.1px] bg-gray-50" style={{ marginLeft: currentValueLocation }} />
    </div>
  )
}

export default PriceRangeBar

const getBarInfo = (
  lowerValue: number,
  upperValue: number,
  currentValue: number,
  width: number,
  displayFactor: number
): { barStartLocation: number; barEndLocation: number; currentValueLocation: number } => {
  const currentValueAboveRangeFraction = 3 / 4
  const currentValueBelowRangeFraction = 1 / 4
  const inRangeFraction = 1 / 2
  if (lowerValue >= currentValue) {
    return calculateRangeValues(
      lowerValue,
      upperValue,
      currentValue,
      width,
      currentValueBelowRangeFraction,
      displayFactor
    )
  } else if (upperValue <= currentValue) {
    return calculateRangeValues(
      lowerValue,
      upperValue,
      currentValue,
      width,
      currentValueAboveRangeFraction,
      displayFactor
    )
  } else {
    return calculateRangeValues(lowerValue, upperValue, currentValue, width, inRangeFraction, displayFactor)
  }
}

const calculateRangeValues = (
  lowerValue: number,
  upperValue: number,
  currentValue: number,
  width: number,
  currentPricePercent: number,
  displayFactor: number
) => {
  const ratio = (1 - currentPricePercent) / currentPricePercent
  const multiplierUpper = ratio > 1 ? 1 : ratio
  const multiplierLower = ratio > 1 ? 1 / ratio : 1
  const upperDifference = Math.abs(upperValue - currentValue)
  const lowerDifference = Math.abs(currentValue - lowerValue)
  const maxOffset = upperDifference > lowerDifference ? upperDifference : lowerDifference
  const lowerOffset = (1 + displayFactor) * maxOffset * multiplierLower
  const upperOffset = (1 + displayFactor) * maxOffset * multiplierUpper
  const rangeStartValue = currentValue - lowerOffset
  const rangeEndValue = currentValue + upperOffset
  const rangeSize = rangeEndValue - rangeStartValue
  const barStartLocation = ((lowerValue - rangeStartValue) / rangeSize) * width
  const barEndLocation = ((upperValue - rangeStartValue) / rangeSize) * width
  const currentValueLocation = ((currentValue - rangeStartValue) / rangeSize) * width
  return { barStartLocation, barEndLocation, currentValueLocation }
}
