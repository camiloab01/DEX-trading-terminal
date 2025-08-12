import { ChartSizeEnums, FontWeightEnums } from './Enums'
import React from 'react'

export interface IChart {
  size: ChartSizeEnums
}

export interface IFontSizeAndLineHeight {
  base: string
  sm: string
  md?: string
  lg?: string
}

export interface ITypography {
  weight?: FontWeightEnums | string
  children: React.ReactNode
  color?: string
  className?: string
  fontSize?: IFontSizeAndLineHeight
  lineHeight?: IFontSizeAndLineHeight
}
