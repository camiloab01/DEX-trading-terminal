import { DialRpcClient, RpcClient } from '@gfxlabs/jsrpc'
import { DialSettings } from '@gfxlabs/jsrpc/dist/types/transports'
import { CushApi } from '@gfxlabs/oku'
import { createContext, useContext, useState } from 'react'
import { useConfigContext } from './ConfigContext'

export class OmniCush {
  private apis: Map<string, RpcClient<CushApi>>
  private readonly root: string
  private readonly protocols: DialSettings[]

  constructor(root: string, protocols: DialSettings[] = ['wss', 'https']) {
    this.root = root
    this.protocols = protocols
    this.apis = new Map()
  }

  network(name: string): RpcClient<CushApi> {
    const client = this.apis.get(name)
    if (client) {
      return client
    }
    const newClient = DialRpcClient<CushApi>(`${this.root}${name}`, this.protocols)
    this.apis.set(name, newClient)
    return newClient
  }
}

interface RpcContextProps {
  omniCush: OmniCush
}

const RpcContext = createContext({} as RpcContextProps)

export const RpcContextProvider = ({ children }: { children: any }) => {
  const { features } = useConfigContext()
  const [omniCush] = useState(new OmniCush(features.ChainRpc.omni, features.ChainRpc.protocols))
  return <RpcContext.Provider value={{ omniCush }}>{children}</RpcContext.Provider>
}

export const useRpcContext = (): RpcContextProps => {
  const context = useContext<RpcContextProps>(RpcContext)
  if (context === null) {
    throw new Error('"useRpcContext" should be used inside a "RpcContextProvider"')
  }

  return context
}
