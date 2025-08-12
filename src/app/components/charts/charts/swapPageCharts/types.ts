import { IToken } from '../../../../lib/getToken'
import { tokenChartTimeIncrementEnums } from '../../../../types/Enums'
export interface ITokenChartTopBar {
  token: IToken
  tokenPriceUSD: number | undefined
  timeIncrement: tokenChartTimeIncrementEnums
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
}

export interface ITokenChartHeader {
  token: IToken
  tokenPriceUSD: number | undefined
}

export interface ITokenChartContainer {
  timeIncrement: tokenChartTimeIncrementEnums
  token: IToken
  setIsEnoughData: (value: boolean | undefined) => void
}
