import { t } from '@lingui/macro'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const defaultDesc = `Trade DeFi with Oku, a professional-grade Uniswap v3 front-end platform. Enjoy live trading, track orders, and implement limit and market orders with precision. Ideal for pro traders seeking advanced DEX features.`
const defaultLongDesc = `Trade DeFi with Oku, a professional-grade Uniswap v3 front-end platform. Enjoy live trading, track orders, and implement limit and market orders with precision. Ideal for pro traders seeking advanced DEX features.`
export const TitleAndDescriptionFunc = (args: {
  pageTitle?: string
  pageDescription?: string
  longPageDescription?: string
}) => {
  let { pageTitle, pageDescription, longPageDescription } = args
  pageTitle = pageTitle ? t`${pageTitle}` : t`oku.trade`
  pageDescription = pageDescription ? t`${pageDescription}` : t`${defaultDesc}`
  longPageDescription = longPageDescription ? t`${longPageDescription}` : t`${defaultLongDesc}`
  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:description" content={longPageDescription} />
      <meta property="twitter:description" content={longPageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="twitter:title" content={pageTitle} />
    </Helmet>
  )
}
export const SharedHelmet = () => {
  const loc = useLocation()
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="keywords"
          content="Crypto, Uniswap, Token, Pool, Trade, Analytics, Dex, Position, Swap, Price, Volume"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.oku.trade/app${loc.pathname}`} />
        <meta property="og:image" content="https://cdn.gfx.xyz/okusplash.png" />
      </Helmet>
    </>
  )
}
