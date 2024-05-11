import { getDeploymentData } from '@/utils/getDeploymentData'
import { initPolkadotJs } from '@/utils/initPolkadotJs'
import { writeContractAddresses } from '@/utils/writeContractAddresses'
import { ContractPromise } from '@polkadot/api-contract'
import {
  contractQuery,
  contractTx,
  decodeOutput,
  deployContract,
} from '@scio-labs/use-inkathon/helpers'

/**
 * Script that deploys the Nft Trader contract and writes its address to a file.
 *
 * Parameters:
 *  - `DIR`: Directory to read contract build artifacts & write addresses to (optional, defaults to `./deployments`)
 *  - `CHAIN`: Chain ID (optional, defaults to `development`)
 *
 * Example usage:
 *  - `pnpm run deploy`
 *  - `CHAIN=alephzero-testnet pnpm run deploy`
 */
const mainNftTrader = async () => {
  const initParams = await initPolkadotJs()
  const { api, chain, account } = initParams

  // Deploy NftTrader contract
  const { abi, wasm } = await getDeploymentData('nft_trader')
  const nft_trader = await deployContract(api, account, abi, wasm, 'new', [
    '0x4e4654535a4e323032340000',
  ])
  const contract = new ContractPromise(api, abi, nft_trader.address)

  console.log(`Deployed Contract ${nft_trader.address}`)

  // Move contract to child identity.
  console.log(`Move contract to child identity.`)
  await new Promise((resolve, reject) => {
    const unsub = api.tx.identity
      .createChildIdentity(nft_trader.address)
      .signAndSend(account, async (result) => {
        if (result.status.isInBlock) {
          console.log(`Moved contract to child identity.`)
          unsub.then((unsub) => unsub())
          resolve()
        }
      })
    unsub.catch(reject)
  })

  console.log(`Initialize contract.`)
  try {
    // Initialize the contract.
    await contractTx(api, account, contract, 'init', {}, [])
    console.log('\nSuccessfully initialized the contract.')
  } catch (error) {
    console.error('Error while initializing contract', error)
  }

  // Write contract addresses to `{contract}/{network}.ts` file(s)
  await writeContractAddresses(chain.network, {
    nft_trader,
  })
}

const main = async () => {
  await mainNftTrader()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => process.exit(0))
