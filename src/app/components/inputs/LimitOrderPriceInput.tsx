import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { getNearestTick, getPriceFromTick, getTickFromPrice, getTickSpacing } from '../../util/calculateTick'
import { useDataContext } from '../../context/DataContext'
import LimitOrderPriceInputToolTip from '../tooltip/LimitOrderPriceInputToolTip'
import NumberInput from './NumberInput'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { convertFromSciNot } from '../numbers/FormatNumber'
import IncrementButton from '../buttons/IncrementButton'
import { useDebounceCallback } from 'usehooks-ts'
import { useLimitQuoteQueryParam } from '../../hooks/useQueryParams'
import { TokenSymbol } from '../misc/TokenSymbol'

interface ILimitOrderPriceInput {
  disabled?: boolean
  tick: null | number
  setTick: React.Dispatch<React.SetStateAction<number | null>>
  onPriceEntered: (value: string) => void
  isPreferredTokenOrder: boolean
}

interface IPoolTickInfo {
  tick: number
  upperBound: number
  lowerBound: number
  spacing: number
}

function LimitOrderPriceInput(props: ILimitOrderPriceInput) {
  const { disabled = false, isPreferredTokenOrder, setTick, onPriceEntered } = props
  const [hover, setHover] = useState(false)
  const { token0, token1, poolSummary, token: selectedToken, liquidityChart } = useDataContext()
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [placeholder, setPlaceholder] = useState<string>('')
  const [showPriceToolTip, setShowPriceToolTip] = useState(false)
  const [disableMinus, setDisableMinus] = useState(false)
  const [disablePlus, setDisablePlus] = useState(false)
  const [userTargetTick, setUserTargetTick] = useState<number | null>(null)
  const isQuoteFlipped = selectedToken.selected !== 0
  const [poolTickInfo, setPoolTickInfo] = useState<undefined | IPoolTickInfo>(undefined)
  const TICK_BOUNDARY_SIZE = 2
  const [limitQuoteQuery] = useLimitQuoteQueryParam('limitQuote')

  const debounced = useDebounceCallback((value) => {
    if (!liquidityChart || !poolTickInfo) return
    const tick = getTick(parseFloat(value))
    if (tick == undefined) return
    const validTick = nudgeTargetTick(tick, poolTickInfo, isPreferredTokenOrder)
    setUserTargetTick(validTick)
    setTick(validTick)
    const userTargetTickPrice = getPrice(validTick)
    if (userTargetTickPrice !== undefined) {
      onPriceEntered(convertFromSciNot(userTargetTickPrice))
      setValue(convertFromSciNot(userTargetTickPrice))
    }
  }, 1000)
  useEffect(() => {
    if (userTargetTick === null || !poolTickInfo) return
    if (userTargetTick < poolTickInfo.upperBound && userTargetTick + poolTickInfo.spacing > poolTickInfo.lowerBound)
      isQuoteFlipped ? setDisablePlus(true) : setDisableMinus(true)
    else isQuoteFlipped ? setDisablePlus(false) : setDisableMinus(false)
  }, [userTargetTick, poolTickInfo]),
    useEffect(() => {
      if (!limitQuoteQuery) {
        setValue('')
      }
    }, [token0, token1, isQuoteFlipped, poolSummary?.fee, liquidityChart?.pool, isPreferredTokenOrder])
  useEffect(() => {
    setUserTargetTick(null)
    if ((isPreferredTokenOrder && isQuoteFlipped) || (!isPreferredTokenOrder && !isQuoteFlipped)) {
      setDisablePlus(true)
      setDisableMinus(false)
    } else {
      setDisableMinus(true)
      setDisablePlus(false)
    }
  }, [isQuoteFlipped, isPreferredTokenOrder, token0, token1, poolSummary?.fee, liquidityChart?.pool])
  useEffect(() => {
    if (value === '') debounced.cancel()
  }, [value])
  useEffect(() => {
    if (userTargetTick === null || !poolTickInfo) return
    if (userTargetTick > poolTickInfo.lowerBound && userTargetTick - poolTickInfo.spacing < poolTickInfo.upperBound)
      isQuoteFlipped ? setDisableMinus(true) : setDisablePlus(true)
    else isQuoteFlipped ? setDisableMinus(false) : setDisablePlus(false)
  }, [userTargetTick])
  useEffect(() => {
    if (poolSummary == undefined || liquidityChart == undefined) return
    setPoolTickInfo({
      tick: liquidityChart.current_pool_tick,
      upperBound: getNearestTick(
        liquidityChart.current_pool_tick + getTickSpacing(poolSummary.fee) * TICK_BOUNDARY_SIZE,
        getTickSpacing(poolSummary.fee)
      ),
      lowerBound: getNearestTick(
        liquidityChart.current_pool_tick - getTickSpacing(poolSummary.fee) * TICK_BOUNDARY_SIZE,
        getTickSpacing(poolSummary.fee)
      ),
      spacing: getTickSpacing(poolSummary.fee),
    })
  }, [isQuoteFlipped, isPreferredTokenOrder, poolSummary, liquidityChart, token0, token1, value])
  useEffect(() => {
    if (liquidityChart == undefined || poolSummary == undefined) return
    const currentPrice = getPrice(liquidityChart.current_pool_tick)
    if (currentPrice !== undefined && placeholder !== convertFromSciNot(currentPrice)) {
      setPlaceholder('Fetching price...')
      setTimeout(() => {
        currentPrice && setInitialPlaceHolder(currentPrice)
        if (limitQuoteQuery) onInput(limitQuoteQuery)
      }, 1000)
    }
  }, [liquidityChart?.pool, liquidityChart?.tick_spacing, poolSummary, placeholder])

  const nudgeTargetTick = (tick: number, poolTickInfo: IPoolTickInfo, isFlipped: boolean): number => {
    if (poolTickInfo == undefined) return tick
    if (!isFlipped) return tick < poolTickInfo.upperBound ? poolTickInfo.upperBound : tick
    else return tick > poolTickInfo.lowerBound ? poolTickInfo.lowerBound : tick
  }
  const setInitialPlaceHolder = (currentPrice: number) => {
    if (liquidityChart) {
      setPlaceholder(currentPrice ? convertFromSciNot(currentPrice) : '')
    } else setPlaceholder('')
  }
  const incrementTick = () => {
    if (!poolTickInfo) return
    const increment = isQuoteFlipped ? poolTickInfo.spacing : -poolTickInfo.spacing
    const boundary = isQuoteFlipped ? poolTickInfo.upperBound : poolTickInfo.lowerBound
    if (userTargetTick === null) {
      const newTick = getNearestTick(boundary, poolTickInfo.spacing)
      const newPrice = getPrice(newTick)
      if (newPrice !== undefined) {
        setValue(convertFromSciNot(newPrice))
        onPriceEntered(convertFromSciNot(newPrice))
      }
      setUserTargetTick(newTick)
      setTick(newTick)
      return
    }
    const newTick = getNearestTick(userTargetTick + increment, poolTickInfo.spacing)
    const newPrice = getPrice(newTick)
    if (newPrice !== undefined) {
      setValue(convertFromSciNot(newPrice))
      onPriceEntered(convertFromSciNot(newPrice))
    }
    setUserTargetTick(newTick)
    setTick(newTick)
    return
  }

  const decrementTick = () => {
    if (!poolTickInfo) return
    const increment = isQuoteFlipped ? poolTickInfo.spacing : -poolTickInfo.spacing
    const boundary = isQuoteFlipped ? poolTickInfo.lowerBound : poolTickInfo.upperBound
    if (userTargetTick === null) {
      const newTick = getNearestTick(boundary, poolTickInfo.spacing)
      const newPrice = getPrice(newTick)
      if (newPrice !== undefined) {
        setValue(convertFromSciNot(newPrice))
        onPriceEntered(convertFromSciNot(newPrice))
      }
      setUserTargetTick(newTick)
      setTick(newTick)
      return
    }
    const newTick = getNearestTick(userTargetTick - increment, poolTickInfo.spacing)
    const newPrice = getPrice(newTick)
    if (newPrice !== undefined) {
      setValue(convertFromSciNot(newPrice))
      onPriceEntered(convertFromSciNot(newPrice))
    }
    setUserTargetTick(newTick)
    setTick(newTick)
  }
  const onInput = (value: string) => {
    setFocus(true)
    setValue(value)
    debounced(value)
  }
  const getTick = (price: number) => {
    if (token0 == undefined || token1 == undefined || poolTickInfo == undefined) return null
    const tick = getTickFromPrice(price, token0?.decimals, token1?.decimals, isQuoteFlipped)
    const newTick = getNearestTick(tick, poolTickInfo?.spacing)
    return newTick
  }
  const getPrice = (newTick: number) => {
    if (token0 !== undefined && token1 !== undefined) {
      const price = getPriceFromTick(newTick, token0?.decimals, token1?.decimals, isQuoteFlipped)
      return price
    }
  }

  return (
    <div className="flex flex-col relative gap-[6px]">
      <div className="flex flex-row gap-2">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[400]}>
          Quote in{' '}
          {selectedToken.selected === 0 ? (
            <TokenSymbol address={token0.address} fallback_name={token0.symbol} />
          ) : (
            <TokenSymbol address={token1.address} fallback_name={token1.symbol} />
          )}
        </T3>
        <InformationCircleIcon
          className={`text-gray-400`}
          width={15}
          onMouseEnter={() => setShowPriceToolTip(true)}
          onMouseLeave={() => setShowPriceToolTip(false)}
        />
        {showPriceToolTip && <LimitOrderPriceInputToolTip />}
      </div>
      <div
        onFocus={() => setFocus(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex py-3 flex-row px-3 rounded-t-[6px] bg-gray-900 border items-center"
        style={{ borderColor: focus || (hover && !disabled) ? colors.blue[400] : colors.gray[750] }}
      >
        <IncrementButton isPlus={false} onClick={decrementTick} disabled={disableMinus} />
        <div className="flex flex-1 ">
          <NumberInput
            onBlur={() => setFocus(false)}
            style={{ textAlign: 'center' }}
            disabled={false}
            onUserInput={onInput}
            value={value}
            placeholder={placeholder ? placeholder : ''}
          />
        </div>
        <IncrementButton onClick={incrementTick} disabled={disablePlus} />
      </div>
    </div>
  )
}
export default LimitOrderPriceInput
