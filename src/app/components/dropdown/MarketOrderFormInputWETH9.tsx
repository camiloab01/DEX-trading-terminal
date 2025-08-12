import { T2 } from '../typography/Typography'
import { useMemo, useState } from 'react'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import { IToken } from '../../lib/getToken'
import { colors } from '../../constants/colors'
import { GoChevronDown } from 'react-icons/go'
import { createToken } from '../../util/createToken'
import { useDataContext } from '../../context/DataContext'
import { WETH9_ADDRESS } from '../../constants/abi/chainInfo'
import { zeroAddress } from 'viem'
import { useChainLoader } from '../../route/loaderData'
import { TokenSymbol } from '../misc/TokenSymbol'

export const MarketOrderFormInputWeth9Dropdown = ({
  token,
  setFromToken,
  disabled,
}: {
  token: IToken
  setFromToken: (value: IToken) => void
  disabled: boolean
}) => {
  const { currentChainInfo } = useChainLoader()
  const { token1, token0 } = useDataContext()
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
  })
  const { styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0.5,0)' },
    common: { transformOrigin: `top-right` },
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  const isWrapped = useMemo(
    () => token.address.toLowerCase() === WETH9_ADDRESS[currentChainInfo.id].toLowerCase(),
    [token.address]
  )
  const nativeToken = createToken({
    address: zeroAddress,
    symbol: currentChainInfo.nativeCurrency.symbol,
    decimals: currentChainInfo.nativeCurrency.decimals,
    name: currentChainInfo.nativeCurrency.name,
    chainId: currentChainInfo.id,
  }) as IToken
  const isToken0WrappedToken = token0.address.toLowerCase() === WETH9_ADDRESS[currentChainInfo.id].toLowerCase()
  const wrappedNativeToken = createToken({
    address: WETH9_ADDRESS[currentChainInfo.id],
    symbol: isToken0WrappedToken ? (token0.symbol as string) : (token1.symbol as string),
    decimals: currentChainInfo.nativeCurrency.decimals,
    name: isToken0WrappedToken ? (token0.name as string) : (token1.name as string),
    chainId: currentChainInfo.id,
  }) as IToken

  const onClickHandler = () => {
    nativeToken.logoURI = token.logoURI
    wrappedNativeToken.logoURI = token.logoURI
    if (isWrapped) setFromToken(nativeToken)
    else setFromToken(wrappedNativeToken)
    setIsOpen(false)
  }

  return (
    <>
      <div
        className="flex flex-row rounded-[6px] w-fit  items-center justify-center cursor-pointer"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="flex flex-row gap-1 ml-1">
          <T2 color={colors.gray[100]}>
            <TokenSymbol address={token.address} fallback_name={token.symbol} />
          </T2>
          <GoChevronDown />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="z-10" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <div
            className="z-10 mt-2 bg-gray-750 flex flex-row gap-2 py-2 px-3 outline outline-gray-700 outline-1 rounded-lg hover:bg-gray-800 hover:outline-blue-600 cursor-pointer"
            style={{
              ...styles,
            }}
            onClick={onClickHandler}
          >
            <T2 color={colors.gray[100]}>
              {isWrapped ? (
                <TokenSymbol address={nativeToken.address} fallback_name={nativeToken.symbol} />
              ) : (
                <TokenSymbol address={wrappedNativeToken.address} fallback_name={wrappedNativeToken.symbol} />
              )}
            </T2>
          </div>
        </div>
      )}
    </>
  )
}
