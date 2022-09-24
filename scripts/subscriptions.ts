import { ethers, network } from 'hardhat'
import addresses from '../addresses.json'
import daiAddresses from '../addresses.dai.json'
import { Dai__factory, Subscriptions__factory } from '../typechain-types'

async function main() {
  const signer = (await ethers.getSigners())[0]
  const daiAddress = daiAddresses[network.name as keyof typeof daiAddresses]
  const subscriptionsAddress = addresses[network.name as keyof typeof addresses]
  const dai = Dai__factory.connect(daiAddress, signer)
  const subscriptions = Subscriptions__factory.connect(subscriptionsAddress, signer)
  const fees = await dai.balanceOf(subscriptionsAddress)

  console.log('network', network.name)
  console.log('subscriptions', (await subscriptions.totalSupply()).toNumber())
  console.log('uncollected fees', ethers.utils.formatEther(fees), 'dai')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
