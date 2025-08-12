import { T3 } from '../../../typography/Typography.tsx'
import { colors } from '../../../../constants/colors.ts'
import { formatNumber } from '../../../numbers/FormatNumber.tsx'
import { useRpcBlockContext } from '../../../../context/RpcBlockContext.tsx'
import { useEffect, useState } from 'react'
import { useNetworkContext } from '../../../../context/NetworkContext.tsx'
import { ReactSVG } from 'react-svg'
const Gas = 'https://assets.oku.trade/Icon/Gas.svg'

export const GasInfo = ({
  gas,
  color = colors.gray[50],
  showGasPrice = false,
}: {
  gas?: number
  color?: string
  showGasPrice?: boolean
}) => {
  const { blockNumberByChain } = useRpcBlockContext()
  const [gasPrice, setGasPrice] = useState<number>()
  const { provider } = useNetworkContext()
  useEffect(() => {
    if (showGasPrice && provider != undefined) {
      provider.getGasPrice().then((res) => {
        setGasPrice(parseFloat(res.toString()) / 10 ** 9)
      })
    } else {
      setGasPrice(undefined)
    }
  }, [blockNumberByChain, provider])
  return (
    <div className="flex flex-row gap-1 items-center ">
      <ReactSVG src={Gas} style={{ color }} className={'w-2.5 h-2.5'} />
      <T3 color={color}>
        {gas != undefined && gasPrice != undefined
          ? `${formatNumber({
              num: gas,
              aboveOneDecimalAmount: 0,
              belowOneDecimalAmount: 0,
              notation: 'standard',
            })} @ ${formatNumber({
              num: gasPrice,
              belowOneDecimalAmount: 2,
              notation: 'standard',
            })} Gwei`
          : gas != undefined
            ? formatNumber({
                num: gas,
                aboveOneDecimalAmount: 0,
                belowOneDecimalAmount: 0,
                notation: 'standard',
              })
            : gasPrice != undefined
              ? `${formatNumber({
                  num: gasPrice,
                  belowOneDecimalAmount: 2,
                  notation: 'standard',
                })} Gwei`
              : '...'}
      </T3>
    </div>
  )
}
