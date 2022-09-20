import hre, { network } from 'hardhat'
import daiAddresses from '../addresses.dai.json'
import addresses from '../addresses.json'

async function main() {
  const dai = daiAddresses[network.name as keyof typeof daiAddresses]
  const address = addresses[network.name as keyof typeof addresses]
  if(address) {
    console.log()
    console.log('verify', address, 'on', network.name)
    await hre.run("verify:verify", { 
      address,
      contract: 'contracts/Subscriptions.sol:Subscriptions',
      constructorArguments: [dai]
    })
    console.log()
  } else {
    console.log()
    console.log(`no deploy address found for network '${network.name}'`)
    console.log()
  }
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error)
  process.exit(1)
})