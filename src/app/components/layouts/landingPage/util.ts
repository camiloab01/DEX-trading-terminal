import { HistoricProtocolStatistics } from '@gfxlabs/oku'
import noTokenLogo from '../../../assets/no-token-logo.webp'
import { CHAIN_INFO, getChainIdFromName } from '../../../constants/abi/chainInfo'
import { colors } from '../../../constants/colors'
import { ConfigFeatures } from '../../../context/ConfigContext'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { AggregatedDataKey, HistoricProtocolStatisticsData } from './panels/Charts'
import { TokenSearchResponseWithKey } from './tables/TopTokens'
export const omniFlattenAndSort = (
  data: any,
  sortBy: string,
  sortByAsc: boolean,
  configFeatures: ConfigFeatures,
  sliceAmount = 21
) => {
  const flattenedAccounts = omniFlattenAndNoSort(data, configFeatures)

  const sorted = sortByAsc
    ? flattenedAccounts.sort((a, b) => a[sortBy] - b[sortBy])
    : flattenedAccounts.sort((a, b) => b[sortBy] - a[sortBy])
  return sorted.slice(0, sliceAmount)
}

export const convertToFlattenable = (data: any, property = 'results') => {
  const newObj: { [key: string]: any } = {}
  for (const key in data) {
    newObj[key] = data[key][property]
  }

  return newObj
}

export const omniFlattenAndNoSort = (data: any, configFeatures: ConfigFeatures) => {
  const removedNull = removeNullKeys(data)

  const flattenedAccounts = Object.entries(removedNull)
    .filter((key) => !configFeatures.Chains.hidden.includes(key[0] as unknown as string))
    .flatMap(([key, accounts]) => {
      const sortedAccounts = accounts as unknown as any[]
      return sortedAccounts.map((account: any) => {
        const chain = Object.values(CHAIN_INFO).find((x) => x.internalName === key)
        let logoUrl
        if (chain !== undefined) {
          logoUrl = chain.logoUrl
        } else {
          // default use ETH since this is what ChangeNetworkDropdown uses
          logoUrl = CHAIN_INFO[1].logoUrl
        }
        return { ...account, logoUrl, key }
      })
    })
  return flattenedAccounts
}

const removeNullKeys = (obj: any) => {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      delete obj[key]
    }
  }
  return obj
}

function normalizeDataArrays(
  ethereumTimes: number[],
  chainData: HistoricProtocolStatistics[],
  property: keyof HistoricProtocolStatistics
): number[] {
  const normalizedData: number[] = []

  ethereumTimes.forEach((time, index) => {
    const matchingStats = chainData != null ? chainData.find((stats) => stats.time === time) : undefined
    normalizedData[index] = matchingStats ? matchingStats[property] : 0
  })

  return normalizedData
}

export interface YDataItem {
  name: string
  data: number[]
}

export const getMultiLineChartData = (
  chartData: HistoricProtocolStatisticsData,
  statisticProperty: keyof HistoricProtocolStatistics,
  configFeatures: ConfigFeatures
): {
  xData: number[]
  yData: YDataItem[]
} => {
  const ethData: HistoricProtocolStatistics[] | undefined = chartData['ethereum']

  const xData: number[] = ethData.map((stats) => stats.time)
  const yData: Array<{ name: string; data: number[] }> = []

  // Iterate over each chain's data
  for (const [chain, data] of Object.entries(chartData).filter(
    (key) => !configFeatures.Chains.hidden.includes(key[0] as unknown as string)
  )) {
    if (chain !== 'ethereum') {
      const normalizedChainData = normalizeDataArrays(xData, data, statisticProperty)
      yData.push({
        name: chain,
        data: normalizedChainData,
      })
    }
  }

  yData.unshift({
    name: 'ethereum',
    data: ethData.map((stats) => stats[statisticProperty]),
  })

  return { xData, yData }
}

export const getChartColor = (index: number): string => {
  const multi_line_chart_colors: { [key: number]: string } = colors.multi_line_chart
  return multi_line_chart_colors[index % Object.keys(multi_line_chart_colors).length]
}

export function createChartGradientLines(index: number, gradientOffset: number, isLine = false): string {
  const baseColors = [
    { r: 28, g: 52, b: 121 }, // Deep Blue
    { r: 200, g: 16, b: 74 }, // Deep Red
    { r: 64, g: 182, b: 107 }, // Green
    { r: 151, g: 71, b: 200 }, // Purple
    { r: 240, g: 166, b: 74 }, // Orange
    { r: 1, g: 143, b: 143 }, // Teal
    { r: 237, g: 74, b: 125 }, // Pink
    { r: 255, g: 165, b: 0 }, // Orange
    { r: 255, g: 255, b: 0 }, // Yellow
    { r: 0, g: 200, b: 200 }, // Cyan
    { r: 150, g: 0, b: 150 }, // Magenta
    { r: 255, g: 0, b: 0 }, // Red
    { r: 0, g: 150, b: 0 }, // Lime Green
    { r: 0, g: 0, b: 200 }, // Blue
    { r: 128, g: 0, b: 80 }, // Purple
    { r: 0, g: 128, b: 0 }, // Dark Green
    { r: 0, g: 0, b: 128 }, // Dark Blue
    { r: 128, g: 128, b: 0 }, // Olive Green
    { r: 128, g: 0, b: 0 }, // Maroon
    { r: 0, g: 128, b: 128 }, // Teal
    { r: 128, g: 128, b: 128 }, // Gray
  ]

  const colorIndex = index % baseColors.length
  const baseColor = baseColors[colorIndex]

  const adjustedColor = {
    r: Math.max(0, baseColor.r - gradientOffset * 20),
    g: Math.max(0, baseColor.g - gradientOffset * 20),
    b: Math.max(0, baseColor.b - gradientOffset * 20),
  }

  const hexColor = `#${adjustedColor.r.toString(16).padStart(2, '0')}${adjustedColor.g.toString(16).padStart(2, '0')}${adjustedColor.b.toString(16).padStart(2, '0')}${isLine ? '' : index === 0 ? 'F2' : 'CC'}`

  return hexColor
}

export const getChartTitle = (chart: AggregatedDataKey) => {
  switch (chart) {
    case 'tvl':
      return 'TVL'
    case 'volume':
      return 'Volume'
    case 'fees':
      return 'Fees'
    default:
      return 'TVL'
  }
}

export const removeError = (data: any) => {
  if (data._errors) {
    delete data._errors
  }
  return data
}

export interface TopTokensWithLogos extends TokenSearchResponseWithKey {
  logoUrl: string
  chainId: number
}

export const getTopTokensWithLogos = (tokens: TokenSearchResponseWithKey[]) => {
  const topTokensWithLogos: TopTokensWithLogos[] = []
  for (let i = 0; i < Math.min(tokens.length, 20); i++) {
    const token = tokens[i]
    const chainId = getChainIdFromName(token.key)
    const logoUrl = getTokenLogoUrl(token.contract, chainId)
    if (logoUrl !== noTokenLogo) {
      topTokensWithLogos.push({ ...token, logoUrl, chainId })
    }
  }

  return topTokensWithLogos
}
