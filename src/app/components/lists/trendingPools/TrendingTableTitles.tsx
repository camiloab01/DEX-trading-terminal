import { colors } from '../../../constants/colors'
import { TrendingPoolsEnums } from '../../../types/Enums'
import { T3 } from '../../typography/Typography'

interface ITrendingTableTitles {
  trendType: TrendingPoolsEnums
}
export default function TrendingTableTitles({ trendType }: ITrendingTableTitles) {
  return <div className="flex flex-row p-3 whitespace-pre bg-gray-800">{SwitchTableTitle(trendType)}</div>
}
const SwitchTableTitle = (trendType: TrendingPoolsEnums) => {
  switch (trendType) {
    case TrendingPoolsEnums.TOP_GAINERS:
      return <TrendingTitles titles={['Pool', 'Price', 'Volume 24H']} />
    case TrendingPoolsEnums.TOP_LOSERS:
      return <TrendingTitles titles={['Pool', 'Price', 'Volume 24H']} />
    case TrendingPoolsEnums.TOTAL_SWAPS:
      return <TrendingTitles titles={['Pool', 'Total Swaps']} />
    case TrendingPoolsEnums.TVL:
      return <TrendingTitles titles={['Pool', 'TVL', 'Volume 7D']} />
    case TrendingPoolsEnums.VOLUME:
      return <TrendingTitles titles={['Pool', 'Volume 24H', 'Volume 7D']} />
    default:
      return <TrendingTitles titles={['Pool', 'Price', 'Volume 24H']} />
  }
}

const TrendingTitles = ({ titles }: { titles: string[] }) => {
  return (
    <div className="flex flex-row w-full">
      <T3 color={colors.gray[400]} className="flex flex-[18]">
        {titles[0]}
      </T3>
      <T3 color={colors.gray[400]} className="flex flex-[7] justify-end">
        {titles[1]}
      </T3>
      {titles[2] && (
        <T3 color={colors.gray[400]} className="flex flex-[9] justify-end">
          {titles[2]}
        </T3>
      )}
    </div>
  )
}
