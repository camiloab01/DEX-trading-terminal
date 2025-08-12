import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useState } from 'react'
import { formatNumber } from '../numbers/FormatNumber'

interface IOrderFormSlider {
  setPercent: (value: string) => void
  percent: string
  disabled?: boolean
}

function OrderFormSlider(props: IOrderFormSlider) {
  const { setPercent, percent, disabled = false } = props
  const [hover, setHover] = useState(false)
  const onSlide = (e: any) => setPercent(e.target.value)

  return (
    <div
      className=" w-full h-[30px] flex justify-center flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input
        type="range"
        min={'0'}
        max={'100'}
        value={percent}
        onChange={(e) => onSlide(e)}
        className={`slider`}
        style={{ backgroundSize: `${percent}% 100%` }}
        disabled={disabled}
      />
      <div className="w-full h-[0px] z-[100]">
        {hover && !disabled && (
          <div
            className="w-fit p-1 rounded-[4px] border-[1px]"
            style={{
              backgroundColor: colors.gray[800],
              borderColor: colors.gray[600],
              marginLeft: parseFloat(percent) > 98 ? '98%' : percent.concat('%'),
            }}
          >
            <T3>{formatNumber({ num: parseFloat(percent), belowOneDecimalAmount: 2 })}%</T3>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderFormSlider
