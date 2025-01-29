import { getGraphClient } from './graphql'
import { gql } from 'graphql-request'
import { DaoItem, DaoQueryResponse, DaoResponse, DaoStatus, DaoType, HydratedDaoItem, YeeterData } from './types'
import { CHAIN_ID, DEFAULT_DAO_DATE, GRAPH, FEATURED_DAOS, SUPER_AGENTS, REFERRER, SPECIAL_DAOS } from './constants'


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




  getFeaturedAndRecentDaos: gql`
    query getFeaturedAndRecentDaos(
      $ids: [ID!]!
      $skip: Int = 0 
      $first: Int = 1000
      $orderBy: String = "createdAt"
      $orderDirection: String = "desc"
      $createdAfter: Int
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

const yeeterFields = `
id
createdAt
dao {
  id
}
endTime
startTime
isShares
multiplier
minTribute
goal
balance
yeetCount
vault
`;

export const GET_YEETER = gql`
  query yeeterByDao($daoId: String!) {
    yeeters(
      first: 1,
      orderBy: createdAt,
      orderDirection: desc,
      where: {
        dao_: {
          id: $daoId
        }
      }
    ) {
      ${yeeterFields}
    }
  }
`;

export const GET_YEETER_BY_DAO_IDs = gql`
  query getYeeterByDaoIds($ids: [ID!]!) {
    yeeters(where: { dao_: { id_in: $ids } }) {
      ${yeeterFields}
    }
  }
`

export const GET_YEETERS = gql`
  {
    yeeters(
      first: 1000, 
      orderBy: createdAt, 
      orderDirection: desc
      where: {
        dao_: {
          referrer: "${REFERRER}"
        }
      }
    ) {
      ${yeeterFields}

    }
  }
