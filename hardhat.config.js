/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { POLYGON_MUMBAI_HTTPS_URL, ACCOUNT_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: POLYGON_MUMBAI_HTTPS_URL,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
  scripts: {
    path: "./scripts",
  },
};
