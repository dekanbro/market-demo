// Default DAO parameters
export const DEFAULT_DAO_PARAMS = {
  VOTING_PERIOD: 60 * 60 * 24 * 2, // 2 days
  GRACE_PERIOD: 60 * 60 * 24 * 1, // 1 days
  PROPOSAL_OFFERING: '0',
  QUORUM: '0',
  SPONSOR_THRESHOLD: '1',
  MIN_RETENTION: '33',
  GOVERNANCE_TOKEN_NAME: 'Governance Token',
  GOVERNANCE_TOKEN_SYMBOL: 'GOV',
} as const

// Time
export const DEFAULT_START_DATE_OFFSET = 600 // 10 minutes
export const DEFAULT_DURATION = 1800 // 30 minutes

// Shaman permissions
export const MM_SHAMAN_PERMISSIONS = '3' // No permissions
export const YEET_SHAMAN_PERMISSIONS = '2' // Full permissions (manage + admin)

// Default values for different summoner types
export const DEFAULT_YEETER_VALUES = {
  TOKEN_CONFIG: {
    name: 'Yeeter Token',
    symbol: 'YEET'
  },
  isShares: true,
  feeRecipients: [
    "0xD0f8720846890a7961945261FE5012E4cA39918e",
    "0x4a9a27d614a74ee5524909ca27bdbcbb7ed3b315",
  ], // yeeter team, daohaus eco fund 
  feeAmounts: ["5000", "5000"], // .5% fees
  multiplier: "100000",
}

export const DEFAULT_GOAL = "10000000000000000" // .01
export const START_TIME = Math.floor(Date.now() / 1000) + DEFAULT_START_DATE_OFFSET
export const END_TIME = START_TIME + DEFAULT_DURATION

export const SHARES_TRANSFER_PAUSED = true;
export const LOOT_TRANSFER_PAUSED = true;


export const DEFAULT_MEME_YEETER_VALUES = {
  poolFee: "10000", // 1%
  boostRewardFee: "90000", // 9%
} as const

