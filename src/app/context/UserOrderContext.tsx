import { Order } from '@gfxlabs/oku'
import { fetchOrdersForUsers } from '../data/fetchOrdersForUser'
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import { useAccount, useBlockNumber } from 'wagmi'
import { useChainLoader } from '../route/loaderData'
interface UserOrderContextProps {
  allUserOrders: Order[] | undefined
  getAndSetAllUserOrders: (address: `0x${string}`) => void
  setUpdateUserInfo: (value: boolean) => void
}

export const UserOrderContext = createContext({} as UserOrderContextProps)

export const UserOrderProvider = ({ children }: { children: ReactElement }) => {
  const { address } = useAccount()
  const { cushRpc, currentChainInfo } = useChainLoader()
  const [allUserOrders, setAllUserOrders] = useState<Order[] | undefined>()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [update, setUpdateUserInfo] = useState(false)
  const [count, setCount] = useState(0)
  const [blockCount, setBlockCount] = useState(0)
  const blockTime = currentChainInfo.blockTimeSeconds

  useEffect(() => {
    setAllUserOrders([])
    if (address) {
      getAndSetAllUserOrders(address)
    }
  }, [address, cushRpc, currentChainInfo])

  useEffect(() => {
    if (!update) return
    if (blockTime < 10 ? blockCount < 30 : blockCount < 3 * blockTime) {
      if (address) {
        setBlockCount(blockCount + blockTime)
        getAndSetAllUserOrders(address)
      }
    } else {
      setUpdateUserInfo(false)
      setBlockCount(0)
    }
  }, [blockNumber])

  useEffect(() => {
    if (allUserOrders != undefined) {
      setCount(allUserOrders.length + allUserOrders.length)
      if (count < allUserOrders.length + allUserOrders.length) {
        setUpdateUserInfo(false)
      }
    }
  }, [allUserOrders])

  const getAndSetAllUserOrders = (address: `0x${string}`) => {
    fetchOrdersForUsers(cushRpc, address)
      .then((orders) => {
        orders.sort((a, b) => {
          if (b.limit_order_full) {
            return 1
          }
          if (a.limit_order_full) {
            return -1
          }
          if (b.status?.toLowerCase() === 'open') {
            return 1
          }
          if (a.status?.toLowerCase() === 'open') {
            return -1
          }
          if (b.time != undefined && a.time != undefined) {
            return b.time - a.time
          } else {
            return 0
          }
        })
        setAllUserOrders(orders)
      })
      .catch(() => {
        setAllUserOrders([])
      })
  }

  return (
    <UserOrderContext.Provider value={{ allUserOrders, getAndSetAllUserOrders, setUpdateUserInfo }}>
      {children}
    </UserOrderContext.Provider>
  )
}

export const useUserOrderContext = (): UserOrderContextProps => {
  const context = useContext<UserOrderContextProps>(UserOrderContext)

  if (context === null) {
    throw new Error('"useUserOrderContext" should be used inside a "UserOrderContextProvider"')
  }

  return context
}
