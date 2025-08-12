import { T3 } from '../typography/Typography'
import { IOrderSettings } from '../dropdown/OrderFormDropdown'
import Input from './NumberInput'
import { getLocalStorageItem, setLocalStorageItem } from '../../lib/localStorage'
import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

interface ISlippageInput {
  settings: IOrderSettings
  setSettings: (value: IOrderSettings) => void
  value: string
  setValue: (value: string) => void
}

export default function SlippageInput(props: ISlippageInput) {
  const { settings, setSettings, value, setValue } = props
  const [focus, setFocus] = useState(false)
  const [debouncedValue] = useDebounceValue(value, 500)
  const checkValue = (value: string) => {
    const slippage =
      parseFloat(value) > 100 ? '100' : parseFloat(value) < 0.001 && parseFloat(value) > 0 ? '0.001' : value
    setValue(slippage)
    setLocalStorageItem('slippage', slippage)
  }

  useEffect(() => {
    const slippage = getLocalStorageItem('slippage')
    if (slippage && slippage !== '') setValue(slippage)
  }, [])
  useEffect(() => setSettings({ ...settings, slippage: value === '' ? 0 : parseFloat(value) }), [debouncedValue])

  return (
    <div className="flex flex-row items-center justify-between text-[12px] leading-[14px] rounded-[4px] h-[30px] min-w-[210px] md:min-w-[83px] bg-gray-700 text-gray-300 gap-1 px-1 group">
      <Input
        value={value}
        onUserInput={checkValue}
        classes="group-hover:text-white"
        style={focus ? { color: '#FFFFFF' } : {}}
        onClick={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <T3 color={focus ? 'text-white' : 'text-gray-300'} className="group-hover:text-white">
        %
      </T3>
    </div>
  )
}
