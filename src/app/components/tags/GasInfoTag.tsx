import { T3 } from '../typography/Typography'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useNetworkContext } from '../../context/NetworkContext'
import { useRpcBlockContext } from '../../context/RpcBlockContext'
import { colors } from '../../constants/colors'
import { ReactSVG } from 'react-svg'
import { formatNumber } from '../numbers/FormatNumber'
const Gas = 'https://assets.oku.trade/Icon/Gas.svg'

export default function GasInfoTag() {
  const { blockNumberByChain } = useRpcBlockContext()
  const { provider } = useNetworkContext()
  const { isConnected } = useAccount()
  const [gas, setGas] = useState('')

  useEffect(() => {
    if (provider != undefined) {
      provider.getGasPrice().then((res) => {
        setGas((parseFloat(res.toString()) / 10 ** 9).toString()) // gwei converter
      })
    }
  }, [blockNumberByChain, provider])

  return (
    <div className="flex flex-row gap-1 items-center ">
      <ReactSVG src={Gas} style={{ color: colors.gray[50] }} className={'w-2.5 h-2.5'} />
      <T3 color={colors.gray[50]} fontSize={{ base: '12px', sm: '12px' }}>
        {!isConnected && provider == undefined
          ? 'Please Connect Wallet'
          : gas
            ? formatNumber({ num: gas }).concat(' Gwei')
            : 'loading'}
      </T3>
    </div>
  )
}
