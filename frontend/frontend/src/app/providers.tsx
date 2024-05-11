'use client'

import { PropsWithChildren } from 'react'

import { getDeployments } from '@/deployments/deployments'
import {
  SubstrateWallet,
  SubstrateWalletPlatform,
  UseInkathonProvider,
  allSubstrateWallets,
} from '@scio-labs/use-inkathon'

import { env } from '@/config/environment'

export const polymesh: SubstrateWallet = {
  id: 'polywallet',
  name: 'Polymesh Wallet',
  platforms: [SubstrateWalletPlatform.Browser],
  urls: {
    website: 'https://github.com/PolymeshAssociation/polymesh-wallet',
    chromeExtension:
      'https://chromewebstore.google.com/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf',
  },
  logoUrls: [
    'https://github.com/PolymeshAssociation/polymesh-wallet/raw/main/packages/extension/public/images/icon-128.png',
  ],
}

export default function ClientProviders({ children }: PropsWithChildren) {
  return (
    <UseInkathonProvider
      appName="ink!athon" // TODO
      connectOnInit={true}
      defaultChain={env.defaultChain}
      deployments={getDeployments()}
      supportedWallets={[polymesh, ...allSubstrateWallets]}
    >
      {children}
    </UseInkathonProvider>
  )
}
