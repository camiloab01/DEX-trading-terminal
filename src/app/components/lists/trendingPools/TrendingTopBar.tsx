import { T2 } from '../../typography/Typography'
import { TrendingPoolsEnums } from '../../../types/Enums'
import TrendingPoolDropdown from '../../dropdown/TrendingPoolDropdown'

interface ITrendingTopBar {
  trendType: TrendingPoolsEnums
  setTrendType: (value: TrendingPoolsEnums) => void
}

export default function TrendingTopBar(props: ITrendingTopBar) {
  const { trendType, setTrendType } = props
  return (
    <div
      className="flex flex-row justify-between items-center border-b border-gray-800 w-full py-4 px-3 bg-gray-900"
      data-name="TrendingTopBar"
    >
      <T2>Trending</T2>
      <TrendingPoolDropdown trendType={trendType} setTrendType={setTrendType} />
    </div>
  )
}
