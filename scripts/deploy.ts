import { ethers } from 'hardhat'

async function main() {
  const Subscriptions = await ethers.getContractFactory('Subscriptions')
  const subscriptions = await Subscriptions.deploy()
  await subscriptions.deployed()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
