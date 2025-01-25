import { z } from 'zod'

/**
 * Schema for DAO summoning parameters
 */
export const DaoSummonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  tokenConfig: z.object({
    name: z.string().min(1, 'Token name is required'),
    symbol: z.string().min(1, 'Token symbol is required'),
  }),
  votingPeriod: z.number().int().positive(),
  gracePeriod: z.number().int().positive(),
  proposalOffering: z.string(),
  quorum: z.string(),
  sponsorThreshold: z.string(),
  minRetention: z.string(),
  startTime: z.number().int(),
  endTime: z.number().int(),
  price: z.string(),
  multiplier: z.string(),
  minThresholdGoal: z.string(),
  feeRecipients: z.array(z.string()),
  feeAmounts: z.array(z.string()),
  boostRewardFee: z.string(),
  poolFee: z.string(),
  imageUrl: z.string().url(),
  memberAddress: z.string(),
})

/**
 * Schema for summoner function parameters
 */
export const SummonerFunctionSchema = z.object({
  functionName: z.enum(['summonBaalFromReferrer']),
  args: z.tuple([
    z.array(z.string()), // addresses
    z.array(z.string()), // params
  ]),
})

/**
 * Type definitions from schemas
 */
export type DaoSummonParams = z.infer<typeof DaoSummonSchema>
export type SummonerFunction = z.infer<typeof SummonerFunctionSchema>

/**
 * Interface for summoner functions
 */
export interface ISummonerFunctions {
  createDao: (params: DaoSummonParams) => Promise<{
    success: boolean
    txHash?: string
    error?: string
  }>
}

export interface DaoSummonResult {
  success: boolean;
  error?: string;
  txHash?: string;
} 