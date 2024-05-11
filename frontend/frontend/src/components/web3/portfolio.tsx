'use client'

import { FC, useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import NftTraderContract from '@inkathon/contracts/typed-contracts/contracts/nft_trader'
import { PortfolioId, Ticker } from '@inkathon/contracts/typed-contracts/types-returns/nft_trader'
import {
  useInkathon,
  useRegisteredContract,
  useRegisteredTypedContract,
} from '@scio-labs/use-inkathon'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

export interface PortfolioProps {
  ticker: Ticker | undefined
  portfolio: PortfolioId | undefined
  refreshPortfolio: number
  reloadPrices: () => void
  updatePortfolio: () => Promise<void>
}
export interface Nft {
  id: number
  price: number | undefined
}
export interface PortfolioInfo {
  name: string
  nfts: Nft[]
}
export const Portfolio: FC<PortfolioProps> = ({
  ticker,
  portfolio,
  refreshPortfolio,
  reloadPrices,
  updatePortfolio,
}) => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.NftTrader)
  const { typedContract } = useRegisteredTypedContract(ContractIds.NftTrader, NftTraderContract)
  const [portfolioInfo, setPortfolioInfo] = useState<PortfolioInfo>()
  const form = useForm()

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = form

  // Fetch Portfolio
  const fetchPortfolio = async () => {
    if (!api || !ticker || !portfolio || !typedContract) {
      setPortfolioInfo(undefined)
      return
    }

    const name = portfolio?.kind.user
      ? (await api.query.portfolio.portfolios(portfolio?.did, portfolio?.kind.user)).toHuman()
      : 'Default'

    // Get NFTs in portfolio and only show the ones with the correct ticker.
    const nfts = (await api.query.portfolio.portfolioNFT.entries(portfolio))
      .map(([key, has]) => {
        const args = key.args
        const nft = args[1].toPrimitive() as [string, number]
        const collection = nft[0]
        const id = nft[1]
        return [id, has.toPrimitive() && collection == `${ticker}`]
      })
      .filter(([nft, keep]) => keep)
      .map(([id, _]): Nft => {
        return { id: id as number, price: undefined }
      })
    //console.log(`Fetched portfolio nfts `, nfts)

    // reset form state.
    reset()

    // get NFT sale details
    for (const nft of nfts) {
      try {
        const typedResult = await typedContract.query.nftSaleDetails(nft.id)
        const value = typedResult.value.unwrap().ok
        if (value) {
          //console.log('nft sale details: ', value)
          // convert price to POLYX
          nft.price = Number(value.price) / 1_000_000.0
          setValue(`Nft_${nft.id}`, nft.price)
        }
      } catch (e) {
        console.error(e)
      }
    }

    setPortfolioInfo({
      name: `${name}`,
      nfts: nfts,
    })
  }
  useEffect(() => {
    fetchPortfolio()
  }, [api, ticker, portfolio, refreshPortfolio, typedContract])

  // Update NFTs for sale.
  const updateNftForSale = async (prices: { [_: string]: any }) => {
    if (!activeAccount || !contract || !activeSigner || !api || !portfolioInfo) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    //console.log('From prices: ', prices)
    const updates = new Map<number, number | null>()
    for (const nft of portfolioInfo.nfts) {
      const price = prices[`Nft_${nft.id}`] as number
      if (price != nft.price) {
        console.log(`update Nft `, nft.id, price)
        if (price) {
          updates.set(nft.id, price * 1_000_000.0)
        } else {
          updates.set(nft.id, null)
        }
      }
    }
    if (updates.size == 0) {
      console.log('No for sale updates')
      return
    }
    //console.log('Updates: ', updates)

    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'nftForSell', {}, [updates])
      reset()
      reloadPrices()
    } catch (e) {
      console.error(e)
    } finally {
      fetchPortfolio()
    }
  }

  // Remove the portfolio from the contract.
  const removePortfolio = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'removePortfolio', {}, [])
      console.log('Portfolio removed from contract')
      await updatePortfolio()
      console.log('Portfolio updated')
    } catch (e) {
      console.error(e)
    }
  }

  // Connection Loading Indicator
  if (!api)
    return (
      <div className="mb-4 mt-8 flex flex-col items-center justify-center space-y-3 text-center font-mono text-sm text-gray-400 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Spinner />
        <div>Loading...</div>
      </div>
    )

  if (!portfolio) {
    return (
      <div className="flex max-w-[30rem] grow flex-col gap-4">
        <h2 className="text-center font-mono text-gray-400">Setup your portfolio first.</h2>
      </div>
    )
  }

  return (
    <>
      <div className="flex max-w-[30rem] grow flex-col gap-4">
        <h2 className="text-center font-mono text-gray-400">
          Your portfolio: &quot;{portfolioInfo?.name}&quot;
        </h2>

        <Card>
          <CardContent className="pb-3 pt-6">
            {/* Nfts */}
            <form className="flex flex-col justify-end gap-2">
              {portfolioInfo?.nfts.map((nft) => (
                <div key={nft.id} className="flex gap-2">
                  NFT {nft.id}
                  <Input
                    placeholder="Set POLYX price to sell"
                    type="number"
                    disabled={form.formState.isSubmitting}
                    {...register(`Nft_${nft.id}`)}
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-primary font-bold"
                  disabled={form.formState.isSubmitting || !isDirty}
                  isLoading={form.formState.isSubmitting}
                  onClick={handleSubmit(updateNftForSale)}
                >
                  Update Prices
                </Button>
                <Button
                  type="submit"
                  className="bg-primary font-bold"
                  disabled={form.formState.isSubmitting}
                  isLoading={form.formState.isSubmitting}
                  onClick={handleSubmit(removePortfolio)}
                >
                  Remove Portfolio from contract
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
