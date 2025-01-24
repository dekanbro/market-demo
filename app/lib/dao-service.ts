import { getGraphClient } from './graphql'
import { gql } from 'graphql-request'
import { DaoItem, DaoQueryResponse, DaoResponse, DaoStatus, DaoType, HydratedDaoItem } from './types'
import { CHAIN_ID, DEFAULT_DAO_DATE, GRAPH, FEATURED_DAOS, SUPER_AGENTS } from './constants'


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
  `,

  getCombinedDaos: gql`
    query getCombinedDaos(
      $ids: [ID!]
      $skip: Int = 0
      $first: Int = 100
      $orderBy: String = "createdAt"
      $orderDirection: String = "desc"
      $createdAfter: String
      $referrer: String
    ) {
      specificDaos: daos(where: { id_in: $ids }) {
        ...DaoFields
      }
      filteredDaos: daos(
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
  `,

  getFeaturedAndRecentDaos: gql`
    query getFeaturedAndRecentDaos(
      $ids: [ID!]!
      $skip: Int = 0 
      $first: Int = 200
      $orderBy: String = "createdAt"
      $orderDirection: String = "desc"
      $createdAfter: String
    ) {
      featured: daos(where: { id_in: $ids }) {
        ...DaoFields
      }
      recent: daos(
        where: { createdAt_gt: $createdAfter }
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        ...DaoFields
      }
    }
    ${daoFields}
  `,

  getDaoById: gql`
    query getDaoById($id: ID!) {
      dao(id: $id) {
        ...DaoFields
      }
    }
    ${daoFields}
  `
}

// Helper Functions
function createGraphClient(chainId: string = CHAIN_ID.BASE) {
  const apiKey = process.env.GRAPH_API_KEY
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
  const apiKey = process.env.GRAPH_API_KEY
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

interface CombinedDaoParams extends FilteredDaoParams {
  ids?: string[];
}

// Add hydration function
function hydrateDaoData(dao: DaoItem): HydratedDaoItem {
  // Check if DAO is featured
  const isFeatured = FEATURED_DAOS.some(featured => featured.id === dao.id)
  const isSuperAgent = SUPER_AGENTS.some(agent => agent.id === dao.id)
  
  // Parse profile data
  let profile = undefined
  if (dao.rawProfile?.[0]?.content) {
    try {
      profile = JSON.parse(dao.rawProfile[0].content)
    } catch (e) {
      console.error("[DAO] Failed to parse profile:", e)
    }
  }

  // Determine status (can add more complex logic later)
  let status: DaoStatus = 'failed'
  if (isFeatured) status = 'featured'
  // else if (dao.activeMemberCount > 0) status = 'active'

  let type: DaoType = 'none'
  if (isSuperAgent) type = 'super'

  console.log("[DAO] Hydrating DAO:", dao.id, status)
  console.log("[DAO] DAO:", dao.rawProfile)

  return {
    ...dao,
    profile,
    status,
    comingSoon: false,
    type,
    price: 0
  }
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

export async function fetchDaosByIds({ 
  chainId = CHAIN_ID.BASE,
  filter,
  ids = []
}: DaoQueryParams & { ids: string[] }): Promise<DaoResponse> {
  try {
    const client = createGraphClient(chainId)
    
    const data = await client.request<DaoQueryResponse>(
      queries.getDaosByIds, 
      { ids }
    )

    // Apply filters in memory
    let filteredDaos = data.daos

    // Apply text filter if provided
    if (filter) {
      filteredDaos = filteredDaos.filter(dao => 
        dao.name.toLowerCase().includes(filter.toLowerCase())
      )
    }

    // Sort by createdAt descending
    const sortedDaos = filteredDaos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return {
      daos: sortedDaos,
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

export async function fetchCombinedDaos({ 
  chainId = CHAIN_ID.BASE,
  filter,
  createdAfter,
  referrer,
  ids = []
}: CombinedDaoParams = {}): Promise<DaoResponse> {
  try {
    const client = createGraphClient(chainId)
    
    // Build where clause based on provided values
    const where: Record<string, any> = {}
    if (createdAfter) where.createdAt_gt = createdAfter
    if (referrer) where.referrer = referrer

    const variables = {
      ids: ids.length > 0 ? ids : undefined,
      where
    }
    
    const data = await client.request<{
      specificDaos: DaoItem[];
      filteredDaos: DaoItem[];
    }>(queries.getCombinedDaos, variables)

    // Apply text filter after fetching if needed
    let allDaos = [...data.specificDaos, ...data.filteredDaos]
    if (filter) {
      allDaos = allDaos.filter(dao => 
        dao.name.toLowerCase().includes(filter.toLowerCase())
      )
    }

    // Remove duplicates and sort
    const uniqueDaos = Array.from(
      new Map(allDaos.map(dao => [dao.id, dao])).values()
    )

    const sortedDaos = uniqueDaos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return {
      daos: sortedDaos,
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

export async function fetchFeaturedAndRecentDaos({ 
  chainId = CHAIN_ID.BASE,
  filter,
  featuredIds = [],
  first = 100,
  createdAfter = DEFAULT_DAO_DATE
}: DaoQueryParams & { 
  featuredIds: string[];
  first?: number;
  createdAfter?: string;
}): Promise<{ daos: HydratedDaoItem[]; error: string | null; loading: boolean }> {
  try {
    const client = createGraphClient(chainId)
    
    const data = await client.request<{
      featured: DaoItem[];
      recent: DaoItem[];
    }>(queries.getFeaturedAndRecentDaos, { 
      ids: featuredIds,
      first,
      createdAfter
    })

    // Combine both sets
    let allDaos = [...data.featured, ...data.recent]

    // Apply text filter if provided
    if (filter) {
      allDaos = allDaos.filter(dao => 
        dao.name.toLowerCase().includes(filter.toLowerCase())
      )
    }

    // Remove duplicates
    const uniqueDaos = Array.from(
      new Map(allDaos.map(dao => [dao.id, dao])).values()
    )

    // Hydrate and sort DAOs
    const hydratedDaos = uniqueDaos.map(hydrateDaoData)
    const sortedDaos = hydratedDaos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return {
      daos: sortedDaos,
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

export async function getDaoById(id: string, chainId = CHAIN_ID.BASE): Promise<HydratedDaoItem | null> {
  console.log("[DAO] Fetching DAO by ID:", id)
  try {
    const client = createGraphClient(chainId)
    logRequest({ chainId, id })
    
    const data = await client.request<{ dao: DaoItem }>(
      queries.getDaoById,
      { id }
    )

    if (!data.dao) return null

    // Hydrate the DAO data
    const hydratedDao = hydrateDaoData(data.dao)
    
    return hydratedDao
  } catch (error) {
    console.error("[DAO] Error fetching DAO:", error)
    return null
  }
} 