import React, { useEffect, useState } from 'react'
import { AddLiquidityState, CreatePoolState, IBalanceToken } from '../../modals/CreatePoolModal'
import { useChainLoader } from '../../../route/loaderData'
import { useNetworkContext } from '../../../context/NetworkContext'
import { useAccount } from 'wagmi'
import { OrderBannerEnums } from '../../banners/OrderBanners'
import { parseUnits } from 'viem'
import { getTickFromPrice } from '../../../util/calculateTick'
import { colors } from '../../../constants/colors'
import { T2, T3 } from '../../typography/Typography'
import Input from '../../inputs/NumberInput'
import { RoundTokenLogo } from '../../misc/RoundTokenLogo'
import { FormattedNumber } from '../../numbers/FormatNumber'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { CreatePoolInputContainer, NumberInputField } from './CreateNewPool'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { createPoolAddLiqMulticall } from '../../../contracts/pool'
import { ITransaction, TransactionType, useTransactions } from '../../../context/TransactionsContext'
import { FontWeightEnums } from '../../../types/Enums'

function AddLiquidityNewPool({
  addLiquidityState,
  setAddLiquidityState,
  onBack,
  createPoolState,
  onClose,
  balanceToken0,
  balanceToken1,
}: {
  addLiquidityState: AddLiquidityState
  setAddLiquidityState: React.Dispatch<React.SetStateAction<AddLiquidityState>>
  onBack: () => void
  createPoolState: CreatePoolState
  onClose: () => void
  balanceToken0: IBalanceToken | undefined
  balanceToken1: IBalanceToken | undefined
}) {
  const [disabled, setDisabled] = useState<boolean>(true)
  const { currentChainInfo } = useChainLoader()
  const { provider, signer } = useNetworkContext()
  const { address } = useAccount()
  const { add, isCompleted, setIsCompleted } = useTransactions()
  const [enoughBalance, setEnoughBalance] = useState(false)

  useEffect(() => {
    if (
      createPoolState == undefined ||
      addLiquidityState.token0Amount === '' ||
      Number(addLiquidityState.token0Amount) === 0 ||
      addLiquidityState.token1Amount === '' ||
      Number(addLiquidityState.token1Amount) === 0 ||
      !address
    ) {
      setDisabled(true)
      return
    }

    if (balanceToken0 && balanceToken1) {
      const token0Parsed = parseUnits(addLiquidityState.token0Amount, balanceToken0?.decimals)
      const token1Parsed = parseUnits(addLiquidityState.token1Amount, balanceToken1?.decimals)
      if (balanceToken0?.value < token0Parsed || balanceToken1?.value < token1Parsed) {
        setDisabled(true)
        setEnoughBalance(false)
        return
      } else {
        addLiquidityState.token0Amount !== '' && addLiquidityState.token1Amount !== '' && setEnoughBalance(true)
      }
    }
    setDisabled(addLiquidityState.minPrice === '' || addLiquidityState.maxPrice === '')
  }, [addLiquidityState])

  useEffect(() => {
    // use createPoolState.inputPrice and range to calculate minPrice and maxPrice
    if (addLiquidityState.range != undefined && createPoolState != undefined) {
      const rangeHalf = addLiquidityState.range / 2
      const priceMin = parseFloat(createPoolState.inputPrice) * (1 - rangeHalf / 100)
      const priceMax = parseFloat(createPoolState.inputPrice) * (1 + rangeHalf / 100)
      setAddLiquidityState((prevState) => {
        return { ...prevState, minPrice: priceMin.toString(), maxPrice: priceMax.toString() }
      })
    }
  }, [addLiquidityState.range])

  useEffect(() => {
    if (isCompleted) {
      onClose()
      setDisabled(false)
      setIsCompleted(false)
    }
  }, [isCompleted])

  const onSubmit = async () => {
    const { feeTier, inputPrice } = createPoolState
    const { token0Amount, token1Amount, minPrice, maxPrice } = addLiquidityState
    if (createPoolState == undefined || signer == undefined || address == undefined || feeTier == undefined) return
    if (provider == undefined || balanceToken0 == undefined || balanceToken1 == undefined) return
    const createPool = async function (this: ITransaction): Promise<`0x${string}`> {
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_TRANSACTION)
      const minTick = getTickFromPrice(parseFloat(minPrice), balanceToken0.decimals, balanceToken1.decimals, true)
      const maxTick = getTickFromPrice(parseFloat(maxPrice), balanceToken0.decimals, balanceToken1.decimals, true)
      const txn = await createPoolAddLiqMulticall(
        createPoolState.token0Address as `0x${string}`,
        createPoolState.token1Address as `0x${string}`,
        balanceToken0.decimals,
        balanceToken1.decimals,
        feeTier,
        parseFloat(inputPrice),
        parseFloat(token0Amount),
        parseFloat(token1Amount),
        address,
        { lower: minTick, upper: maxTick },
        signer,
        provider,
        currentChainInfo.contracts.nftManager.address
      )
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_TRANSACTION_IN_PROGRESS, false, txn)
      return txn
    }
    add({ type: TransactionType.CREATE_POOL, fn: createPool, signer, provider })
    setDisabled(true)
  }

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <button onClick={() => onBack()} className="text-white hover:colors-gray-200">
          <ArrowLeftIcon width={12} color="inherit" />
        </button>
        <T2 color={colors.gray[100]} weight={FontWeightEnums.MEDIUM}>
          Add Liquidity
        </T2>
      </div>
      {createPoolState.feeTier != undefined && createPoolState != undefined && (
        <div className="text-white text-xs font-medium mt-5 p-2">{createPoolState.feeTier / 10000}% Fee Tier</div>
      )}
      <form className="flex flex-col gap-y-3 mt-3">
        <CreatePoolInputContainer
          title="Select Range"
          element={
            <div className="flex gap-1 flew-row justify-between w-full">
              {RANGE.map((range) => (
                <RangeTab
                  key={range}
                  range={range}
                  isActive={range === addLiquidityState.range}
                  onClick={setAddLiquidityState}
                />
              ))}
            </div>
          }
        />
        <div className="flex flex-col md:flex-row gap-2 ">
          <CreatePoolInputContainer
            title="Min Price"
            element={
              <NumberInputField
                value={addLiquidityState.minPrice}
                onInput={(value) =>
                  setAddLiquidityState((state) => {
                    return { ...state, range: undefined, minPrice: value }
                  })
                }
              />
            }
          />
          <CreatePoolInputContainer
            title="Max Price"
            element={
              <NumberInputField
                value={addLiquidityState.maxPrice}
                onInput={(value) =>
                  setAddLiquidityState((state) => {
                    return { ...state, range: undefined, maxPrice: value }
                  })
                }
              />
            }
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 ">
          <CreatePoolInputContainer
            title="Enter Amount"
            element={
              <EnterAmountInput
                tokenAddress={createPoolState.token0Address}
                balanceToken={balanceToken0}
                value={addLiquidityState.token0Amount}
                onInput={(value) =>
                  setAddLiquidityState((state) => {
                    return { ...state, token0Amount: value }
                  })
                }
              />
            }
          />
          <CreatePoolInputContainer
            title="Enter Amount"
            element={
              <EnterAmountInput
                tokenAddress={createPoolState.token1Address}
                balanceToken={balanceToken1}
                value={addLiquidityState.token1Amount}
                onInput={(value) =>
                  setAddLiquidityState((state) => {
                    return { ...state, token1Amount: value }
                  })
                }
              />
            }
          />
        </div>
        <button
          className="flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold bg-blue-400 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white"
          disabled={disabled}
          type="button"
          onClick={() => onSubmit()}
        >
          {addLiquidityState.token0Amount === '' || addLiquidityState.token1Amount === ''
            ? 'Create Position'
            : addLiquidityState.maxPrice === ''
              ? 'Set Max Price'
              : addLiquidityState.minPrice === ''
                ? 'Set Min Price'
                : enoughBalance
                  ? 'Create Position'
                  : 'Not Enough in Wallet'}
        </button>
      </form>
    </div>
  )
}

