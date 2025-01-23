export interface TokenConfig {
  name: string
  symbol: string
}

export interface DaoParams {
  votingPeriod: number
  gracePeriod: number
  proposalOffering: string
  quorum: string
  sponsorThreshold: string
  minRetention: string
  minStakingValue: string
  governanceTokenName: string
  governanceTokenSymbol: string
  votingTransferDelay: number
}

export interface SummonParams {
  sharesTokenName: string
  sharesTokenSymbol: string
  lootTokenName: string
  lootTokenSymbol: string
  initialSharesAmount: string
  initialLootAmount: string
}

export interface YeeterConfig {
  daoName: string
  startTime: number
  endTime: number
  tokenConfig: TokenConfig
  price: string
  multiplier: string
  minThresholdGoal: string
  feeRecipients: string[]
  feeAmounts: string[]
  boostRewardFees: string[]
  isShares: boolean
  poolFee: string
  memberAddress: string
  imageUrl: string
  description: string
  tags: string[]
}

// Contract interaction types
export interface InitData {
  initializationParams: string
  saltNonce: string
}

export interface ShamanParams {
  permissions: string
  setupParams: string
}

export interface YeeterInitParams {
  startTime: number
  endTime: number
  tokenName: string
  tokenSymbol: string
  tokenSupply: string
  shamanAddress: string
  shamanParams: ShamanParams
}

export interface DaoInitParams {
  initializationParams: string
  initializationActions: string[]
}

export interface ProxyAddresses {
  daoAddress: string
  shamanAddress: string
  safeAddress: string
}

// Function return types
export interface EncodedParams {
  encoded: `0x${string}`
}

export interface SaltNonceResult {
  saltNonce: string
  timestamp: number
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors?: string[]
} 