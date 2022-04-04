const {expect} = require('chai')
const {ethers} = require('hardhat')

const oneEth = ethers.utils.parseEther('1')
const percentage = 25

describe('Splitter', async function () {
	let splitter, token

	// eslint-disable-next-line no-unused-vars
	let deployer, withdrawal1, withdrawal2, addr3, addrs

	beforeEach(async function () {
		;[deployer, withdrawal1, withdrawal2, addr3, ...addrs] =
			await ethers.getSigners()

		const Splitter = await ethers.getContractFactory('Splitter')
		splitter = await Splitter.deploy(
			withdrawal1.address,
			withdrawal2.address,
			percentage
		)
	})

	describe('ETH', async function () {
		describe('Receive ETH', async function () {
			it('Should receive ETH', async function () {
				expect(
					await ethers.provider.getBalance(splitter.address)
				).to.equal(0)

				await receiveETH(addr3, oneEth)

				expect(
					await ethers.provider.getBalance(splitter.address)
				).to.equal(oneEth)
			})
		})

		describe('Withdraw ETH', async function () {
			it('Should transfer to addresses', async function () {
				const received = oneEth

				await receiveETH(addr3, received)

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

				const withdrawal = await splitter
					.connect(deployer)
					.withdrawETH()
				await withdrawal.wait()

				expect(
					await ethers.provider.getBalance(withdrawal1.address)
				).to.equal(expected1)

				expect(
					await ethers.provider.getBalance(withdrawal2.address)
				).to.equal(expected2)
			})
		})
	})

	describe('ERC20', async function () {
		beforeEach(async function () {
			const Token = await ethers.getContractFactory('MockToken')
			token = await Token.deploy()
		})

		describe('Receive ERC20', async function () {
			it('Should receive ERC20 transfers', async function () {
				expect(await token.balanceOf(splitter.address)).to.equal(0)

				await mintToken(addr3, 1000)

				await transferToken(addr3, splitter, 500)

				expect(await token.balanceOf(splitter.address)).to.equal(500)
			})
		})

		describe('Withdraw ERC20', async function () {
			it('Should transfer to addresses', async function () {
				const RECEIVED = 5000

				const previousBalance1 = await token.balanceOf(
					withdrawal1.address
				)
				const previousBalance2 = await token.balanceOf(
					withdrawal2.address
				)

				await mintToken(addr3, 10000)

				await transferToken(addr3, splitter, RECEIVED)

				const amount1 = (RECEIVED * percentage) / 100
				const amount2 = (RECEIVED * (100 - percentage)) / 100

				const expected1 = previousBalance1.add(amount1)
				const expected2 = previousBalance2.add(amount2)

				const withdrawal = await splitter
					.connect(deployer)
					.withdrawERC20(token.address)
				await withdrawal.wait()

				expect(await token.balanceOf(withdrawal1.address)).to.equal(
					expected1
				)

				expect(await token.balanceOf(withdrawal2.address)).to.equal(
					expected2
				)
			})
		})
	})

	const mintToken = async (to, amount) => {
		const minting = await token.mint(to.address, amount)
		await minting.wait()
	}

	const transferToken = async (from, to, amount) => {
		const transfer = await token.connect(from).transfer(to.address, amount)
		await transfer.wait()
	}

	const receiveETH = async (from, amount) => {
		const tx = await from.sendTransaction({
			to: splitter.address,
			value: amount
		})

		await tx.wait()
	}
})
