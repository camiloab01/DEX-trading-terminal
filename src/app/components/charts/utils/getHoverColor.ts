import { colors, opacity } from '../../../constants/colors'

const rgb2hex = (color: number[]) =>
  '#' +
  color
    .map((item) => {
      const hex = item.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    })
    .join('')
const addHover2Color = (background: RegExpMatchArray, overlay: RegExpMatchArray, opacity: number) => {
  const hex2rgb = (color: RegExpMatchArray) => {
    return [parseInt(color[0], 16), parseInt(color[1], 16), parseInt(color[2], 16)]
  }
  const newColor1 = hex2rgb(background)
  const newColor2 = hex2rgb(overlay)
  const target1 = newColor1.map((item) => item * opacity)
  const target2 = newColor2.map((item) => item * (1 - opacity))
  const sum = target1.map((num, idx) => {
    return Math.round(num + target2[idx])
  })
  return rgb2hex(sum)
}

export const getHoverColor = (background: string) => {
  const overlay = colors.hover
  const backgroundConvert = background.slice(-6).match(/.{1,2}/g)
  const overlayConvert = overlay.slice(-6).match(/.{1,2}/g)
  return backgroundConvert && overlayConvert
    ? addHover2Color(backgroundConvert, overlayConvert, Number(opacity.hover))
    : colors.black
}
