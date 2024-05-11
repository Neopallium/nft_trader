'use client'

import { FC, useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { zodResolver } from '@hookform/resolvers/zod'
import NftTraderContract from '@inkathon/contracts/typed-contracts/contracts/nft_trader'
import { IdentityId } from '@inkathon/contracts/typed-contracts/types-arguments/nft_trader'
import {
  contractCallDryRun,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
  useRegisteredTypedContract,
} from '@scio-labs/use-inkathon'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const formSchema = z.object({
  portfolioName: z.string().min(1).max(90),
})

export interface SetupPortfolioProps {
  contractDid: IdentityId | undefined
  userDid: IdentityId | undefined
  updatePortfolio: () => Promise<void>
}
export const SetupPortfolio: FC<SetupPortfolioProps> = ({
  contractDid,
  userDid,
  updatePortfolio,
}) => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.NftTrader)
  const { typedContract } = useRegisteredTypedContract(ContractIds.NftTrader, NftTraderContract)
  const [needAuthorization, setNeedAuthorization] = useState<boolean>()
  const [pendingAuth, setPendingAuth] = useState<boolean>()
  const formAllow = useForm()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { register, handleSubmit } = form

  // Check if the contract has been authorized to create a portfolio
  const checkAuthorized = async () => {
    if (!activeAccount || !contract || !activeSigner || !api || !contractDid) {
      return
    }

    // Check if the contract has been authorized to create a portfolio
    try {
      const dryResult = await contractCallDryRun(
        api,
        activeAccount.address,
        contract,
        'createPortfolio',
        {},
        ['test'],
      )
      const { isError, decodedOutput } = decodeOutput(dryResult, contract, 'createPortfolio')
      console.log('createPortfolio dry run: ', isError)
      if (isError) {
        setNeedAuthorization(true)
      } else {
        setNeedAuthorization(false)
      }
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    checkAuthorized()
  }, [api, activeAccount, contract, activeSigner, contractDid])

  // Allow contract to create portfolio
  const allowCreatePortfolio = async () => {
    if (!activeAccount || !contract || !activeSigner || !api || !contractDid) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    setPendingAuth(true)
    try {
      const tx = await api.tx.portfolio
        .allowIdentityToCreatePortfolios(contractDid)
        .signAndSend(activeAccount.address, (result) => {
          console.log(`Current status is ${result.status}`)
          if (result.status.isInBlock) {
            checkAuthorized()
            setPendingAuth(false)
          }
        })
      console.log('Allow contract to create portfolio tx hash: ', tx)
    } catch (e) {
      console.error(e)
    }
  }

  // create portfolio
  const createPortfolio: SubmitHandler<z.infer<typeof formSchema>> = async ({ portfolioName }) => {
    if (!activeAccount || !contract || !activeSigner || !api || !contractDid) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    try {
      // Check if the user already has a portfolio with the same name.
      const portfolioNumber = (
        await api.query.portfolio.nameToNumber(userDid, portfolioName)
      ).toHuman()
      console.log('Portfolio number: ', portfolioNumber)
      if (portfolioNumber) {
        toast.error('You already have a portfolio with the same name. Try another name…')
        return
      }

      // Create the portfolio
      await contractTxWithToast(api, activeAccount.address, contract, 'createPortfolio', {}, [
        portfolioName,
      ])
      console.log('Portfolio created')
      await updatePortfolio()
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

  return (
    <>
      <div className="flex max-w-[30rem] grow flex-col gap-4">
        <h2 className="text-center font-mono text-gray-400">Register with contract</h2>

        <Card>
          <CardContent className="pb-3 pt-6">
            {needAuthorization && (
              <form
                onSubmit={formAllow.handleSubmit(allowCreatePortfolio)}
                className="flex flex-col justify-end gap-2"
              >
                <div className="text-sm text-gray-400">
                  The contract needs authorization to create a portfolio. The portfolio will be used
                  to hold the NFTs you sell or buy.
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-primary font-bold"
                    disabled={form.formState.isSubmitting || pendingAuth}
                    isLoading={form.formState.isSubmitting || pendingAuth}
                  >
                    Allow create portfolio
                  </Button>
                </div>
              </form>
            )}
            {!needAuthorization && (
              <form
                onSubmit={handleSubmit(createPortfolio)}
                className="flex flex-col justify-end gap-2"
              >
                <div className="text-sm text-gray-400">Create the portfolio.</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Name for new portfolio"
                    disabled={form.formState.isSubmitting}
                    {...register('portfolioName')}
                  />
                  <Button
                    type="submit"
                    className="bg-primary font-bold"
                    disabled={form.formState.isSubmitting}
                    isLoading={form.formState.isSubmitting}
                  >
                    Create portfolio
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
