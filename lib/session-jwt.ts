import { SignJWT, jwtVerify } from 'jose'
import logger from './logger'

// Session configuration
const SESSION_DURATION_HOURS = 4

// Convert secret to Uint8Array for jose - CRITICAL: No fallbacks allowed
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.length < 32) {
    logger.error('JWT_SECRET not configured or too short (minimum 32 characters required)')
    throw new Error('CRITICAL: JWT_SECRET must be set in environment variables with at least 32 characters')
  }

  return new TextEncoder().encode(secret)
}

interface SessionPayload {
  username: string
  createdAt: number
  expiresAt: number
}

/**
 * Create a new JWT session token
 * @param username The username for the session
 * @returns A signed JWT token
 */
export async function createSession(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000) // JWT uses seconds, not milliseconds
  const expiresAt = now + (SESSION_DURATION_HOURS * 60 * 60)

  try {
    const token = await new SignJWT({
      username,
      createdAt: now,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(expiresAt)
      .setSubject(username)
      .sign(getSecretKey())

    logger.info(`Created new JWT session for ${username}, expires at ${new Date(expiresAt * 1000).toISOString()}`)
    return token
  } catch (error) {
    logger.error('Failed to create JWT session:', error)
    throw new Error('Failed to create session')
  }
}

/**
 * Validate a JWT session token
 * @param token The JWT token to validate
 * @returns true if the token is valid and not expired, false otherwise
 */
export async function validateSession(token: string): Promise<boolean> {
  if (!token) {
    return false
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    })

    // JWT library automatically checks expiration
    // Additional check to ensure username exists
    if (!payload.sub) {
      logger.warn('JWT token missing subject (username)')
      return false
    }

    return true
  } catch (error) {
    // Token is invalid or expired
    if (error instanceof Error) {
      // Don't log every validation failure to avoid log spam
      if (error.message.includes('expired')) {
        logger.debug('JWT token expired')
      } else {
        logger.debug('JWT validation failed:', error.message)
      }
    }
    return false
  }
}

/**
 * Get session data from a JWT token
 * @param token The JWT token
 * @returns The session payload or null if invalid
 */
export async function getSessionData(token: string): Promise<SessionPayload | null> {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    })

    return {
      username: payload.sub || 'unknown',
      createdAt: payload.iat || 0,
      expiresAt: payload.exp || 0,
    }
  } catch (error) {
    return null
  }
}

/**
 * Delete a session (for logout) - JWT tokens are stateless, so this is a no-op
 * The client should delete the cookie containing the token
 * @param token The session token (not used in JWT implementation)
 */
export async function deleteSession(token: string): Promise<void> {
  // JWT tokens are stateless - they're deleted by removing the cookie client-side
  // No server-side cleanup needed
  logger.info('Session logout requested (JWT token will be removed client-side)')
}

/**
 * Generate a secure random secret for JWT signing (for initial setup)
 * Run this once and store in .env as JWT_SECRET
 */
export function generateJWTSecret(): string {
  const array = new Uint8Array(64) // 512 bits
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}
