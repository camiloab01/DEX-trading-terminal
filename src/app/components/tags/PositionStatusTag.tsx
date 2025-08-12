import { colors } from '../../constants/colors'
import useMobile from '../../hooks/useMobile'
import { PositionStatusEnums } from '../../types/Enums'
import { T3 } from '../typography/Typography'
import { useEffect, useState } from 'react'

export interface IPositionStatusTag {
  status: PositionStatusEnums
}

const PositionStatusTag = (props: IPositionStatusTag) => {
  const [bgColor, setBgColor] = useState(colors.blue[800])
  const [textColor, setTextColor] = useState(colors.blue[500])
  const [title, setTitle] = useState('')

  useEffect(() => {
    switch (props.status) {
      case PositionStatusEnums.IN_RANGE:
        setBgColor(colors.green[700])
        setTextColor(colors.green[400])
        setTitle('In Range')
        break
      case PositionStatusEnums.OUT_OF_RANGE:
        setBgColor(colors.yellow[700])
        setTextColor(colors.yellow[200])
        setTitle('Out of Range')
        break
      case PositionStatusEnums.CLOSED:
        setBgColor(colors.gray[600])
        setTextColor(colors.gray[300])
        setTitle('Closed')
        break
      default:
        setTitle('')
        break
    }
  }, [props.status])
  const { isDesktop } = useMobile()
  return (
    <div
      className="py-2 text-[14px] font-regular rounded-[6px] flex items-center justify-center"
      style={{ backgroundColor: bgColor, width: isDesktop ? '94px' : '75px' }}
    >
      <T3 color={textColor}>{title}</T3>
    </div>
  )
}

export default PositionStatusTag
