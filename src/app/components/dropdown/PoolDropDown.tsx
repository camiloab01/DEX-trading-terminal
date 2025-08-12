import StarSVG from '../../assets/star.svg'
import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getTokenByAddress } from '../../lib/getToken'
import { CHAIN_INFO } from '../../constants/abi/chainInfo'
import { useEffect, useState } from 'react'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { GoChevronDown } from 'react-icons/go'
import { RoundTokenLogo } from '../misc/RoundTokenLogo'
import { useChainLoader } from '../../route/loaderData'
import { BsCheckLg } from 'react-icons/bs'
import { TokenSymbol } from '../misc/TokenSymbol'
import { usePageName } from '../../hooks/usePageName'

interface ITokenButton {
  setShowModal: (value: boolean) => void
  setToken: (token: string) => void
  token: {
    symbol: string
    name: string
    address: string
    decimals: number
    logoURI: string
  }
  selectedToken: string
}
export default function PoolDropDown({ token, setToken }: { token: string; setToken: (value: string) => void }) {
  const { currentChain } = useChainLoader()
  const { pageName } = usePageName()
  const [tokens] = useState<Map<string, any>>(new Map())
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0,0)' },
    common: { transformOrigin: `top right` },
  })
  const dismiss = useDismiss(context)
  const click = useClick(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  tokens.set('Watchlist', { symbol: 'Watchlist', logoURI: StarSVG })
  useEffect(() => {
    const tokensInfo = CHAIN_INFO[currentChain].tokenList.map(async (token) =>
      getTokenByAddress(token.address, currentChain)
    )
    tokensInfo.forEach((token) => {
      token.then((token) => {
        token.symbol && tokens.set(token.symbol, token)
      })
    })
  }, [currentChain])
  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`h-full flex gap-x-2 border ${pageName === 'liquidity' ? 'border-gray-700' : 'border-gray-700 xl:border-gray-800'} items-center justify-center 
        ${pageName === 'liquidity' ? 'bg-gray-800' : 'bg-gray-800 xl:bg-gray-900'} outline-1 rounded-md cursor-pointer`}
      >
        {token !== '' && <RoundTokenLogo logoUrl={tokens.get(token).logoURI} tokenSymbol={token} size={16} />}
        {token === '' ? <T3 color={colors.gray[400]}>Select token</T3> : <T3 color={colors.white}>{token}</T3>}
        <GoChevronDown color={colors.gray[400]} />
      </div>
      {isOpen && (
        <div
          className={`bg-gray-750 z-10 mt-0.5 border border-gray-700 rounded-xl h-fit text-white flex flex-col`}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div style={{ ...styles }}>
            {[...tokens.keys()].map((tokenItem, index) => {
              if (tokenItem == 'Watchlist') return
              const thisToken = tokens.get(tokenItem)
              return (
                <TokenButton
                  key={index}
                  token={thisToken}
                  setShowModal={setIsOpen}
                  setToken={setToken}
                  selectedToken={token}
                />
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

const TokenButton = (props: ITokenButton) => {
  const { token, setShowModal, setToken, selectedToken } = props

  return (
    <button
      className="text-white hover:bg-gray-drophover flex gap-x-3 py-2 px-4 rounded-xl items-center w-full"
      key={token.address}
      onClick={() => {
        setToken(token.symbol)
        setShowModal(false)
      }}
    >
      <RoundTokenLogo tokenSymbol={token.symbol} logoUrl={token.logoURI} size={24} />
      <T3>
        <TokenSymbol address={token.address} fallback_name={token.symbol} shortenSymbol />
      </T3>
      {token.symbol === selectedToken && <BsCheckLg color={colors.green[300]} className="ml-auto sm:ml-0" />}
    </button>
  )
}
