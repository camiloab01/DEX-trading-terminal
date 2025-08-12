import { colors } from '../constants/colors'
import { getLocalStorageItem, setLocalStorageItem } from '../lib/localStorage'
import { ChartSizeEnums, LayoutEnums, ThemeEnums } from '../types/Enums'
import { IChart } from '../types/Interface'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { IconContext } from 'react-icons'

export interface Colors {
  pos_color: string
  neg_color: string
  neg_vol_color: string
  pos_vol_color: string
  background_gradient: string
}

interface IThemeContext {
  colorScheme: ThemeEnums
  setColorScheme: (value: ThemeEnums) => void
  appLayout: LayoutEnums
  setAppLayout: (value: LayoutEnums) => void
  chart: IChart
  setChart: (value: IChart) => void
  colors: Colors
}

const ColorDict = {
  [ThemeEnums.DEFAULT]: {
    neg_color: colors.red[350],
    pos_color: colors.green[400],
    neg_vol_color: colors.red[700],
    pos_vol_color: colors.green[800],
    background_gradient: colors.gray[900],
  },
  [ThemeEnums.UNICORN_POWER]: {
    neg_color: colors.pink[400],
    pos_color: colors.blue.vibrant,
    neg_vol_color: colors.pink[700],
    pos_vol_color: colors.blue[600],
    background_gradient: colors.pink[400],
  },
  [ThemeEnums.ACCESSIBLE]: {
    neg_color: colors.orange.accesible,
    pos_color: colors.blue.accessible,
    neg_vol_color: colors.yellow[600],
    pos_vol_color: colors.blue.accessible,
    background_gradient: colors.orange.accesible,
  },
  [ThemeEnums.GALACTIC]: {
    neg_color: colors.blue[400],
    pos_color: colors.green[400],
    neg_vol_color: colors.blue.accessible,
    pos_vol_color: colors.green[500],
    background_gradient: colors.green['vibrant'],
  },
}

const initChart = { size: ChartSizeEnums.DEFAULT }

const ThemeContext = createContext<IThemeContext>({
  colorScheme: ThemeEnums.DEFAULT,
  setColorScheme: () => undefined,
  appLayout: LayoutEnums.DEFAULT,
  setAppLayout: () => undefined,
  chart: initChart,
  setChart: () => undefined,
  colors: ColorDict[ThemeEnums.DEFAULT],
})

interface IContext {
  children: React.ReactNode
}

export const ThemeContextProvider = (props: IContext) => {
  const { children } = props
  const appLayoutDefault = getLocalStorageItem('appLayout')
  const colorSchemeDefault = getLocalStorageItem('colorScheme')
  const [colorScheme, setColorScheme] = useState<ThemeEnums>(colorSchemeDefault || ThemeEnums.DEFAULT)
  const [appLayout, setAppLayout] = useState<LayoutEnums>(appLayoutDefault || LayoutEnums.DEFAULT)
  const [chart, setChart] = useState<IChart>(initChart)
  const [colors, setColors] = useState(ColorDict[colorScheme])

  useEffect(() => {
    setColors(ColorDict[colorScheme])
    setLocalStorageItem('colorScheme', colorScheme)
  }, [colorScheme])

  useEffect(() => {
    setLocalStorageItem('appLayout', appLayout)
  }, [appLayout])

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        appLayout,
        setAppLayout,
        chart,
        setChart,
        colors,
      }}
    >
      <IconContext.Provider value={{ color: 'white', className: '' }}>{children}</IconContext.Provider>
    </ThemeContext.Provider>
  )
}
export const useThemeContext = () => useContext(ThemeContext)
