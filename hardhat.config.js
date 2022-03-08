require('dotenv').config()

require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
require('solidity-coverage')

const addresses = require('./addresses')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners()

	for (const account of accounts) {
		console.log(account.address)
	}
})

task('deploy', 'Deploy contract', async (taskArgs, hre) => {
	// let deployer, addrs;

	let deployer, addrs

	const Contract = await hre.ethers.getContractFactory('Splitter')
	const contract = await Contract.deploy(
		addresses.test_A,
		addresses.test_B,
		25
	)

	await contract.deployed()
	;[deployer, ...addrs] = await ethers.getSigners()

	console.log('Splitter deployed to:', contract.address)
	console.log('Deployed by:', deployer.address)
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: '0.8.9',
	networks: {
		ropsten: {
			url: process.env.ROPSTEN_URL || '',
			accounts:
				process.env.PRIVATE_KEY !== undefined
					? [process.env.PRIVATE_KEY]
					: []
		},
		rinkeby: {
			url: process.env.RINKEBY_URL,
			accounts: [process.env.PRIVATE_KEY]
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
