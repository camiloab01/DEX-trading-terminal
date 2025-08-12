import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { arbitrum, optimism } from 'viem/chains'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useChainLoader } from '../route/loaderData'

interface RpcBlockContextProps {
  blockNumber: number
  blockNumberByChain: number
}

const RpcBlockContext = createContext({} as RpcBlockContextProps)

const chainIDsToUpdateEveryThreeBlocks: number[] = [optimism.id, arbitrum.id]

const shouldUpdateBlockNumberByChain = (currentBlock: number, chainID: number) => {
  // depending on the chain, we want to update the block number every few blocks
  const divisor = chainIDsToUpdateEveryThreeBlocks.includes(chainID) ? 3 : 1
  return currentBlock % divisor === 0
}

export const RpcBlockContextProvider = ({ children }: { children: any }) => {
  const [blockNumber, setBlockNumber] = useState(0)
  const [blockNumberByChain, setBlockNumberByChain] = useState(0)
  const { cushRpc, chainID } = useChainLoader()
  const cushRpcRef = useRef(cushRpc)
  cushRpcRef.current = cushRpc

  const { data, refetch, isError } = useQuery({
    refetchInterval: 1000,
    placeholderData: keepPreviousData,
    gcTime: 0,
    queryKey: [new Date().valueOf()],
    queryFn: async () => {
      const ans = await cushRpcRef.current.call('cush_liveBlock', [])
      return ans
    },
  })

  useEffect(() => {
    refetch()
  }, [cushRpcRef, cushRpc])

  useEffect(() => {
    if (data != undefined) {
      setBlockNumber(data)
      if (shouldUpdateBlockNumberByChain(data, chainID)) {
        setBlockNumberByChain(data)
      }
    }
  }, [data])

  useEffect(() => {
    if (isError === true) {
      setBlockNumber(-1)
      setBlockNumberByChain(-1)
    }
  }, [isError])

  return <RpcBlockContext.Provider value={{ blockNumber, blockNumberByChain }}>{children}</RpcBlockContext.Provider>
}

export const useRpcBlockContext = (): RpcBlockContextProps => {
  const context = useContext<RpcBlockContextProps>(RpcBlockContext)
  if (context === null) {
    throw new Error('"useRpcBlockContext" should be used inside a "RpcBlockContextProvider"')
  }

  return context
}
