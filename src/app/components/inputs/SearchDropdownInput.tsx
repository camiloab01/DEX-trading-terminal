const Search = 'https://assets.oku.trade/search.svg'
import useBreakpoint from '../../hooks/useBreakpoint'
import { Trans } from '@lingui/react'
import { LegacyRef, useState } from 'react'
import { usePageName } from '../../hooks/usePageName'

interface ISearchDropdownInput {
  onChange: (value: string) => void
  value: string
  width?: number | string
  bgColor?: string
  borderColor?: string
  innerRef?: LegacyRef<HTMLInputElement>
  isPoolSection?: boolean
}

export default function SearchDropdownInput(props: ISearchDropdownInput) {
  const {
    innerRef,
    onChange,
    width = '100%',
    value,
    bgColor = 'bg-gray-800 xl:bg-gray-900',
    borderColor = 'border-gray-700 xl:border-gray-800',
    isPoolSection,
  } = props
  const placeHolderPadding = useBreakpoint({ base: '8px', sm: '16px' })
  const [focus, setFocus] = useState(false)
  const { pageName } = usePageName()

  return (
    <Trans
      id="Search Dropdown Input"
      render={() => (
        <input
          className={`flex flex-1 ${pageName === 'liquidity' && !isPoolSection ? 'bg-gray-750' : isPoolSection && pageName !== 'pool' ? 'bg-gray-800' : bgColor} 
          placeholder:text-gray-300 focus:outline-0 placeholder:text-[12px] placeholder:font-normal rounded-md border ${pageName === 'liquidity' ? 'border-gray-700' : borderColor} 
          focus:border-blue-400 text-white outline-none`}
          style={{
            width: width,
            height: 32,
            paddingLeft: placeHolderPadding,
            backgroundImage: focus || value !== '' ? '' : `url(${Search})`,
            backgroundSize: '14px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px center',
          }}
          ref={innerRef}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    />
  )
}
