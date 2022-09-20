import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    hardhat: {
      loggingEnabled: false,
      allowUnlimitedContractSize: true,
      forking: {
        url: 'https://rpc.ankr.com/fantom'
      }
    },
    opera: {
      url: 'https://rpc.ankr.com/fantom',
      accounts: [process.env.PRIVATE_KEY || '']
    }
  },
  etherscan: {
    apiKey: {
      opera: 'WCJCN6GBG8ECES1FZ7Q23KMDKVR8VKMFRX'
    }
  }
}

export default config