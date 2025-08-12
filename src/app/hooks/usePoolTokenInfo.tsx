import { useCallback, useState } from 'react'
import equal from 'fast-deep-equal/es6/react'

export interface PoolTokenInfo {
  decimals: number
  selected: number
  sign: number
  flipped: boolean
}

export const usePoolTokenInfo = () => {
  const [token, setFullTokenRaw] = useState({
    selected: 1,
    decimals: 0,
    sign: -1,
    flipped: true,
  })

  const setFullToken = (pi: PoolTokenInfo) => {
    if (!equal(pi, token)) {
      setFullTokenRaw(pi)
    }
  }

  const setToken = useCallback(
    (n: number) => {
      if (n < 0) {
        n = token.flipped ? 1 : 0
      }
      const newToken = { selected: n, decimals: token.decimals, sign: n === 0 ? 1 : -1, flipped: n === 0 }
      setFullToken(newToken)
    },
    [token]
  )

  return {
    token,
    setToken,
    setFullToken,
  }
}
