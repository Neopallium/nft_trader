'use client'

import { FC, useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import NftTraderContract from '@inkathon/contracts/typed-contracts/contracts/nft_trader'
import { Ticker } from '@inkathon/contracts/typed-contracts/types-arguments/nft_trader'
import { PortfolioId } from '@inkathon/contracts/typed-contracts/types-returns/nft_trader'
import {
  useInkathon,
  useRegisteredContract,
  useRegisteredTypedContract,
} from '@scio-labs/use-inkathon'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

export interface NftsForSaleProps {
  ticker: Ticker | undefined
  portfolio: PortfolioId | undefined
  refreshPrices: number
  reloadPortfolio: () => void
}
export interface NftPrice {
  id: number
  price: number
  yours: boolean
}
export const NftsForSale: FC<NftsForSaleProps> = ({
  ticker,
  portfolio,
  refreshPrices,
  reloadPortfolio,
}) => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.NftTrader)
  const { typedContract } = useRegisteredTypedContract(ContractIds.NftTrader, NftTraderContract)
  const [nftPrices, setNftPrices] = useState<NftPrice[]>()
  const [fetchingPrices, setFetchingPrices] = useState<boolean>(false)
  const form = useForm()

  const { reset, handleSubmit } = form

  // Fetch Nfts for sale
  const fetchNftPrices = async () => {
    console.log('fetching nft prices')
    if (!api || !typedContract || !ticker || !portfolio) {
      setNftPrices(undefined)
      return
    }

    setFetchingPrices(true)
    // get NFT sale prices
    try {
      const typedResult = await typedContract.query.nftPrices()
      const value = typedResult.value.unwrap().ok
      //console.log('nft prices: ', value)
      const nfts = []
      if (value) {
        for (const nft of value.values()) {
          const { did } = (
            await api.query.nft.nftOwner(ticker, nft.id)
          ).toHuman() as unknown as PortfolioId
          const yours = did == portfolio?.did
          // convert price to POLYX
          const val = Number(nft.price) / 1_000_000.0
          nfts.push({
            id: nft.id,
            price: val,
            yours,
          })
        }
      }
      setNftPrices(nfts)
      setFetchingPrices(false)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    fetchNftPrices()
  }, [api, ticker, portfolio, refreshPrices, typedContract])

  // Buy an NFT
  const buyNft = async (nft: NftPrice) => {
    if (!activeAccount || !contract || !activeSigner || !api || !nftPrices) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    console.log(`Buying NFT with id: ${nft.id} and price: ${nft.price}`)
    // Convert price back to u128
    const value = BigInt(nft.price * 1_000_000)

    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'buyNft', { value }, [nft.id])
      reset()
      reloadPortfolio()
    } catch (e) {
      console.error(e)
    } finally {
      await fetchNftPrices()
    }
  }

  const reloadPrices = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await fetchNftPrices()
  }

  return (
    <>
      <div className="flex max-w-[30rem] grow flex-col gap-4">
        <h2 className="text-center font-mono text-gray-400">
          Nfts for sale{' '}
          <Button onClick={reloadPrices} disabled={fetchingPrices} isLoading={fetchingPrices}>
            Refresh
          </Button>
        </h2>

        <Card>
          <CardContent className="pb-3 pt-6">
            {/* Nfts */}
            {nftPrices?.map((nft) => (
              <form
                key={nft.id}
                onSubmit={handleSubmit(async () => await buyNft(nft))}
                className="flex flex-col justify-end gap-2"
              >
                <div className="flex gap-2">
                  NFT {nft.id} Price: {nft.price} POLYX
                  {nft.yours && <span className="text-sm text-gray-400"> You are selling</span>}
                  {!nft.yours && (
                    <Button
                      type="submit"
                      className="bg-primary font-bold"
                      disabled={form.formState.isSubmitting}
                      isLoading={form.formState.isSubmitting}
                    >
                      Buy
                    </Button>
                  )}
                </div>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
