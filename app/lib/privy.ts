import { PrivyClientConfig } from '@privy-io/react-auth';
import { mainnet, sepolia } from 'viem/chains';

export const privyConfig: PrivyClientConfig = {
  loginMethods: ['email', 'wallet'],
  appearance: {
    theme: 'light',
    accentColor: '#676FFF',
    showWalletLoginFirst: false,
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
  },
  defaultChain: mainnet,
  supportedChains: [mainnet, sepolia]
}; 