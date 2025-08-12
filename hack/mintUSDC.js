// mint usdc from this goerli token address: 0x3a034fe373b6304f98b7a24a3f21c958946d4075
import ethers from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli')

const wallet = new ethers.Wallet('<Private_key>', provider)

const contract = new ethers.Contract(
  '0x3a034fe373b6304f98b7a24a3f21c958946d4075',
  ['function mint(address to, uint256 amount) public returns (bool)'],
  wallet
)

contract
  .mint('<to_address>', 100000000)
  .then((tx) => {
    console.log(tx)
  })
  .catch((err) => {
    console.log(err)
  })
