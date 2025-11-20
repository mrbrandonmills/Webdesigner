/**
 * Reddit Ads API Automation
 *
 * Creates and manages Reddit ad campaigns programmatically.
 * Much more reliable than organic posting - no automation detection.
 */

import * as fs from 'fs'
import * as path from 'path'
import { pathsConfig } from './config'
import { logger } from './logger'

interface RedditAdCampaign {
  name: string
  objective: 'CONVERSIONS' | 'TRAFFIC' | 'AWARENESS' | 'VIDEO_VIEWS' | 'APP_INSTALLS'
  dailyBudget: number // in cents
  startDate: string
  endDate?: string
}

interface RedditAdGroup {
  name: string
  campaignId: string
  bid: number // in cents (CPC or CPM)
  bidStrategy: 'CPC' | 'CPM'
  targeting: {
    subreddits?: string[]
    interests?: string[]
    locations?: string[]
    devices?: ('DESKTOP' | 'MOBILE' | 'TABLET')[]
  }
}

interface RedditAd {
  name: string
  adGroupId: string
  headline: string
  body: string
  destinationUrl: string
  thumbnailUrl?: string
  callToAction: 'LEARN_MORE' | 'SIGN_UP' | 'DOWNLOAD' | 'SHOP_NOW' | 'GET_QUOTE'
}

// Reddit Ads API client
class RedditAdsClient {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor(
    private clientId: string,
    private clientSecret: string,
    private refreshToken: string
  ) {}

  // Get access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&refresh_token=${this.refreshToken}`
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000

    return this.accessToken
  }

  // Make API request
  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const token = await this.getAccessToken()

    const response = await fetch(`https://ads-api.reddit.com/api/v3${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API error ${response.status}: ${error}`)
    }

    return response.json()
  }

  // Get profile (first step in v3)
  async getProfile(): Promise<any> {
    const result = await this.request('/me')
    return result.data
  }

  // Get businesses for a profile
  async getBusinesses(profileId: string): Promise<any[]> {
    const result = await this.request(`/profiles/${profileId}`)
    return result.data?.businesses || []
  }

  // Get ad accounts for a business
  async getAdAccounts(businessId: string): Promise<any[]> {
    const result = await this.request(`/businesses/${businessId}/ad_accounts`)
    return result.data || []
  }

  // Get all accounts (combines profile -> businesses -> ad accounts)
  async getAccounts(): Promise<any[]> {
    // Step 1: Get profile
    const profile = await this.getProfile()
    const profileId = profile.id

    // Step 2: Get businesses
    const businesses = await this.getBusinesses(profileId)
    if (businesses.length === 0) {
      throw new Error('No businesses found for this profile')
    }

    // Step 3: Get ad accounts for each business
    const allAccounts: any[] = []
    for (const business of businesses) {
      const accounts = await this.getAdAccounts(business.id)
      allAccounts.push(...accounts)
    }

    return allAccounts
  }

  // Create campaign
  async createCampaign(accountId: string, campaign: RedditAdCampaign): Promise<string> {
    const result = await this.request(`/ad_accounts/${accountId}/campaigns`, 'POST', {
      name: campaign.name,
      objective: campaign.objective,
      daily_budget_micro: campaign.dailyBudget * 10000, // Convert cents to micro
      start_time: campaign.startDate,
      end_time: campaign.endDate,
      is_paid: true
    })
    return result.data.id
  }

  // Create ad group
  async createAdGroup(accountId: string, adGroup: RedditAdGroup): Promise<string> {
    const result = await this.request(`/ad_accounts/${accountId}/ad_groups`, 'POST', {
      name: adGroup.name,
      campaign_id: adGroup.campaignId,
      bid_micro: adGroup.bid * 10000,
      bid_strategy: adGroup.bidStrategy,
      goal_type: adGroup.bidStrategy === 'CPC' ? 'CLICKS' : 'IMPRESSIONS',
      targeting: {
        subreddit: adGroup.targeting.subreddits ? {
          ids: adGroup.targeting.subreddits
        } : undefined,
        interest: adGroup.targeting.interests ? {
          ids: adGroup.targeting.interests
        } : undefined,
        geolocations_include: adGroup.targeting.locations ? {
          ids: adGroup.targeting.locations
        } : undefined,
        platform: adGroup.targeting.devices || ['DESKTOP', 'MOBILE']
      }
    })
    return result.data.id
  }

  // Create ad
  async createAd(accountId: string, ad: RedditAd): Promise<string> {
    const result = await this.request(`/ad_accounts/${accountId}/ads`, 'POST', {
      name: ad.name,
      ad_group_id: ad.adGroupId,
      post: {
        headline: ad.headline,
        body: ad.body,
        url: ad.destinationUrl,
        thumbnail_url: ad.thumbnailUrl,
        cta: ad.callToAction
      }
    })
    return result.data.id
  }

  // Get campaign stats
  async getCampaignStats(accountId: string, campaignId: string): Promise<any> {
    const result = await this.request(
      `/accounts/${accountId}/campaigns/${campaignId}/metrics?` +
      `start_date=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&` +
      `end_date=${new Date().toISOString().split('T')[0]}`
    )
    return result.data
  }

  // Pause campaign
  async pauseCampaign(accountId: string, campaignId: string): Promise<void> {
    await this.request(`/accounts/${accountId}/campaigns/${campaignId}`, 'PUT', {
      configured_status: 'PAUSED'
    })
  }

  // Resume campaign
  async resumeCampaign(accountId: string, campaignId: string): Promise<void> {
    await this.request(`/accounts/${accountId}/campaigns/${campaignId}`, 'PUT', {
      configured_status: 'ACTIVE'
    })
  }
}

