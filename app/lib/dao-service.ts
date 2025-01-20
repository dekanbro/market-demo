import { getGraphClient } from './graphql'
import { gql } from 'graphql-request'
import { DaoQueryResponse, DaoResponse } from './types'

const daoFields = `
  id
  createdAt
  createdBy
  txHash
  safeAddress
  lootPaused
  sharesPaused
  gracePeriod
  votingPeriod
  proposalOffering
  quorumPercent
  sponsorThreshold
  minRetentionPercent
  shareTokenName
  shareTokenSymbol
  sharesAddress
  lootTokenName
  lootTokenSymbol
  lootAddress
  totalShares
  totalLoot
  latestSponsoredProposalId
  proposalCount
  activeMemberCount
  existingSafe
  delegatedVaultManager
  forwarder
  referrer
  name
  rawProfile: records(
    first: 1
    orderBy: createdAt
    orderDirection: desc
    where: { table: "daoProfile" }
  ) {
    createdAt
    createdBy
    contentType
    content
  }
  shamen: shaman(
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    createdAt
    shamanAddress
    permissions
  }
  vaults (where: {active: true}){
    id
    createdAt
    active
    ragequittable
    name
    safeAddress
  }
`

const LIST_ALL_DAOS = gql`
  query dao(
    $skip: Int = 0
    $first: Int = 100
    $orderBy: String = "createdAt"
    $orderDirection: String = "desc"
  ) {
    molochV3S(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ${daoFields}
    }
  }
`

interface DaoQueryParams {
  chainId?: string;
  filter?: string;
}

export async function fetchDaos({ chainId = '0x1', filter }: DaoQueryParams = {}): Promise<DaoResponse> {
  try {
    console.log("[DAO] Fetching with params:", { chainId, filter });
    
    // Verify API key exists
    const apiKey = process.env.NEXT_PUBLIC_GRAPH_API_KEY
    if (!apiKey) {
      throw new Error('Graph API key is not configured')
    }
    
    const client = getGraphClient({
      chainId,
      graphKey: apiKey,
      subgraphKey: 'DAOHAUS'
    })
    
    // Log the full request
    console.log("[DAO] Making request with:", {
      chainId,
      graphKey: apiKey.substring(0, 8) + '...',
      subgraphKey: 'DAOHAUS'
    })
    
    const data = await client.request<DaoQueryResponse>(LIST_ALL_DAOS, { chainId })
    console.log("[DAO] Response:", data);
    
    const filteredDaos = filter 
      ? data.molochV3S.filter(dao => 
          dao.name.toLowerCase().includes(filter.toLowerCase())
        )
      : data.molochV3S

    return {
      daos: filteredDaos,
      error: null,
      loading: false
    }
  } catch (error) {
    console.error("[DAO] Error:", error);
    return {
      daos: [],
      error: error instanceof Error ? error.message : 'Failed to fetch DAOs',
      loading: false
    }
  }
} 