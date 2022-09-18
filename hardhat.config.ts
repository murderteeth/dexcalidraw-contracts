import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      loggingEnabled: false,
      allowUnlimitedContractSize: true,
      forking: {
        url: "https://rpc.ankr.com/fantom"
      }
    }
  },
};

export default config;