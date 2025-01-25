import { 
  createWalletClient, 
  createPublicClient,
  http, 
  type WalletClient, 
  type PublicClient,
  type Account,
  type Hash,
  type TransactionReceipt 
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { formatEther, parseEther } from 'viem'

/**
 * Creates and manages an agent's Ethereum account
 * Uses environment variables for secure key storage
 */
export class AgentAccountManager {
  private walletClient: WalletClient
  private publicClient: PublicClient
  private account: Account | null = null

  constructor() {
    this.publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL)
    }) as PublicClient

    this.walletClient = createWalletClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
      account: undefined
    }) as WalletClient
  }

  /**
   * Initializes the agent account from environment variables
   * @throws {Error} If private key is not properly configured
   */
  async initialize(): Promise<void> {
    const privateKey = process.env.AGENT_PRIVATE_KEY
    if (!privateKey) {
      throw new Error('Agent private key not configured')
    }

    try {
      this.account = privateKeyToAccount(privateKey as `0x${string}`)
      
      // Update wallet client with account
      this.walletClient = createWalletClient({
        chain: base,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL),
        account: this.account
      })

      const balance = await this.publicClient.getBalance({
        address: this.account.address
      })
      
      if (balance === BigInt(0)) {
        console.warn('Warning: Agent account has zero balance')
      }
    } catch (error) {
      console.error('Failed to initialize agent account:', error)
      throw new Error('Failed to initialize agent account')
    }
  }

  /**
   * Gets the current agent account
   * @returns The agent's account
   * @throws {Error} If account is not initialized
   */
  getAccount(): Account {
    if (!this.account) {
      throw new Error('Agent account not initialized')
    }
    return this.account
  }

  /**
   * Gets the wallet client configured with the agent account
   * @returns Configured wallet client
   * @throws {Error} If account is not initialized
   */
  getClient(): WalletClient {
    if (!this.account) {
      throw new Error('Agent account not initialized')
    }
    return this.walletClient
  }

  getPublicClient(): PublicClient {
    return this.publicClient
  }

  /**
   * Monitors a transaction until it's mined
   * @param hash - Transaction hash to monitor
   * @param confirmations - Number of confirmations to wait for (default: 1)
   * @returns Transaction receipt
   */
  async monitorTransaction(
    hash: Hash,
    confirmations: number = 1
  ): Promise<TransactionReceipt> {
    try {
      // Wait for transaction to be mined
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
        onReplaced: (replacement) => {
          if (replacement.reason === 'replaced') {
            console.warn('Transaction was replaced:', {
              oldHash: hash,
              newHash: replacement.transaction.hash,
              reason: replacement.reason
            })
          }
        }
      })

      // Log transaction status
      if (receipt.status === 'success') {
        console.log('Transaction successful:', {
          hash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed
        })
      } else {
        console.error('Transaction failed:', receipt)
      }

      return receipt
    } catch (error) {
      console.error('Error monitoring transaction:', error)
      throw new Error(`Transaction monitoring failed: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }

  /**
   * Sends and monitors a transaction
   * @param tx - Transaction to send
   * @returns Transaction receipt
   */
  async sendAndMonitorTransaction(
    tx: Parameters<WalletClient['writeContract']>[0]
  ): Promise<TransactionReceipt> {
    try {
      const hash = await this.walletClient.writeContract(tx)
      console.log('Transaction sent:', hash)
      
      return this.monitorTransaction(hash)
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }
}

// Create singleton instance
export const agentAccountManager = new AgentAccountManager()

const MIN_GAS_BALANCE = parseEther('0.0005')

export async function checkAgentBalance() {
  const balance = await agentAccountManager.getPublicClient().getBalance({ 
    address: agentAccountManager.getAccount().address 
  })
  
  if (balance < MIN_GAS_BALANCE) {
    throw new Error(`Agent needs gas! Current balance: ${formatEther(balance)} ETH, agent address: ${agentAccountManager.getAccount().address}`)
  }
} 