// Dream Decoder ad templates
const adTemplates = {
  dreams: {
    headline: 'What Do Your Dreams Mean?',
    body: 'Free AI tool uses Jungian psychology to decode your dreams. Not generic definitions—personalized analysis based on YOUR dream context.',
    callToAction: 'LEARN_MORE' as const
  },
  jung: {
    headline: 'Jungian Dream Analysis - Free',
    body: 'Discover the archetypes in your dreams. Shadow, Anima, Hero—understand what your unconscious is telling you.',
    callToAction: 'LEARN_MORE' as const
  },
  selfImprovement: {
    headline: 'Unlock Your Subconscious Mind',
    body: 'Your dreams reveal truths you\'re not ready to face. Free AI dream decoder uses real psychology, not dictionary definitions.',
    callToAction: 'LEARN_MORE' as const
  },
  psychology: {
    headline: 'AI Dream Interpreter - Based on Jung',
    body: 'Finally, dream analysis that goes deeper than "water means emotions." Context-aware Jungian interpretation + 3D visualization.',
    callToAction: 'LEARN_MORE' as const
  }
}

// Subreddit targeting by category
const targetSubreddits = {
  dreams: ['Dreams', 'LucidDreaming', 'DreamInterpretation', 'Nightmares'],
  psychology: ['Jung', 'Psychoanalysis', 'psychology', 'consciousness'],
  selfImprovement: ['selfimprovement', 'DecidingToBeBetter', 'getdisciplined', 'productivity'],
  spiritual: ['Psychonaut', 'spirituality', 'Meditation', 'awakened']
}

// Main function to create a campaign
export async function createDreamDecoderCampaign(options: {
  dailyBudget: number // in dollars
  duration: number // in days
  targetCategory: keyof typeof targetSubreddits
}): Promise<void> {
  logger.info('REDDIT_ADS', 'Creating Dream Decoder campaign')

  const clientId = process.env.REDDIT_ADS_CLIENT_ID
  const clientSecret = process.env.REDDIT_ADS_CLIENT_SECRET
  const refreshToken = process.env.REDDIT_ADS_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    logger.error('REDDIT_ADS', 'Missing Reddit Ads credentials')
    console.log('\nRequired environment variables:')
    console.log('  REDDIT_ADS_CLIENT_ID')
    console.log('  REDDIT_ADS_CLIENT_SECRET')
    console.log('  REDDIT_ADS_REFRESH_TOKEN')
    console.log('\nGet these from: https://ads.reddit.com/accounts')
    return
  }

  const client = new RedditAdsClient(clientId, clientSecret, refreshToken)

  try {
    // Get ad account - use configured business ID to get accounts
    const businessId = process.env.REDDIT_ADS_BUSINESS_ID
    if (!businessId) {
      throw new Error('REDDIT_ADS_BUSINESS_ID not set')
    }

    const accounts = await client.getAdAccounts(businessId)
    if (accounts.length === 0) {
      throw new Error('No ad accounts found for this business')
    }

    const accountId = accounts[0].id
    logger.info('REDDIT_ADS', `Using account: ${accountId}`)

    // Create campaign
    const campaignId = await client.createCampaign(accountId, {
      name: `Dream Decoder - ${options.targetCategory} - ${new Date().toISOString().split('T')[0]}`,
      objective: 'TRAFFIC',
      dailyBudget: options.dailyBudget * 100, // Convert to cents
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + options.duration * 24 * 60 * 60 * 1000).toISOString()
    })
    logger.info('REDDIT_ADS', `Created campaign: ${campaignId}`)

    // Create ad group
    const adGroupId = await client.createAdGroup(accountId, {
      name: `${options.targetCategory} targeting`,
      campaignId,
      bid: 75, // $0.75 CPC
      bidStrategy: 'CPC',
      targeting: {
        subreddits: targetSubreddits[options.targetCategory],
        devices: ['DESKTOP', 'MOBILE']
      }
    })
    logger.info('REDDIT_ADS', `Created ad group: ${adGroupId}`)

    // Create ad
    const template = adTemplates[options.targetCategory] || adTemplates.dreams
    const adId = await client.createAd(accountId, {
      name: `${options.targetCategory} ad`,
      adGroupId,
      headline: template.headline,
      body: template.body,
      destinationUrl: `https://brandonmills.com/dream-decoder?utm_source=reddit&utm_medium=paid&utm_campaign=${options.targetCategory}`,
      callToAction: template.callToAction
    })
    logger.info('REDDIT_ADS', `Created ad: ${adId}`)

    console.log('\n✅ Campaign created successfully!')
    console.log(`   Campaign ID: ${campaignId}`)
    console.log(`   Daily Budget: $${options.dailyBudget}`)
    console.log(`   Duration: ${options.duration} days`)
    console.log(`   Target: ${targetSubreddits[options.targetCategory].join(', ')}`)
    console.log(`\nManage at: https://ads.reddit.com/accounts/${accountId}/campaigns/${campaignId}`)

  } catch (error: any) {
    logger.error('REDDIT_ADS', `Failed: ${error.message}`)
  }
}

