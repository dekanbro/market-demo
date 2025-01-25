import { gql } from 'graphql-request'
import { getGraphClient } from './graphql'
import { CHAIN_ID, GRAPH } from './constants'
import { SPECIAL_DAOS } from './constants'

const memberFields = gql`
  fragment MemberFields on Member {
    id
    createdAt
    memberAddress
    shares
    loot
    delegateShares
    delegatingTo
    delegateOfCount
    votes {
      txHash
      createdAt
      approved
      balance
    }
  }
`

const GET_MEMBERS = gql`
  query members($daoId: String!) {
    members(
      where: { dao: $daoId }
      orderBy: shares
      orderDirection: desc
    ) {
      ...MemberFields
    }
  }
  ${memberFields}
`

export async function getMembersByDaoId(daoId: string, chainId: string = CHAIN_ID.BASE) {
  const apiKey = process.env.GRAPH_API_KEY
  if (!apiKey) {
    throw new Error('Graph API key is not configured')
  }

  // Check if this is a special DAO and use its chainId
  const specialDao = SPECIAL_DAOS.GNOSIS.find(dao => dao.id === daoId)
  if (specialDao) {
    chainId = specialDao.chainId
  }

  try {
    const client = getGraphClient({
      chainId,
      graphKey: apiKey,
      subgraphKey: GRAPH.SUBGRAPH_KEYS.DAOHAUS
    })
    
    const data = await client.request<{ members: any[] }>(
      GET_MEMBERS,
      { daoId }
    )
    
    return data.members
  } catch (error) {
    console.error('Error fetching members:', error)
    return []
  }
} 