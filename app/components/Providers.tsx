'use client'

import { createConfig } from '@wagmi/core'
import { WagmiProvider } from 'wagmi'
import { base } from 'viem/chains'
import { http } from 'viem'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth'
import { DEFAULT_CHAIN } from '@/app/lib/constants'

// Configure for Base
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  }
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
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