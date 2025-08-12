const envOr = (a, b) => {
  if (a) {
    return a
  }
  return b
}

const splitEnvOr = (a, b) => {
  if (a) {
    return a.split(' ')
  }
  return b
}

const obj = {
  Chat: {
    enabled: envOr(process.env.VITE_CHAT_ENABLED),
    url: envOr(process.env.VITE_CHAT_URL),
  },
  Login: {
    url: envOr(process.env.VITE_LOGIN_URL),
    app_id: envOr(process.env.VITE_LOGIN_APP_ID),
    path_prefix: envOr(process.env.VITE_LOGIN_PATH_PREFIX),
  },
  Whitelist: {
    enabled: envOr(process.env.VITE_WHITELIST_ENABLED),
  },
  Swap: {
    enabled: envOr(process.env.VITE_SWAP_ENABLED),
  },
  ChainRpc: {
    omni: envOr(process.env.VITE_OMNI_CUSH_URL),
    protocols: ['wss', 'https'],
  },
  Telemetry: {
    enabled: envOr(process.env.VITE_TELEMETRY_ENABLED),
    url: envOr(process.env.VITE_TELEMETRY_URL),
    multibase_key: envOr(process.env.VITE_TELEMETRY_MULTIBASE_KEY),
  },
  Router: {
    url: 'https://canoe.icarus.tools',
  },
  Accounts: {
    url: envOr(process.env.VITE_ACCOUNTS_URL),
    gfx_login_provider_id: envOr(process.env.VITE_GFX_LOGIN_PROVIDER_ID),
  },
}
const blob = JSON.stringify(obj)
console.log(`window.ConfigJsStaticOptions = ${blob}`)
