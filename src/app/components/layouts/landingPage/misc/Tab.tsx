import { colors } from '../../../../constants/colors'
import { FontWeightEnums } from '../../../../types/Enums'
import { T2 } from '../../../typography/Typography'

const Tab = ({
  isActive,
  setTab,
  text,
  tab,
}: {
  isActive: boolean
  setTab: (index: number) => void
  text: string
  tab: number
}) => {
  return (
    <div onClick={() => setTab(tab)} className={`cursor-pointer p-2 ${isActive ? 'bg-gray-750' : ''} rounded-t-xl`}>
      <T2 weight={FontWeightEnums.REGULAR} color={isActive ? colors.gray[50] : colors.gray[300]}>
        {text}
      </T2>
    </div>
  )
}

export default Tab
