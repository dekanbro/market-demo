'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { base } from 'viem/chains'
import { ReactNode } from 'react'
import { config, queryClient } from '../lib/wagmi'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet'],
        // loginMethods: ['wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          showWalletLoginFirst: true,
        },
        defaultChain: base,
        supportedChains: [base]
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  )
} 