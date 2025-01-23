/**
 * Environment variable configuration for agent accounts
 */
export const AGENT_CONFIG = {
  // Required environment variables
  requiredEnvVars: [
    'AGENT_PRIVATE_KEY',
    'NEXT_PUBLIC_RPC_URL'
  ],

  // Validation rules
  validation: {
    AGENT_PRIVATE_KEY: (value: string) => {
      return value.startsWith('0x') && value.length === 66
    },
    NEXT_PUBLIC_RPC_URL: (value: string) => {
      return value.startsWith('http') || value.startsWith('ws')
    }
  }
} as const

/**
 * Validates all required environment variables
 * @throws {Error} If any required variables are missing or invalid
 */
export function validateEnvConfig(): void {
  for (const envVar of AGENT_CONFIG.requiredEnvVars) {
    const value = process.env[envVar]
    if (!value) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }

    const validator = AGENT_CONFIG.validation[envVar as keyof typeof AGENT_CONFIG.validation]
    if (validator && !validator(value)) {
      throw new Error(`Invalid value for environment variable: ${envVar}`)
    }
  }
} 