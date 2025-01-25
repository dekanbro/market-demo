import { base } from 'viem/chains'
import { CONTRACT_ADDRESSES } from '../wagmi'
import { BasicHOSSummonerAbi } from './abis/basic-hos-summoner'
import { agentAccountManager, checkAgentBalance } from './agent-account'
import { assembleMemeYeeterSummonerArgs } from './summoning'
import { 
  type DaoSummonParams, 
  type ISummonerFunctions,
  type DaoSummonResult 
} from './schemas'
import { validateEnvConfig } from './config'

export class DaoSummoner implements ISummonerFunctions {
  /**
   * Creates a new DAO with the given parameters
   * @param params - DAO creation parameters
   * @returns Transaction result
   */
  async createDao(params: DaoSummonParams): Promise<DaoSummonResult> {
    console.log("member address from createDao", params.memberAddress);
    try {
      // Check balance first
      await checkAgentBalance()

      // Validate environment configuration
      validateEnvConfig()

      // Initialize agent account
      await agentAccountManager.initialize()

      // Convert params to expected format
      const daoParams = {
        votingPeriod: params.votingPeriod,
        gracePeriod: params.gracePeriod,
        proposalOffering: params.proposalOffering,
        quorum: params.quorum,
        sponsorThreshold: params.sponsorThreshold,
        minRetention: params.minRetention,
        tokenConfig: {
          name: params.tokenConfig.name,
          symbol: params.tokenConfig.symbol,
        },
        memberAddress: params.memberAddress,
      }

      const yeeterConfig = {
        startTime: params.startTime,
        endTime: params.endTime,
        tokenConfig: {
          name: params.tokenConfig.name,
          symbol: params.tokenConfig.symbol,
        },
        price: params.price || "0",
        multiplier: params.multiplier,
        minThresholdGoal: params.minThresholdGoal,
        feeRecipients: params.feeRecipients,
        feeAmounts: params.feeAmounts,
        boostRewardFee: params.boostRewardFee,
        memberAddress: params.memberAddress,
        imageUrl: params.imageUrl,
        description: params.description,
        daoName: params.name,
      }

      // Assemble summoning arguments
      const [
        lootTokenParams,
        sharesTokenParams,
        shamanParams,
        initActions,
        saltNonce,
      ] = await assembleMemeYeeterSummonerArgs(
        daoParams,
        yeeterConfig
      )

      console.log("loot token params", lootTokenParams);
      console.log("shares token params", sharesTokenParams);
      console.log("shaman params", shamanParams);
      console.log("init actions", initActions);
      console.log("salt nonce", saltNonce);

      // Send transaction
      const receipt = await agentAccountManager.sendAndMonitorTransaction({
        address: CONTRACT_ADDRESSES[base.id].YEET24_SUMMONER,
        abi: BasicHOSSummonerAbi,
        functionName: 'summonBaalFromReferrer',
        args: [
          lootTokenParams,
          sharesTokenParams,
          shamanParams,
          initActions,
          saltNonce,
        ],
        account: agentAccountManager.getAccount(),
        chain: base
      })

      return {
        success: receipt.status === 'success',
        txHash: receipt.transactionHash,
      }
    } catch (error) {
      console.error('Error creating DAO:', error)
      if (error instanceof Error && error.message.includes('Agent needs gas')) {
        return {
          success: false,
          error: error.message
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Rename the instance
export const daoSummoner = new DaoSummoner() 