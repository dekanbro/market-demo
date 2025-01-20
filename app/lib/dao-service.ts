import { getGraphClient } from './graphql'
import { gql } from 'graphql-request'
import { DaoQueryResponse, DaoResponse } from './types'
import { CHAIN_ID, GRAPH } from './constants'

// GraphQL Fragments
const daoFields = gql`
  fragment DaoFields on Dao {
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
    vaults(where: {active: true}) {
      id
      createdAt
      active
      ragequittable
      name
      safeAddress
    }
  }
`

// GraphQL Queries
const queries = {
  listDaos: gql`
    query listDaos(
      $skip: Int = 0
      $first: Int = 100
      $orderBy: String = "createdAt"
      $orderDirection: String = "desc"
    ) {
      daos(
        skip: $skip
        first: $first
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        ...DaoFields
      }
    }
    ${daoFields}
  `,
  
  getDaosByIds: gql`
    query getDaosByIds($ids: [ID!]!) {
      daos(where: { id_in: $ids }) {
        ...DaoFields
      }
    }
    ${daoFields}
  `,
  
  // New query for filtered DAOs
  getFilteredDaos: gql`
    query getFilteredDaos(
      $skip: Int = 0
      $first: Int = 100
      $orderBy: String = "createdAt"
      $orderDirection: String = "desc"
      $createdAfter: String
      $referrer: String
    ) {
      daos(
        skip: $skip
        first: $first
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: {
          createdAt_gt: $createdAfter
          referrer: $referrer
        }
      ) {
        ...DaoFields
      }
    }
    ${daoFields}
  `
}

// Helper Functions
function createGraphClient(chainId: string = CHAIN_ID.BASE) {
  const apiKey = process.env.NEXT_PUBLIC_GRAPH_API_KEY
  if (!apiKey) {
    throw new Error('Graph API key is not configured')
  }

  return getGraphClient({
    chainId,
    graphKey: apiKey,
    subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
  })
}

function logRequest(params: Record<string, any>) {
  const apiKey = process.env.NEXT_PUBLIC_GRAPH_API_KEY
  console.log("[DAO] Making request with:", {
    ...params,
    graphKey: apiKey?.substring(0, 8) + '...',
    subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
  })
}

// Service Functions
interface DaoQueryParams {
  chainId?: string;
  filter?: string;
}

interface FilteredDaoParams extends DaoQueryParams {
  createdAfter?: string;
  referrer?: string;
}

export async function fetchDaos({ 
  chainId = CHAIN_ID.BASE, 
  filter 
}: DaoQueryParams = {}): Promise<DaoResponse> {
  try {
    console.log("[DAO] Fetching with params:", { chainId, filter })
    
    const client = createGraphClient(chainId)
    logRequest({ chainId })
    
    const data = await client.request<DaoQueryResponse>(queries.listDaos)
    console.log("[DAO] Response:", data)
    
    const filteredDaos = filter 
      ? data.daos.filter(dao => 
          dao.name.toLowerCase().includes(filter.toLowerCase())
        )
      : data.daos

    return {
      daos: filteredDaos,
      error: null,
      loading: false
    }
  } catch (error) {
    console.error("[DAO] Error:", error)
    return {
      daos: [],
      error: error instanceof Error ? error.message : 'Failed to fetch DAOs',
      loading: false
    }
  }
}

export async function fetchDaosByIds(ids: string[]): Promise<DaoResponse> {
  try {
    console.log("[DAO] Fetching DAOs by IDs:", ids)
    
    const client = createGraphClient()
    logRequest({ ids })
    
    const data = await client.request<DaoQueryResponse>(queries.getDaosByIds, { ids })
    console.log("[DAO] Response:", data)
    
    return {
      daos: data.daos,
      error: null,
      loading: false
    }
  } catch (error) {
    console.error("[DAO] Error:", error)
    return {
      daos: [],
      error: error instanceof Error ? error.message : 'Failed to fetch DAOs',
      loading: false
    }
  }
}

export async function fetchFilteredDaos({ 
  chainId = CHAIN_ID.BASE,
  filter,
  createdAfter,
  referrer 
}: FilteredDaoParams = {}): Promise<DaoResponse> {
  try {
    console.log("[DAO] Fetching filtered DAOs:", { 
      chainId, 
      filter,
      createdAfter,
      referrer 
    })
    
    const client = createGraphClient(chainId)
    logRequest({ chainId, createdAfter, referrer })
    
    const data = await client.request<DaoQueryResponse>(
      queries.getFilteredDaos, 
      { 
        createdAfter,
        referrer
      }
    )
    console.log("[DAO] Response:", data)
    
    const filteredDaos = filter 
      ? data.daos.filter(dao => 
          dao.name.toLowerCase().includes(filter.toLowerCase())
        )
      : data.daos

    return {
      daos: filteredDaos,
      error: null,
      loading: false
    }
  } catch (error) {
    console.error("[DAO] Error:", error)
    return {
      daos: [],
      error: error instanceof Error ? error.message : 'Failed to fetch DAOs',
      loading: false
    }
  }
} 