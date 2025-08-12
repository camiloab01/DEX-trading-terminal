import { CHAIN_INFO } from '../constants/abi/chainInfo'
import { init } from '@multibase/js'
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import { useAccount, useWalletClient, usePublicClient, useSwitchChain, useConfig, useChainId } from 'wagmi'
import { useConfigContext } from './ConfigContext'
import { Account, Address, PublicClient, WalletClient, zeroAddress } from 'viem'
import { useLocation, useMatches, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useChainLoader } from '../route/loaderData'
import { zarazTrack } from '../lib/zaraz'

export type WalletClientWithAccount = Omit<WalletClient, 'account'> & { account: Account }

interface NetworkContextProps {
  provider: PublicClient
  signer?: WalletClientWithAccount
}
export const NetworkContext = createContext({} as NetworkContextProps)

export const NetworkContextProvider = ({ children }: { children: ReactElement }) => {
  const { chain } = useAccount()
  const [searchParams] = useSearchParams()
  const {
    features: { Telemetry },
  } = useConfigContext()
  const { currentChainInfo } = useChainLoader()
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const { data: rawSigner } = useWalletClient()
  const [initialLoad, setInitialLoad] = useState(false)
  const [signer, setSigner] = useState<WalletClientWithAccount | undefined>(rawSigner)
  const [signerAddress, setSignerAddress] = useState<Address | undefined>()
  const { switchChain: switchNetwork } = useSwitchChain()
  const { chain: chainParam, chainID } = useChainLoader()
  const provider = usePublicClient({ chainId: chainID })
  const matches = useMatches()
  const { pathname } = useLocation()
  const [searchParam] = useSearchParams()
  const { poolAddress, token0, token1 } = useParams()

  try {
    init(Telemetry.multibase_key, { enabled: !!Telemetry.multibase_key, debug: false })
  } catch (e) {
    window.log.log('failed to initiate multibase')
  }

  useEffect(() => setSigner(rawSigner), [rawSigner])

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false)
      return
    }
    if (!isConnected || !chain) return
    if (chain.id !== chainID) {
      let chainInfo = CHAIN_INFO[1]
      if (window.ethereum?.networkVersion) {
        const currentChainInfo = CHAIN_INFO[window.ethereum.networkVersion as number]
        if (currentChainInfo != undefined) chainInfo = currentChainInfo
      }
      let match
      for (const m of matches.reverse()) {
        if (m.handle) {
          const base = (m.handle as any).base
          if (base) {
            match = base
            break
          }
        }
      }
      if (match) {
        if (match !== 'landing') {
          navigate(`/app/${chainInfo.internalName}/${match}/`)
        }
      } else {
        const newPath = pathname.replace(chainParam ? chainParam : 'ethereum', chainInfo.internalName)
        navigate(newPath)
      }
    }
  }, [chain])

  useEffect(() => {
    if (!signerAddress || signerAddress == zeroAddress) return
    let referrer_url = document.referrer
    if (referrer_url === '') referrer_url = 'https://oku.trade'

    const url = new URL(referrer_url)
    const urlParams = new URLSearchParams(url.search)
    const trackingProperties = {
      address: signerAddress,
      chain: currentChainInfo.name,
      utm_id: urlParams.get('utm_id'),
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
    }
    zarazTrack('wallet_connect', trackingProperties)
  }, [signerAddress])

  useEffect(() => {
    if (!signer) return
    if (signerAddress != signer.account.address) setSignerAddress(signer.account.address)
  }, [signer, isConnected])

  const config = useConfig()
  const chainId = useChainId({ config })
  useEffect(() => {
    if (chainId !== chainID) {
      let match
      for (const m of matches.reverse()) {
        if (m.handle) {
          const base = (m.handle as any).base
          if (base) {
            match = base
            break
          }
        }
      }

      if (switchNetwork !== undefined) {
        if (match || searchParam.get('swap_chain')) {
          switchNetwork({ chainId: chainID })

          if (match) {
            if (match !== 'landing') {
              navigate(`/app/${chainParam}/${match}/`)
            }
          }
        }
      }
    }
  }, [chainParam, switchNetwork])

  useEffect(() => {
    if (chain && chain.id && chain.id !== chainID) {
      if (pathname.includes('pool')) {
        navigate(`app/${chainParam}/pool/${poolAddress}?${searchParams.toString()}`)
      }
      if (pathname.includes('liquidity')) {
        navigate(`app/${chainParam}/liquidity/${poolAddress}?${searchParams.toString()}`)
      }
      if (pathname.includes('swap')) {
        navigate(`app/${chainParam}/swap/${token0}/${token1}?${searchParams.toString()}`)
      }
    }
  }, [chainParam])

  return (
    <NetworkContext.Provider value={{ provider: provider as PublicClient, signer }}>{children}</NetworkContext.Provider>
  )
}

export const useNetworkContext = (): NetworkContextProps => {
  const context = useContext<NetworkContextProps>(NetworkContext)
  if (context === null) {
    throw new Error('"useNetworkContext" should be used inside a "NetworkContextProvider"')
  }
  return context
}
