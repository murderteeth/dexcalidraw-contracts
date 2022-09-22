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
    mainnet: {
      url: 'https://rpc.ankr.com/eth',
      accounts: [process.env.PRIVATE_KEY || '']
    },
    polygon: {
      url: 'https://rpc.ankr.com/polygon',
      accounts: [process.env.PRIVATE_KEY || '']
    },
    opera: {
      url: 'https://rpc.ankr.com/fantom',
      accounts: [process.env.PRIVATE_KEY || '']
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.APIKEY_MAINNET || '',
      polygon: process.env.APIKEY_POLYGON || '',
      opera: process.env.APIKEY_OPERA || ''
    }
  }
}

export default config