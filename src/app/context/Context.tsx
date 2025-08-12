import React from 'react'
import { RpcBlockContextProvider } from './RpcBlockContext'
import { ChartDataContextProvider } from '../components/charts/context/ChartDataContext'
import { DataContextProvider } from './DataContext'
import { PositionMakerContextProvider } from './PositionMakerContext'
import { SwapPageContextProvider } from './SwapPageContext'
import { UserOrderProvider } from './UserOrderContext'
import { NetworkContextProvider } from './NetworkContext'
import { Web3Provider } from '../Web3Provider'
import { I18nProvider } from './I18nContext'
import { ModalContextProvider } from './ModalContext'
import { RpcContextProvider } from './RpcContext'
import { TelemetryContextProvider } from './TelemetryContext'
import { ThemeContextProvider } from './ThemeContext'
import { BannersProvider } from '../components/banners/OrderBanners'
import { TransactionsContextProvider } from './TransactionsContext'
import { FirebaseContextProvider } from './FirebaseContext'

interface IContext {
  children: React.ReactNode
}

function AppContext(props: IContext): any {
  const { children } = props
  const providers = [
    I18nProvider,
    ThemeContextProvider,
    Web3Provider,
    FirebaseContextProvider,
    RpcContextProvider,
    ModalContextProvider,
    TelemetryContextProvider,
    NetworkContextProvider,
    RpcBlockContextProvider,
    DataContextProvider,
    ChartDataContextProvider,
    PositionMakerContextProvider,
    UserOrderProvider,
    SwapPageContextProvider,
    BannersProvider,
    TransactionsContextProvider,
  ]
  const res = providers.reduceRight((acc, CurrVal) => <CurrVal>{acc as any}</CurrVal>, children)
  return res as any
}

export default AppContext