`;

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
  // const apiKey = process.env.GRAPH_API_KEY
  // console.log("[DAO] Making request with:", {
  //   ...params,
  //   graphKey: apiKey?.substring(0, 8) + '...',
  //   subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
  // })
}

// Create a separate client for yeeter subgraph
function createYeeterClient(chainId: string = CHAIN_ID.BASE) {
  const apiKey = process.env.GRAPH_API_KEY
  if (!apiKey) {
    throw new Error('Graph API key is not configured')
  }

  return getGraphClient({
    chainId,
    graphKey: apiKey,
    subgraphKey: GRAPH.SUBGRAPH_KEYS.YEETER
  })
}

// Service Functions
interface DaoQueryParams {
  chainId?: string;
  filter?: string;
  featuredIds?: string[];
  first?: number;
  createdAfter?: string;
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
  const isFeatured = FEATURED_DAOS.some(featured => featured.id === dao.id)
  const isSuperAgent = SUPER_AGENTS.some(agent => agent.id === dao.id)
  const isSpecialDao = SPECIAL_DAOS.GNOSIS.some(special => special.id === dao.id)

  const specialDao = SPECIAL_DAOS.GNOSIS.find(special => special.id === dao.id)
  const featuredDao = FEATURED_DAOS.find(featured => featured.id === dao.id)
  
  let profile = undefined
  if (dao.rawProfile?.[0]?.content) {
    try {
      profile = JSON.parse(dao.rawProfile[0].content)
    } catch (e) {
      console.error("[DAO] Failed to parse profile:", e)
    }
  }

  let status: DaoStatus = 'failed'
  if (isFeatured || isSpecialDao) status = 'featured'

  let type: DaoType = 'none'
  if (isSuperAgent) type = 'super'

  // Check presale status
  let comingSoon = false
  let isPresale = false
  
  if (dao.yeeterData?.startTime && dao.yeeterData?.endTime) {
    const now = Date.now()
    const startTime = parseInt(dao.yeeterData.startTime) * 1000
    const endTime = parseInt(dao.yeeterData.endTime) * 1000
    const twoDaysFromNow = now + (2 * 24 * 60 * 60 * 1000)
    // const price = dao.yeeterData.price
    
    comingSoon = startTime > now && startTime <= twoDaysFromNow
    isPresale = now >= startTime && now < endTime

  }

  const marketMakerShaman = dao.shamen.find(shaman => {
    // console.log("[DAO] Shaman ID:", shaman.shamanAddress, "Yeeter ID:", dao.yeeterData?.id)
    return shaman.shamanAddress.toLowerCase() !== dao.yeeterData?.id.toLowerCase()
  })
  return {
    ...dao,
    profile,
    status,
    comingSoon,
    type,
    price: 0,
    isPresale,
    isSpecialDao,
    agentImage: specialDao?.agentImage || featuredDao?.agentImage || undefined,
    marketMakerShamanAddress: marketMakerShaman?.shamanAddress || undefined
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

export async function fetchFeaturedAndRecentDaos({ 
  chainId = CHAIN_ID.BASE,
  filter,
  featuredIds,
  first = 200,
  createdAfter = DEFAULT_DAO_DATE
}: {
  chainId?: string
  filter?: string
  featuredIds: string[]
  first?: number
  createdAfter?: string
}): Promise<DaoResponse> {
  try {
    const baseClient = getGraphClient({
      chainId: CHAIN_ID.BASE,
      graphKey: process.env.GRAPH_API_KEY!,
      subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
    })

    const yeeterClient = getGraphClient({
      chainId: CHAIN_ID.BASE,
      graphKey: process.env.GRAPH_API_KEY!,
      subgraphKey: GRAPH.SUBGRAPH_KEYS.YEETER
    })

    const gnosisClient = getGraphClient({
      chainId: CHAIN_ID.GNOSIS,
      graphKey: process.env.GRAPH_API_KEY!,
      subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
    })

    // Query both chains and yeeter data
    const [baseData, gnosisData] = await Promise.all([
      baseClient.request<{
        featured: DaoItem[];
        recent: DaoItem[];
      }>(queries.getFeaturedAndRecentDaos, { 
        ids: featuredIds.filter(id => !id.includes('0x64')),
        createdAfter: Number(createdAfter)
      }),
      gnosisClient.request<{
        daos: DaoItem[];
      }>(queries.getDaosByIds, { 
        ids: SPECIAL_DAOS.GNOSIS.map(dao => dao.id)
      }),
    ])

    const yeeterData = await yeeterClient.request<{
      yeeters: YeeterData[];
    }>(GET_YEETER_BY_DAO_IDs, {
      ids: [...baseData.featured.map(dao => dao.id), ...baseData.recent.map(dao => dao.id)]
    })


    // Create a map of yeeter data by DAO ID
    const yeeterDataMap = new Map(
      yeeterData.yeeters.map(yeeter => [yeeter.dao.id, yeeter])
    )

    // Combine DAOs from both chains and add yeeter data
    let allDaos = [
      ...baseData.featured,
      ...baseData.recent,
      ...gnosisData.daos.map(dao => ({
        ...dao,
        chainId: CHAIN_ID.GNOSIS
      }))
    ].map(dao => ({
      ...dao,
      yeeterData: yeeterDataMap.get(dao.id) || null
    }))

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

export async function getDaoById(id: string, chainId: string = CHAIN_ID.BASE): Promise<HydratedDaoItem | null> {
  try {
    // Check if this is a special DAO and use its chainId
    const specialDao = SPECIAL_DAOS.GNOSIS.find(dao => dao.id === id)
    if (specialDao) {
      chainId = specialDao.chainId
    }

    const [daoClient, yeeterClient] = [
      getGraphClient({
        chainId,
        graphKey: process.env.GRAPH_API_KEY!,
        subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
      }), 
      getGraphClient({
        chainId,
        graphKey: process.env.GRAPH_API_KEY!,
        subgraphKey: GRAPH.SUBGRAPH_KEYS.YEETER
      })
    ]
    
    const daoData = await daoClient.request<{ dao: DaoItem }>(
      queries.getDaoById,
      { id }
    );

    if (!daoData.dao) return null

    // Add chainId to the response
    const daoWithChain = {
      ...daoData.dao,
      chainId
    }

    // Query yeeter by dao ID instead of shaman address
    const yeeterData = await yeeterClient.request<{ yeeters: YeeterData[] }>(
      GET_YEETER,
      { daoId: id }
    );


    const hydratedDao = hydrateDaoData({
      ...daoWithChain,
      yeeterData: yeeterData.yeeters?.[0] || null
    })
    
    return hydratedDao
  } catch (error) {
    console.error("[DAO] Error fetching DAO:", error)
    return null
  }
} 