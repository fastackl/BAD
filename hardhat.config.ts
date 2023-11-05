import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import dotenv from 'dotenv';
dotenv.config();
import 'hardhat-ignore-warnings';
import * as fastUtils from './scripts/fastUtils/utils.js';

task("save", "Saves artifact and deployment files to the ./archive folder")
  .setAction(async () => {
    await fastUtils.archive();
  });

task("archive", "Saves artifact and deployment files to the ./archive folder, then deletes the files from the artifact and deployments directories")
  .setAction(async () => {
    await fastUtils.archive();
  });

const config = {
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`
      }
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`
      }
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          }
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          }
        }
      },
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          }
        }
      },
      {
        version: "0.8.19",
        evmVersion: 'london',
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          }
        }
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests:"./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  mocha: {
    timeout: 40000
  },
  warnings: 'off',
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
}

export default config;
