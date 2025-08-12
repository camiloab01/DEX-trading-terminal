import { ConfigFeatures } from './app/context/ConfigContext'
import { TokenList } from './app/lib/tokenList'
import log from 'loglevel'

export const DefaultConfig: ConfigFeatures = {
  Swap: { enabled: 'true' },
  ChainRpc: {
    omni: 'wss://omni.icarus.tools/',
    protocols: ['wss', 'https'],
  },
  Router: {
    url: 'https://canoe.icarus.tools',
  },
  Telemetry: {
    enabled: 'true',
    url: 'https://telemetry.apiary.software',
    multibase_key: '88e5b8a6-ac60-44b1-bcc3-0f8f5a249313',
  },
  Analytics: {
    enabled: 'true',
    url: 'https://oku.trade/info',
  },
  Docs: {
    enabled: 'true',
    url: 'https://docs.oku.trade/home',
  },
  Logging: {
    level: 'warn',
  },
  Chains: {
    hidden: [],
    featured: [],
    comingsoon: [],
  },
  Accounts: {
    url: 'https://accounts.staging.gfx.town',
    gfx_login_provider_id: 'oidc.login.gfx.staging.town',
  },
  ...window.ConfigJsStaticOptions,
}

if (window.log === undefined) {
  window.log = log
  const originalFactory = log.methodFactory
  log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName)
    return rawMethod.bind(rawMethod, `[${methodName}]`)
  }
  log.setLevel(log.getLevel())
  if (DefaultConfig?.Logging?.level && window?.ConfigJsStaticOptions?.Logging) {
    log.setLevel(window.ConfigJsStaticOptions.Logging.level)
  }
}

declare global {
  interface Window {
    ConfigJsStaticOptions: any
    OkuTokenList: any
    log: log.RootLogger
    zaraz?: any
    OkuOfacList: any
  }
}

export const DefaultTokenList: TokenList = window.OkuTokenList
export const OkuOfacList: any = window.OkuOfacList
