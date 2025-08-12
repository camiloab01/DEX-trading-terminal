import { zeroAddress } from 'viem'
import { useDataContext } from '../../context/DataContext'
import { useSwapPageContext } from '../../context/SwapPageContext'
import { FormattedNumber } from '../numbers/FormatNumber'
import { T4 } from '../typography/Typography'
import { useEffect, useMemo } from 'react'
import { useAccount, useBalance, useBlockNumber } from 'wagmi'
import { colors } from '../../constants/colors'
import { useQueryClient } from '@tanstack/react-query'
import { GetBalanceData } from 'wagmi/query'
import { IFontSizeAndLineHeight } from '../../types/Interface'
import { TokenSymbol } from '../misc/TokenSymbol'

interface IBalanceTag {
  balance: GetBalanceData | undefined
  showIcon?: boolean
  fontSize?: IFontSizeAndLineHeight
  tokenAddress: string | undefined
}

export const BalanceTag = (props: IBalanceTag) => {
  const { balance, showIcon, fontSize, tokenAddress } = props

  return (
    <div className="flex flex-row gap-1 items-center">
      {showIcon && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.5 5.8125C11.5 5.4644 11.3617 5.13056 11.1156 4.88442C10.8694 4.63828 10.5356 4.5 10.1875 4.5H8C8 4.96413 7.81563 5.40925 7.48744 5.73744C7.15925 6.06563 6.71413 6.25 6.25 6.25C5.78587 6.25 5.34075 6.06563 5.01256 5.73744C4.68437 5.40925 4.5 4.96413 4.5 4.5H2.3125C1.9644 4.5 1.63056 4.63828 1.38442 4.88442C1.13828 5.13056 1 5.4644 1 5.8125M11.5 5.8125V9.3125C11.5 9.6606 11.3617 9.99444 11.1156 10.2406C10.8694 10.4867 10.5356 10.625 10.1875 10.625H2.3125C1.9644 10.625 1.63056 10.4867 1.38442 10.2406C1.13828 9.99444 1 9.6606 1 9.3125V5.8125M11.5 5.8125V4.0625M1 5.8125V4.0625M11.5 4.0625C11.5 3.7144 11.3617 3.38056 11.1156 3.13442C10.8694 2.88828 10.5356 2.75 10.1875 2.75H2.3125C1.9644 2.75 1.63056 2.88828 1.38442 3.13442C1.13828 3.38056 1 3.7144 1 4.0625M11.5 4.0625V2.3125C11.5 1.9644 11.3617 1.63056 11.1156 1.38442C10.8694 1.13828 10.5356 1 10.1875 1H2.3125C1.9644 1 1.63056 1.13828 1.38442 1.38442C1.13828 1.63056 1 1.9644 1 2.3125V4.0625"
            stroke={colors.gray[400]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <T4 color={colors.gray[400]} fontSize={fontSize}>
        {balance ? <FormattedNumber num={parseFloat(balance.formatted)} notation="standard" /> : 'Loading'}
        {tokenAddress && <TokenSymbol address={tokenAddress} fallback_name={balance?.symbol} />}
      </T4>
    </div>
  )
}

export default function MemoizedBalanceTag({
  flip,
  showIcon = false,
  isSwapPage,
  fontSize,
}: {
  flip: boolean
  showIcon?: boolean
  isSwapPage: boolean
  fontSize?: IFontSizeAndLineHeight
}) {
  const { poolSummary } = useDataContext()
  const { token0, token1 } = useSwapPageContext()
  const { address } = useAccount()
  const selectedToken = flip ? token0 : token1
  const tokenAddress = isSwapPage ? selectedToken?.address : poolSummary.t0
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balance, queryKey } = useBalance({
    address: address,
    token: (tokenAddress !== zeroAddress ? tokenAddress : undefined) as any,
  })

  const queryClient = useQueryClient()
  useEffect(() => {
    if ((blockNumber ?? 0n) % 2n === 0n) {
      queryClient.invalidateQueries({ queryKey })
    }
  }, [blockNumber, queryClient])

  return useMemo(
    () => <BalanceTag balance={balance} showIcon={showIcon} fontSize={fontSize} tokenAddress={tokenAddress} />,
    [balance, flip]
  )
}
