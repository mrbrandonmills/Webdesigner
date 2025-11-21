/**
 * Instagram Auto Token Refresh
 * Automatically refreshes Instagram tokens before they expire
 * No more manual bullshit
 */

export class InstagramTokenManager {
  private static TOKEN_FILE = './data/instagram-token.json'

  /**
   * Get valid token - auto-refreshes if needed
   */
  static async getValidToken(): Promise<string> {
    const tokenData = await this.loadTokenData()

    // Check if token is still valid (>7 days remaining)
    const now = Date.now()
    const expiresAt = tokenData.expiresAt || 0
    const daysRemaining = (expiresAt - now) / (1000 * 60 * 60 * 24)

    if (daysRemaining > 7) {
      console.log(`✓ Instagram token valid for ${Math.floor(daysRemaining)} more days`)
      return tokenData.token
    }

    // Token expired or expiring soon - refresh it
    console.log('🔄 Instagram token expiring soon, auto-refreshing...')
    const newToken = await this.refreshToken(tokenData.token)

    // Save new token
    await this.saveTokenData({
      token: newToken,
      refreshedAt: now,
      expiresAt: now + (60 * 24 * 60 * 60 * 1000) // 60 days
    })

    console.log('✓ Instagram token refreshed automatically')
    return newToken
  }

  /**
   * Refresh token using Meta's long-lived token exchange
   */
  private static async refreshToken(currentToken: string): Promise<string> {
    const appId = process.env.META_APP_ID!
    const appSecret = process.env.META_APP_SECRET!

    if (!appId || !appSecret) {
      throw new Error('META_APP_ID and META_APP_SECRET required for auto-refresh')
    }

    // Exchange short-lived token for long-lived token
    const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`

    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()

      // If refresh fails, try getting page token directly
      return await this.getPageToken()
    }

    const data = await response.json()
    return data.access_token
  }

  /**
   * Get page token directly (fallback method)
   */
  private static async getPageToken(): Promise<string> {
    console.log('🔄 Trying direct page token method...')

    const pageId = process.env.FACEBOOK_PAGE_ID!
    const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN!

    const url = `https://graph.facebook.com/v18.0/${pageId}?fields=access_token&access_token=${currentToken}`

    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get page token: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.access_token
  }

  /**
   * Load token data from file
   */
  private static async loadTokenData(): Promise<{ token: string; refreshedAt: number; expiresAt: number }> {
    try {
      const fs = await import('fs/promises')
      const data = await fs.readFile(this.TOKEN_FILE, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // File doesn't exist, use env token
      return {
        token: process.env.INSTAGRAM_ACCESS_TOKEN!,
        refreshedAt: 0,
        expiresAt: 0
      }
    }
  }

  /**
   * Save token data to file
   */
  private static async saveTokenData(data: { token: string; refreshedAt: number; expiresAt: number }): Promise<void> {
    const fs = await import('fs/promises')
    await fs.mkdir('./data', { recursive: true })
    await fs.writeFile(this.TOKEN_FILE, JSON.stringify(data, null, 2))

    // Also update env for current process
    process.env.INSTAGRAM_ACCESS_TOKEN = data.token
  }

  /**
   * Health check - returns days until expiration
   */
  static async checkHealth(): Promise<{ valid: boolean; daysRemaining: number; message: string }> {
    try {
      const tokenData = await this.loadTokenData()
      const now = Date.now()
      const daysRemaining = Math.floor((tokenData.expiresAt - now) / (1000 * 60 * 60 * 24))

      if (daysRemaining < 0) {
        return {
          valid: false,
          daysRemaining: 0,
          message: 'Token expired - will auto-refresh on next use'
        }
      }

      if (daysRemaining < 7) {
        return {
          valid: true,
          daysRemaining,
          message: `Token expiring in ${daysRemaining} days - will auto-refresh soon`
        }
      }

      return {
        valid: true,
        daysRemaining,
        message: `Token valid for ${daysRemaining} more days`
      }
    } catch (error) {
      return {
        valid: false,
        daysRemaining: 0,
        message: 'Token data not found - will initialize on first use'
      }
    }
  }
}
