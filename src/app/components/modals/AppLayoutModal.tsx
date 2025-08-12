import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useThemeContext } from '../../context/ThemeContext'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums, LayoutEnums } from '../../types/Enums'
import { MegaphoneIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useModalContext } from '../../context/ModalContext'
import { t } from '@lingui/macro'
import { NavLink } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { ReactNode } from 'react'
import { PiWallet } from 'react-icons/pi'
import { RiTwitterXFill } from 'react-icons/ri'
import { FaTelegramPlane } from 'react-icons/fa'
import { RxDiscordLogo } from 'react-icons/rx'
import { usePageName } from '../../hooks/usePageName'
import { LuBook } from 'react-icons/lu'
import { useChainLoader } from '../../route/loaderData'

interface ILayout {
  appLayout: LayoutEnums
  setAppLayout: (value: LayoutEnums) => void
}

const DefaultLayout = (props: ILayout) => {
  const { appLayout, setAppLayout } = props
  const isDefault = appLayout === 'default'

  return (
    <button className="flex flex-col items-center gap-1.5" onClick={() => setAppLayout(LayoutEnums.DEFAULT)}>
      <div className={`rounded-md hover:scale-[1.05] transition ease-in-out`}>
        <div
          className={`flex flex-col gap-1.5 h-[82px] w-[107px] rounded-md ${isDefault ? 'p-[3px] border-[2px] border-blue-400' : 'p-1'}`}
        >
          <div className={`flex flex-1 bg-gray-700 rounded-[8px] pt-[5px] pb-2 px-[2px] gap-[1px]`}>
            <div className="flex flex-1 border border-[#7D85A3] rounded-md"></div>
            <div className="flex w-[43px] flex-col gap-[1px] rounded-md">
              <div className="flex flex-1 border border-[#7D85A3] rounded-md"></div>
              <div className="flex w-full h-[23px] border border-[#7D85A3] rounded-md"></div>
            </div>
            <div className="flex flex-1 border border-[#7D85A3] rounded-md"></div>
          </div>
        </div>
      </div>
      <T3 color="text-gray-100" weight={FontWeightEnums.REGULAR}>
        Default
      </T3>
    </button>
  )
}
const AlternateLayout = (props: ILayout) => {
  const { appLayout, setAppLayout } = props

  return (
    <button className="flex flex-col items-center gap-[6px] " onClick={() => setAppLayout(LayoutEnums.ALTERNATE)}>
      <div className={`rounded-md hover:scale-[1.05] transition ease-in-out`}>
        <div
          className={`flex flex-col gap-1.5 h-[82px] w-[107px] rounded-md ${appLayout === 'alternate' ? 'p-[3px] border-[2px] border-blue-400' : 'p-1'}`}
        >
          <div className={`flex flex-1 bg-gray-700 rounded-[8px] gap-[1px] pt-[5px] pb-2 px-[2px]`}>
            <div className="flex flex-1 border border-[#7D85A3] rounded-md"></div>
            <div className="flex w-[43px] flex-col gap-[1px] rounded-md">
              <div className="flex flex-1 gap-[1px]">
                <div className="flex flex-1 border border-[#7D85A3] rounded-md"></div>
                <div className="flex flex-1 border border-[#7D85A3] rounded-md"></div>
              </div>
              <div className="flex w-full h-[20px] border border-[#7D85A3] rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      <T3 color="text-gray-100" weight={FontWeightEnums.REGULAR}>
        Alternate
      </T3>
    </button>
  )
}

const CustomT3: React.FC<{
  children: ReactNode
  className?: string
}> = ({ children, className }) => (
  <T3
    className={className}
    weight={FontWeightEnums.MEDIUM}
    color={colors.gray[100]}
    fontSize={{ base: '12px', sm: '14px' }}
    lineHeight={{ base: '14px', sm: '18px' }}
  >
    {children}
  </T3>
)

