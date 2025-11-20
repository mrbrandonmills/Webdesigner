/**
 * Distributed Rate Limiter with Upstash Redis
 *
 * Provides brute force protection using Upstash Redis for distributed rate limiting.
 * Falls back to in-memory storage for local development when Redis is not configured.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

interface RateLimitEntry {
  count: number
  firstAttempt: number
  resetAt: number
}

// Check if Upstash is configured
const isUpstashConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
)

// Initialize Upstash Redis client if configured
let redis: Redis | null = null
let upstashRateLimiter: Ratelimit | null = null

if (isUpstashConfigured) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  // Default rate limiter: 5 requests per 15 minutes using sliding window
  upstashRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'ratelimit',
  })
}

/**
 * In-Memory Rate Limiter (fallback for development)
 */
class InMemoryRateLimiter {
  private attempts: Map<string, RateLimitEntry>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.attempts = new Map()
    this.startCleanup()
  }

  isRateLimited(
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    const now = Date.now()
    const entry = this.attempts.get(identifier)

    if (!entry || now > entry.resetAt) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        resetAt: now + windowMs,
      })
      return false
    }

    entry.count++
    this.attempts.set(identifier, entry)
    return entry.count > maxAttempts
  }

  getRemainingAttempts(identifier: string, maxAttempts: number = 5): number {
    const entry = this.attempts.get(identifier)
    if (!entry || Date.now() > entry.resetAt) {
      return maxAttempts
    }
    return Math.max(0, maxAttempts - entry.count)
  }

  getTimeUntilReset(identifier: string): number {
    const entry = this.attempts.get(identifier)
    if (!entry) return 0

    const now = Date.now()
    if (now > entry.resetAt) return 0

    return Math.ceil((entry.resetAt - now) / 1000)
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [identifier, entry] of this.attempts.entries()) {
      if (now > entry.resetAt) {
        this.attempts.delete(identifier)
      }
    }
  }

  private startCleanup(): void {
    if (this.cleanupInterval) return
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  getStats(): { totalEntries: number; activeBlocks: number } {
    const now = Date.now()
    let activeBlocks = 0

    for (const entry of this.attempts.values()) {
      if (entry.count > 5 && now <= entry.resetAt) {
        activeBlocks++
      }
    }

    return {
      totalEntries: this.attempts.size,
      activeBlocks,
    }
  }
}

// In-memory fallback instance
const inMemoryLimiter = new InMemoryRateLimiter()

/**
 * Result from rate limit check
 */
interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for an identifier
 * Uses Upstash Redis if configured, otherwise falls back to in-memory
 */
export async function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): Promise<RateLimitResult> {
  if (isUpstashConfigured && upstashRateLimiter) {
    // Use Upstash rate limiter
    const result = await upstashRateLimiter.limit(identifier)

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  }

  // Fallback to in-memory
  const isLimited = inMemoryLimiter.isRateLimited(
    identifier,
    maxAttempts,
    windowMs
  )

  return {
    success: !isLimited,
    limit: maxAttempts,
    remaining: inMemoryLimiter.getRemainingAttempts(identifier, maxAttempts),
    reset: Date.now() + inMemoryLimiter.getTimeUntilReset(identifier) * 1000,
  }
}

/**
 * Create a custom rate limiter with specific limits
 * Only works when Upstash is configured
 */
export function createRateLimiter(
  requests: number,
  window: string
): Ratelimit | null {
  if (!isUpstashConfigured || !redis) {
    logger.warn('Upstash Redis not configured. Custom rate limiters require Redis.')
    return null
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: true,
    prefix: 'ratelimit:custom',
  })
}

/**
 * Reset rate limit for an identifier
 * Only works for in-memory limiter (Upstash handles expiration automatically)
 */
export function resetRateLimit(identifier: string): void {
  inMemoryLimiter.reset(identifier)
}

/**
 * Get rate limiter stats
 * Only available for in-memory limiter
 */
export function getRateLimiterStats(): {
  totalEntries: number
  activeBlocks: number
  backend: 'upstash' | 'memory'
} {
  const stats = inMemoryLimiter.getStats()
  return {
    ...stats,
    backend: isUpstashConfigured ? 'upstash' : 'memory',
  }
}

/**
 * Helper function to extract client IP from Next.js request
 */
export function getClientIP(request: Request): string {
  const headers = request.headers as Headers

  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return 'unknown'
}

/**
 * Legacy compatibility: Synchronous rate limiter for in-memory only
 * @deprecated Use checkRateLimit for distributed rate limiting
 */
const rateLimiter = {
  isRateLimited: (
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): boolean => {
    if (isUpstashConfigured) {
      logger.warn('Using synchronous isRateLimited with Upstash configured. Consider using async checkRateLimit instead.')
    }
    return inMemoryLimiter.isRateLimited(identifier, maxAttempts, windowMs)
  },
  getRemainingAttempts: (identifier: string, maxAttempts: number = 5): number =>
    inMemoryLimiter.getRemainingAttempts(identifier, maxAttempts),
  getTimeUntilReset: (identifier: string): number =>
    inMemoryLimiter.getTimeUntilReset(identifier),
  reset: (identifier: string): void => inMemoryLimiter.reset(identifier),
  getStats: () => inMemoryLimiter.getStats(),
  stopCleanup: () => inMemoryLimiter.stopCleanup(),
}

export default rateLimiter

/**
 * Check if Upstash is configured
 */
export function isRedisConfigured(): boolean {
  return isUpstashConfigured
}
