import { colors } from '../../constants/colors'
import useBreakpoint from '../../hooks/useBreakpoint'
import { FontWeightEnums } from '../../types/Enums'
import { ITypography } from '../../types/Interface'

const Typography = (props: ITypography) => {
  const {
    weight = FontWeightEnums.REGULAR,
    children,
    color = colors.white,
    className,
    fontSize = { base: '10px', sm: '10px', md: '10px', lg: '10px' },
    lineHeight = { base: '12px', sm: '12px', md: '12px', lg: '12px' },
  } = props
  const fontSizeValue = useBreakpoint(fontSize)
  const lineHeightValue = useBreakpoint(lineHeight)

  return (
    <div
      className={`${className} ${!color.includes('#') ? color : ''}`}
      style={{
        fontWeight: weight,
        fontSize: fontSizeValue,
        lineHeight: lineHeightValue,
        color: color && color.includes('#') ? color : undefined,
      }}
    >
      {children}
    </div>
  )
}

export const T1 = ({
  fontSize = { base: '16px', sm: '16px', md: '16px', lg: '16px' },
  lineHeight = { base: '18px', sm: '18px', md: '18px', lg: '18px' },
  ...props
}: ITypography) => <Typography {...props} fontSize={fontSize} lineHeight={lineHeight} />
export const T2 = ({
  fontSize = { base: '12px', sm: '14px', md: '14px', lg: '14px' },
  lineHeight = { base: '14px', sm: '16px', md: '16px', lg: '16px' },
  ...props
}: ITypography) => <Typography {...props} fontSize={fontSize} lineHeight={lineHeight} />
export const T3 = ({
  fontSize = { base: '12px', sm: '12px', md: '12px', lg: '12px' },
  lineHeight = { base: '14px', sm: '14px', md: '14px', lg: '14px' },
  ...props
}: ITypography) => <Typography {...props} fontSize={fontSize} lineHeight={lineHeight} />
export const T4 = ({
  fontSize = { base: '10px', sm: '10px', md: '10px', lg: '10px' },
  lineHeight = { base: '12px', sm: '12px', md: '12px', lg: '12px' },
  ...props
}: ITypography) => <Typography {...props} fontSize={fontSize} lineHeight={lineHeight} />
