import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import erc20 from '../abi/erc20.json'
import daiAddresses from '../addresses.dai.json'

const toBytes32 = (bn: any) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32))
}

const setStorageAt = async (address: any, index: any, value: any) => {
  await ethers.provider.send("hardhat_setStorageAt", [address, index, value])
  await ethers.provider.send("evm_mine", [])
}

const fakeDaiBalance = async (address: any, amount: any) => {
  const slot = 2
  const index = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [address, slot])
  await setStorageAt(
    daiAddresses.opera, 
    index, toBytes32(amount).toString())
}

describe.only('Subscriptions', function () {
  async function deploySubscriptions() {
    const [owner, user] = await ethers.getSigners()
    const dai = new ethers.Contract(daiAddresses.opera, erc20)
    const subscriptions = await (
      await ethers.getContractFactory('Subscriptions')
    ).deploy(daiAddresses.opera)
    return {
      subscriptions: subscriptions.connect(user),
      dai: dai.connect(user),
      owner: {
        signer: owner,
        subscriptions,
        dai
      },
      user,
      fee: ethers.utils.parseEther('10')
    }
  }

  it('Reverts if you don\'t pay', async function () {
    const { subscriptions } = await loadFixture(deploySubscriptions)
    await expect(subscriptions.subscribe()).to.be.revertedWith('WERC10: request exceeds allowance')
  })

  it('Mints subscriptions', async function () {
    const { subscriptions, dai, user, fee } = await loadFixture(deploySubscriptions)
    expect(await subscriptions.balanceOf(user.address)).to.eq(0)
    await fakeDaiBalance(user.address, fee)
    await dai.approve(subscriptions.address, fee)
    await expect(subscriptions.subscribe())
    .to.emit(subscriptions, 'Subscribe')
    .withArgs(user.address)
    expect(await subscriptions.balanceOf(user.address)).to.eq(1)
  })

  it('Expires tokens after a year', async function() {
    const { subscriptions, dai, user, fee } = await loadFixture(deploySubscriptions)
    await fakeDaiBalance(user.address, fee)
    await dai.approve(subscriptions.address, fee)
    const token = await subscriptions.nextToken()
    await subscriptions.subscribe()
    expect(await subscriptions.expired(token)).to.be.false
    const now = new Date()
    const nextYear = now.setFullYear(now.getFullYear() + 1)
    await time.increaseTo(nextYear)
    expect(await subscriptions.expired(token)).to.be.true
  })

  it('Reverts theivery', async function() {
    const { subscriptions, dai, user, fee } = await loadFixture(deploySubscriptions)
    await fakeDaiBalance(user.address, fee)
    await dai.approve(subscriptions.address, fee)
    await subscriptions.subscribe()
    await expect(subscriptions.sweep()).to.be.revertedWith('!owner')
  })

  it('Sweeps fees', async function() {
    const { subscriptions, dai, owner, user, fee } = await loadFixture(deploySubscriptions)
    expect(await dai.balanceOf(owner.signer.address)).to.eq(0)

    await fakeDaiBalance(user.address, fee)
    await dai.approve(subscriptions.address, fee)
    await subscriptions.subscribe()
    await expect(owner.subscriptions.sweep())
    .to.emit(owner.subscriptions, 'Sweep')
    .withArgs(owner.signer.address, fee)
    expect(await dai.balanceOf(owner.signer.address)).to.eq(fee)
  })
})