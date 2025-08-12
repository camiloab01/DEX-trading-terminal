import { useState } from 'react'
import { DefaultConfig } from '../../config'

export interface ConfigFeatures {
  ChainRpc: {
    omni: string
    protocols: string[]
  }
  Router: {
    url: string
  }
  Telemetry: {
    enabled: string
    url: string
    multibase_key: string
  }
  Swap: {
    enabled: string
  }
  Logging: {
    level: any
  }
  Analytics: {
    enabled: string
    url: string
  }
  Docs: {
    enabled: string
    url: string
  }
  Chains: {
    comingsoon: string[]
    featured: string[]
    hidden: string[]
  }
  Accounts: {
    url: string
    gfx_login_provider_id: string
  }
}

const coalesce = <T,>(x: T | undefined, d: T) => {
  if (x != undefined) {
    return x
  }
  return d
}

const DefaultFlags = {
  Swap: {
    enabled: coalesce(import.meta.env.VITE_SWAP_ENABLED, 'false'),
  },
  Telemetry: {
    enabled: coalesce(import.meta.env.VITE_TELEMETRY_ENABLED, 'true'),
  },
}

export type ConfigFlags = typeof DefaultFlags

interface ConfigContextProps {
  features: ConfigFeatures
  flags: ConfigFlags
}

export const useConfigContext = (): ConfigContextProps => {
  const [flags] = useState({ ...DefaultFlags })
  const [features] = useState({ ...DefaultConfig })

  return { features, flags }
}
