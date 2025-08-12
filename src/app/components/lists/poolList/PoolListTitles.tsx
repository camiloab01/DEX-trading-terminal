import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'

export default function PoolListTitles() {
  return (
    <div className=" px-2 flex flex-row w-full h-fit text-[12px] font-normal">
      <div className="flex flex-[35]">
        <T3 color={colors.gray[400]}>Pool</T3>
      </div>
      <div className="flex flex-[15] justify-end">
        <T3 color={colors.gray[400]}>Fee</T3>
      </div>
      <div className="flex flex-[30] justify-end">
        <T3 color={colors.gray[400]}>Price</T3>
      </div>
      <div className="flex flex-[26] flex-row gap-[2px] items-center justify-center">
        <T3 color={colors.gray[400]}>Change</T3>
      </div>
      <div className="flex flex-[7]"></div>
    </div>
  )
}
