import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// chainlinkLimitOrder
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const chainlinkLimitOrderAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      {
        name: '_positionManager',
        internalType: 'contract NonFungiblePositionManager',
        type: 'address',
      },
      {
        name: 'wrappedNative',
        internalType: 'contract ERC20',
        type: 'address',
      },
      {
        name: 'link',
        internalType: 'contract LinkTokenInterface',
        type: 'address',
      },
      {
        name: '_registrar',
        internalType: 'contract IKeeperRegistrar',
        type: 'address',
      },
      { name: '_fastGasFeed', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__AmountShouldBeZero' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__CenterITM' },
  {
    type: 'error',
    inputs: [],
    name: 'LimitOrderRegistry__ContractNotShutdown',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__ContractShutdown' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__DirectionMisMatch' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidBatchId' },
  {
    type: 'error',
    inputs: [],
    name: 'LimitOrderRegistry__InvalidFillsPerUpkeep',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidGasLimit' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidGasPrice' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidPositionId' },
  {
    type: 'error',
    inputs: [
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
    ],
    name: 'LimitOrderRegistry__InvalidTargetTick',
  },
  {
    type: 'error',
    inputs: [
      { name: 'upper', internalType: 'int24', type: 'int24' },
      { name: 'lower', internalType: 'int24', type: 'int24' },
    ],
    name: 'LimitOrderRegistry__InvalidTickRange',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'minimum', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'LimitOrderRegistry__MinimumNotMet',
  },
  {
    type: 'error',
    inputs: [{ name: 'asset', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__MinimumNotSet',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__NoLiquidityInOrder' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__NoOrdersToFulfill' },
  {
    type: 'error',
    inputs: [
      { name: 'currentTick', internalType: 'int24', type: 'int24' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
    ],
    name: 'LimitOrderRegistry__OrderITM',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'LimitOrderRegistry__OrderNotInList',
  },
  {
    type: 'error',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'LimitOrderRegistry__OrderNotReadyToClaim',
  },
  {
    type: 'error',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__PoolAlreadySetup',
  },
  {
    type: 'error',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__PoolNotSetup',
  },
  {
    type: 'error',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'batchId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'LimitOrderRegistry__UserNotFound',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__ZeroFeesToWithdraw',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__ZeroNativeBalance' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'affectedOrder',
        internalType: 'struct LimitOrderRegistry.BatchOrder',
        type: 'tuple',
        components: [
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'userCount', internalType: 'uint64', type: 'uint64' },
          { name: 'batchId', internalType: 'uint128', type: 'uint128' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'head', internalType: 'uint256', type: 'uint256' },
          { name: 'tail', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'CancelOrder',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'batchId',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimOrder',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'LimitOrderSetup',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'pool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'userTotal',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'affectedOrder',
        internalType: 'struct LimitOrderRegistry.BatchOrder',
        type: 'tuple',
        components: [
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'userCount', internalType: 'uint64', type: 'uint64' },
          { name: 'batchId', internalType: 'uint128', type: 'uint128' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'head', internalType: 'uint256', type: 'uint256' },
          { name: 'tail', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'NewOrder',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'batchId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pool',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'OrderFilled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'isShutdown',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ShutdownChanged',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FAST_GAS_HEARTBEAT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LINK',
    outputs: [
      {
        name: '',
        internalType: 'contract LinkTokenInterface',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_FILLS_PER_UPKEEP',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_GAS_LIMIT',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_GAS_PRICE',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'POSITION_MANAGER',
    outputs: [
      {
        name: '',
        internalType: 'contract NonFungiblePositionManager',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WRAPPED_NATIVE',
    outputs: [{ name: '', internalType: 'contract ERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'batchCount',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint128', type: 'uint128' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'batchIdToUserDepositAmount',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelOrder',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
      { name: 'batchId', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'checkData', internalType: 'bytes', type: 'bytes' }],
    name: 'checkUpkeep',
    outputs: [
      { name: 'upkeepNeeded', internalType: 'bool', type: 'bool' },
      { name: 'performData', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    name: 'claim',
    outputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'feePerUser', internalType: 'uint128', type: 'uint128' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'isReadyForClaim', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'batchId', internalType: 'uint128', type: 'uint128' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'claimOrder',
    outputs: [
      { name: '', internalType: 'contract ERC20', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fastGasFeed',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'startingNode', internalType: 'uint256', type: 'uint256' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
    ],
    name: 'findSpot',
    outputs: [
      { name: 'proposedHead', internalType: 'uint256', type: 'uint256' },
      { name: 'proposedTail', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'getClaim',
    outputs: [
      {
        name: '',
        internalType: 'struct LimitOrderRegistry.Claim',
        type: 'tuple',
        components: [
          {
            name: 'pool',
            internalType: 'contract UniswapV3Pool',
            type: 'address',
          },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'feePerUser', internalType: 'uint128', type: 'uint128' },
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'isReadyForClaim', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'getFeePerUser',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGasPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getOrderBook',
    outputs: [
      {
        name: '',
        internalType: 'struct LimitOrderRegistry.BatchOrder',
        type: 'tuple',
        components: [
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'userCount', internalType: 'uint64', type: 'uint64' },
          { name: 'batchId', internalType: 'uint128', type: 'uint128' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'head', internalType: 'uint256', type: 'uint256' },
          { name: 'tail', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'int24', type: 'int24' },
      { name: '', internalType: 'int24', type: 'int24' },
    ],
    name: 'getPositionFromTicks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initiateShutdown',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'isOrderReadyForClaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isShutdown',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liftShutdown',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract ERC20', type: 'address' }],
    name: 'minimumAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'startingNode', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'newOrder',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'orderBook',
    outputs: [
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'userCount', internalType: 'uint64', type: 'uint64' },
      { name: 'batchId', internalType: 'uint128', type: 'uint128' },
      { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'head', internalType: 'uint256', type: 'uint256' },
      { name: 'tail', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'performData', internalType: 'bytes', type: 'bytes' }],
    name: 'performUpkeep',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract UniswapV3Pool', type: 'address' }],
    name: 'poolToData',
    outputs: [
      { name: 'centerHead', internalType: 'uint256', type: 'uint256' },
      { name: 'centerTail', internalType: 'uint256', type: 'uint256' },
      { name: 'token0', internalType: 'contract ERC20', type: 'address' },
      { name: 'token1', internalType: 'contract ERC20', type: 'address' },
      { name: 'fee', internalType: 'uint24', type: 'uint24' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registrar',
    outputs: [{ name: '', internalType: 'contract IKeeperRegistrar', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'feed', internalType: 'address', type: 'address' }],
    name: 'setFastGasFeed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newVal', internalType: 'uint16', type: 'uint16' }],
    name: 'setMaxFillsPerUpkeep',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'asset', internalType: 'contract ERC20', type: 'address' },
    ],
    name: 'setMinimumAssets',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_registrar',
        internalType: 'contract IKeeperRegistrar',
        type: 'address',
      },
    ],
    name: 'setRegistrar',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'gasLimit', internalType: 'uint32', type: 'uint32' }],
    name: 'setUpkeepGasLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'gasPrice', internalType: 'uint32', type: 'uint32' }],
    name: 'setUpkeepGasPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'initialUpkeepFunds', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setupLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'tokenToSwapFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'upkeepGasLimit',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'upkeepGasPrice',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawNative',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenFeeIsIn', internalType: 'address', type: 'address' }],
    name: 'withdrawSwapFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721Abi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'operator', type: 'address', indexed: true },
      { name: 'approved', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenByIndex',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'tokeId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// permit2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const permit2Abi = [
  {
    type: 'error',
    inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }],
    name: 'AllowanceExpired',
  },
  { type: 'error', inputs: [], name: 'ExcessiveInvalidation' },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [{ name: 'maxAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidAmount',
  },
  { type: 'error', inputs: [], name: 'InvalidContractSignature' },
  { type: 'error', inputs: [], name: 'InvalidNonce' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidSignatureLength' },
  { type: 'error', inputs: [], name: 'InvalidSigner' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  {
    type: 'error',
    inputs: [{ name: 'signatureDeadline', internalType: 'uint256', type: 'uint256' }],
    name: 'SignatureExpired',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      {
        name: 'expiration',
        internalType: 'uint48',
        type: 'uint48',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Lockdown',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newNonce',
        internalType: 'uint48',
        type: 'uint48',
        indexed: false,
      },
      {
        name: 'oldNonce',
        internalType: 'uint48',
        type: 'uint48',
        indexed: false,
      },
    ],
    name: 'NonceInvalidation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      {
        name: 'expiration',
        internalType: 'uint48',
        type: 'uint48',
        indexed: false,
      },
      { name: 'nonce', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'Permit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'word',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'mask',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UnorderedNonceInvalidation',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [
      { name: 'amount', internalType: 'uint160', type: 'uint160' },
      { name: 'expiration', internalType: 'uint48', type: 'uint48' },
      { name: 'nonce', internalType: 'uint48', type: 'uint48' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint160', type: 'uint160' },
      { name: 'expiration', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'newNonce', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'invalidateNonces',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'wordPos', internalType: 'uint256', type: 'uint256' },
      { name: 'mask', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'invalidateUnorderedNonces',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'approvals',
        internalType: 'struct IAllowanceTransfer.TokenSpenderPair[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'spender', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'lockdown',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'nonceBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      {
        name: 'permitBatch',
        internalType: 'struct IAllowanceTransfer.PermitBatch',
        type: 'tuple',
        components: [
          {
            name: 'details',
            internalType: 'struct IAllowanceTransfer.PermitDetails[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint160', type: 'uint160' },
              { name: 'expiration', internalType: 'uint48', type: 'uint48' },
              { name: 'nonce', internalType: 'uint48', type: 'uint48' },
            ],
          },
          { name: 'spender', internalType: 'address', type: 'address' },
          { name: 'sigDeadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      {
        name: 'permitSingle',
        internalType: 'struct IAllowanceTransfer.PermitSingle',
        type: 'tuple',
        components: [
          {
            name: 'details',
            internalType: 'struct IAllowanceTransfer.PermitDetails',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint160', type: 'uint160' },
              { name: 'expiration', internalType: 'uint48', type: 'uint48' },
              { name: 'nonce', internalType: 'uint48', type: 'uint48' },
            ],
          },
          { name: 'spender', internalType: 'address', type: 'address' },
          { name: 'sigDeadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails',
        type: 'tuple',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitBatchTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails',
        type: 'tuple',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'witness', internalType: 'bytes32', type: 'bytes32' },
      { name: 'witnessTypeString', internalType: 'string', type: 'string' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitWitnessTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitBatchTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'witness', internalType: 'bytes32', type: 'bytes32' },
      { name: 'witnessTypeString', internalType: 'string', type: 'string' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitWitnessTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'transferDetails',
        internalType: 'struct IAllowanceTransfer.AllowanceTransferDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint160', type: 'uint160' },
          { name: 'token', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint160', type: 'uint160' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapNftManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapNftManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_factory', internalType: 'address', type: 'address' },
      { name: '_WETH9', internalType: 'address', type: 'address' },
      { name: '_tokenDescriptor_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DecreaseLiquidity',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'IncreaseLiquidity',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WETH9',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'baseURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.CollectParams',
        type: 'tuple',
        components: [
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amount0Max', internalType: 'uint128', type: 'uint128' },
          { name: 'amount1Max', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token0', internalType: 'address', type: 'address' },
      { name: 'token1', internalType: 'address', type: 'address' },
      { name: 'fee', internalType: 'uint24', type: 'uint24' },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'createAndInitializePoolIfNecessary',
    outputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.DecreaseLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
          { name: 'amount0Min', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Min', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'decreaseLiquidity',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.IncreaseLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount0Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount0Min', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Min', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'increaseLiquidity',
    outputs: [
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.MintParams',
        type: 'tuple',
        components: [
          { name: 'token0', internalType: 'address', type: 'address' },
          { name: 'token1', internalType: 'address', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'amount0Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount0Min', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Min', internalType: 'uint256', type: 'uint256' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'mint',
    outputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'positions',
    outputs: [
      { name: 'nonce', internalType: 'uint96', type: 'uint96' },
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'token0', internalType: 'address', type: 'address' },
      { name: 'token1', internalType: 'address', type: 'address' },
      { name: 'fee', internalType: 'uint24', type: 'uint24' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      {
        name: 'feeGrowthInside0LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'refundETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermitAllowed',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermitAllowedIfNecessary',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermitIfNecessary',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amountMinimum', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'sweepToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount0Owed', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1Owed', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'uniswapV3MintCallback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amountMinimum', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'unwrapWETH9',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapV3Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3PoolAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'CollectProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Flash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'observationCardinalityNextNew',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'IncreaseObservationCardinalityNext',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeProtocol0Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol0New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SetFeeProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Swap',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'observations',
    outputs: [
      { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
      { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityCumulativeX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'secondsAgos', internalType: 'uint32[]', type: 'uint32[]' }],
    name: 'observe',
    outputs: [
      { name: 'tickCumulatives', internalType: 'int56[]', type: 'int56[]' },
      {
        name: 'secondsPerLiquidityCumulativeX128s',
        internalType: 'uint160[]',
        type: 'uint160[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'positions',
    outputs: [
      { name: '_liquidity', internalType: 'uint128', type: 'uint128' },
      {
        name: 'feeGrowthInside0LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: 'token0', internalType: 'uint128', type: 'uint128' },
      { name: 'token1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
      { name: 'observationIndex', internalType: 'uint16', type: 'uint16' },
      {
        name: 'observationCardinality',
        internalType: 'uint16',
        type: 'uint16',
      },
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: 'unlocked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityInsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tick', internalType: 'int24', type: 'int24' }],
    name: 'ticks',
    outputs: [
      { name: 'liquidityGross', internalType: 'uint128', type: 'uint128' },
      { name: 'liquidityNet', internalType: 'int128', type: 'int128' },
      {
        name: 'feeGrowthOutside0X128',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'feeGrowthOutside1X128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityOutsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const readChainlinkLimitOrder = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"FAST_GAS_HEARTBEAT"`
 */
export const readChainlinkLimitOrderFastGasHeartbeat = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'FAST_GAS_HEARTBEAT',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"LINK"`
 */
export const readChainlinkLimitOrderLink = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'LINK',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"MAX_FILLS_PER_UPKEEP"`
 */
export const readChainlinkLimitOrderMaxFillsPerUpkeep = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'MAX_FILLS_PER_UPKEEP',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"MAX_GAS_LIMIT"`
 */
export const readChainlinkLimitOrderMaxGasLimit = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'MAX_GAS_LIMIT',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"MAX_GAS_PRICE"`
 */
export const readChainlinkLimitOrderMaxGasPrice = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'MAX_GAS_PRICE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"POSITION_MANAGER"`
 */
export const readChainlinkLimitOrderPositionManager = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'POSITION_MANAGER',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"WRAPPED_NATIVE"`
 */
export const readChainlinkLimitOrderWrappedNative = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'WRAPPED_NATIVE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"batchCount"`
 */
export const readChainlinkLimitOrderBatchCount = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'batchCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"batchIdToUserDepositAmount"`
 */
export const readChainlinkLimitOrderBatchIdToUserDepositAmount = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'batchIdToUserDepositAmount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"checkUpkeep"`
 */
export const readChainlinkLimitOrderCheckUpkeep = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'checkUpkeep',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"claim"`
 */
export const readChainlinkLimitOrderClaim = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"fastGasFeed"`
 */
export const readChainlinkLimitOrderFastGasFeed = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'fastGasFeed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"findSpot"`
 */
export const readChainlinkLimitOrderFindSpot = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'findSpot',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getClaim"`
 */
export const readChainlinkLimitOrderGetClaim = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getClaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getFeePerUser"`
 */
export const readChainlinkLimitOrderGetFeePerUser = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getFeePerUser',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getGasPrice"`
 */
export const readChainlinkLimitOrderGetGasPrice = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getGasPrice',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getOrderBook"`
 */
export const readChainlinkLimitOrderGetOrderBook = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getOrderBook',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getPositionFromTicks"`
 */
export const readChainlinkLimitOrderGetPositionFromTicks = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getPositionFromTicks',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"isOrderReadyForClaim"`
 */
export const readChainlinkLimitOrderIsOrderReadyForClaim = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'isOrderReadyForClaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"isShutdown"`
 */
export const readChainlinkLimitOrderIsShutdown = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'isShutdown',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"minimumAssets"`
 */
export const readChainlinkLimitOrderMinimumAssets = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'minimumAssets',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"orderBook"`
 */
export const readChainlinkLimitOrderOrderBook = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'orderBook',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"owner"`
 */
export const readChainlinkLimitOrderOwner = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"poolToData"`
 */
export const readChainlinkLimitOrderPoolToData = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'poolToData',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"registrar"`
 */
export const readChainlinkLimitOrderRegistrar = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'registrar',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"tokenToSwapFees"`
 */
export const readChainlinkLimitOrderTokenToSwapFees = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'tokenToSwapFees',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"upkeepGasLimit"`
 */
export const readChainlinkLimitOrderUpkeepGasLimit = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'upkeepGasLimit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"upkeepGasPrice"`
 */
export const readChainlinkLimitOrderUpkeepGasPrice = /*#__PURE__*/ createReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'upkeepGasPrice',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const writeChainlinkLimitOrder = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"cancelOrder"`
 */
export const writeChainlinkLimitOrderCancelOrder = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'cancelOrder',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"claimOrder"`
 */
export const writeChainlinkLimitOrderClaimOrder = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'claimOrder',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"initiateShutdown"`
 */
export const writeChainlinkLimitOrderInitiateShutdown = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'initiateShutdown',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"liftShutdown"`
 */
export const writeChainlinkLimitOrderLiftShutdown = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'liftShutdown',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"newOrder"`
 */
export const writeChainlinkLimitOrderNewOrder = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'newOrder',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const writeChainlinkLimitOrderOnErc721Received = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'onERC721Received',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"performUpkeep"`
 */
export const writeChainlinkLimitOrderPerformUpkeep = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'performUpkeep',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setFastGasFeed"`
 */
export const writeChainlinkLimitOrderSetFastGasFeed = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setFastGasFeed',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMaxFillsPerUpkeep"`
 */
export const writeChainlinkLimitOrderSetMaxFillsPerUpkeep = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMaxFillsPerUpkeep',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMinimumAssets"`
 */
export const writeChainlinkLimitOrderSetMinimumAssets = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMinimumAssets',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setRegistrar"`
 */
export const writeChainlinkLimitOrderSetRegistrar = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setRegistrar',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasLimit"`
 */
export const writeChainlinkLimitOrderSetUpkeepGasLimit = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasLimit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasPrice"`
 */
export const writeChainlinkLimitOrderSetUpkeepGasPrice = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasPrice',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setupLimitOrder"`
 */
export const writeChainlinkLimitOrderSetupLimitOrder = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setupLimitOrder',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeChainlinkLimitOrderTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawNative"`
 */
export const writeChainlinkLimitOrderWithdrawNative = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawNative',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawSwapFees"`
 */
export const writeChainlinkLimitOrderWithdrawSwapFees = /*#__PURE__*/ createWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawSwapFees',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const simulateChainlinkLimitOrder = /*#__PURE__*/ createSimulateContract({ abi: chainlinkLimitOrderAbi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"cancelOrder"`
 */
export const simulateChainlinkLimitOrderCancelOrder = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'cancelOrder',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"claimOrder"`
 */
export const simulateChainlinkLimitOrderClaimOrder = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'claimOrder',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"initiateShutdown"`
 */
export const simulateChainlinkLimitOrderInitiateShutdown = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'initiateShutdown',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"liftShutdown"`
 */
export const simulateChainlinkLimitOrderLiftShutdown = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'liftShutdown',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"newOrder"`
 */
export const simulateChainlinkLimitOrderNewOrder = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'newOrder',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const simulateChainlinkLimitOrderOnErc721Received = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'onERC721Received',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"performUpkeep"`
 */
export const simulateChainlinkLimitOrderPerformUpkeep = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'performUpkeep',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setFastGasFeed"`
 */
export const simulateChainlinkLimitOrderSetFastGasFeed = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setFastGasFeed',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMaxFillsPerUpkeep"`
 */
export const simulateChainlinkLimitOrderSetMaxFillsPerUpkeep = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMaxFillsPerUpkeep',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMinimumAssets"`
 */
export const simulateChainlinkLimitOrderSetMinimumAssets = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMinimumAssets',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setRegistrar"`
 */
export const simulateChainlinkLimitOrderSetRegistrar = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setRegistrar',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasLimit"`
 */
export const simulateChainlinkLimitOrderSetUpkeepGasLimit = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasLimit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasPrice"`
 */
export const simulateChainlinkLimitOrderSetUpkeepGasPrice = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasPrice',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setupLimitOrder"`
 */
export const simulateChainlinkLimitOrderSetupLimitOrder = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setupLimitOrder',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateChainlinkLimitOrderTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawNative"`
 */
export const simulateChainlinkLimitOrderWithdrawNative = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawNative',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawSwapFees"`
 */
export const simulateChainlinkLimitOrderWithdrawSwapFees = /*#__PURE__*/ createSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawSwapFees',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const watchChainlinkLimitOrderEvent = /*#__PURE__*/ createWatchContractEvent({ abi: chainlinkLimitOrderAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"CancelOrder"`
 */
export const watchChainlinkLimitOrderCancelOrderEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'CancelOrder',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"ClaimOrder"`
 */
export const watchChainlinkLimitOrderClaimOrderEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'ClaimOrder',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"LimitOrderSetup"`
 */
export const watchChainlinkLimitOrderLimitOrderSetupEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'LimitOrderSetup',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"NewOrder"`
 */
export const watchChainlinkLimitOrderNewOrderEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'NewOrder',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"OrderFilled"`
 */
export const watchChainlinkLimitOrderOrderFilledEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'OrderFilled',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchChainlinkLimitOrderOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"ShutdownChanged"`
 */
export const watchChainlinkLimitOrderShutdownChangedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'ShutdownChanged',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const readErc20 = /*#__PURE__*/ createReadContract({ abi: erc20Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const readErc20Name = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const writeErc20 = /*#__PURE__*/ createWriteContract({ abi: erc20Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const simulateErc20 = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const watchErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const readErc721 = /*#__PURE__*/ createReadContract({ abi: erc721Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc721BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const readErc721GetApproved = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readErc721IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"name"`
 */
export const readErc721Name = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const readErc721OwnerOf = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc721Symbol = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenByIndex"`
 */
export const readErc721TokenByIndex = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'tokenByIndex',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const readErc721TokenUri = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc721TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const writeErc721 = /*#__PURE__*/ createWriteContract({ abi: erc721Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc721Approve = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeErc721SafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeErc721SetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc721TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const simulateErc721 = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc721Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateErc721SafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateErc721SetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc721TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__
 */
export const watchErc721Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc721ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchErc721ApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc721TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link permit2Abi}__
 */
export const readPermit2 = /*#__PURE__*/ createReadContract({ abi: permit2Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readPermit2DomainSeparator = /*#__PURE__*/ createReadContract({
  abi: permit2Abi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"allowance"`
 */
export const readPermit2Allowance = /*#__PURE__*/ createReadContract({
  abi: permit2Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"nonceBitmap"`
 */
export const readPermit2NonceBitmap = /*#__PURE__*/ createReadContract({
  abi: permit2Abi,
  functionName: 'nonceBitmap',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__
 */
export const writePermit2 = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"approve"`
 */
export const writePermit2Approve = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateNonces"`
 */
export const writePermit2InvalidateNonces = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'invalidateNonces',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateUnorderedNonces"`
 */
export const writePermit2InvalidateUnorderedNonces = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'invalidateUnorderedNonces',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"lockdown"`
 */
export const writePermit2Lockdown = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'lockdown',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permit"`
 */
export const writePermit2Permit = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitTransferFrom"`
 */
export const writePermit2PermitTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'permitTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitWitnessTransferFrom"`
 */
export const writePermit2PermitWitnessTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'permitWitnessTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writePermit2TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: permit2Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__
 */
export const simulatePermit2 = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"approve"`
 */
export const simulatePermit2Approve = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateNonces"`
 */
export const simulatePermit2InvalidateNonces = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'invalidateNonces',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateUnorderedNonces"`
 */
export const simulatePermit2InvalidateUnorderedNonces = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'invalidateUnorderedNonces',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"lockdown"`
 */
export const simulatePermit2Lockdown = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'lockdown',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permit"`
 */
export const simulatePermit2Permit = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitTransferFrom"`
 */
export const simulatePermit2PermitTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'permitTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitWitnessTransferFrom"`
 */
export const simulatePermit2PermitWitnessTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'permitWitnessTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulatePermit2TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: permit2Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link permit2Abi}__
 */
export const watchPermit2Event = /*#__PURE__*/ createWatchContractEvent({
  abi: permit2Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"Approval"`
 */
export const watchPermit2ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: permit2Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"Lockdown"`
 */
export const watchPermit2LockdownEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: permit2Abi,
  eventName: 'Lockdown',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"NonceInvalidation"`
 */
export const watchPermit2NonceInvalidationEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: permit2Abi,
  eventName: 'NonceInvalidation',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"Permit"`
 */
export const watchPermit2PermitEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: permit2Abi,
  eventName: 'Permit',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"UnorderedNonceInvalidation"`
 */
export const watchPermit2UnorderedNonceInvalidationEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: permit2Abi,
  eventName: 'UnorderedNonceInvalidation',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const readUniswapNftManager = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readUniswapNftManagerDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 */
export const readUniswapNftManagerPermitTypehash = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'PERMIT_TYPEHASH',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"WETH9"`
 */
export const readUniswapNftManagerWeth9 = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'WETH9',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readUniswapNftManagerBalanceOf = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"baseURI"`
 */
export const readUniswapNftManagerBaseUri = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'baseURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"factory"`
 */
export const readUniswapNftManagerFactory = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"getApproved"`
 */
export const readUniswapNftManagerGetApproved = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readUniswapNftManagerIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"name"`
 */
export const readUniswapNftManagerName = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readUniswapNftManagerOwnerOf = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"positions"`
 */
export const readUniswapNftManagerPositions = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'positions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readUniswapNftManagerSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"symbol"`
 */
export const readUniswapNftManagerSymbol = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"tokenByIndex"`
 */
export const readUniswapNftManagerTokenByIndex = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'tokenByIndex',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const readUniswapNftManagerTokenOfOwnerByIndex = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'tokenOfOwnerByIndex',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readUniswapNftManagerTokenUri = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readUniswapNftManagerTotalSupply = /*#__PURE__*/ createReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const writeUniswapNftManager = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"approve"`
 */
export const writeUniswapNftManagerApprove = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"burn"`
 */
export const writeUniswapNftManagerBurn = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"collect"`
 */
export const writeUniswapNftManagerCollect = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"createAndInitializePoolIfNecessary"`
 */
export const writeUniswapNftManagerCreateAndInitializePoolIfNecessary = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'createAndInitializePoolIfNecessary',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const writeUniswapNftManagerDecreaseLiquidity = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'decreaseLiquidity',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const writeUniswapNftManagerIncreaseLiquidity = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'increaseLiquidity',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"mint"`
 */
export const writeUniswapNftManagerMint = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const writeUniswapNftManagerMulticall = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"permit"`
 */
export const writeUniswapNftManagerPermit = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"refundETH"`
 */
export const writeUniswapNftManagerRefundEth = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'refundETH',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeUniswapNftManagerSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermit"`
 */
export const writeUniswapNftManagerSelfPermit = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowed"`
 */
export const writeUniswapNftManagerSelfPermitAllowed = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowed',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowedIfNecessary"`
 */
export const writeUniswapNftManagerSelfPermitAllowedIfNecessary = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowedIfNecessary',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitIfNecessary"`
 */
export const writeUniswapNftManagerSelfPermitIfNecessary = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitIfNecessary',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeUniswapNftManagerSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"sweepToken"`
 */
export const writeUniswapNftManagerSweepToken = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'sweepToken',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeUniswapNftManagerTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"uniswapV3MintCallback"`
 */
export const writeUniswapNftManagerUniswapV3MintCallback = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'uniswapV3MintCallback',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"unwrapWETH9"`
 */
export const writeUniswapNftManagerUnwrapWeth9 = /*#__PURE__*/ createWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'unwrapWETH9',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const simulateUniswapNftManager = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"approve"`
 */
export const simulateUniswapNftManagerApprove = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"burn"`
 */
export const simulateUniswapNftManagerBurn = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"collect"`
 */
export const simulateUniswapNftManagerCollect = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"createAndInitializePoolIfNecessary"`
 */
export const simulateUniswapNftManagerCreateAndInitializePoolIfNecessary = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'createAndInitializePoolIfNecessary',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const simulateUniswapNftManagerDecreaseLiquidity = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'decreaseLiquidity',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const simulateUniswapNftManagerIncreaseLiquidity = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'increaseLiquidity',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"mint"`
 */
export const simulateUniswapNftManagerMint = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const simulateUniswapNftManagerMulticall = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"permit"`
 */
export const simulateUniswapNftManagerPermit = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"refundETH"`
 */
export const simulateUniswapNftManagerRefundEth = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'refundETH',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateUniswapNftManagerSafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermit"`
 */
export const simulateUniswapNftManagerSelfPermit = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowed"`
 */
export const simulateUniswapNftManagerSelfPermitAllowed = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowed',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowedIfNecessary"`
 */
export const simulateUniswapNftManagerSelfPermitAllowedIfNecessary = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowedIfNecessary',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitIfNecessary"`
 */
export const simulateUniswapNftManagerSelfPermitIfNecessary = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitIfNecessary',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateUniswapNftManagerSetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"sweepToken"`
 */
export const simulateUniswapNftManagerSweepToken = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'sweepToken',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateUniswapNftManagerTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"uniswapV3MintCallback"`
 */
export const simulateUniswapNftManagerUniswapV3MintCallback = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'uniswapV3MintCallback',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"unwrapWETH9"`
 */
export const simulateUniswapNftManagerUnwrapWeth9 = /*#__PURE__*/ createSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'unwrapWETH9',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const watchUniswapNftManagerEvent = /*#__PURE__*/ createWatchContractEvent({ abi: uniswapNftManagerAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"Approval"`
 */
export const watchUniswapNftManagerApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchUniswapNftManagerApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"Collect"`
 */
export const watchUniswapNftManagerCollectEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'Collect',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"DecreaseLiquidity"`
 */
export const watchUniswapNftManagerDecreaseLiquidityEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'DecreaseLiquidity',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"IncreaseLiquidity"`
 */
export const watchUniswapNftManagerIncreaseLiquidityEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'IncreaseLiquidity',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchUniswapNftManagerTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const readUniswapV3Pool = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"factory"`
 */
export const readUniswapV3PoolFactory = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"fee"`
 */
export const readUniswapV3PoolFee = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'fee',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"feeGrowthGlobal0X128"`
 */
export const readUniswapV3PoolFeeGrowthGlobal0X128 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'feeGrowthGlobal0X128',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"feeGrowthGlobal1X128"`
 */
export const readUniswapV3PoolFeeGrowthGlobal1X128 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'feeGrowthGlobal1X128',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"liquidity"`
 */
export const readUniswapV3PoolLiquidity = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'liquidity',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"maxLiquidityPerTick"`
 */
export const readUniswapV3PoolMaxLiquidityPerTick = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'maxLiquidityPerTick',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"observations"`
 */
export const readUniswapV3PoolObservations = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'observations',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"observe"`
 */
export const readUniswapV3PoolObserve = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'observe',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"positions"`
 */
export const readUniswapV3PoolPositions = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'positions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"protocolFees"`
 */
export const readUniswapV3PoolProtocolFees = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'protocolFees',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"slot0"`
 */
export const readUniswapV3PoolSlot0 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'slot0',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"snapshotCumulativesInside"`
 */
export const readUniswapV3PoolSnapshotCumulativesInside = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'snapshotCumulativesInside',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"tickBitmap"`
 */
export const readUniswapV3PoolTickBitmap = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'tickBitmap',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"tickSpacing"`
 */
export const readUniswapV3PoolTickSpacing = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'tickSpacing',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"ticks"`
 */
export const readUniswapV3PoolTicks = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'ticks',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token0"`
 */
export const readUniswapV3PoolToken0 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token0',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token1"`
 */
export const readUniswapV3PoolToken1 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token1',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const writeUniswapV3Pool = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"burn"`
 */
export const writeUniswapV3PoolBurn = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collect"`
 */
export const writeUniswapV3PoolCollect = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collectProtocol"`
 */
export const writeUniswapV3PoolCollectProtocol = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collectProtocol',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"flash"`
 */
export const writeUniswapV3PoolFlash = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'flash',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"increaseObservationCardinalityNext"`
 */
export const writeUniswapV3PoolIncreaseObservationCardinalityNext = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'increaseObservationCardinalityNext',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"initialize"`
 */
export const writeUniswapV3PoolInitialize = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"mint"`
 */
export const writeUniswapV3PoolMint = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"setFeeProtocol"`
 */
export const writeUniswapV3PoolSetFeeProtocol = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'setFeeProtocol',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"swap"`
 */
export const writeUniswapV3PoolSwap = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'swap',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const simulateUniswapV3Pool = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"burn"`
 */
export const simulateUniswapV3PoolBurn = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collect"`
 */
export const simulateUniswapV3PoolCollect = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collectProtocol"`
 */
export const simulateUniswapV3PoolCollectProtocol = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collectProtocol',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"flash"`
 */
export const simulateUniswapV3PoolFlash = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'flash',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"increaseObservationCardinalityNext"`
 */
export const simulateUniswapV3PoolIncreaseObservationCardinalityNext = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'increaseObservationCardinalityNext',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateUniswapV3PoolInitialize = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"mint"`
 */
export const simulateUniswapV3PoolMint = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"setFeeProtocol"`
 */
export const simulateUniswapV3PoolSetFeeProtocol = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'setFeeProtocol',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"swap"`
 */
export const simulateUniswapV3PoolSwap = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'swap',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const watchUniswapV3PoolEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Burn"`
 */
export const watchUniswapV3PoolBurnEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Burn',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Collect"`
 */
export const watchUniswapV3PoolCollectEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Collect',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"CollectProtocol"`
 */
export const watchUniswapV3PoolCollectProtocolEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'CollectProtocol',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Flash"`
 */
export const watchUniswapV3PoolFlashEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Flash',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"IncreaseObservationCardinalityNext"`
 */
export const watchUniswapV3PoolIncreaseObservationCardinalityNextEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'IncreaseObservationCardinalityNext',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Initialize"`
 */
export const watchUniswapV3PoolInitializeEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Initialize',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Mint"`
 */
export const watchUniswapV3PoolMintEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Mint',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"SetFeeProtocol"`
 */
export const watchUniswapV3PoolSetFeeProtocolEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'SetFeeProtocol',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Swap"`
 */
export const watchUniswapV3PoolSwapEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Swap',
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const useReadChainlinkLimitOrder = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"FAST_GAS_HEARTBEAT"`
 */
export const useReadChainlinkLimitOrderFastGasHeartbeat = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'FAST_GAS_HEARTBEAT',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"LINK"`
 */
export const useReadChainlinkLimitOrderLink = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'LINK',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"MAX_FILLS_PER_UPKEEP"`
 */
export const useReadChainlinkLimitOrderMaxFillsPerUpkeep = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'MAX_FILLS_PER_UPKEEP',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"MAX_GAS_LIMIT"`
 */
export const useReadChainlinkLimitOrderMaxGasLimit = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'MAX_GAS_LIMIT',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"MAX_GAS_PRICE"`
 */
export const useReadChainlinkLimitOrderMaxGasPrice = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'MAX_GAS_PRICE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"POSITION_MANAGER"`
 */
export const useReadChainlinkLimitOrderPositionManager = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'POSITION_MANAGER',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"WRAPPED_NATIVE"`
 */
export const useReadChainlinkLimitOrderWrappedNative = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'WRAPPED_NATIVE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"batchCount"`
 */
export const useReadChainlinkLimitOrderBatchCount = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'batchCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"batchIdToUserDepositAmount"`
 */
export const useReadChainlinkLimitOrderBatchIdToUserDepositAmount = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'batchIdToUserDepositAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"checkUpkeep"`
 */
export const useReadChainlinkLimitOrderCheckUpkeep = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'checkUpkeep',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"claim"`
 */
export const useReadChainlinkLimitOrderClaim = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"fastGasFeed"`
 */
export const useReadChainlinkLimitOrderFastGasFeed = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'fastGasFeed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"findSpot"`
 */
export const useReadChainlinkLimitOrderFindSpot = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'findSpot',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getClaim"`
 */
export const useReadChainlinkLimitOrderGetClaim = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getFeePerUser"`
 */
export const useReadChainlinkLimitOrderGetFeePerUser = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getFeePerUser',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getGasPrice"`
 */
export const useReadChainlinkLimitOrderGetGasPrice = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getGasPrice',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getOrderBook"`
 */
export const useReadChainlinkLimitOrderGetOrderBook = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getOrderBook',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"getPositionFromTicks"`
 */
export const useReadChainlinkLimitOrderGetPositionFromTicks = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'getPositionFromTicks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"isOrderReadyForClaim"`
 */
export const useReadChainlinkLimitOrderIsOrderReadyForClaim = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'isOrderReadyForClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"isShutdown"`
 */
export const useReadChainlinkLimitOrderIsShutdown = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'isShutdown',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"minimumAssets"`
 */
export const useReadChainlinkLimitOrderMinimumAssets = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'minimumAssets',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"orderBook"`
 */
export const useReadChainlinkLimitOrderOrderBook = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'orderBook',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"owner"`
 */
export const useReadChainlinkLimitOrderOwner = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"poolToData"`
 */
export const useReadChainlinkLimitOrderPoolToData = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'poolToData',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"registrar"`
 */
export const useReadChainlinkLimitOrderRegistrar = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'registrar',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"tokenToSwapFees"`
 */
export const useReadChainlinkLimitOrderTokenToSwapFees = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'tokenToSwapFees',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"upkeepGasLimit"`
 */
export const useReadChainlinkLimitOrderUpkeepGasLimit = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'upkeepGasLimit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"upkeepGasPrice"`
 */
export const useReadChainlinkLimitOrderUpkeepGasPrice = /*#__PURE__*/ createUseReadContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'upkeepGasPrice',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const useWriteChainlinkLimitOrder = /*#__PURE__*/ createUseWriteContract({ abi: chainlinkLimitOrderAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"cancelOrder"`
 */
export const useWriteChainlinkLimitOrderCancelOrder = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'cancelOrder',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"claimOrder"`
 */
export const useWriteChainlinkLimitOrderClaimOrder = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'claimOrder',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"initiateShutdown"`
 */
export const useWriteChainlinkLimitOrderInitiateShutdown = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'initiateShutdown',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"liftShutdown"`
 */
export const useWriteChainlinkLimitOrderLiftShutdown = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'liftShutdown',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"newOrder"`
 */
export const useWriteChainlinkLimitOrderNewOrder = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'newOrder',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useWriteChainlinkLimitOrderOnErc721Received = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'onERC721Received',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"performUpkeep"`
 */
export const useWriteChainlinkLimitOrderPerformUpkeep = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'performUpkeep',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setFastGasFeed"`
 */
export const useWriteChainlinkLimitOrderSetFastGasFeed = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setFastGasFeed',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMaxFillsPerUpkeep"`
 */
export const useWriteChainlinkLimitOrderSetMaxFillsPerUpkeep = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMaxFillsPerUpkeep',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMinimumAssets"`
 */
export const useWriteChainlinkLimitOrderSetMinimumAssets = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMinimumAssets',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setRegistrar"`
 */
export const useWriteChainlinkLimitOrderSetRegistrar = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setRegistrar',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasLimit"`
 */
export const useWriteChainlinkLimitOrderSetUpkeepGasLimit = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasLimit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasPrice"`
 */
export const useWriteChainlinkLimitOrderSetUpkeepGasPrice = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasPrice',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setupLimitOrder"`
 */
export const useWriteChainlinkLimitOrderSetupLimitOrder = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setupLimitOrder',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteChainlinkLimitOrderTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawNative"`
 */
export const useWriteChainlinkLimitOrderWithdrawNative = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawNative',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawSwapFees"`
 */
export const useWriteChainlinkLimitOrderWithdrawSwapFees = /*#__PURE__*/ createUseWriteContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawSwapFees',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const useSimulateChainlinkLimitOrder = /*#__PURE__*/ createUseSimulateContract({ abi: chainlinkLimitOrderAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"cancelOrder"`
 */
export const useSimulateChainlinkLimitOrderCancelOrder = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'cancelOrder',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"claimOrder"`
 */
export const useSimulateChainlinkLimitOrderClaimOrder = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'claimOrder',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"initiateShutdown"`
 */
export const useSimulateChainlinkLimitOrderInitiateShutdown = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'initiateShutdown',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"liftShutdown"`
 */
export const useSimulateChainlinkLimitOrderLiftShutdown = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'liftShutdown',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"newOrder"`
 */
export const useSimulateChainlinkLimitOrderNewOrder = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'newOrder',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useSimulateChainlinkLimitOrderOnErc721Received = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'onERC721Received',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"performUpkeep"`
 */
export const useSimulateChainlinkLimitOrderPerformUpkeep = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'performUpkeep',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setFastGasFeed"`
 */
export const useSimulateChainlinkLimitOrderSetFastGasFeed = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setFastGasFeed',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMaxFillsPerUpkeep"`
 */
export const useSimulateChainlinkLimitOrderSetMaxFillsPerUpkeep = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMaxFillsPerUpkeep',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setMinimumAssets"`
 */
export const useSimulateChainlinkLimitOrderSetMinimumAssets = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setMinimumAssets',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setRegistrar"`
 */
export const useSimulateChainlinkLimitOrderSetRegistrar = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setRegistrar',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasLimit"`
 */
export const useSimulateChainlinkLimitOrderSetUpkeepGasLimit = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasLimit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setUpkeepGasPrice"`
 */
export const useSimulateChainlinkLimitOrderSetUpkeepGasPrice = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setUpkeepGasPrice',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"setupLimitOrder"`
 */
export const useSimulateChainlinkLimitOrderSetupLimitOrder = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'setupLimitOrder',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateChainlinkLimitOrderTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawNative"`
 */
export const useSimulateChainlinkLimitOrderWithdrawNative = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawNative',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `functionName` set to `"withdrawSwapFees"`
 */
export const useSimulateChainlinkLimitOrderWithdrawSwapFees = /*#__PURE__*/ createUseSimulateContract({
  abi: chainlinkLimitOrderAbi,
  functionName: 'withdrawSwapFees',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__
 */
export const useWatchChainlinkLimitOrderEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"CancelOrder"`
 */
export const useWatchChainlinkLimitOrderCancelOrderEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'CancelOrder',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"ClaimOrder"`
 */
export const useWatchChainlinkLimitOrderClaimOrderEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'ClaimOrder',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"LimitOrderSetup"`
 */
export const useWatchChainlinkLimitOrderLimitOrderSetupEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'LimitOrderSetup',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"NewOrder"`
 */
export const useWatchChainlinkLimitOrderNewOrderEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'NewOrder',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"OrderFilled"`
 */
export const useWatchChainlinkLimitOrderOrderFilledEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'OrderFilled',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchChainlinkLimitOrderOwnershipTransferredEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderAbi}__ and `eventName` set to `"ShutdownChanged"`
 */
export const useWatchChainlinkLimitOrderShutdownChangedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: chainlinkLimitOrderAbi,
  eventName: 'ShutdownChanged',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const useReadErc721 = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc721BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const useReadErc721GetApproved = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadErc721IsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc721Name = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadErc721OwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc721Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenByIndex"`
 */
export const useReadErc721TokenByIndex = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'tokenByIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadErc721TokenUri = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc721TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const useWriteErc721 = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc721Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteErc721SafeTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteErc721SetApprovalForAll = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc721TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const useSimulateErc721 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc721Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateErc721SafeTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateErc721SetApprovalForAll = /*#__PURE__*/ createUseSimulateContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc721TransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__
 */
export const useWatchErc721Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc721ApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchErc721ApprovalForAllEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc721Abi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc721TransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link permit2Abi}__
 */
export const useReadPermit2 = /*#__PURE__*/ createUseReadContract({
  abi: permit2Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadPermit2DomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: permit2Abi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadPermit2Allowance = /*#__PURE__*/ createUseReadContract({
  abi: permit2Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"nonceBitmap"`
 */
export const useReadPermit2NonceBitmap = /*#__PURE__*/ createUseReadContract({
  abi: permit2Abi,
  functionName: 'nonceBitmap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__
 */
export const useWritePermit2 = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"approve"`
 */
export const useWritePermit2Approve = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateNonces"`
 */
export const useWritePermit2InvalidateNonces = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'invalidateNonces',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateUnorderedNonces"`
 */
export const useWritePermit2InvalidateUnorderedNonces = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'invalidateUnorderedNonces',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"lockdown"`
 */
export const useWritePermit2Lockdown = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'lockdown',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permit"`
 */
export const useWritePermit2Permit = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitTransferFrom"`
 */
export const useWritePermit2PermitTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'permitTransferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitWitnessTransferFrom"`
 */
export const useWritePermit2PermitWitnessTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'permitWitnessTransferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWritePermit2TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: permit2Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__
 */
export const useSimulatePermit2 = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulatePermit2Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateNonces"`
 */
export const useSimulatePermit2InvalidateNonces = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'invalidateNonces',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"invalidateUnorderedNonces"`
 */
export const useSimulatePermit2InvalidateUnorderedNonces = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'invalidateUnorderedNonces',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"lockdown"`
 */
export const useSimulatePermit2Lockdown = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'lockdown',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permit"`
 */
export const useSimulatePermit2Permit = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitTransferFrom"`
 */
export const useSimulatePermit2PermitTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'permitTransferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"permitWitnessTransferFrom"`
 */
export const useSimulatePermit2PermitWitnessTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'permitWitnessTransferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link permit2Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulatePermit2TransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: permit2Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link permit2Abi}__
 */
export const useWatchPermit2Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: permit2Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchPermit2ApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: permit2Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"Lockdown"`
 */
export const useWatchPermit2LockdownEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: permit2Abi,
  eventName: 'Lockdown',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"NonceInvalidation"`
 */
export const useWatchPermit2NonceInvalidationEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: permit2Abi,
  eventName: 'NonceInvalidation',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"Permit"`
 */
export const useWatchPermit2PermitEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: permit2Abi,
  eventName: 'Permit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link permit2Abi}__ and `eventName` set to `"UnorderedNonceInvalidation"`
 */
export const useWatchPermit2UnorderedNonceInvalidationEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: permit2Abi,
  eventName: 'UnorderedNonceInvalidation',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const useReadUniswapNftManager = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadUniswapNftManagerDomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 */
export const useReadUniswapNftManagerPermitTypehash = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'PERMIT_TYPEHASH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"WETH9"`
 */
export const useReadUniswapNftManagerWeth9 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'WETH9',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadUniswapNftManagerBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"baseURI"`
 */
export const useReadUniswapNftManagerBaseUri = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'baseURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"factory"`
 */
export const useReadUniswapNftManagerFactory = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadUniswapNftManagerGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadUniswapNftManagerIsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"name"`
 */
export const useReadUniswapNftManagerName = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadUniswapNftManagerOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"positions"`
 */
export const useReadUniswapNftManagerPositions = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'positions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadUniswapNftManagerSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadUniswapNftManagerSymbol = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"tokenByIndex"`
 */
export const useReadUniswapNftManagerTokenByIndex = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'tokenByIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const useReadUniswapNftManagerTokenOfOwnerByIndex = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'tokenOfOwnerByIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadUniswapNftManagerTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadUniswapNftManagerTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: uniswapNftManagerAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const useWriteUniswapNftManager = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteUniswapNftManagerApprove = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteUniswapNftManagerBurn = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"collect"`
 */
export const useWriteUniswapNftManagerCollect = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"createAndInitializePoolIfNecessary"`
 */
export const useWriteUniswapNftManagerCreateAndInitializePoolIfNecessary = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'createAndInitializePoolIfNecessary',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const useWriteUniswapNftManagerDecreaseLiquidity = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'decreaseLiquidity',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const useWriteUniswapNftManagerIncreaseLiquidity = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'increaseLiquidity',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteUniswapNftManagerMint = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteUniswapNftManagerMulticall = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteUniswapNftManagerPermit = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"refundETH"`
 */
export const useWriteUniswapNftManagerRefundEth = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'refundETH',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteUniswapNftManagerSafeTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermit"`
 */
export const useWriteUniswapNftManagerSelfPermit = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowed"`
 */
export const useWriteUniswapNftManagerSelfPermitAllowed = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowed',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowedIfNecessary"`
 */
export const useWriteUniswapNftManagerSelfPermitAllowedIfNecessary = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowedIfNecessary',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitIfNecessary"`
 */
export const useWriteUniswapNftManagerSelfPermitIfNecessary = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitIfNecessary',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteUniswapNftManagerSetApprovalForAll = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"sweepToken"`
 */
export const useWriteUniswapNftManagerSweepToken = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'sweepToken',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteUniswapNftManagerTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"uniswapV3MintCallback"`
 */
export const useWriteUniswapNftManagerUniswapV3MintCallback = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'uniswapV3MintCallback',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"unwrapWETH9"`
 */
export const useWriteUniswapNftManagerUnwrapWeth9 = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapNftManagerAbi,
  functionName: 'unwrapWETH9',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const useSimulateUniswapNftManager = /*#__PURE__*/ createUseSimulateContract({ abi: uniswapNftManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateUniswapNftManagerApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateUniswapNftManagerBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"collect"`
 */
export const useSimulateUniswapNftManagerCollect = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"createAndInitializePoolIfNecessary"`
 */
export const useSimulateUniswapNftManagerCreateAndInitializePoolIfNecessary = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'createAndInitializePoolIfNecessary',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const useSimulateUniswapNftManagerDecreaseLiquidity = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'decreaseLiquidity',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const useSimulateUniswapNftManagerIncreaseLiquidity = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'increaseLiquidity',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateUniswapNftManagerMint = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateUniswapNftManagerMulticall = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateUniswapNftManagerPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"refundETH"`
 */
export const useSimulateUniswapNftManagerRefundEth = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'refundETH',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateUniswapNftManagerSafeTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermit"`
 */
export const useSimulateUniswapNftManagerSelfPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowed"`
 */
export const useSimulateUniswapNftManagerSelfPermitAllowed = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowed',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitAllowedIfNecessary"`
 */
export const useSimulateUniswapNftManagerSelfPermitAllowedIfNecessary = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitAllowedIfNecessary',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"selfPermitIfNecessary"`
 */
export const useSimulateUniswapNftManagerSelfPermitIfNecessary = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'selfPermitIfNecessary',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateUniswapNftManagerSetApprovalForAll = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"sweepToken"`
 */
export const useSimulateUniswapNftManagerSweepToken = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'sweepToken',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateUniswapNftManagerTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"uniswapV3MintCallback"`
 */
export const useSimulateUniswapNftManagerUniswapV3MintCallback = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'uniswapV3MintCallback',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `functionName` set to `"unwrapWETH9"`
 */
export const useSimulateUniswapNftManagerUnwrapWeth9 = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapNftManagerAbi,
  functionName: 'unwrapWETH9',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__
 */
export const useWatchUniswapNftManagerEvent = /*#__PURE__*/ createUseWatchContractEvent({ abi: uniswapNftManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchUniswapNftManagerApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchUniswapNftManagerApprovalForAllEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"Collect"`
 */
export const useWatchUniswapNftManagerCollectEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'Collect',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"DecreaseLiquidity"`
 */
export const useWatchUniswapNftManagerDecreaseLiquidityEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'DecreaseLiquidity',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"IncreaseLiquidity"`
 */
export const useWatchUniswapNftManagerIncreaseLiquidityEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'IncreaseLiquidity',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapNftManagerAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchUniswapNftManagerTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapNftManagerAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const useReadUniswapV3Pool = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"factory"`
 */
export const useReadUniswapV3PoolFactory = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'factory',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"fee"`
 */
export const useReadUniswapV3PoolFee = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'fee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"feeGrowthGlobal0X128"`
 */
export const useReadUniswapV3PoolFeeGrowthGlobal0X128 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'feeGrowthGlobal0X128',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"feeGrowthGlobal1X128"`
 */
export const useReadUniswapV3PoolFeeGrowthGlobal1X128 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'feeGrowthGlobal1X128',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"liquidity"`
 */
export const useReadUniswapV3PoolLiquidity = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'liquidity',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"maxLiquidityPerTick"`
 */
export const useReadUniswapV3PoolMaxLiquidityPerTick = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'maxLiquidityPerTick',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"observations"`
 */
export const useReadUniswapV3PoolObservations = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'observations',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"observe"`
 */
export const useReadUniswapV3PoolObserve = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'observe',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"positions"`
 */
export const useReadUniswapV3PoolPositions = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'positions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"protocolFees"`
 */
export const useReadUniswapV3PoolProtocolFees = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'protocolFees',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"slot0"`
 */
export const useReadUniswapV3PoolSlot0 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'slot0',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"snapshotCumulativesInside"`
 */
export const useReadUniswapV3PoolSnapshotCumulativesInside = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'snapshotCumulativesInside',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"tickBitmap"`
 */
export const useReadUniswapV3PoolTickBitmap = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'tickBitmap',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"tickSpacing"`
 */
export const useReadUniswapV3PoolTickSpacing = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'tickSpacing',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"ticks"`
 */
export const useReadUniswapV3PoolTicks = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'ticks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token0"`
 */
export const useReadUniswapV3PoolToken0 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token0',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token1"`
 */
export const useReadUniswapV3PoolToken1 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token1',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const useWriteUniswapV3Pool = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteUniswapV3PoolBurn = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collect"`
 */
export const useWriteUniswapV3PoolCollect = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collectProtocol"`
 */
export const useWriteUniswapV3PoolCollectProtocol = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collectProtocol',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"flash"`
 */
export const useWriteUniswapV3PoolFlash = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'flash',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"increaseObservationCardinalityNext"`
 */
export const useWriteUniswapV3PoolIncreaseObservationCardinalityNext = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'increaseObservationCardinalityNext',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteUniswapV3PoolInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteUniswapV3PoolMint = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"setFeeProtocol"`
 */
export const useWriteUniswapV3PoolSetFeeProtocol = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'setFeeProtocol',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"swap"`
 */
export const useWriteUniswapV3PoolSwap = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3PoolAbi,
  functionName: 'swap',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const useSimulateUniswapV3Pool = /*#__PURE__*/ createUseSimulateContract({ abi: uniswapV3PoolAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateUniswapV3PoolBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collect"`
 */
export const useSimulateUniswapV3PoolCollect = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collect',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"collectProtocol"`
 */
export const useSimulateUniswapV3PoolCollectProtocol = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'collectProtocol',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"flash"`
 */
export const useSimulateUniswapV3PoolFlash = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'flash',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"increaseObservationCardinalityNext"`
 */
export const useSimulateUniswapV3PoolIncreaseObservationCardinalityNext = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'increaseObservationCardinalityNext',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateUniswapV3PoolInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateUniswapV3PoolMint = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"setFeeProtocol"`
 */
export const useSimulateUniswapV3PoolSetFeeProtocol = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'setFeeProtocol',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"swap"`
 */
export const useSimulateUniswapV3PoolSwap = /*#__PURE__*/ createUseSimulateContract({
  abi: uniswapV3PoolAbi,
  functionName: 'swap',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const useWatchUniswapV3PoolEvent = /*#__PURE__*/ createUseWatchContractEvent({ abi: uniswapV3PoolAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Burn"`
 */
export const useWatchUniswapV3PoolBurnEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Burn',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Collect"`
 */
export const useWatchUniswapV3PoolCollectEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Collect',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"CollectProtocol"`
 */
export const useWatchUniswapV3PoolCollectProtocolEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'CollectProtocol',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Flash"`
 */
export const useWatchUniswapV3PoolFlashEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Flash',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"IncreaseObservationCardinalityNext"`
 */
export const useWatchUniswapV3PoolIncreaseObservationCardinalityNextEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'IncreaseObservationCardinalityNext',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Initialize"`
 */
export const useWatchUniswapV3PoolInitializeEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Initialize',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Mint"`
 */
export const useWatchUniswapV3PoolMintEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Mint',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"SetFeeProtocol"`
 */
export const useWatchUniswapV3PoolSetFeeProtocolEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'SetFeeProtocol',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `eventName` set to `"Swap"`
 */
export const useWatchUniswapV3PoolSwapEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: uniswapV3PoolAbi,
  eventName: 'Swap',
})
