import { 
  isAddress, 
  keccak256, 
  encodePacked,
  toHex,
  encodeAbiParameters, 
  parseAbiParameters,
  type Address,
  parseEther,
  formatEther
} from 'viem'
import type { ValidationResult, EncodedParams } from './types'

/**
 * Generates a unique salt nonce using current timestamp and random number
 * @returns BigInt to be used as salt nonce
 */
export function getSaltNonce(): bigint {
  const timestamp = BigInt(Math.floor(Date.now() / 1000)); // Unix timestamp in seconds
  const random = BigInt(Math.floor(Math.random() * 1000000));
  
  // Combine timestamp and random number into a single BigInt
  const combined = (timestamp << 20n) + random; // Shift timestamp left by 20 bits and add random
  
  return combined;
}

/**
 * Validates an Ethereum address
 * @param address - Address to validate
 * @returns Validation result with isValid flag and optional errors
 */
export function isEthAddress(address: string): ValidationResult {
  if (!address) {
    return {
      isValid: false,
      errors: ['Address cannot be empty']
    }
  }

  if (!address.startsWith('0x')) {
    return {
      isValid: false,
      errors: ['Address must start with 0x']
    }
  }

  return {
    isValid: isAddress(address),
    errors: !isAddress(address) ? ['Invalid Ethereum address format'] : undefined
  }
}

/**
 * Encodes ABI parameters with their values
 * @param types - Array of parameter types
 * @param values - Array of parameter values
 * @returns Encoded parameters with decoded representation
 * @throws {Error} If encoding fails or arrays don't match
 */
export function encodeValues(types: string[], values: any[]): EncodedParams {
  if (types.length !== values.length) {
    throw new Error('Types and values arrays must be the same length')
  }

  if (!types.length || !values.length) {
    throw new Error('Types and values arrays cannot be empty')
  }

  try {
    const encoded = encodeAbiParameters(
      parseAbiParameters(types.join(',')),
      values
    )

    return {
      encoded,
    }
  } catch (error) {
    console.error('Error encoding values:', error)
    throw new Error(`Failed to encode values: ${error instanceof Error ? error.message : 'unknown error'}`)
  }
}

/**
 * Checks if a value can be converted to a number
 * @param value - Value to check
 * @returns True if value is numeric
 */
export function isNumberish(value: any): boolean {
  if (typeof value === 'number') return !isNaN(value)
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return !isNaN(parsed) && isFinite(parsed)
  }
  if (typeof value === 'bigint') return true
  return false
}

/**
 * Checks if a value is a string
 * @param value - Value to check
 * @returns True if value is a string
 */
export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String
}

/**
 * Converts a float price in ETH to wei (fixed point 18 decimals)
 * @param price - Price in ETH (e.g., 0.0001)
 * @returns Price in wei as bigint
 * @throws {Error} If price is invalid
 */
export function validateAndConvertPrice(price: number | string): bigint {
  try {
    // Convert to string to handle both number and string inputs
    const priceStr = price.toString()
    
    // Validate price format
    if (!/^\d*\.?\d+$/.test(priceStr)) {
      throw new Error('Invalid price format')
    }

    // Convert to wei
    const priceInWei = parseEther(priceStr)

    // Validate reasonable range (between 0.000000001 ETH and 1000 ETH)
    const minPrice = parseEther('0.000000001')
    const maxPrice = parseEther('1000')
    
    if (priceInWei <= 0n) {
      throw new Error('Price must be greater than 0')
    }
    if (priceInWei < minPrice) {
      throw new Error('Price is too low')
    }
    if (priceInWei > maxPrice) {
      throw new Error('Price is too high')
    }

    return priceInWei
  } catch (error) {
    throw new Error(`Invalid price: ${error instanceof Error ? error.message : 'unknown error'}`)
  }
} 