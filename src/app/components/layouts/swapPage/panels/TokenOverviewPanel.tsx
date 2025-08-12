import { formatNumber, FormattedNumber } from '../../../numbers/FormatNumber'
import { T1, T2, T3 } from '../../../typography/Typography'
import { colors } from '../../../../constants/colors'
import { IToken } from '../../../../lib/getToken'
import { FontWeightEnums } from '../../../../types/Enums'
import TokenSwitch from '../../../switch/TokenSwitch'
import { PercentChangeCard } from '../cards/PercentChange'
import { useEffect, useState } from 'react'
import { usePoolTokenInfo } from '../../../../hooks/usePoolTokenInfo'
import { TokenOverview } from '@gfxlabs/oku'
import { isStableCoin } from '../../../../constants/abi/chainInfo'
import { useChainLoader } from '../../../../route/loaderData'
import { TokenSymbol } from '../../../misc/TokenSymbol'

interface ITokenOverviewPanel {
  token0: IToken
  token1: IToken
  tokenOverview0: TokenOverview | undefined
  tokenOverview1: TokenOverview | undefined
}
export default function TokenOverviewPanel(props: ITokenOverviewPanel) {
  const { token0: token1, token1: token0, tokenOverview0: tokenOverview1, tokenOverview1: tokenOverview0 } = props
  const { currentChain } = useChainLoader()
  const { token, setToken } = usePoolTokenInfo()
  const [selectedToken, setSelectedToken] = useState(token.selected === 0 ? tokenOverview0 : tokenOverview1)

  useEffect(() => {
    // set to default to not on the stablecoin
    const isToken0Stable = isStableCoin(currentChain, token0.address)
    const isToken1Stable = isStableCoin(currentChain, token1.address)
    if (!((isToken0Stable && isToken1Stable) || (!isToken0Stable && !isToken1Stable))) {
      if (isToken1Stable) setToken(0)
      else setToken(1)
    }
  }, [token0.address, token1.address])
  useEffect(() => {
    if (tokenOverview0 && tokenOverview1 && token != undefined) {
      if (token.selected === 0) {
        tokenOverview0.address.toLowerCase() === token0.address.toLowerCase()
          ? setSelectedToken(tokenOverview0)
          : setSelectedToken(undefined)
      } else {
        tokenOverview1.address.toLowerCase() === token1.address.toLowerCase()
          ? setSelectedToken(tokenOverview1)
          : setSelectedToken(undefined)
      }
    }
  }, [tokenOverview0, tokenOverview1, token])

  return (
    <div className={`flex flex-1 flex-col bg-gray-900 rounded-xl border border-gray-800 p-3`}>
      <div className="flex justify-between w-full">
        <T2 weight={FontWeightEnums.MEDIUM} color={colors.gray[50]}>
          Token Overview
        </T2>
        <div>
          <TokenSwitch
            setTokenSelected={setToken}
            token={token}
            token0Address={token0.address}
            token0Symbol={token0.symbol}
            token1Address={token1.address}
            token1Symbol={token1.symbol}
            isLogo={true}
          />
        </div>
      </div>
      <div>
        {selectedToken ? (
          <div>
            <T3 color={colors.gray[400]}>
              {selectedToken.name} <TokenSymbol address={selectedToken.address} fallback_name={selectedToken.symbol} />
            </T3>
            <div className="flex content-end mt-2">
              <T1 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
                $
                {selectedToken.price_deltas != undefined &&
                  formatNumber({
                    num: selectedToken.price_deltas?.price_usd,
                  })}
              </T1>
              <div className="flex items-end ml-2">
                {selectedToken.price_deltas.day_change_usd > 0 ? <T2 color={colors.green[300]}>+</T2> : <> </>}
                <p
                  className={`${
                    selectedToken.price_deltas.day_change_usd > 0 ? 'text-green-300' : 'text-red-300'
                  } text-xs`}
                >
                  <FormattedNumber
                    belowOneDecimalAmount={2}
                    num={selectedToken.price_deltas.day_change_usd * 100}
                    notation="standard"
                  />
                  %
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-2">
              {selectedToken.circulating_market_cap_usd > 0 && (
                <div className="flex flex-col bg-gray-800 w-full border border-gray-750 rounded-[10px] py-4 px-3 gap-y-2 items-center justify-center">
                  <T3 color={colors.gray[400]}>{'Market Cap'}</T3>
                  <T2 color={colors.gray[100]}>
                    {' '}
                    ${<FormattedNumber num={selectedToken.circulating_market_cap_usd} notation="compact" />}
                  </T2>
                </div>
              )}
              {selectedToken.fully_diluted_market_cap_usd > 0 && (
                <div className="flex flex-col bg-gray-800 w-full border border-gray-750 rounded-[10px] py-4 px-3 gap-y-2 items-center justify-center">
                  <T3 color={colors.gray[400]}>Fully Diluted Value</T3>
                  <T2 color={colors.gray[100]}>
                    {' '}
                    ${<FormattedNumber num={selectedToken.fully_diluted_market_cap_usd} notation="compact" />}
                  </T2>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 mt-5 gap-x-2 gap-y-2">
              <PercentChangeCard time="1H" percent={selectedToken.price_deltas.hour_change_usd} />
              <PercentChangeCard time="24H" percent={selectedToken.price_deltas.day_change_usd} />
              <PercentChangeCard time="7D" percent={selectedToken.price_deltas.week_change_usd} />
              <PercentChangeCard time="14D" percent={selectedToken.price_deltas.two_week_change_usd} />
              <PercentChangeCard time="30D" percent={selectedToken.price_deltas.month_change_usd} />
              <PercentChangeCard time="1Y" percent={selectedToken.price_deltas.year_change_usd} />
            </div>
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
            <T2>No Data Found</T2>
          </div>
        )}
      </div>
    </div>
  )
}
