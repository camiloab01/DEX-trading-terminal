window.ConfigJsStaticOptions = {
  Logging: {
    level: 'trace',
  },
  Analytics: {
    enabled: 'true',
    url: 'https://oku.trade/info/',
  },
  Swap: {
    enabled: 'true',
  },
  Router: {
    url: 'https://canoe.staging.gfx.town',
  },
  ChainRpc: {
    omni: 'https://cush.staging.gfx.town/',
    protocols: ['https', 'wss'],
  },
  Telemetry: {
    enabled: 'true',
    url: 'https://telemetry.staging.gfx.town',
    multibase_key: '',
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
}
