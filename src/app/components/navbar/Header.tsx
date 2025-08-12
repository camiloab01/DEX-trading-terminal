import { T2 } from '../typography/Typography'
import useBreakpoint from '../../hooks/useBreakpoint'
import ConnectWalletButton from '../buttons/ConnectWalletButton'
import ChangeNetworkDropDown from '../dropdown/ChangeNetworkDropDown'
import SearchPoolDropDown from '../dropdown/SearchPoolDropDown'
import NavBar from './NavBar'
import { useWindowSize } from 'usehooks-ts'

export default function Header() {
  const HeaderHeight = useBreakpoint({ base: '56px', sm: '48px' })
  const margin = useBreakpoint({ base: '8px', sm: '16px' })
  const windowSize = useWindowSize()
  const UniBadge = () => {
    return (
      <div className="hidden sm:flex items-center h-[37px] sm:h-8 p-[2px] sm:p-1.5 border rounded-md border-gray-600 bg-gray-900 gap-1 min-w-[44px]">
        <img
          src={'https://assets.oku.trade/uni-v3.webp'}
          alt="UNIv3"
          className="h-[17px] w-[17px] sm:h-5 sm:w-5 mb-1 sm:mb-[2px]"
        />
        <T2>V3</T2>
      </div>
    )
  }

  return (
    <div className={`flex h-fit w-full flex-col bg-gray-900`}>
      <div
        style={{
          height: HeaderHeight,
          paddingRight: margin,
          paddingLeft: margin,
        }}
        className="grow flex flex-row items-center justify-between py-[6px] lg:mt-0"
      >
        <div className={`flex flex-row justify-between w-full`}>
          <div className="flex items-center">
            <NavBar />
          </div>
          <div
            className={`flex flex-row items-center ${windowSize.width < 500 ? 'gap-[2px]' : 'gap-1'} sm:gap-2`}
          >
            {windowSize.width >= 1024 && <SearchPoolDropDown />}
            <UniBadge />
            <ChangeNetworkDropDown />
            <ConnectWalletButton additionalClass="h-[37px] sm:h-8" />
          </div>
        </div>
      </div>
      <div className="bg-gray-dark">
        {windowSize.width < 1024 && <SearchPoolDropDown />}
      </div>
    </div>
  )
}
