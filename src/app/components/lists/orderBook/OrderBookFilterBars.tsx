import { colors } from '../../../constants/colors'
const ColorfulBars = ({
  topColor = colors.gray[600],
  middleColor = colors.gray[600],
  bottomColor = colors.gray[600],
}: {
  topColor?: string
  middleColor?: string
  bottomColor?: string
}) => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.68457 5C2.68457 4.44772 3.02664 4 3.44862 4H12.6172C13.0391 4 13.3812 4.44772 13.3812 5C13.3812 5.55228 13.0391 6 12.6172 6H3.44862C3.02664 6 2.68457 5.55228 2.68457 5Z"
      fill={topColor}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.68457 10C2.68457 9.44772 3.02664 9 3.44862 9H12.6172C13.0391 9 13.3812 9.44772 13.3812 10C13.3812 10.5523 13.0391 11 12.6172 11H3.44862C3.02664 11 2.68457 10.5523 2.68457 10Z"
      fill={middleColor}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.68457 15C2.68457 14.4477 3.02664 14 3.44862 14H12.6172C13.0391 14 13.3812 14.4477 13.3812 15C13.3812 15.5523 13.0391 16 12.6172 16H3.44862C3.02664 16 2.68457 15.5523 2.68457 15Z"
      fill={bottomColor}
    />
  </svg>
)
export default ColorfulBars
