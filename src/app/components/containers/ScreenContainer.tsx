import SwitchNetworkBanner from '../banners/SwitchNetworkBanner'
import Header from '../navbar/Header'
import DashboardBackground from './DashboardBackground'
import { ReactElement } from 'react'
import { useAccount } from 'wagmi'

export default function ScreenContainer({ children }: { children: ReactElement }) {
  const { isConnected } = useAccount()

  return (
    <>
      {isConnected && <SwitchNetworkBanner />}
      <DashboardBackground>
        <div className={`flex bg-gray-dark h-fit w-full flex-col`}>
          <Header />
        </div>
        {children}
      </DashboardBackground>
    </>
  )
}
