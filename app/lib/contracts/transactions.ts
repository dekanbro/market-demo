import { type Address } from 'viem'
import { encodeFunction, isNumberish } from './helpers'
import { DaoParams, EncodedParams } from './types'
import { DEFAULT_DAO_PARAMS } from './constants'

/**
 * Encodes a governance configuration transaction
 * @param params - Partial DAO governance parameters
 * @returns Encoded transaction data
 * @throws {Error} If any numeric parameter is invalid
 */
export function governanceConfigTx(
  params: Partial<DaoParams> = {}
): EncodedParams {
  const {
    votingPeriod = DEFAULT_DAO_PARAMS.VOTING_PERIOD,
    gracePeriod = DEFAULT_DAO_PARAMS.GRACE_PERIOD,
    proposalOffering = DEFAULT_DAO_PARAMS.PROPOSAL_OFFERING,
    quorum = DEFAULT_DAO_PARAMS.QUORUM,
    sponsorThreshold = DEFAULT_DAO_PARAMS.SPONSOR_THRESHOLD,
    minRetention = DEFAULT_DAO_PARAMS.MIN_RETENTION,
    votingTransferDelay = DEFAULT_DAO_PARAMS.VOTING_TRANSFER_DELAY
  } = params

  // Validate numeric parameters
  if (!isNumberish(votingPeriod)) throw new Error('Invalid voting period')
  if (!isNumberish(gracePeriod)) throw new Error('Invalid grace period')
  if (!isNumberish(votingTransferDelay)) throw new Error('Invalid voting transfer delay')

  return encodeFunction(
    'setGovernanceConfig',
    [
      'uint32',  // voting period
      'uint32',  // grace period
      'uint256', // proposal offering
      'uint256', // quorum
      'uint256', // sponsor threshold
      'uint256', // min retention
      'uint32'   // voting transfer delay
    ],
    [
      votingPeriod,
      gracePeriod,
      proposalOffering,
      quorum,
      sponsorThreshold,
      minRetention,
      votingTransferDelay
    ]
  )
}

/**
 * Encodes a token configuration transaction
 * @param tokenParams - Encoded token parameters
 * @returns Encoded transaction data
 * @throws {Error} If tokenParams is empty or invalid
 */
export function tokenConfigTx(
  tokenParams: string
): EncodedParams {
  if (!tokenParams || !tokenParams.startsWith('0x')) {
    throw new Error('Invalid token parameters: must be a valid hex string')
  }

  return encodeFunction(
    'setTokenConfig',
    ['bytes'],
    [tokenParams]
  )
}

/**
 * Encodes a metadata configuration transaction
 * @param name - DAO name
 * @param description - DAO description
 * @returns Encoded transaction data
 * @throws {Error} If name or description is empty
 */
export function metadataConfigTx(
  name: string,
  description: string
): EncodedParams {
  if (!name.trim()) throw new Error('Name cannot be empty')
  if (!description.trim()) throw new Error('Description cannot be empty')

  return encodeFunction(
    'setMetadata',
    ['string', 'string'],
    [name, description]
  )
}

/**
 * Encodes a shaman module configuration transaction
 * @param shamanAddress - Address of the shaman module
 * @param permissions - Permission bitmask as string
 * @returns Encoded transaction data
 * @throws {Error} If address or permissions are invalid
 */
export function shamanModuleConfigTx(
  shamanAddress: Address,
  permissions: string
): EncodedParams {
  if (!shamanAddress || shamanAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Invalid shaman address')
  }
  if (!isNumberish(permissions)) {
    throw new Error('Invalid permissions value')
  }

  return encodeFunction(
    'setShamans',
    ['address[]', 'uint256[]'],
    [[shamanAddress], [BigInt(permissions)]]
  )
}

/**
 * Encodes a token distribution transaction
 * @param recipients - Array of recipient addresses
 * @param amounts - Array of token amounts
 * @returns Encoded transaction data
 * @throws {Error} If arrays are empty or mismatched
 */
export function tokenDistroTx(
  recipients: Address[],
  amounts: string[]
): EncodedParams {
  if (!recipients.length || !amounts.length) {
    throw new Error('Recipients and amounts arrays cannot be empty')
  }
  if (recipients.length !== amounts.length) {
    throw new Error('Recipients and amounts arrays must be the same length')
  }
  if (recipients.some(addr => addr === '0x0000000000000000000000000000000000000000')) {
    throw new Error('Invalid recipient address')
  }
  if (amounts.some(amount => !isNumberish(amount))) {
    throw new Error('Invalid amount value')
  }

  return encodeFunction(
    'mintShares',
    ['address[]', 'uint256[]'],
    [recipients, amounts.map(amount => BigInt(amount))]
  )
} 