import { T2 } from '../typography/Typography'

interface IBaseSwitch {
  item: boolean
  setItem: (value: boolean) => void
  item1: string
  item2: string
  classes?: string
}

interface IButton {
  onClick: () => void
  children: string
  isHighlighted?: boolean
}

const SwitchButton = (props: IButton) => {
  const { onClick, children, isHighlighted } = props

  return (
    <button onClick={onClick} className="flex flex-1 justify-center items-center rounded-md group">
      <T2
        color={isHighlighted ? 'text-gray-50' : 'text-gray-300'}
        className="hover:text-gray-50 group-focus:text-gray-50"
      >
        {children}
      </T2>
    </button>
  )
}

const Highlight = ({ isFirstValue }: { isFirstValue: boolean }) => (
  <div className={`h-full absolute py-1 w-full px-2 flex`}>
    <div
      className={`h-full w-[50%] rounded-md bg-gray-750 transform transition-all duration-300 ${isFirstValue ? 'transform translate-x-[100%] ' : ''}`}
    ></div>
  </div>
)

export default function BaseSwitch(props: IBaseSwitch) {
  const { item, setItem, item1, item2, classes } = props

  return (
    <div
      className={`w-full h-[32px] rounded-lg border border-gray-800 text-[14px] font-normal bg-gray-900 items-center relative ${classes}`}
    >
      <Highlight isFirstValue={item} />
      <div className="flex flex-row flex-1 rounded-full w-full h-full absolute">
        <SwitchButton onClick={() => setItem(false)} isHighlighted={!item}>
          {item1}
        </SwitchButton>
        <SwitchButton onClick={() => setItem(true)} isHighlighted={item}>
          {item2}
        </SwitchButton>
      </div>
    </div>
  )
}
