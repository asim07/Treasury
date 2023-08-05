require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:  "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
  },
  },
  networks: {
    hardhat: {
      // url: "http://127.0.0.1:8545/",
      forking: {
        url: 'https://mainnet.infura.io/v3/886780ecb0e74a5191b8fc1a507a9e5e'
        // url: 'https://polygon-mainnet.infura.io/v3/886780ecb0e74a5191b8fc1a507a9e5e'
      }
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/886780ecb0e74a5191b8fc1a507a9e5e",
      accounts : {
        mnemonic : "step essence coconut base slice timber coast since lyrics slogan vocal dignity"
      }
    }
  }

};