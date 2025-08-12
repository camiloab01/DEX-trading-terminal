import { IOrderSettings } from '../dropdown/OrderFormDropdown'
import Input from './NumberInput'
import { useEffect, useState } from 'react'

interface ITransactionDeadlineInput {
  settings: IOrderSettings
  setSettings: (value: IOrderSettings) => void
  value: string
  setValue: (value: string) => void
}

export default function TransactionDeadlineInput(props: ITransactionDeadlineInput) {
  const { settings, setSettings, value, setValue } = props
  const [focus, setFocus] = useState(false)

  useEffect(() => setSettings({ ...settings, transactionDeadline: value === '' ? 0 : parseFloat(value) }), [value])
  return (
    <div className="flex flex-row items-center justify-start text-[12px] leading-[14px] text-gray-300 rounded-[4px] w-[50px] sm:min-w-[83px] h-[30px] bg-gray-700 pl-1 group">
      <Input
        value={value}
        onUserInput={setValue}
        classes="group-hover:text-white"
        style={focus ? { color: '#FFFFFF' } : {}}
        onClick={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  )
}
