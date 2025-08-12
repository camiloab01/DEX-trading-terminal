import { IToken } from '../lib/getToken'
import React, { createContext, useContext, useState } from 'react'

interface ISwapPageContext {
  token0: IToken | undefined
  setToken0: React.Dispatch<React.SetStateAction<IToken | undefined>>
  token1: IToken | undefined
  setToken1: React.Dispatch<React.SetStateAction<IToken | undefined>>
  flip: boolean
  setFlip: React.Dispatch<React.SetStateAction<boolean>>
}

const SwapPageContext = createContext({} as ISwapPageContext)

export const SwapPageContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [token0, setToken0] = useState<IToken | undefined>(undefined)
  const [token1, setToken1] = useState<IToken | undefined>(undefined)
  const [flip, setFlip] = useState(true)

  return (
    <SwapPageContext.Provider value={{ token0, setToken0, token1, setToken1, flip, setFlip }}>
      {children}
    </SwapPageContext.Provider>
  )
}

export const useSwapPageContext = () => useContext(SwapPageContext)
