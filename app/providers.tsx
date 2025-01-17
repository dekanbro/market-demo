'use client';

import { createConfig, type Config } from '@wagmi/core'
import { WagmiProvider } from 'wagmi'
import { mainnet } from 'viem/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Simple config for ENS resolution only
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
}) satisfies Config

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 