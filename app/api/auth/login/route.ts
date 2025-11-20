import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { login } from '@/lib/auth'
import rateLimiter, { getClientIP } from '@/lib/rate-limiter'
import logger from '@/lib/logger'
import { LoginSchema, formatZodErrors } from '@/lib/validations'

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)

  try {
    // Rate limiting: 5 attempts per 15 minutes
    if (rateLimiter.isRateLimited(clientIP, 5, 15 * 60 * 1000)) {
      const timeUntilReset = rateLimiter.getTimeUntilReset(clientIP)
      const minutes = Math.ceil(timeUntilReset / 60)

      logger.warn(`Rate limit exceeded for IP: ${clientIP}`)

      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: timeUntilReset,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(timeUntilReset),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + timeUntilReset),
          },
        }
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = LoginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { username, password } = validationResult.data

    const success = await login(username, password)

    if (success) {
      // Reset rate limit on successful login
      rateLimiter.reset(clientIP)
      logger.success(`Successful login from IP: ${clientIP}`)

      const remaining = rateLimiter.getRemainingAttempts(clientIP, 5)
      return NextResponse.json(
        { success: true },
        {
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      )
    } else {
      // Failed login - rate limiter already incremented
      const remaining = rateLimiter.getRemainingAttempts(clientIP, 5)
      logger.warn(`Failed login attempt from IP: ${clientIP}, remaining attempts: ${remaining}`)

      return NextResponse.json(
        { error: 'Invalid credentials' },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      )
    }
  } catch (error) {
    // Log detailed error server-side only
    logger.error('Login endpoint error', error)

    // Return sanitized error to client
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
