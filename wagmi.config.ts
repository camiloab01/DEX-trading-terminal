import { defineConfig } from '@wagmi/cli'
import permit2Abi from './abis/permit2.json'
import uniswapNftManagerAbi from './abis/uniswapNftManager.json'
import ChainlinkLimitOrderAbi from './abis/chainlinkLimitOrder.json'

import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' }
import { actions, react } from '@wagmi/cli/plugins'
import { erc20Abi, erc721Abi } from 'viem'
export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'permit2',
      abi: permit2Abi as any,
    },
    {
      name: 'uniswapNftManager',
      abi: uniswapNftManagerAbi,
    },
    {
      name: 'uniswapV3Pool',
      abi: IUniswapV3PoolABI.abi,
    },
    {
      name: 'chainlinkLimitOrder',
      abi: ChainlinkLimitOrderAbi,
    },
    {
      name: 'erc20',
      abi: erc20Abi,
    },
    {
      name: 'erc721',
      abi: erc721Abi,
    },
  ],
  plugins: [actions({}), react({})],
})
