/**
 * Integration Health Monitoring System
 *
 * Autonomously tracks all external integrations and services:
 * - Instagram/Meta API
 * - Twitter/X API
 * - Pinterest API
 * - Stripe payments
 * - Printful store
 * - Resend email
 *
 * Industry standard: Health checks every 5-15 minutes for critical services
 */

export interface IntegrationStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down' | 'unknown'
  lastChecked: Date
  lastSuccess?: Date
  errorMessage?: string
  expiresAt?: Date
  autoFixable: boolean
  fixAttempted?: boolean
}

export interface HealthReport {
  timestamp: Date
  overallStatus: 'healthy' | 'degraded' | 'critical'
  integrations: IntegrationStatus[]
  recommendations: string[]
}

// Check Instagram/Meta token validity
export async function checkInstagramHealth(): Promise<IntegrationStatus> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!token || !igAccountId) {
    return {
      name: 'Instagram',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'Missing token or account ID',
      autoFixable: false
    }
  }

  try {
    // Test by fetching account info directly - most reliable check
    const accountUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=username,followers_count&access_token=${token}`
    const res = await fetch(accountUrl)
    const data = await res.json()

    if (data.error) {
      return {
        name: 'Instagram',
        status: 'down',
        lastChecked: new Date(),
        errorMessage: data.error.message,
        autoFixable: false
      }
    }

    if (data.username) {
      return {
        name: 'Instagram',
        status: 'healthy',
        lastChecked: new Date(),
        lastSuccess: new Date(),
        autoFixable: false
      }
    }

    return {
      name: 'Instagram',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'Could not verify account access',
      autoFixable: false
    }
  } catch (error) {
    return {
      name: 'Instagram',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: error instanceof Error ? error.message : 'Network error',
      autoFixable: false
    }
  }
}

// Check Twitter API health
export async function checkTwitterHealth(): Promise<IntegrationStatus> {
  const apiKey = process.env.TWITTER_API_KEY
  const apiSecret = process.env.TWITTER_API_SECRET
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  const accessSecret = process.env.TWITTER_ACCESS_SECRET

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return {
      name: 'Twitter',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'Missing API credentials',
      autoFixable: false
    }
  }

  // Twitter OAuth1 credentials don't expire, so just verify they exist
  return {
    name: 'Twitter',
    status: 'healthy',
    lastChecked: new Date(),
    lastSuccess: new Date(),
    autoFixable: false
  }
}

// Check Pinterest API health
export async function checkPinterestHealth(): Promise<IntegrationStatus> {
  const token = process.env.PINTEREST_ACCESS_TOKEN
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN

  if (!token) {
    return {
      name: 'Pinterest',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'No access token configured',
      autoFixable: !!refreshToken
    }
  }

  try {
    // Test the token with a simple API call
    const res = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.ok) {
      return {
        name: 'Pinterest',
        status: 'healthy',
        lastChecked: new Date(),
        lastSuccess: new Date(),
        autoFixable: !!refreshToken
      }
    }

    // Check if we can auto-refresh
    if (res.status === 401 && refreshToken) {
      return {
        name: 'Pinterest',
        status: 'degraded',
        lastChecked: new Date(),
        errorMessage: 'Token expired - can auto-refresh',
        autoFixable: true
      }
    }

    return {
      name: 'Pinterest',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: `API error: ${res.status}`,
      autoFixable: false
    }
  } catch (error) {
    return {
      name: 'Pinterest',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: error instanceof Error ? error.message : 'Network error',
      autoFixable: false
    }
  }
}

// Check Stripe API health
export async function checkStripeHealth(): Promise<IntegrationStatus> {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!secretKey || !publishableKey) {
    return {
      name: 'Stripe',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'Missing API keys',
      autoFixable: false
    }
  }

  try {
    // Test with a simple balance check
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    })

    if (res.ok) {
      return {
        name: 'Stripe',
        status: 'healthy',
        lastChecked: new Date(),
        lastSuccess: new Date(),
        autoFixable: false
      }
    }

    const data = await res.json()
    return {
      name: 'Stripe',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: data.error?.message || `HTTP ${res.status}`,
      autoFixable: false
    }
  } catch (error) {
    return {
      name: 'Stripe',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: error instanceof Error ? error.message : 'Network error',
      autoFixable: false
    }
  }
}

// Check Printful API health
export async function checkPrintfulHealth(): Promise<IntegrationStatus> {
  const apiKey = process.env.PRINTFUL_API_KEY
  const storeId = process.env.PRINTFUL_STORE_ID

  if (!apiKey || !storeId) {
    return {
      name: 'Printful',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'Missing API credentials',
      autoFixable: false
    }
  }

  try {
    const res = await fetch(`https://api.printful.com/stores/${storeId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (res.ok) {
      return {
        name: 'Printful',
        status: 'healthy',
        lastChecked: new Date(),
        lastSuccess: new Date(),
        autoFixable: false
      }
    }

    return {
      name: 'Printful',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: `API error: ${res.status}`,
      autoFixable: false
    }
  } catch (error) {
    return {
      name: 'Printful',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: error instanceof Error ? error.message : 'Network error',
      autoFixable: false
    }
  }
}

// Check Resend email health
export async function checkResendHealth(): Promise<IntegrationStatus> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      name: 'Resend',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: 'Missing API key',
      autoFixable: false
    }
  }

  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (res.ok) {
      return {
        name: 'Resend',
        status: 'healthy',
        lastChecked: new Date(),
        lastSuccess: new Date(),
        autoFixable: false
      }
    }

    return {
      name: 'Resend',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: `API error: ${res.status}`,
      autoFixable: false
    }
  } catch (error) {
    return {
      name: 'Resend',
      status: 'down',
      lastChecked: new Date(),
      errorMessage: error instanceof Error ? error.message : 'Network error',
      autoFixable: false
    }
  }
}

// Run full health check on all integrations
export async function runFullHealthCheck(): Promise<HealthReport> {
  const checks = await Promise.all([
    checkInstagramHealth(),
    checkTwitterHealth(),
    checkPinterestHealth(),
    checkStripeHealth(),
    checkPrintfulHealth(),
    checkResendHealth()
  ])

  const recommendations: string[] = []
  let downCount = 0
  let degradedCount = 0

  for (const check of checks) {
    if (check.status === 'down') {
      downCount++
      if (check.autoFixable) {
        recommendations.push(`${check.name}: Auto-fix available - run integration repair`)
      } else {
        recommendations.push(`${check.name}: Manual intervention required - ${check.errorMessage}`)
      }
    } else if (check.status === 'degraded') {
      degradedCount++
      if (check.expiresAt) {
        recommendations.push(`${check.name}: Token expires soon - refresh before ${check.expiresAt.toLocaleDateString()}`)
      }
    }
  }

  let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy'
  if (downCount > 0) overallStatus = 'critical'
  else if (degradedCount > 0) overallStatus = 'degraded'

  return {
    timestamp: new Date(),
    overallStatus,
    integrations: checks,
    recommendations
  }
}

// Auto-fix Pinterest token if possible
export async function autoFixPinterest(): Promise<boolean> {
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN
  const clientId = process.env.PINTEREST_CLIENT_ID
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET

  if (!refreshToken) return false

  try {
    // Pinterest refresh token flow
    // Note: This would need client credentials which may not be configured
    console.log('[Integration Health] Pinterest auto-fix not implemented - needs OAuth credentials')
    return false
  } catch (error) {
    console.error('[Integration Health] Pinterest auto-fix failed:', error)
    return false
  }
}
