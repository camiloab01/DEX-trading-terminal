import { useFirebaseContext } from '../context/FirebaseContext.tsx'
import { useNetworkContext } from '../context/NetworkContext.tsx'
import { OAuthProvider } from 'firebase/auth'
import axios from 'axios'
import { useConfigContext } from '../context/ConfigContext.tsx'

export const useSilentLogin = () => {
  const { provider, signer } = useNetworkContext()
  const { authenticate, refetchJwtToken, address } = useFirebaseContext()
  const {
    features: { Accounts },
  } = useConfigContext()
  const accountsAPI = axios.create({ baseURL: Accounts.url })

  const login = async () => {
    if (signer == undefined || provider == undefined || provider == null) {
      throw new Error('signer and provider not present')
    }
    const address = signer.account.address

    const {
      data: { challenge },
    } = await accountsAPI.post<{ challenge: string }>('/login/challenge', {
      address,
      chain_id: await signer.getChainId(),
      uri: window.location.href,
    })

    const solution = await signer.signMessage({
      account: address,
      message: challenge,
    })

    const {
      data: { token, token_type },
    } = await accountsAPI.post<{
      token: string
      token_type: string
    }>('/login/solution', { solution, challenge })

    window.log.debug('token', token, 'token_type', token_type)

    const oAuthProvider = new OAuthProvider(Accounts.gfx_login_provider_id)
    const credential = oAuthProvider.credential({ idToken: token })
    const userInfo = await authenticate(credential)
    const firebaseJwt = await userInfo.user.getIdToken(false)

    await accountsAPI.post('/login/link', { token, token_type }, { headers: { 'X-Firebase-Jwt': firebaseJwt } })
    await refetchJwtToken()
  }

  const authenticated = address !== undefined
  return {
    login,
    authenticated,
  }
}
