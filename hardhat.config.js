require('dotenv').config()

require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
require('solidity-coverage')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: '0.8.9',
	networks: {
		rinkeby: {
			url: process.env.RINKEBY_NODE_URL,
			accounts: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY]
		},
		mainnet: {
			url: process.env.MAINNET_NODE_URL,
			accounts: [process.env.MAINNET_DEPLOYER_PRIVATE_KEY]
		}
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: 'USD'
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY
	}
}
