import { FormattedNumber } from '../numbers/FormatNumber'
import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useThemeContext } from '../../context/ThemeContext'
import useMobile from '../../hooks/useMobile'
import { useDataContext } from '../../context/DataContext'
import { useCurrentClient } from '../../hooks/useClient'
import { TokenSymbol } from '../misc/TokenSymbol'

function InfoBar() {
  const { token } = useDataContext()
  const { poolSummary } = useDataContext()
  const { isMobile } = useMobile()
  const price = token.selected === 0 ? 1 / poolSummary.t0_price : poolSummary.t0_price
  const { data: tokenOverview0 } = useCurrentClient('cush_getTokenOverview', [poolSummary.t0], {})
  const { data: tokenOverview1 } = useCurrentClient('cush_getTokenOverview', [poolSummary.t1], {})
  const marketCap =
    token.selected === 1 ? tokenOverview0?.circulating_market_cap_usd : tokenOverview1?.circulating_market_cap_usd

  return poolSummary == undefined ? (
    <></>
  ) : (
    <>
      <InfoText title={'Price'} info={<FormattedNumber num={price} />} />
      {poolSummary != undefined && poolSummary.t0 != undefined ? (
        <InfoText
          title={'24H Change'}
          info={
            <FormattedNumber
              num={
                token.selected === 0
                  ? poolSummary.t1_price * poolSummary.t1_change
                  : poolSummary.t0_price * poolSummary.t0_change
              }
            />
          }
          percentChange={token.selected === 0 ? poolSummary.t1_change * 100 : poolSummary.t0_change * 100}
        />
      ) : (
        <></>
      )}
      <InfoText
        title={'TVL'}
        info={
          <FormattedNumber
            num={poolSummary.t0_tvl * poolSummary.t0_price_usd + poolSummary.t1_tvl * poolSummary.t1_price_usd}
          />
        }
        token="$"
        percentChange={poolSummary?.tvl_usd_change * 100}
      />

      <InfoText
        title={isMobile ? 'Vol. 24H' : 'Volume 24H'}
        info={<FormattedNumber num={token.selected === 0 ? poolSummary.t0_volume : poolSummary.t1_volume} />}
        token={
          token.selected === 0 ? (
            <TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />
          ) : (
            <TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />
          )
        }
        percentChange={(token.selected === 0 ? poolSummary.t0_volume_change : poolSummary.t1_volume_change) * 100}
      />
      <InfoText
        title={isMobile ? 'Vol. 7D' : 'Volume 7D'}
        info={<FormattedNumber num={token.selected === 0 ? poolSummary.t0_volume_7d : poolSummary.t1_volume_7d} />}
        token={
          token.selected === 0 ? (
            <TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />
          ) : (
            <TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />
          )
        }
        percentChange={token.selected === 0 ? poolSummary.t0_volume_change_7d : poolSummary.t1_volume_change_7d}
      />
      {marketCap != undefined ? <InfoText title={'Market Cap'} info={<FormattedNumber num={marketCap} />} /> : <> </>}
    </>
  )
}

export default InfoBar

interface IInfoText {
  title: string
  info: string | JSX.Element
  token?: string | JSX.Element
  percentChange?: number | undefined
}

const InfoText = (props: IInfoText) => {
  const { title, info, token, percentChange = undefined } = props
  const { colors: themeColors } = useThemeContext()
  const changeColor =
    percentChange !== undefined
      ? percentChange > 0
        ? themeColors.pos_color
        : percentChange < 0
          ? themeColors.neg_color
          : colors.white
      : ''
  const Icon =
    percentChange !== undefined ? (
      percentChange > 0 ? (
        <T2 color={changeColor}>+</T2>
      ) : percentChange < 0 ? (
        <T2 color={changeColor}>-</T2>
      ) : (
        <div></div>
      )
    ) : (
      <div></div>
    )

  return (
    <div className="flex flex-row my-1" style={{ width: 'min-content' }}>
      <div className="whitespace-nowrap mr-1">
        <T2 color={colors.gray[300]}>{title}:</T2>
      </div>
      <div className="whitespace-nowrap ">
        {typeof info === 'string' ? (
          <T2>{info}</T2>
        ) : (
          <div className="flex">
            {token === '$' ? (
              <T2>
                {token}
                {info}
              </T2>
            ) : (
              <T2>
                {info} {token}
              </T2>
            )}
          </div>
        )}
      </div>
      {percentChange !== undefined && (
        <div className="flex flex-row ml-2 items-center">
          {isNaN(percentChange) || isNaN(Math.abs(percentChange)) || !Number.isFinite(percentChange) ? (
            <T3 color={colors.gray[300]}>NA</T3>
          ) : (
            <>
              {Icon}
              <T3 color={changeColor}>{Math.abs(percentChange).toFixed(2)}%</T3>
            </>
          )}
        </div>
      )}
    </div>
  )
}
