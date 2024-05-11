'use client'

import { FC, useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import NftTraderContract from '@inkathon/contracts/typed-contracts/contracts/nft_trader'
import {
  IdentityId,
  PortfolioId,
  PortfolioKindBuilder,
  Ticker,
} from '@inkathon/contracts/typed-contracts/types-returns/nft_trader'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
  useRegisteredTypedContract,
} from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import { NftsForSale } from '@/components/web3/NftsForSale'
import { SetupPortfolio } from '@/components/web3/SetupPortfolio'
import { Portfolio } from '@/components/web3/portfolio'
import { tickerToString } from '@/utils/ticker'
import { truncateHash } from '@/utils/truncate-hash'

import { Spinner } from '../ui/spinner'

export interface KeyRecord {
  PrimaryKey: IdentityId | undefined
  SecondaryKey: [IdentityId, any] | undefined
}
export const NftTraderContractInteractions: FC = () => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.NftTrader)
  const { typedContract } = useRegisteredTypedContract(ContractIds.NftTrader, NftTraderContract)
  const [contractDid, setContractDid] = useState<IdentityId>()
  const [contractTicker, setContractTicker] = useState<Ticker>()
  const [ticker, setTicker] = useState<string>()
  const [contractIsLoading, setContractIsLoading] = useState<boolean>()
  const [userDid, setUserDid] = useState<IdentityId>()
  const [userPortfolio, setUserPortfolio] = useState<PortfolioId>()
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [refreshPortfolio, setRefreshPortfolio] = useState<number>(0)
  const [refreshPrices, setRefreshPrices] = useState<number>(0)

  // Fetch Contract Info
  const fetchContractInfo = async () => {
    if (!contract || !typedContract || !api) return

    setContractIsLoading(true)
    try {
      // get ticker
      const typedResult1 = await typedContract.query.ticker()
      const value1 = typedResult1.value.unwrap().ok
      if (value1) {
        setContractTicker(value1)
        const ticker = tickerToString(value1)
        console.log('Got ticker: ', ticker)
        setTicker(ticker)
      }
      // Get contract DID
      const typedResult2 = await typedContract.query.contractDid()
      const value2 = typedResult2.value.unwrap().ok
      setContractDid(value2)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching the contracts ticker & DID. Try again…')
      setContractDid(undefined)
    } finally {
      setContractIsLoading(false)
    }
  }
  useEffect(() => {
    fetchContractInfo()
  }, [typedContract])

  // Fetch User portfolio and DID
  const fetchUserPortfolio = async () => {
    if (!contract || !typedContract || !api || !activeAccount) return

    setUserPortfolio(undefined)
    setFetchIsLoading(true)
    try {
      // get user DID
      const keyRecord = (
        await api.query.identity.keyRecords(activeAccount.address)
      ).toHuman() as unknown as KeyRecord
      const did = keyRecord?.PrimaryKey ?? keyRecord?.SecondaryKey?.[0]
      setUserDid(did)

      // get user portfolio
      const result = await contractQuery(api, activeAccount?.address, contract, 'havePortfolio')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'havePortfolio')
      if (isError) throw new Error(decodedOutput)
      console.log('Result from contract.havePortfolio: ', output)
      if (output.Ok) {
        const portfolio = output.Ok
        console.log('Got portfolio: ', portfolio)
        setUserPortfolio({
          did: portfolio.did,
          kind: portfolio.kind.User
            ? PortfolioKindBuilder.User(portfolio.kind.User)
            : PortfolioKindBuilder.Default(),
        })
      }
    } catch (e) {
      console.error(e)
      toast.error("Error while fetching the user's portfolio. Try again…")
      setUserPortfolio(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchUserPortfolio()
  }, [typedContract, activeAccount, activeSigner])

  // Reload Portfolio
  const reloadPortfolio = () => {
    setRefreshPortfolio((prev) => prev + 1)
  }
  // Reload NFT Prices
  const reloadPrices = () => {
    setRefreshPrices((prev) => prev + 1)
  }

  // Connection/Data Loading Indicator
  if (!api || contractIsLoading || fetchIsLoading)
    return (
      <div className="mb-4 mt-8 flex flex-col items-center justify-center space-y-3 text-center font-mono text-sm text-gray-400 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Spinner />
        <div>Loading...</div>
      </div>
    )

  // Check if user doesn't have an identity
  if (!fetchIsLoading && !userDid)
    return (
      <div className="flex max-w-[30rem] grow flex-col gap-4">
        <div>
          Selected account does not have an identity. Either select another account or start the
          onboarding process.
        </div>
      </div>
    )

  return (
    <>
      <div className="flex max-w-[30rem] grow flex-col gap-4">
        {/* Setup user portfolio with the contract */}
        {!userPortfolio && (
          <SetupPortfolio
            contractDid={contractDid}
            updatePortfolio={fetchUserPortfolio}
            userDid={userDid}
          />
        )}

        {/* The user's portfolio */}
        {userPortfolio && (
          <Portfolio
            ticker={contractTicker}
            portfolio={userPortfolio}
            refreshPortfolio={refreshPortfolio}
            reloadPrices={reloadPrices}
            updatePortfolio={fetchUserPortfolio}
          />
        )}

        {/* Nfts for sale */}
        {userPortfolio && (
          <NftsForSale
            ticker={contractTicker}
            portfolio={userPortfolio}
            refreshPrices={refreshPrices}
            reloadPortfolio={reloadPortfolio}
          />
        )}

        {/* Contract Address */}
        <p className="text-center font-mono text-xs text-gray-600">Ticker: {ticker}</p>
        <p className="text-center font-mono text-xs text-gray-600">
          Contract DID: {truncateHash(contractDid?.toString())}
        </p>
        <p className="text-center font-mono text-xs text-gray-600">
          {contract ? contractAddress : 'Loading…'}
        </p>
      </div>
    </>
  )
}
