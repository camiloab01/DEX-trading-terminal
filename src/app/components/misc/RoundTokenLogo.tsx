import noTokenLogo from '../../assets/no-token-logo.webp'

export const RoundTokenLogo = ({
  logoUrl = noTokenLogo,
  tokenSymbol = '',
  size = 18,
}: {
  logoUrl?: string
  tokenSymbol?: string
  size?: number | string
}) => (
  <div className={`rounded-full`} style={{ width: size, height: size }}>
    <img className="rounded-full" src={logoUrl} alt={tokenSymbol} style={{ width: size, height: size }} />
  </div>
)

export const RoundTokenLogoPair = ({
  token0LogoUrl,
  token1LogoUrl,
  token0Symbol = '',
  token1Symbol = '',
  size = 18,
}: {
  token0LogoUrl: string
  token1LogoUrl: string
  token0Symbol?: string
  token1Symbol?: string
  size?: number
}) => (
  <div className="flex">
    <div className={`z-10`}>
      <RoundTokenLogo logoUrl={token0LogoUrl} tokenSymbol={token0Symbol} size={size} />
    </div>
    <div className={`-left-1 relative`}>
      <RoundTokenLogo logoUrl={token1LogoUrl} tokenSymbol={token1Symbol} size={size} />
    </div>
  </div>
)
