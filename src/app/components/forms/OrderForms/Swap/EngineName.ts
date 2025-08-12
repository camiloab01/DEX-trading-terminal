import { capitalizeFirstLetter } from '../../../../util/capitalizeFirstLetter.ts'

export default function EngineName(name: string) {
  const n = {
    usor: 'Uniswap',
    zeroex: '0x',
    okx: 'OKX',
    openocean: 'OpenOcean',
    oneinch: '1inch',
    paraswap: 'ParaSwap',
    propellerswap: 'PropellerSwap',
    kyberswap: 'KyberSwap',
    airswap: 'AirSwap',
  }[name]
  if (!n) return capitalizeFirstLetter(name)
  return n
}
