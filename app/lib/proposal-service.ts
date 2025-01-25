import { gql } from 'graphql-request'
import { getGraphClient } from './graphql'
import { CHAIN_ID, GRAPH } from './constants'
import { SPECIAL_DAOS } from './constants'

const proposalFields = gql`
  fragment ProposalFields on Proposal {
    id
    createdAt
    proposalId
    title
    description
    proposalType
    sponsored
    sponsorTxAt
    votingPeriod
    votingStarts
    votingEnds
    gracePeriod
    graceEnds
    expiration
    cancelled
    yesBalance
    noBalance
    yesVotes
    noVotes
    processed
    passed
    dao {
      totalShares
      quorumPercent
      minRetentionPercent
    }
    votes {
      id
      approved
      balance
      member {
        memberAddress
      }
    }
  }
`

const GET_PROPOSALS = gql`
  query proposals($daoId: String!) {
    proposals(
      where: { dao: $daoId }
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...ProposalFields
    }
  }
  ${proposalFields}
`

export async function getProposalsByDaoId(daoId: string, chainId: string = CHAIN_ID.BASE) {
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
    
    const data = await client.request<{ proposals: any[] }>(
      GET_PROPOSALS,
      { daoId }
    )
    
    return data.proposals
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return []
  }
} 