export default AddLiquidityNewPool

const EnterAmountInput = ({
  tokenAddress,
  balanceToken,
  value,
  onInput,
}: {
  tokenAddress: string
  balanceToken:
    | {
        decimals: number
        formatted: string
        symbol: string
        value: bigint
      }
    | undefined
  value: string
  onInput: (value: string) => void
}) => {
  const [focus, setFocus] = useState(false)
  const { currentChainInfo } = useChainLoader()
  const logo = getTokenLogoUrl(tokenAddress, currentChainInfo.id)
  return (
    <div className="flex flex-col  ">
      <div
        className={`rounded-lg ${!focus ? 'border-gray-800' : ' border-blue-400'}  border  flex flex-row items-center p-[2px] gap-x-1`}
      >
        <div className="flex items-center gap-1 bg-gray-700 rounded-md py-1 px-2 h-fit">
          <RoundTokenLogo tokenSymbol={balanceToken?.symbol} logoUrl={logo} size={12} />
          <T2>{balanceToken?.symbol}</T2>
        </div>
        <Input
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          classes=" bg-gray-dark placeholder:text-gray-300 focus:outline-0 rounded-lg placeholder:text-[12px] text-[12px] placeholder:font-normal p-[2px] pr-1 text-end"
          value={value}
          onUserInput={(value) => onInput(value)}
        />
      </div>
      {balanceToken && balanceToken?.formatted && (
        <T3 color={colors.gray[400]} className="mt-2">
          {<FormattedNumber num={balanceToken?.formatted} notation="standard" />} {balanceToken?.symbol}{' '}
        </T3>
      )}
    </div>
  )
}
const RANGE = [12.5, 25, 50, 75, 100]

const RangeTab = ({
  range,
  isActive,
  onClick,
}: {
  range: number
  isActive: boolean
  onClick: React.Dispatch<React.SetStateAction<AddLiquidityState>>
}) => {
  return (
    <button
      className={`rounded-md flex-grow w-full py-2 border ${isActive ? 'border-blue-400 bg-blue-800 text-blue-400' : 'border-gray-800 text-gray-100'}`}
      onClick={() => onClick((state) => ({ ...state, range }))}
      type="button"
    >
      <T3 weight={FontWeightEnums.MEDIUM} className="w-full" color={isActive ? colors.blue[400] : colors.gray[100]}>
        {range}%
      </T3>
    </button>
  )
}
