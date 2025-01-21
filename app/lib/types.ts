export interface DaoItem {
  id: string;
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
export type DaoStatus = 'featured' | 'active' | 'failed'
export type DaoType = 'none' | 'yeeter' | 'venture' // extend as needed

// Add interface for hydrated DAO
export interface HydratedDaoItem extends DaoItem {
  status: DaoStatus;
  comingSoon: boolean;
  type: DaoType;
  price: number;
}
