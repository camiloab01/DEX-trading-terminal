import { colors } from '../../../../constants/colors.ts'
import { useEffect, useState } from 'react'
import { T3 } from '../../../typography/Typography.tsx'
import { FontWeightEnums } from '../../../../types/Enums.ts'
import PriceLoader from './PriceLoader.tsx'
import { formatNumber } from '../../../numbers/FormatNumber.tsx'
import FlipTokenPrice from '../../../buttons/FlipTokenPrice.tsx'
import { PriceQuoteWithMarket } from '../../../../types/canoe'

export const PriceFlipper = ({
  route,
  loading,
  color = colors.gray[50],
  hoverColor = colors.gray[400],
}: {
  loading?: boolean
  color?: string
  hoverColor?: string
  route?: PriceQuoteWithMarket
}) => {
  const [flipTokens, setFlipTokens] = useState(false)
  const [price, setPrice] = useState(0)
  const [token0Symbol, setToken0Symbol] = useState<string>()
  const [token1Symbol, setToken1Symbol] = useState<string>()

  useEffect(() => {
    if (route && route.humanPrice >= 1 / route.humanPrice && route.isExactIn) {
      setToken0Symbol(route.inToken.symbol)
      setToken1Symbol(route.outToken.symbol)
      setPrice(route.humanPrice)
    } else if (route && route.humanPrice >= 1 / route.humanPrice && !route.isExactIn) {
      setToken0Symbol(route.outToken.symbol)
      setToken1Symbol(route.inToken.symbol)
      setPrice(route.humanPrice)
    } else if (route && route.humanPrice < 1 / route.humanPrice && route.isExactIn) {
      setToken0Symbol(route.outToken.symbol)
      setToken1Symbol(route.inToken.symbol)
      setPrice(1 / route.humanPrice)
    } else if (route && route.humanPrice < 1 / route.humanPrice && !route.isExactIn) {
      setToken0Symbol(route.inToken.symbol)
      setToken1Symbol(route.outToken.symbol)
      setPrice(1 / route.humanPrice)
    } else {
      setToken0Symbol('')
      setToken1Symbol('')
    }
  }, [route?.isExactIn, route?.humanPrice])

  useEffect(() => {
    if (token0Symbol && token1Symbol) {
      setPrice(1 / price)
      setToken0Symbol(token1Symbol)
      setToken1Symbol(token0Symbol)
    }
  }, [flipTokens])

  return (
    <div className="flex flex-row gap-1 items-center">
      <T3 weight={FontWeightEnums.REGULAR} color={color}>
        {loading ? (
          <PriceLoader />
        ) : (
          <div className="flex flex-row">
            <div>≈ {route === undefined ? '...' : formatNumber({ num: price })} </div>
            <div className="flex gap-1 ml-1">
              {token0Symbol} / {token1Symbol}
            </div>
          </div>
        )}
      </T3>
      <FlipTokenPrice
        color={color}
        hoverColor={hoverColor}
        onClick={(e) => {
          e.stopPropagation()
          setFlipTokens(!flipTokens)
        }}
      />
    </div>
  )
}
