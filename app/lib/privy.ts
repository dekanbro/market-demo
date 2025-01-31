import { PrivyClientConfig } from '@privy-io/react-auth';
import { base } from 'viem/chains';

export const privyConfig: PrivyClientConfig = {
  // loginMethods: ['email', 'wallet'],
  loginMethods: ['wallet'],
  appearance: {
    theme: 'light',
    accentColor: '#676FFF',
    // showWalletLoginFirst: true,
  },
  // embeddedWallets: {
  //   createOnLogin: 'users-without-wallets',
  //   requireUserPasswordOnCreate: false,
  // },
  defaultChain: base,
  supportedChains: [base]
}; 