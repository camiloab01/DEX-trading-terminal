interface IButton {
  onClick: () => void
  children: string
  focus: boolean
}

export default function ChooseChartButton(props: IButton) {
  const { onClick, children, focus } = props
  return (
    <button
      onClick={onClick}
      className={`hover:bg-gray-700 w-[56px] py-[6px] rounded-lg text-gray-200 text-[12px] font-regular ${focus ? 'bg-gray-700' : ''}`}
    >
      {children}
    </button>
  )
}
