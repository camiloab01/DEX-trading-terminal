import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithCredential,
  linkWithCredential,
  AuthCredential,
  EmailAuthProvider,
  IdTokenResult,
  UserCredential,
} from 'firebase/auth'
import { firebase } from '../lib/firebase'
import { useQuery } from '@tanstack/react-query'

export interface LoginOptions {
  email?: string
}

interface IFirebaseContext {
  email?: string
  address?: `0x${string}`
  user?: User
  jwtToken?: IdTokenResult

  refetchJwtToken(): Promise<IdTokenResult | undefined>
  authenticate(credential: AuthCredential): Promise<UserCredential>

  login(x: LoginOptions): Promise<void>
  logout(): Promise<void>
}

const FirebaseContext = createContext<IFirebaseContext>({
  refetchJwtToken: async () => undefined,
  authenticate: async () => {
    throw new Error('no firebase context')
  },
  login: async () => undefined,
  logout: async () => undefined,
})
export const FirebaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [auth] = useState(getAuth(firebase))

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user)
      else setUser(undefined)
    })
  }, [auth])

  const { data: jwtToken, refetch } = useQuery({
    queryKey: ['firebase', user?.uid || ''],
    enabled: !!user,
    queryFn: () => {
      if (user) return user?.getIdTokenResult(true)
      return undefined
    },
  })

  const refetchJwtToken = async () => {
    const { data } = await refetch()
    return data
  }

  const address = jwtToken?.claims.eth_address as `0x${string}` | undefined

  const authenticate = async (credential: AuthCredential): Promise<UserCredential> => {
    if (!user) {
      return await signInWithCredential(auth, credential)
    } else {
      for (const userInfo of user.providerData) {
        if (userInfo.providerId === credential.providerId) {
          // already logged in
          return { providerId: null, operationType: 'link', user }
        }
      }
      // link credential
      return await linkWithCredential(user, credential)
    }
  }

  const login = async (x: LoginOptions) => {
    const { email } = x
    if (email) {
      sendSignInLinkToEmail(auth, email, {
        url: window.location.toString(),
        handleCodeInApp: true,
      })
        .then(() => {
          window.localStorage.setItem('emailForSignIn', email)
          window.alert('check ur email')
        })
        .catch((error) => {
          window.log.error(error)
        })
    }
  }

  const logout = async () => {
    await auth.signOut()
  }
  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
        if (!email) {
          return
        }
      }
      // The client SDK will parse the code from the link for you.
      const credential = EmailAuthProvider.credentialWithLink(email, window.location.href)
      authenticate(credential)
        .then(() => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn')
        })
        .catch(() => {})
    }
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        refetchJwtToken,
        authenticate,
        login,
        logout,
        address,
        jwtToken,
        user,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebaseContext = () => useContext(FirebaseContext)
