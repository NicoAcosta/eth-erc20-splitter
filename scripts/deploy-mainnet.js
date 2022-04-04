const hre = require('hardhat')

const percentage = 15
const gasPrice = 16000000000

async function main() {
	let deployer, addrs

	const Contract = await hre.ethers.getContractFactory('Splitter')
	const contract = await Contract.deploy(
		process.env.MAINNET_WITHDRAWAL_1,
		process.env.MAINNET_WITHDRAWAL_2,
		percentage,
		{gasPrice: gasPrice}
	)

	const tx = contract.deployTransaction
	console.log('Deployment tx:', tx.hash)

	await contract.deployed()
	;[deployer, ...addrs] = await ethers.getSigners()

	console.log('Splitter deployed to:', contract.address)
	console.log('Deployed by:', deployer.address)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
