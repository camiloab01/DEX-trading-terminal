import { T2 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'

function NoDataFoundState() {
  return (
    <div className=" rounded-xl border-[1px] w-full flex grow flex-col border-gray-700 bg-gray-900  border-gray-700 flex-1 pt-[60px]  ">
      <div className="flex flex-col items-center justify-center gap-1">
        <T2>No Data Found</T2>
        <div className="flex flex-col items-center no-wrap">
          <T2 color={colors.gray[300]}>It seems we cannot fetch the chart.</T2>
          <T2 color={colors.gray[300]}>Try again in a bit.</T2>
        </div>
      </div>
      <div className="flex flex-1  justify-center overflow-hidden w-full items-center overflow-hidden px-[5%]">
        <img src="https://assets.oku.trade/no-chart-data.svg" className="w-[100%] min-h-[200px] h-full flex flex-1" />
      </div>
    </div>
  )
}

export default NoDataFoundState
