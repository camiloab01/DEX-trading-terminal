import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'

export default function TestAmountButton(props: { onClick: () => void; value: number; focus: boolean }) {
  const { onClick, value, focus } = props
  return (
    <button
      className="w-10 h-[30px] rounded-md hover:bg-hoverbackground box-border border border-gray-750 focus:border-blue-400 group"
      onClick={onClick}
    >
      <T3 color={focus ? colors.blue[400] : 'text-gray-300'} className="group-hover:text-white">
        {value}
      </T3>
    </button>
  )
}
