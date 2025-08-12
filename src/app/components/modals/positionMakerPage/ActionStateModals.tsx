import { FormattedNumber } from '../../numbers/FormatNumber'
import { T1, T2 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { FontWeightEnums } from '../../../types/Enums'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { UserPositions } from '@gfxlabs/oku'
import { getHoverColor } from '../../charts/utils/getHoverColor'
import { formatUnits } from 'viem'
import { useEffect, useState } from 'react'
import { RoundTokenLogo } from '../../misc/RoundTokenLogo'
import { useChainLoader } from '../../../route/loaderData'
import { TokenSymbol } from '../../misc/TokenSymbol'

const RemoveLiquidityButton = ({ onClick }: { onClick: () => void }) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rounded-[8px] flex items-center h-[38px] justify-center"
      style={{ backgroundColor: hover ? getHoverColor(colors.blue[400]) : colors.blue[400] }}
    >
      <T1 weight={FontWeightEnums.SEMIBOLD}>Remove all liquidity</T1>
    </button>
  )
}

interface IClosePosition {
  onClick: () => void
  position: UserPositions
}

export const ClosePosition = ({ onClick, position }: IClosePosition) => {
  const { currentChain } = useChainLoader()
  const [token0Logo, setToken0Logo] = useState<string>()
  const [token1Logo, setToken1Logo] = useState<string>()
  useEffect(() => {
    const token0Logo = getTokenLogoUrl(position.position_pool_data?.token0, currentChain)
    const token1Logo = getTokenLogoUrl(position.position_pool_data?.token1, currentChain)
    setToken0Logo(token0Logo)
    setToken1Logo(token1Logo)
  }, [position])
  return (
    <div
      className="flex flex-col w-[285px] h-[197px] p-3 border-[1px] rounded-[15px] justify-between"
      style={{ backgroundColor: colors.gray.dark, borderColor: colors.gray[800] }}
    >
      <div className="flex flex-row justify-between">
        <T1 weight={FontWeightEnums.SEMIBOLD}>Close Position</T1>
      </div>
      <div
        className="flex flex-col gap-3 px-4 py-3 rounded-[13px]"
        style={{ backgroundColor: colors.gray[800], borderColor: colors.gray[700] }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <RoundTokenLogo tokenSymbol={position.position_pool_data.token0_symbol} logoUrl={token0Logo} size={12} />
            <T2>
              <TokenSymbol
                address={position.position_pool_data.token0}
                fallback_name={position.position_pool_data.token0_symbol}
              />
            </T2>
          </div>
          <T2>
            <FormattedNumber
              num={Number(
                formatUnits(
                  BigInt(position.current_position_values.amount0_current),
                  position.position_pool_data.token0_decimals
                )
              )}
              notation="standard"
            />
          </T2>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <RoundTokenLogo tokenSymbol={position.position_pool_data.token1_symbol} logoUrl={token1Logo} size={12} />
            <T2>
              <TokenSymbol
                address={position.position_pool_data.token1}
                fallback_name={position.position_pool_data.token1_symbol}
              />
            </T2>
          </div>
          <T2>
            <FormattedNumber
              num={Number(
                formatUnits(
                  BigInt(position.current_position_values.amount1_current),
                  position.position_pool_data.token1_decimals
                )
              )}
              notation="standard"
            />
          </T2>
        </div>
      </div>
      <RemoveLiquidityButton onClick={onClick} />
    </div>
  )
}

interface IClaimFees {
  onClaim: () => void
  position: UserPositions
}

export const ClaimFees = ({ onClaim, position }: IClaimFees) => {
  const [token0Logo, setToken0Logo] = useState<string>()
  const [token1Logo, setToken1Logo] = useState<string>()
  const { currentChain } = useChainLoader()

  useEffect(() => {
    const token0Logo = getTokenLogoUrl(position.position_pool_data?.token0, currentChain)
    const token1Logo = getTokenLogoUrl(position.position_pool_data?.token1, currentChain)

    setToken0Logo(token0Logo)
    setToken1Logo(token1Logo)
  }, [position])

  return (
    <div
      className="flex flex-col w-[285px] p-3 border-[1px] rounded-[15px] gap-4"
      style={{ backgroundColor: colors.gray.dark, borderColor: colors.gray[800] }}
    >
      <div className="flex flex-row justify-between">
        <T2>Claim fees</T2>
      </div>
      <div
        className="flex flex-col gap-3 px-4 py-3 rounded-[13px]"
        style={{ backgroundColor: colors.gray[800], borderColor: colors.gray[700] }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <RoundTokenLogo tokenSymbol={position.position_pool_data.token0_symbol} logoUrl={token0Logo} size={12} />
            <div>
              <T2>
                <TokenSymbol
                  address={position.position_pool_data.token0}
                  fallback_name={position.position_pool_data.token0_symbol}
                />
              </T2>
            </div>
          </div>
          <T2>
            <FormattedNumber
              num={Number(
                formatUnits(
                  BigInt(position.current_fee_info.token0FeesUncollected),
                  position.position_pool_data.token0_decimals
                )
              )}
              notation="standard"
            />
          </T2>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <RoundTokenLogo tokenSymbol={position.position_pool_data.token1_symbol} logoUrl={token1Logo} size={12} />
            <T2>
              <TokenSymbol
                address={position.position_pool_data.token1}
                fallback_name={position.position_pool_data.token1_symbol}
              />
            </T2>
          </div>
          <T2>
            <FormattedNumber
              num={Number(
                formatUnits(
                  BigInt(position.current_fee_info.token1FeesUncollected),
                  position.position_pool_data.token1_decimals
                )
              )}
              notation="standard"
            />
          </T2>
        </div>
      </div>
      <button
        className="w-full text-white font-semibold h-[38px] flex items-center justify-center rounded-[8px] bg-blue-400 hover:bg-blue-800"
        onClick={onClaim}
      >
        Claim All Fees
      </button>
    </div>
  )
}
