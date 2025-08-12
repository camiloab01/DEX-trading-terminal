import React, { useEffect, useState } from 'react'
import { CreatePoolState, IBalanceToken } from '../../modals/CreatePoolModal'
import { useAccount, useSwitchChain } from 'wagmi'
import { isAddress } from 'viem'
import { colors } from '../../../constants/colors'
import { T2, T3 } from '../../typography/Typography'
import CreatePoolFeeDropdown from '../../dropdown/CreatePoolFee'
import Input from '../../inputs/NumberInput'
import { useCurrentClient } from '../../../hooks/useClient'
import { FontWeightEnums } from '../../../types/Enums'
import { useChainLoader } from '../../../route/loaderData'

export default function CreateNewPool({
  onSubmit,
  createPoolState,
  setCreatePoolState,
  balanceToken0,
  balanceToken1,
}: {
  onSubmit: () => void
  createPoolState: CreatePoolState
  setCreatePoolState: React.Dispatch<React.SetStateAction<CreatePoolState>>
  balanceToken0: IBalanceToken | undefined
  balanceToken1: IBalanceToken | undefined
}) {
  const [disabled, setDisabled] = useState<boolean>(true)
  const { address, isConnected, chain } = useAccount()
  const { currentChain } = useChainLoader()
  const { switchChain: switchNetwork } = useSwitchChain({})
  const { data: searchResults } = useCurrentClient('cush_search', [
    createPoolState.token0Address.concat(' '.concat(createPoolState.token1Address)).toString(),
    {
      fee_tiers: [Number(createPoolState.feeTier)],
      result_offset: 0,
      sort_by: 'total_volume_7d_usd',
      result_size: 50,
      sort_order: false,
    },
  ])
  const { data: token0Search } = useCurrentClient('cush_search', [createPoolState.token0Address])
  const { data: token1Search } = useCurrentClient('cush_search', [createPoolState.token1Address])

  useEffect(() => {
    setDisabled(
      !(
        isAddress(createPoolState.token1Address) &&
        token0Search &&
        token0Search?.pools != undefined &&
        (token0Search?.pools.length > 0 ? createPoolState.token0Address !== token0Search?.pools[0].address : true) &&
        isAddress(createPoolState.token0Address) &&
        token1Search &&
        token1Search?.pools != undefined &&
        (token1Search?.pools.length > 0 ? createPoolState.token1Address !== token1Search?.pools[0].address : true) &&
        createPoolState.feeTier !== undefined &&
        createPoolState.inputPrice !== '' &&
        Number(createPoolState.inputPrice) > 0 &&
        isConnected &&
        address &&
        searchResults?.pools.length === 0 &&
        createPoolState.token0Address !== createPoolState.token1Address
      )
    )
  }, [createPoolState, token0Search, token1Search, searchResults])

  useEffect(() => {
    if (isAddress(createPoolState.token0Address) && isAddress(createPoolState.token1Address)) {
      const address0 = BigInt(createPoolState.token0Address)
      const address1 = BigInt(createPoolState.token1Address)
      if (address1 < address0) {
        setCreatePoolState((state) => {
          return {
            ...state,
            token0Address: createPoolState.token1Address,
            token1Address: createPoolState.token0Address,
          }
        })
      }
    }
  }, [createPoolState.token0Address, createPoolState.token1Address])
  const token0Symbol = balanceToken0 ? balanceToken0?.symbol : 'Token0'
  const token1Symbol = balanceToken1 ? balanceToken1?.symbol : 'Token1'

  useEffect(() => {
    if (chain && chain.id !== currentChain) switchNetwork?.({ chainId: currentChain })
  }, [])

  return (
    <div>
      <T2 color={colors.gray[100]} weight={FontWeightEnums.MEDIUM}>
        Create New Pool
      </T2>
      <form onSubmit={onSubmit} className="flex flex-col gap-y-2 mt-3">
        <div className="flex  flex-col md:flex-row gap-2">
          <CreatePoolInputContainer
            title="Token 0 Address"
            element={
              <input
                className="bg-gray-dark  placeholder:text-gray-500 focus:border-blue-400 focus:outline-none placeholder:text-[12px] text-xs placeholder:font-normal rounded-md border border-gray-700 p-2 h-[30px] w-full "
                value={createPoolState.token0Address}
                placeholder="0x9434...5543"
                onChange={(e) => {
                  setCreatePoolState((state) => {
                    return { ...state, token0Address: e.target.value }
                  })
                }}
              />
            }
          />
          <CreatePoolInputContainer
            title="Token 1 Address"
            element={
              <input
                className="bg-gray-dark placeholder:text-gray-500 focus:border-blue-400 focus:outline-none placeholder:text-[12px] text-xs placeholder:font-normal rounded-md border border-gray-700 p-2 h-[30px] w-full "
                value={createPoolState.token1Address}
                placeholder="0x9434...5543"
                onChange={(e) => {
                  setCreatePoolState((state) => {
                    return { ...state, token1Address: e.target.value }
                  })
                }}
              />
            }
          />
        </div>
        <div className="">
          <div className="flex flex-col md:flex-row gap-2 ">
            <CreatePoolInputContainer
              title="Choose Fee Tier"
              element={
                <CreatePoolFeeDropdown
                  fee={createPoolState.feeTier}
                  setFee={(fee) => {
                    setCreatePoolState((state) => {
                      return { ...state, feeTier: fee }
                    })
                  }}
                />
              }
            />
            <CreatePoolInputContainer
              title="Input Price"
              element={
                <NumberInputField
                  value={createPoolState.inputPrice}
                  onInput={(value) =>
                    setCreatePoolState((state) => {
                      return { ...state, inputPrice: value }
                    })
                  }
                />
              }
            />
          </div>
          <div className="flex justify-end">
            {createPoolState.inputPrice !== '' ? (
              <div className="pt-1 w-64">
                <T3 color={colors.gray[400]}>
                  {createPoolState.inputPrice} {token1Symbol} per {token0Symbol}
                </T3>
              </div>
            ) : (
              <div className="pt-1"></div>
            )}
          </div>
        </div>
        <button
          disabled={disabled}
          className="flex w-full justify-center items-center h-[32px] rounded-md text-[14px] font-medium bg-blue-400 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-gray-50"
        >
          {createPoolState.token0Address === createPoolState.token1Address &&
          createPoolState.token0Address !== '' &&
          createPoolState.token1Address !== ''
            ? 'Addresses Cannot be Identical'
            : (createPoolState.token0Address !== '' && !isAddress(createPoolState.token0Address)) ||
                (createPoolState.token1Address !== '' && !isAddress(createPoolState.token1Address))
              ? 'Invalid Address'
              : createPoolState.token0Address !== '' &&
                  createPoolState.token1Address !== '' &&
                  searchResults?.pools &&
                  searchResults?.pools.length > 0
                ? 'Pool Already Exists'
                : isConnected
                  ? 'Next'
                  : 'Connect Wallet'}
        </button>
      </form>
    </div>
  )
}

export const CreatePoolInputContainer = ({ title, element }: { title?: string; element: React.ReactElement }) => {
  return (
    <div className="flex flex-col gap-2  flex-1 justify-between min-w-64 w-full items-between ">
      {title !== undefined ? <T3 color={colors.gray[100]}>{title}</T3> : <div className=""></div>}
      <div className="min-h-8 w-full ">{element}</div>
    </div>
  )
}

export const NumberInputField = ({ value, onInput }: { value: string; onInput: (value: string) => void }) => {
  return (
    <Input
      classes="bg-gray-dark placeholder:text-gray-300 focus:outline-none focus:border-blue-400 placeholder:text-[12px] placeholder:font-normal rounded-md border-gray-800 p-2  text-xs h-[30px] "
      style={{ borderStyle: 'solid', borderWidth: '1px' }}
      value={value}
      onUserInput={(value) => onInput(value)}
    />
  )
}
