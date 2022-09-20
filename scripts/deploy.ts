import hre, { ethers, network } from 'hardhat'
import daiAddresses from '../addresses.dai.json'

async function main() {
  await hre.run('clean')
  await hre.run('compile')
  const dai = daiAddresses[network.name as keyof typeof daiAddresses]
  if(dai) {
    console.log('deploy on', network.name)
    console.log('dai', dai)
    const Subscriptions = await ethers.getContractFactory('Subscriptions')
    const subscriptions = await Subscriptions.deploy(dai)
    await subscriptions.deployed()
    console.log()
    console.log('deployed', subscriptions.address)
    console.log()
  } else {
    console.log()
    console.log('no dai, no dice!')
    console.log()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
