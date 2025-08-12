import ScreenContainer from '../components/containers/ScreenContainer'
import { CreatePoolModal } from '../components/modals/CreatePoolModal'
import TransactionModal from '../components/modals/swap/TransactionModal'
import { CHAIN_INFO } from '../constants/abi/chainInfo'
import AppContext from '../context/Context'
import { OmniCush } from '../context/RpcContext'
import { NotFound404 } from '../pages/NotFound404'
import SwapPage from '../pages/SwapPage'
import { TelemetrySender } from './TelemetrySender'
import {
  createBrowserRouter,
  matchPath,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useConfigContext } from '../context/ConfigContext'
import { SharedHelmet } from './helmet'
import { chainDataLoader } from './loaderData'
import { isAddress } from 'viem'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { OkuOfacList } from '../../config'
import { PoolPage } from '../pages/PoolPage'

function FallbackComponent() {
  return (
    <div className="flex gap-8 grow flex-col items-center align-center justify-center w-full h-full">
      <div className="text-white text-xl">
        An error has been occurred, sorry!.{' '}
        <a href=".">Click here to refresh your page</a>
      </div>
      <a className="text-white" href="https://support.gfx.xyz/t/oku-trade">
        If you continue to get this error, click here to file a ticket
      </a>
    </div>
  )
}
const chainNames = Object.keys(CHAIN_INFO).map(
  (chain) => CHAIN_INFO[chain].internalName
)
const createRouter = (omniCush: OmniCush) => {
  let chain = CHAIN_INFO[1]
  if (window.ethereum?.networkVersion) {
    const currentChainInfo =
      CHAIN_INFO[window.ethereum.networkVersion as number]
    if (currentChainInfo != undefined) {
      chain = currentChainInfo
    }
  }
  const myFallback = <FallbackComponent />
  const sentryCreateBrowserRouter =
    Sentry.wrapCreateBrowserRouter(createBrowserRouter)
  const defaultPage = `/app/${chain.internalName}/swap/${chain.defaultToken0}/${chain.defaultToken1}`
  const pages: RouteObject[] = [
    {
      path: 'pool',
      handle: { base: 'pool' },
      loader: async ({ params, request }) => {
        const { currentChainInfo } = chainDataLoader(omniCush, {
          params,
          request,
        })
        if (!params.poolAddress) {
          return redirect(
            `/app/${params.chain}/pool/${currentChainInfo.defaultPool + new URL(request.url).search}`
          )
        }
        if (!isAddress(params.poolAddress)) {
          return redirect(`app/${params.chain}/404`)
        }
        return null
      },
      children: [{ id: 'pool', path: ':poolAddress', element: <PoolPage /> }],
    },
    {
      path: 'swap',
      handle: { base: 'swap' },
      loader: async ({ params, request }) => {
        const { currentChainInfo } = chainDataLoader(omniCush, {
          params,
          request,
        })
        if (!params.token0 || !params.token1) {
          return redirect(
            `/app/${params.chain}/swap/${currentChainInfo.defaultToken0}/${
              currentChainInfo.defaultToken1 + new URL(request.url).search
            }`
          )
        }
        if (!isAddress(params.token0) || !isAddress(params.token1)) {
          return redirect(`app/${params.chain}/404`)
        }
        return null
      },
      children: [
        { id: 'swap', path: ':token0/:token1', element: <SwapPage /> },
      ],
    },
  ]

  const AppWrapper = () => {
    const { isConnected, address } = useAccount()
    const userAddress = address as string
    const onOfacList =
      address &&
      OkuOfacList.some((item: string) => {
        return item.toLowerCase() === userAddress.toLowerCase()
      })
    const showSite = isConnected ? !onOfacList : true
    if (showSite) return <Outlet />
  }
  const childRoutes: RouteObject[] = [
    { path: '404', element: <NotFound404 /> },
    {
      path: '/trade',
      loader: async () => redirect(`/app/${chain.internalName}/pool`),
    },
    { path: '/swap', loader: async () => redirect(defaultPage) },
    {
      errorElement: <Sentry.ErrorBoundary fallback={myFallback} showDialog />,
      id: 'app',
      path: '/app',
      element: <AppWrapper />,
      loader: async ({ params, request }: any) => {
        if (!params.chain || !chainNames.includes(params.chain)) {
          return redirect(defaultPage + new URL(request.url).search)
        }
        const url = new URL(request.url)
        if (matchPath('/:chain', url.pathname)) {
          return redirect(
            `/app/${params.chain}/pool/${params.poolAddress + new URL(request.url).search}`
          )
        }
        return null
      },
      children: [
        {
          path: '*',
          element: <NotFound404 />,
          loader: async ({ request }: any) => {
            if (matchPath('/', new URL(request.url).pathname)) {
              return redirect(defaultPage + new URL(request.url).search)
            }
            return null
          },
        },
        {
          path: ':chain',
          id: 'chain',
          loader: async ({ params, request }: any) =>
            chainDataLoader(omniCush, { params, request }),
          element: (
            <>
              <TelemetrySender />
              <TransactionModal />
              <CreatePoolModal />
              {<Outlet />}
            </>
          ),
          children: [
            { path: '*', element: <NotFound404 /> },
            {
              path: '',
              loader: async ({ request }: any) =>
                redirect('./swap' + new URL(request.url).search),
              element: <NotFound404 />,
            },
            { id: 'pages', children: pages },
          ],
        },
      ],
    },
    {
      errorElement: <Sentry.ErrorBoundary fallback={myFallback} showDialog />,
      id: 'noRoute',
      path: '/*',
      element: <NotFound404 />,
    },
  ]

  const queryClient = new QueryClient({})
  const parentRoute: RouteObject = {
    id: 'parent',
    element: (
      <QueryClientProvider client={queryClient}>
        <AppContext>
          <SharedHelmet />
          <ScreenContainer>
            <Sentry.ErrorBoundary fallback={FallbackComponent}>
              <Outlet />
            </Sentry.ErrorBoundary>
          </ScreenContainer>
        </AppContext>
      </QueryClientProvider>
    ),
    loader: async ({ params, request }: any) => {
      return chainDataLoader(omniCush, { params, request })
    },
    children: childRoutes,
  }
  return sentryCreateBrowserRouter([parentRoute], {
    future: {
      v7_relativeSplatPath: true,
    },
  })
}

const RouteWrapper = () => {
  const { features } = useConfigContext()
  const [omniCush] = useState(
    new OmniCush(features.ChainRpc.omni, features.ChainRpc.protocols)
  )
  const router = createRouter(omniCush)
  return <RouterProvider router={router} />
}

export default RouteWrapper
