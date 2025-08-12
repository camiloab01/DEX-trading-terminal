import { createWeb3Modal /* defaultWagmiConfig */ } from '@web3modal/wagmi/react'
import { emailConnector } from '@web3modal/wagmi'
import { MAINNET_CHAINS as CHAINS_LIST } from '@gfxlabs/oku-chains'
import { safe, walletConnect, injected, coinbaseWallet } from '@wagmi/connectors'
import { fallback, unstable_connector, http, createConfig } from 'wagmi'
import { colors } from '../constants/colors'
import { Chain, Transport } from 'viem'

const projectId = '0ba768db4337c817602564a355370491'
const metadata = {
  name: 'Oku',
  description: 'Oku - The #1 Defi Interface',
  url: 'https://oku.trade',
  icons: ['https://oku.trade/favicon.ico'],
  verifyUrl: 'verify.walletconnect.com',
}
const chains: [Chain, ...Chain[]] = [...CHAINS_LIST]
export const CreateConfig = () => {
  const wagmiConfig = createConfig({
    chains: chains,
    transports: chains.reduce((acc: { [key: number]: Transport }, chain) => {
      if (chain.id === 324) {
        acc[chain.id] = http()
        return acc
      }
      acc[chain.id] = fallback([unstable_connector(injected), http()])
      return acc
    }, {}),
    connectors: [
      safe(),
      injected(),
      walletConnect({ projectId, metadata, showQrModal: false }),
      coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] }),
      emailConnector({ chains: [...chains], options: { projectId } }),
    ],
  })
  createWeb3Modal({
    wagmiConfig,
    projectId,
    themeVariables: { '--w3m-accent': colors.blue[400] },
  })
  return wagmiConfig
}
