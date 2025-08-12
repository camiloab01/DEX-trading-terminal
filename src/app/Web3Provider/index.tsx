import { WagmiProvider } from 'wagmi'
import { CreateConfig } from './client_config'

const wagmiConfig = CreateConfig()
export const Web3Provider = ({ children }: { children: JSX.Element }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
