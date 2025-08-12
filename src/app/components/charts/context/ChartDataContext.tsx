import { ChartEnums } from '../../../types/Enums'
import React, { createContext, useContext, useState } from 'react'

interface IChartDataContext {
  timeInterval: number
  setTimeInterval: (value: number) => void
  chartType: ChartEnums
  setChartType: (value: ChartEnums) => void
  loadingCharts: boolean
  setLoadingCharts: (value: boolean) => void
  highlightBounds: { lower: number; upper: number } | undefined
  setHighlightBounds: React.Dispatch<
    React.SetStateAction<
      | {
          lower: number
          upper: number
        }
      | undefined
    >
  >
  clear: boolean
  setClear: (value: boolean) => void
}

const ChartDataContext = createContext({} as IChartDataContext)

interface IContext {
  children: React.ReactNode
}

export const ChartDataContextProvider = (props: IContext) => {
  const { children } = props
  const [timeInterval, setTimeInterval] = useState<number>(3) // 1hr
  const [chartType, setChartType] = useState<ChartEnums>(ChartEnums.TRADINGVIEW)
  const [loadingCharts, setLoadingCharts] = useState<boolean>(false)
  const [clear, setClear] = useState<boolean>(false)
  const [hoverBounds, setHoverBoundsRaw] = useState<{ lower: number; upper: number } | undefined>(undefined)
  const setHoverBounds = (
    v: React.SetStateAction<
      | {
          lower: number
          upper: number
        }
      | undefined
    >
  ) => {
    let w = v
    if (typeof v !== 'function' && v && v.upper < v.lower) {
      w = {
        upper: v.lower,
        lower: v.upper,
      }
    }
    if (typeof w !== 'function' && w) {
      w.upper = Math.round(w.upper)
      w.lower = Math.round(w.lower)
    }
    setHoverBoundsRaw(w)
  }

  return (
    <ChartDataContext.Provider
      value={{
        timeInterval,
        setTimeInterval,
        chartType,
        setChartType,
        loadingCharts,
        setLoadingCharts,
        highlightBounds: hoverBounds,
        setHighlightBounds: setHoverBounds,
        clear,
        setClear,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  )
}

export const useChartDataContext = () => useContext(ChartDataContext)