// Get campaign stats
export async function getRedditAdStats(): Promise<void> {
  const clientId = process.env.REDDIT_ADS_CLIENT_ID
  const clientSecret = process.env.REDDIT_ADS_CLIENT_SECRET
  const refreshToken = process.env.REDDIT_ADS_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    console.log('Reddit Ads not configured')
    return
  }

  const client = new RedditAdsClient(clientId, clientSecret, refreshToken)

  try {
    // Get profile first
    const profile = await client.getProfile()
    console.log('\n📊 Reddit Ads Profile:')
    console.log(`  Profile ID: ${profile.id}`)
    console.log(`  Email: ${profile.email || 'N/A'}`)

    // Get businesses
    const businesses = await client.getBusinesses(profile.id)
    console.log(`\n  Businesses: ${businesses.length}`)

    // If no businesses from profile, try using the configured business ID
    const businessId = process.env.REDDIT_ADS_BUSINESS_ID
    if (businesses.length === 0 && businessId) {
      console.log(`\n  Trying configured Business ID: ${businessId}`)
      try {
        const accounts = await client.getAdAccounts(businessId)
        if (accounts.length > 0) {
          console.log(`\n  📈 Business: ${businessId}`)
          console.log(`     Ad Accounts: ${accounts.length}`)
          for (const account of accounts) {
            console.log(`\n     💼 Account: ${account.name || account.id}`)
            console.log(`        ID: ${account.id}`)
            console.log(`        Status: ${account.status || 'N/A'}`)
            console.log(`        Currency: ${account.currency || 'N/A'}`)
          }
        }
      } catch (err: any) {
        console.log(`     Could not access business: ${err.message}`)
      }
    }

    for (const business of businesses) {
      console.log(`\n  📈 Business: ${business.name || business.id}`)
      console.log(`     ID: ${business.id}`)

      // Get ad accounts for this business
      const accounts = await client.getAdAccounts(business.id)
      console.log(`     Ad Accounts: ${accounts.length}`)

      for (const account of accounts) {
        console.log(`\n     💼 Account: ${account.name || account.id}`)
        console.log(`        ID: ${account.id}`)
        console.log(`        Status: ${account.status || 'N/A'}`)
        console.log(`        Currency: ${account.currency || 'N/A'}`)
      }
    }
  } catch (error: any) {
    console.error('Error:', error.message)
  }
}

// Run directly
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.includes('--stats')) {
    getRedditAdStats()
  } else if (args.includes('--create')) {
    const budgetArg = args.find(a => a.startsWith('--budget='))
    const durationArg = args.find(a => a.startsWith('--duration='))
    const categoryArg = args.find(a => a.startsWith('--category='))

    createDreamDecoderCampaign({
      dailyBudget: budgetArg ? parseInt(budgetArg.split('=')[1]) : 50,
      duration: durationArg ? parseInt(durationArg.split('=')[1]) : 7,
      targetCategory: (categoryArg?.split('=')[1] as any) || 'dreams'
    })
  } else {
    console.log('Reddit Ads Automation')
    console.log('')
    console.log('Usage:')
    console.log('  npx tsx scripts/automation/reddit-ads.ts --stats')
    console.log('  npx tsx scripts/automation/reddit-ads.ts --create --budget=50 --duration=7 --category=dreams')
    console.log('')
    console.log('Categories: dreams, jung, selfImprovement, psychology')
  }
}
