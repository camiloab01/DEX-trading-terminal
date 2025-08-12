import { colors } from '../../constants/colors'
import { FontWeightEnums, SortingOrder } from '../../types/Enums'
import { T2, T3 } from '../typography/Typography'
import { useState } from 'react'
import SortIcon from '../../assets/iconComponents/Sort'

export const HeadTitle = ({ title, classes, color }: { title: string; classes?: string; color?: string }) => (
  <T2 weight={FontWeightEnums.REGULAR} color={color ? color : colors.gray[300]} className={classes}>
    {title}
  </T2>
)

export const SmallHeadTitle = ({ title, classes, color }: { title: string; classes?: string; color?: string }) => (
  <T3 weight={FontWeightEnums.REGULAR} color={color ? color : colors.gray[300]} className={classes}>
    {title}
  </T3>
)

interface ISortableHeader {
  title: string
  sorting?: SortingOrder
  handleSortingToggle: (prop: any) => void
  useT3?: boolean
}
export const SortableHeader = (props: ISortableHeader) => {
  const { title, handleSortingToggle, sorting, useT3 } = props
  const [hover, setHover] = useState(false)
  const TextComponent = useT3 ? T3 : T2
  return (
    <div
      className="flex cursor-pointer"
      onClick={handleSortingToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center">
        <TextComponent color={hover ? colors.gray[400] : colors.gray[300]} className="whitespace-nowrap">
          {title}
        </TextComponent>
      </div>
      <SortIcon
        colorUp={sorting === SortingOrder.DESC ? colors.blue[400] : hover ? colors.gray[400] : colors.gray[300]}
        colorDown={sorting === SortingOrder.ASC ? colors.blue[400] : hover ? colors.gray[400] : colors.gray[300]}
      />
    </div>
  )
}
