import { TelemetryApi } from '../data/telemetry_client'
import { useConfigContext } from './ConfigContext'
import { DialRpcClient, RpcClient } from '@gfxlabs/jsrpc'
import { createContext, useContext, useEffect, useState } from 'react'

interface TelemetryContextProps {
  telemetryRpc: RpcClient<TelemetryApi>
}

const TelemetryContext = createContext({} as TelemetryContextProps)

export const TelemetryContextProvider = ({ children }: { children: any }) => {
  const { features } = useConfigContext()
  const [telemetryRpc, setTelemetryRpc] = useState<RpcClient<TelemetryApi>>(
    DialRpcClient(features.Telemetry.url, ['https'])
  )
  useEffect(() => {
    setTelemetryRpc(DialRpcClient(features.Telemetry.url, ['https']))
  }, [])
  return <TelemetryContext.Provider value={{ telemetryRpc }}>{children}</TelemetryContext.Provider>
}

export const useTelemetryContext = (): TelemetryContextProps => {
  const context = useContext<TelemetryContextProps>(TelemetryContext)
  if (context === null) {
    throw new Error('"useRpcContext" should be used inside a "TelemetryContextProvider"')
  }

  return context
}
