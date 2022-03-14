const hre = require('hardhat')

async function main() {
	let deployer, addrs

	const Contract = await hre.ethers.getContractFactory('ETHSplitter')
	const contract = await Contract.deploy(
		process.env.MAINNET_WITHDRAWAL_1,
		process.env.MAINNET_WITHDRAWAL_2,
		25
	)

	await contract.deployed()
	;[deployer, ...addrs] = await ethers.getSigners()

	console.log('ETHSPplitter deployed to:', contract.address)
	console.log('Deployed by:', deployer.address)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
