import tailwindConfig from '../../../tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

export const colors = fullConfig.theme?.colors
export const opacity = fullConfig.theme?.opacity
