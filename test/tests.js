const {expect} = require('chai')
const {ethers} = require('hardhat')

const oneEth = ethers.utils.parseEther('1')
const percentage = 25

describe('ETHSplitter', async function () {
	let contract

	// eslint-disable-next-line no-unused-vars
	let deployer, withdrawal1, withdrawal2, addr3, addrs

	beforeEach(async function () {
		;[deployer, withdrawal1, withdrawal2, addr3, ...addrs] =
			await ethers.getSigners()

		const Contract = await ethers.getContractFactory('ETHSplitter')
		contract = await Contract.deploy(
			withdrawal1.address,
			withdrawal2.address,
			percentage
		)
	})

	describe('Receive ETH', async function () {
		it('Should receive ETH', async function () {
			expect(await ethers.provider.getBalance(contract.address)).to.equal(
				0
			)

			await receive(addr3, oneEth)

			expect(await ethers.provider.getBalance(contract.address)).to.equal(
				oneEth
			)
		})
	})

	describe('Withdraw', async function () {
		it('Should transfer to addresses', async function () {
			const received = oneEth

			await receive(addr3, received)

			const previousBalance1 = await ethers.provider.getBalance(
				withdrawal1.address
			)
			const previousBalance2 = await ethers.provider.getBalance(
				withdrawal2.address
			)

			const amount1 = received.mul(percentage).div(100)
			const amount2 = received.mul(100 - percentage).div(100)

			const expected1 = previousBalance1.add(amount1)
			const expected2 = previousBalance2.add(amount2)

			const withdrawal = await contract.connect(withdrawal2).withdraw()
			await withdrawal.wait()

			expect(
				await ethers.provider.getBalance(withdrawal1.address)
			).to.equal(expected1)

			expect(
				await ethers.provider.getBalance(withdrawal2.address)
			).to.be.within(expected2.mul(9999).div(10000), expected2)
		})
	})

	const receive = async (from, amount) => {
		const tx = await from.sendTransaction({
			to: contract.address,
			value: oneEth
		})

		await tx.wait()
	}
})