export default function AppLayoutModal() {
  const { setShowCreatePoolModal } = useModalContext()
  const { appLayout, setAppLayout } = useThemeContext()
  const { isMobile } = useMobile()
  const { open } = useWeb3Modal()
  const page = usePageName()
  const pageName = page.pageName !== undefined ? page.pageName : ''
  const allowedPages = ['pool', 'liquidity']
  const { currentChainInfo } = useChainLoader()
  return (
    <div>
      <div className="flex w-full justify-center">
        {!isMobile && allowedPages.includes(pageName) && <CustomT3 className="mb-3">Style</CustomT3>}
      </div>
      <div className="flex justify-center flex-col items-center">
        {!isMobile && allowedPages.includes(pageName) && (
          <div className="flex flex-row gap-4">
            <DefaultLayout appLayout={appLayout} setAppLayout={setAppLayout} />
            <AlternateLayout appLayout={appLayout} setAppLayout={setAppLayout} />
          </div>
        )}
      </div>
      {!isMobile && allowedPages.includes(pageName) && <div className="border border-gray-700 my-5 min-w-[230px]" />}
      <div className={`space-y-2  ${!isMobile && 'min-w-[230px]'}`}>
        <NavLink
          to={`app/${currentChainInfo.internalName}/order`}
          relative="route"
          className="hover:rounded-md flex justify-between px-1.5 py-2 cursor-pointer hover:bg-gray-drophover"
        >
          <CustomT3>{t`My Orders`}</CustomT3>
        </NavLink>
        <div
          className="hover:rounded-md flex justify-between items-center px-1.5 py-2 cursor-pointer hover:bg-gray-drophover"
          onClick={() => open()}
        >
          <CustomT3>Manage Wallet</CustomT3>
          <PiWallet style={{ height: 16, width: 16, color: colors.gray[300] }} />
        </div>
        <div
          className="hover:rounded-md flex justify-between items-center px-1.5 py-2 cursor-pointer hover:bg-gray-drophover gap-9 sm:gap-0"
          onClick={() => setShowCreatePoolModal((state) => !state)}
        >
          <CustomT3>Create Pool</CustomT3>
          <PlusCircleIcon
            color={colors.gray[300]}
            width={16}
            height={16}
            className="hover:stroke-gray-200 cursor-pointer"
            onClick={() => setShowCreatePoolModal((state) => !state)}
          />
        </div>
        <a
          href="https://support.gfx.xyz/t/oku-trade"
          target="_blank"
          rel="noreferrer"
          className="hover:rounded-md flex justify-between items-center  px-1.5 py-2 hover:bg-gray-drophover"
        >
          <CustomT3>Send Feedback</CustomT3>
          <MegaphoneIcon width={16} color={colors.gray[300]} />
        </a>

        <a
          href="https://docs.oku.trade/"
          target="_blank"
          rel="noreferrer"
          className="hover:rounded-md flex justify-between items-center  px-1.5 py-2 hover:bg-gray-drophover"
        >
          <CustomT3>Documentation</CustomT3>
          <LuBook width={16} color={colors.gray[300]} />
        </a>

        <div className="flex justify-around">
          <a
            href="https://discord.com/invite/wak5gvc8dc"
            target="_blank"
            rel="noreferrer"
            className="hover:rounded-md flex  px-1.5 py-2 hover:bg-gray-drophover"
          >
            <RxDiscordLogo width={16} color={colors.gray[300]} />
          </a>
          <a
            href="https://twitter.com/okutrade"
            target="_blank"
            rel="noreferrer"
            className="hover:rounded-md  px-1.5 py-2 hover:bg-gray-drophover"
          >
            <RiTwitterXFill width={14} height={14} color={colors.gray[300]} />
          </a>
          <a
            href="https://t.me/OkuTelegram"
            target="_blank"
            rel="noreferrer"
            className="hover:rounded-md flex  px-1.5 py-2 hover:bg-gray-drophover"
          >
            <FaTelegramPlane width={16} color={colors.gray[300]} />
          </a>
        </div>
      </div>
    </div>
  )
}
