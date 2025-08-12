import { T1, T2, T3 } from '../typography/Typography'
import { getLocalStorageItem, setLocalStorageItem } from '../../lib/localStorage'
import SettingsButton from '../buttons/SettingsButton'
import SlippageInput from '../inputs/SlippageInput'
import TransactionDeadlineInput from '../inputs/TransactionDeadlineInput'
import { useState, useEffect } from 'react'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { formatNumber } from '../numbers/FormatNumber.tsx'
import { useChainLoader } from '../../route/loaderData.tsx'
import { useSwapRouter } from '../../hooks/useSwapRouter.tsx'
import EngineName from '../forms/OrderForms/Swap/EngineName.ts'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { usePageName } from '../../hooks/usePageName.tsx'

export interface IOrderSettings {
  slippage: number
  transactionDeadline: number
  refreshSeconds?: number
}

export default function OrderFormDropdown(props: {
  settings: IOrderSettings
  setSettings: (value: IOrderSettings) => void
}) {
  const { settings, setSettings } = props
  const [valueSlippage, setValueSlippage] = useState(settings.slippage.toString())
  const [valueDeadline, setValueDeadline] = useState(settings.transactionDeadline.toString())
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('Slippage')

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0,0)' },
    common: { transformOrigin: `top right` },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const { currentChainInfo } = useChainLoader()
  const { pageName } = usePageName()

  const { markets } = useSwapRouter({ chainInfo: currentChainInfo })
  // just for initial state of checkboxes
  const initialMarkets = [
    'airswap',
    'enso',
    'kyberswap',
    'odos',
    'okx',
    'oneinch',
    'paraswap',
    'usor',
    'zeroex',
    'propellerswap',
    'openocean',
  ]
  const [checkedMarkets, setCheckedMarkets] = useState(() => {
    const savedMarkets = getLocalStorageItem('checkedMarkets')
    return savedMarkets != null ? JSON.parse(savedMarkets) : initialMarkets
  })

  useEffect(() => setLocalStorageItem('checkedMarkets', JSON.stringify(checkedMarkets)), [checkedMarkets])

  const slippages = ['0.1', '0.25', '0.5', '1.0']
  const setSlippage = (value: string) => {
    setSettings({ slippage: parseFloat(value), transactionDeadline: 30 })
    setValueDeadline('30')
    setValueSlippage(value)
    setLocalStorageItem('slippage', value)
  }
  const localStorageSlippage = getLocalStorageItem('slippage') || '0'

  const SwitchItem = ({ name }: { name: string }) => (
    <div
      className={`flex items-center justify-center text-[12px] leading-[14px] md:text-[14px] md:leading-[18px] h-[28px] md:h-[33px] rounded-md w-[64.5px] md:w-[88px] 
      ${selectedItem === name ? 'text-white bg-gray-700 font-semibold' : 'text-gray-400'} cursor-pointer`}
      onClick={() => setSelectedItem(name)}
    >
      {name}
    </div>
  )

  const Search = 'https://assets.oku.trade/search.svg'
  const [searchBarClicked, setSearchBarClicked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const handleSearch = (event: any) => setSearchTerm(event.target.value)
  const filteredMarkets = markets.filter((market) =>
    EngineName(market).toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (!isOpen) setSearchTerm('')
  }, [isOpen])

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <div className="flex flex-row items-center">
          <T3>
            Slippage: {valueSlippage !== '' ? formatNumber({ num: valueSlippage, belowOneDecimalAmount: 3 }) : '0'}%
          </T3>
          <SettingsButton />
        </div>
      </div>
      {isOpen && (
        <div className="z-10" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <div
            className={`h-fit max-h-[335px] md:max-h-[345px] w-[250px] md:w-[314px] flex flex-col z-10 mt-1 bg-gray-750 border border-gray-700 rounded-lg gap-2 p-2`}
            style={{
              ...styles,
            }}
          >
            <div className="flex flex-row justify-between mb-1">
              <T1>Settings</T1>
              <XMarkIcon className="w-4 h-4 text-gray-300 cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="flex flex-row items-center justify-center border border-gray-700 rounded-md w-[129px] md:w-[176px] h-[29px] md:h-[33px]">
              <SwitchItem name="Slippage" />
              <SwitchItem name="Routers" />
            </div>
            {selectedItem === 'Slippage' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col border border-gray-700 rounded-[8px] px-2 py-2.5 md:py-2 gap-2 min-w-[230px] md:min-w-[294px]">
                  <T3 color="text-gray-100">Slippage Tolerance:</T3>
                  <div className="flex flex-col md:flex-row gap-2">
                    <SlippageInput
                      settings={settings}
                      setSettings={setSettings}
                      value={valueSlippage}
                      setValue={setValueSlippage}
                    />
                    <div className="flex flex-row gap-1">
                      {slippages.map((slippage) => {
                        const isSlippageSelected = parseFloat(localStorageSlippage) === parseFloat(slippage)
                        return (
                          <button
                            key={slippage}
                            className={`flex items-center justify-center min-h-8 md:min-h-[30px] rounded-md w-[49.5px] md:w-[39px] cursor-pointer ${isSlippageSelected ? 'bg-blue-400' : 'bg-gray-700'} group`}
                            onClick={() => setSlippage(slippage)}
                          >
                            <T3
                              color={`${isSlippageSelected ? 'text-gray-100' : 'text-gray-300'}`}
                              className="group-hover:text-white"
                            >
                              {slippage}%
                            </T3>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col border border-gray-700 rounded-[8px] px-2 py-[9px] gap-2 min-w-[230px] md:min-w-[294px]">
                  <T3 color="text-gray-100">Transaction deadline:</T3>
                  <div className="flex flex-row gap-2 items-center">
                    <TransactionDeadlineInput
                      settings={settings}
                      setSettings={setSettings}
                      value={valueDeadline}
                      setValue={setValueDeadline}
                    />
                    <T3 color="text-gray-100">minutes</T3>
                  </div>
                </div>
              </div>
            ) : selectedItem === 'Routers' ? (
              <div>
                <div
                  className={`flex items-center w-[230px] md:w-[294px] h-[33px] rounded-[8px] px-2 text-gray-400 text-sm border 
                  ${searchBarClicked ? 'border-[#4C82FB]' : 'border-gray-700'} hover:border-[#4C82FB]`}
                >
                  <input
                    type="text"
                    placeholder="search routers"
                    className="w-full max-w-[230px] md:max-w-[294px] h-full bg-black_transparent focus:outline-none"
                    onClick={() => setSearchBarClicked(true)}
                    onBlur={() => setSearchBarClicked(false)}
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {Search && <img src={Search} alt="search" className="w-4 h-4" />}
                </div>
                <div
                  className={`overflow-auto no-scrollbar ${pageName === 'pool' ? 'max-h-[185px] md:max-h-[225px] lg:max-h-[155px]' : 'max-h-[220px] md:max-h-[225px]'}`}
                >
                  <div className="flex flex-col mt-2 gap-2 text-gray-400 text-sm">
                    {filteredMarkets.length > 0 ? (
                      filteredMarkets.map((market) => {
                        const bgImage = { backgroundImage: `url("https://assets.oku.trade/Router/${market}.svg")` }
                        return (
                          <div
                            key={market}
                            className="flex flex-row items-center justify-between bg-gray-700 gap-2 h-[33px] w-full max-w-[230px] md:max-w-[294px] border border-gray-700 rounded-[8px] px-2"
                          >
                            <div className="flex flex-row items-center gap-1">
                              <div
                                style={bgImage}
                                className="w-5 h-5 bg-[#384D7B] border border-[#4C5E89] rounded-full p-0.5 bg-contain bg-no-repeat bg-center bg-origin-content"
                              ></div>
                              <T2
                                color="text-gray-300"
                                fontSize={{ base: '12px', sm: '12px', md: '14px' }}
                                lineHeight={{ base: '14px', sm: '14px', md: '16px' }}
                              >
                                {EngineName(market)}
                              </T2>
                            </div>
                            <label
                              className={`w-4 h-4 relative cursor-pointer`}
                              onClick={() => {
                                setCheckedMarkets((prevMarkets: string[]) =>
                                  !checkedMarkets.includes(market)
                                    ? [...prevMarkets, market]
                                    : prevMarkets.filter((m: string) => m !== market)
                                )
                              }}
                            >
                              <span
                                className={`flex w-4 h-4 rounded absolute top-0 left-0 transition-transform duration-200 ease-in-out items-center justify-center
                                ${checkedMarkets.includes(market) ? 'bg-blue-400' : 'bg-[#40588C]'}`}
                              >
                                {checkedMarkets.includes(market) && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                              </span>
                            </label>
                          </div>
                        )
                      })
                    ) : (
                      <T3 className="ml-0.5">No routers found...</T3>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}
