import { useModalContext } from '../../context/ModalContext'
import BaseModal from './BaseModal'
import { useEffect, useState } from 'react'
import { useChainLoader } from '../../route/loaderData'
import CreateNewPool from '../forms/createPool/CreateNewPool'
import AddLiquidityNewPool from '../forms/createPool/AddLiquidityNewPool'
import useBreakpoint from '../../hooks/useBreakpoint'
import { useAccount, useBalance, useBlockNumber } from 'wagmi'

export interface CreatePoolState {
  token0Address: string
  token1Address: string
  feeTier: number | undefined
  inputPrice: string
}

export interface AddLiquidityState {
  range: number | undefined
  minPrice: string
  maxPrice: string
  token0Amount: string
  token1Amount: string
}

export interface IBalanceToken {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export const CreatePoolModal = () => {
  const { setShowCreatePoolModal, showCreatePoolModal } = useModalContext()
  const [step, setStep] = useState<number>(0)
  const initCreatePoolState = { token0Address: '', token1Address: '', feeTier: 3000, inputPrice: '' }
  const initAddLiqState = { range: undefined, minPrice: '', maxPrice: '', token0Amount: '', token1Amount: '' }
  const [createPoolState, setCreatePoolState] = useState<CreatePoolState>(initCreatePoolState)
  const [addLiquidityState, setAddLiquidityState] = useState<AddLiquidityState>(initAddLiqState)
  useEffect(() => {
    setCreatePoolState(initCreatePoolState)
    setAddLiquidityState(initAddLiqState)
  }, [showCreatePoolModal])

  useEffect(() => {
    if (showCreatePoolModal === false) {
      setStep(0)
      setCreatePoolState(initCreatePoolState)
      setAddLiquidityState(initAddLiqState)
    }
  }, [showCreatePoolModal])
  const breakpoints = useBreakpoint({ base: '20vh', sm: '30vh' })
  const { currentChainInfo } = useChainLoader()
  const { address } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balanceToken0, refetch: refetch0 } = useBalance({
    address: address,
    token: createPoolState?.token0Address as `0x${string}`,
    chainId: currentChainInfo.id,
  })
  const { data: balanceToken1, refetch: refetch1 } = useBalance({
    address: address,
    token: createPoolState?.token1Address as `0x${string}`,
    chainId: currentChainInfo.id,
  })

  useEffect(() => {
    refetch0()
    refetch1()
  }, [blockNumber])

  return (
    <BaseModal
      showModal={showCreatePoolModal}
      showCloseButton={true}
      offsetTop={breakpoints}
      onClose={() => setShowCreatePoolModal(false)}
    >
      <div className="bg-gray-dark rounded-2xl p-4 text-gray-100 border-[1px] border-gray-800  ">
        {step === 0 ? (
          <CreateNewPool
            onSubmit={() => setStep(1)}
            createPoolState={createPoolState}
            setCreatePoolState={setCreatePoolState}
            balanceToken0={balanceToken0}
            balanceToken1={balanceToken1}
          />
        ) : (
          <AddLiquidityNewPool
            addLiquidityState={addLiquidityState}
            setAddLiquidityState={setAddLiquidityState}
            onBack={() => setStep(0)}
            createPoolState={createPoolState}
            onClose={() => setShowCreatePoolModal(false)}
            balanceToken0={balanceToken0}
            balanceToken1={balanceToken1}
          />
        )}
      </div>
    </BaseModal>
  )
}
