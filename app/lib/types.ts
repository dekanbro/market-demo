export interface DaoItem {
  id: string;
  chainId?: string;
  createdAt: string;
  createdBy: string;
  txHash: string;
  safeAddress: string;
  lootPaused: boolean;
  sharesPaused: boolean;
  gracePeriod: string;
  votingPeriod: string;
  proposalOffering: string;
  quorumPercent: string;
  sponsorThreshold: string;
  minRetentionPercent: string;
  shareTokenName: string;
  shareTokenSymbol: string;
  sharesAddress: string;
  lootTokenName: string;
  lootTokenSymbol: string;
  lootAddress: string;
  totalShares: string;
  totalLoot: string;
  latestSponsoredProposalId: string;
  proposalCount: string;
  activeMemberCount: string;
  existingSafe: string;
  delegatedVaultManager: string;
  forwarder: string;
  referrer: string;
  name: string;
  rawProfile: RecordItem[];
  profile?: DaoProfile;
  shamen: ShamanItem[];
  vaults: VaultItem[];
  yeeterData?: YeeterData | null;
}

export interface DaoProfile {
  description?: string;
  longDescription?: string;
  avatarImg?: string;
  tags?: string[];
  links?: DaoProfileLink[];
}

export interface RecordItem {
  createdAt: string;
  createdBy: string;
  content: string;
  contentType: string;
  dao: {
    name: string;
  };
}

export interface DaoProfileLink {
  label?: string;
  url?: string;
}

export interface ShamanItem {
  id: string;
  createdAt: string;
  shamanAddress: string;
  permissions: string;
}

export interface VaultItem {
  id: string;
  createdAt: string;
  active: string;
  ragequittable: string;
  name: string;
  safeAddress: string;
}

export interface DaoQueryResponse {
  daos: DaoItem[];
}

export interface DaoResponse {
  daos: DaoItem[];
  error: string | null;
  loading: boolean;
}

// Add new types for the extra fields
export type DaoStatus = 'featured' | undefined
export type DaoType = 'none' | 'super' // extend as needed

// Add interface for hydrated DAO
export interface HydratedDaoItem extends DaoItem {
  status: DaoStatus;
  comingSoon: boolean;
  type: DaoType;
  price: number;
  profile?: any;
  yeeterData?: YeeterData | null;
  isPresale?: boolean;
  isSpecialDao: boolean;
  agentImage?: string;
  agentName?: string;
  marketMakerShamanAddress?: string;
  socialsBot?: string;
  farcasterBot?: string;
  discordBot?: string;
}

export interface YeeterData {
  id: string;
  endTime: string;
  startTime: string;
  isShares: boolean;
  multiplier: string;
  minTribute: string;
  goal: string;
  balance: string;
  goalAchieved: boolean;
  yeetCount: string;
  vault: string;
  dao: {
    id: string;
  };
}
