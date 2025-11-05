/**
 * In-Memory Rate Limiter
 *
 * Provides simple brute force protection by tracking request attempts by IP address.
 * Suitable for small to medium traffic. For production at scale, consider Redis.
 */

interface RateLimitEntry {
  count: number
  firstAttempt: number
  resetAt: number
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.attempts = new Map()
    // Clean up expired entries every 5 minutes
    this.startCleanup()
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (typically IP address)
   * @param maxAttempts - Maximum attempts allowed in window
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limit exceeded, false otherwise
   */
  isRateLimited(
    identifier: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutes default
  ): boolean {
    const now = Date.now()
    const entry = this.attempts.get(identifier)

    // No previous attempts or window expired
    if (!entry || now > entry.resetAt) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        resetAt: now + windowMs,
      })
      return false
    }

    // Increment attempt count
    entry.count++
    this.attempts.set(identifier, entry)

    // Check if limit exceeded
    return entry.count > maxAttempts
  }

  /**
   * Get remaining attempts for an identifier
   */
  getRemainingAttempts(
    identifier: string,
    maxAttempts: number = 5
  ): number {
    const entry = this.attempts.get(identifier)
    if (!entry || Date.now() > entry.resetAt) {
      return maxAttempts
    }
    return Math.max(0, maxAttempts - entry.count)
  }

  /**
   * Get time until reset in seconds
   */
  getTimeUntilReset(identifier: string): number {
    const entry = this.attempts.get(identifier)
    if (!entry) return 0

    const now = Date.now()
    if (now > entry.resetAt) return 0

    return Math.ceil((entry.resetAt - now) / 1000)
  }

  /**
   * Reset attempts for an identifier (useful after successful auth)
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [identifier, entry] of this.attempts.entries()) {
      if (now > entry.resetAt) {
        this.attempts.delete(identifier)
      }
    }
  }

  /**
   * Start periodic cleanup
   */
  private startCleanup(): void {
    if (this.cleanupInterval) return

    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Stop cleanup (useful for testing)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * Get current stats (useful for monitoring)
   */
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

// Singleton instance
const rateLimiter = new RateLimiter()

export default rateLimiter

/**
 * Helper function to extract client IP from Next.js request
 */
export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const headers = request.headers as Headers

  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
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

  // Fallback to a default (not ideal but prevents crashes)
  return 'unknown'
}
