import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { FontWeightEnums } from '../../types/Enums'
import { getTokenLogoUrl } from '../../util/getTokenLogo'
import { PoolTokenInfo } from '../../context/DataContext'
import { getHoverColor } from '../charts/utils/getHoverColor'
import { ReactElement, useState } from 'react'
import { RoundTokenLogo } from '../misc/RoundTokenLogo'
import { useChainLoader } from '../../route/loaderData'
import { TokenSymbol } from '../misc/TokenSymbol'

interface IBaseSwitch {
  token: PoolTokenInfo
  setTokenSelected: (value: number) => void
  token0Address: string
  token0Symbol: string | undefined
  token1Address: string
  token1Symbol: string | undefined
  isLogo?: boolean
}

interface IButton {
  onClick: () => void
  children: string | ReactElement
  color: string
  weight: FontWeightEnums
  isLogo: boolean
}

interface IHighlight {
  token: PoolTokenInfo
  isLogo?: boolean
}

function TokenSwitch(props: IBaseSwitch) {
  const { token, setTokenSelected, token0Address, token0Symbol, token1Address, token1Symbol, isLogo = false } = props
  const { currentChain } = useChainLoader()
  return !isLogo ? (
    <div
      className="min-w-[140px] h-[32px] rounded-md border text-[14px] font-normal items-center relative"
      style={{ backgroundColor: colors.gray[800], borderColor: colors.gray[750] }}
    >
      {token !== undefined && <Highlight token={token} />}
      <div className="flex flex-row flex-1 rounded-md w-full h-full absolute">
        <ChooseItemButton
          color={token.selected === 0 ? colors.gray[100] : colors.gray[300]}
          weight={token.selected === 0 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            if (token.selected !== 0) {
              setTokenSelected(0)
            }
          }}
          isLogo={isLogo}
        >
          <TokenSymbol address={token0Address} fallback_name={token0Symbol} />
        </ChooseItemButton>
        <ChooseItemButton
          color={token.selected === 1 ? colors.gray[100] : colors.gray[300]}
          weight={token.selected === 1 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            if (token.selected !== 1) {
              setTokenSelected(1)
            }
            setTokenSelected(1)
          }}
          isLogo={isLogo}
        >
          <TokenSymbol address={token1Address} fallback_name={token1Symbol} />
        </ChooseItemButton>
      </div>
    </div>
  ) : (
    <div
      className="min-w-[80px] h-[32px] rounded-md border text-[14px] font-normal items-center relative"
      style={{ backgroundColor: colors.gray[800], borderColor: colors.gray[750] }}
    >
      {token !== undefined && <Highlight token={token} isLogo={true} />}
      <div className="flex flex-row flex-1 rounded-[6px] w-full h-full absolute ">
        <ChooseItemButton
          color={token.selected === 0 ? colors.gray[100] : colors.gray[500]}
          weight={token.selected === 0 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            setTokenSelected(0)
          }}
          isLogo={isLogo}
        >
          <div className="w-[16px]">
            <RoundTokenLogo
              logoUrl={getTokenLogoUrl(token0Address, currentChain)}
              tokenSymbol={token0Symbol}
              size={16}
            />
          </div>
        </ChooseItemButton>
        <ChooseItemButton
          color={token.selected === 1 ? colors.gray[100] : colors.gray[500]}
          weight={token.selected === 1 ? FontWeightEnums.MEDIUM : FontWeightEnums.REGULAR}
          onClick={() => {
            setTokenSelected(1)
          }}
          isLogo={isLogo}
        >
          <div className="w-[20px]">
            <RoundTokenLogo
              logoUrl={getTokenLogoUrl(token1Address, currentChain)}
              tokenSymbol={token1Symbol}
              size={16}
            />
          </div>
        </ChooseItemButton>
      </div>
    </div>
  )
}

export default TokenSwitch

const ChooseItemButton = (props: IButton) => {
  const { onClick, color, children, weight, isLogo } = props
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="flex flex-1 justify-center items-center rounded-md"
    >
      {!isLogo ? (
        <T3 weight={weight} color={hover ? getHoverColor(color) : color}>
          {children}
        </T3>
      ) : (
        children
      )}
    </button>
  )
}

const Highlight = (props: IHighlight) => {
  const { token } = props
  return (
    <div className={`h-full absolute w-full flex`}>
      <div
        style={{ backgroundColor: colors.gray[750] }}
        className={`h-full w-[50%] rounded-[6px] transform transition-all duration-300  ${
          token.selected === 1 ? 'transform translate-x-[100%]' : ''
        }`}
      ></div>
    </div>
  )
}
