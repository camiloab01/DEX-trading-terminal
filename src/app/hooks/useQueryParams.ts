import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OrderFormTypeEnums } from '../types/Enums'

const useQueryParamSetter = (queryParamPrefix: string) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const setQueryParam = (value: string, condition: boolean) => {
    searchParams
    setSearchParams(
      (existingParams) => {
        const newParams = new URLSearchParams(existingParams)
        if (condition) {
          newParams.set(queryParamPrefix, value)
        } else {
          newParams.delete(queryParamPrefix)
        }
        return newParams
      },
      { preventScrollReset: true, replace: true }
    )
  }
  return setQueryParam
}

export const useSetOrderFormTypeQueryParam = (queryParamPrefix: string) => {
  const setQueryParam = useQueryParamSetter(queryParamPrefix)
  const setLimitQuoteQueryParam = useQueryParamSetter('limitQuote')
  return (orderFormType: string) => {
    setQueryParam(orderFormType, orderFormType === OrderFormTypeEnums.MARKET)
    if (orderFormType === OrderFormTypeEnums.MARKET) setLimitQuoteQueryParam('null', false)
  }
}

export const useSetInputSideQueryParam = (queryParamPrefix: string) => {
  const setQueryParam = useQueryParamSetter(queryParamPrefix)
  return (inputSide: string) => setQueryParam(inputSide, inputSide === 'Buy')
}

export const useSetIsFlippedQueryParam = (queryParamPrefix: string) => {
  const setQueryParam = useQueryParamSetter(queryParamPrefix)
  return (isFlipped: boolean) => setQueryParam(isFlipped.toString(), isFlipped.toString() === 'true')
}

export const useSetLimitQuoteQueryParam = (queryParamPrefix: string) => {
  const setQueryParam = useQueryParamSetter(queryParamPrefix)
  return (limitQuote: string) => setQueryParam(limitQuote, /^[0-9]+(\.[0-9]+)?$/.test(limitQuote))
}

export const useSetInputAmountAndSideQueryParam = (sideQueryParamPrefix: string, amountQueryParamPrefix: string) => {
  const setQueryParamSide = useQueryParamSetter(sideQueryParamPrefix)
  const setQueryParamAmount = useQueryParamSetter(amountQueryParamPrefix)
  return (inputAmount: string, inputSide: string) => {
    setQueryParamSide(inputSide, inputSide === 'Buy')
    setQueryParamAmount(inputAmount, /^[0-9]+(\.[0-9]+)?$/.test(inputAmount))
  }
}

export const useInputSideAndAmountQueryParam = (sideQueryParamPrefix: string, amountQueryParamPrefix: string) => {
  const [searchParams] = useSearchParams()
  const [inputSideQueryParam, setInputSideQueryParamRaw] = useState<string | null>(
    searchParams.get(`${sideQueryParamPrefix}`) ? searchParams.get(`${sideQueryParamPrefix}`) : ''
  )
  const [inputAmountQueryParam, setInputAmountQueryParam] = useState<string | null>(
    searchParams.get(`${amountQueryParamPrefix}`) ? searchParams.get(`${amountQueryParamPrefix}`) : ''
  )
  const setInputSide = useSetInputSideQueryParam(sideQueryParamPrefix)
  const setInputAmountAndInputSide = useSetInputAmountAndSideQueryParam(sideQueryParamPrefix, amountQueryParamPrefix)
  useEffect(() => {
    if (searchParams != undefined) {
      const inputSideParam = searchParams.get(`${sideQueryParamPrefix}`)
      const inputAmountParam = searchParams.get(`${amountQueryParamPrefix}`)
      if (inputSideParam && inputSideParam === 'Buy') setInputSideQueryParamRaw(inputSideParam)
      if (inputAmountParam) {
        setInputAmountQueryParam(inputAmountParam)
      } else {
        setInputAmountQueryParam(null)
      }
    }
  }, [searchParams])
  return [setInputSide, inputSideQueryParam, setInputAmountAndInputSide, inputAmountQueryParam] as const
}

export const useLimitQuoteQueryParam = (limitQuoteQueryParamPrefix: string) => {
  const [searchParams] = useSearchParams()
  const [limitQuoteQueryParam, setLimitQuoteQueryParam] = useState<string | null>(
    searchParams.get(`${limitQuoteQueryParamPrefix}`) ? searchParams.get(`${limitQuoteQueryParamPrefix}`) : ''
  )

  const setLimitQuote = useSetLimitQuoteQueryParam(limitQuoteQueryParamPrefix)
  useEffect(() => {
    if (searchParams != undefined) {
      const limitQuoteQueryParam = searchParams.get(`${limitQuoteQueryParamPrefix}`)
      if (limitQuoteQueryParam) {
        setLimitQuoteQueryParam(limitQuoteQueryParam)
      } else {
        setLimitQuoteQueryParam(null)
      }
    }
  }, [searchParams])
  return [limitQuoteQueryParam, setLimitQuote] as const
}

export const useIsFlippedQueryParam = (queryParamPrefix: string) => {
  const [searchParams] = useSearchParams()
  const [isNativeQueryParam, setIsFlippedQueryParamRaw] = useState<boolean>(
    searchParams.get(`${queryParamPrefix}`) ? Boolean(searchParams.get(`${queryParamPrefix}`)) : false
  )
  const setIsFlipped = useSetIsFlippedQueryParam(queryParamPrefix)
  useEffect(() => {
    if (searchParams != undefined) {
      const param = searchParams.get(`${queryParamPrefix}`)
      if (Boolean(param) === true) setIsFlippedQueryParamRaw(Boolean(param))
    }
  }, [searchParams])
  return [setIsFlipped, isNativeQueryParam] as const
}

export const useOrderFormTypeQueryParam = (queryParamPrefix: string) => {
  const [searchParams] = useSearchParams()
  const [orderFormTypeQueryParam, setOrderFormTypeQueryParamRaw] = useState<string | null>(
    searchParams.get(`${queryParamPrefix}`) ? searchParams.get(`${queryParamPrefix}`) : ''
  )
  const setOrderFormType = useSetOrderFormTypeQueryParam(queryParamPrefix)
  useEffect(() => {
    if (searchParams != undefined) {
      const param = searchParams.get(`${queryParamPrefix}`)
      if (param) setOrderFormTypeQueryParamRaw(param)
    }
  }, [searchParams])
  return [setOrderFormType, orderFormTypeQueryParam] as const
}
