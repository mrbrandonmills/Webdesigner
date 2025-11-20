/**
 * Google Ads API Automation
 *
 * Creates and manages Google Ads campaigns.
 *
 * Setup:
 * 1. Go to https://ads.google.com and create account
 * 2. Go to https://console.cloud.google.com
 * 3. Create project and enable Google Ads API
 * 4. Create OAuth 2.0 credentials
 * 5. Get developer token from Google Ads account
 * 6. Link your Google Ads account to the project
 */

import { logger } from './logger'

interface GoogleAdsCampaign {
  name: string
  budget: number // daily budget in dollars
  targetLocations: string[] // country codes
  keywords: string[]
}

interface GoogleAdsTextAd {
  headlines: string[] // max 30 chars each
  descriptions: string[] // max 90 chars each
  finalUrl: string
  path1?: string
  path2?: string
}

// Google Ads API client
class GoogleAdsClient {
  private baseUrl = 'https://googleads.googleapis.com/v14'

  constructor(
    private accessToken: string,
    private developerToken: string,
    private customerId: string
  ) {}

  // Make API request
  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'developer-token': this.developerToken,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Google Ads API error: ${error}`)
    }

    return response.json()
  }

  // Create campaign budget
  async createBudget(name: string, amountMicros: number): Promise<string> {
    const result = await this.request(
      `/customers/${this.customerId}/campaignBudgets:mutate`,
      'POST',
      {
        operations: [{
          create: {
            name,
            amountMicros: amountMicros.toString(),
            deliveryMethod: 'STANDARD'
          }
        }]
      }
    )
    return result.results[0].resourceName
  }

  // Create campaign
  async createCampaign(name: string, budgetResourceName: string): Promise<string> {
    const result = await this.request(
      `/customers/${this.customerId}/campaigns:mutate`,
      'POST',
      {
        operations: [{
          create: {
            name,
            advertisingChannelType: 'SEARCH',
            status: 'PAUSED',
            manualCpc: {},
            campaignBudget: budgetResourceName,
            networkSettings: {
              targetGoogleSearch: true,
              targetSearchNetwork: true,
              targetContentNetwork: false
            }
          }
        }]
      }
    )
    return result.results[0].resourceName
  }

  // Create ad group
  async createAdGroup(name: string, campaignResourceName: string, cpcBidMicros: number): Promise<string> {
    const result = await this.request(
      `/customers/${this.customerId}/adGroups:mutate`,
      'POST',
      {
        operations: [{
          create: {
            name,
            campaign: campaignResourceName,
            status: 'ENABLED',
            cpcBidMicros: cpcBidMicros.toString(),
            type: 'SEARCH_STANDARD'
          }
        }]
      }
    )
    return result.results[0].resourceName
  }

  // Add keywords to ad group
  async addKeywords(adGroupResourceName: string, keywords: string[]): Promise<void> {
    const operations = keywords.map(keyword => ({
      create: {
        adGroup: adGroupResourceName,
        status: 'ENABLED',
        matchType: 'PHRASE',
        keyword: { text: keyword }
      }
    }))

    await this.request(
      `/customers/${this.customerId}/adGroupCriteria:mutate`,
      'POST',
      { operations }
    )
  }

  // Create responsive search ad
  async createResponsiveSearchAd(
    adGroupResourceName: string,
    ad: GoogleAdsTextAd
  ): Promise<string> {
    const result = await this.request(
      `/customers/${this.customerId}/adGroupAds:mutate`,
      'POST',
      {
        operations: [{
          create: {
            adGroup: adGroupResourceName,
            status: 'ENABLED',
            ad: {
              responsiveSearchAd: {
                headlines: ad.headlines.map(h => ({ text: h })),
                descriptions: ad.descriptions.map(d => ({ text: d })),
                path1: ad.path1,
                path2: ad.path2
              },
              finalUrls: [ad.finalUrl]
            }
          }
        }]
      }
    )
    return result.results[0].resourceName
  }

  // Get campaign performance
  async getCampaignPerformance(): Promise<any> {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date DURING LAST_7_DAYS
    `

    return this.request(
      `/customers/${this.customerId}/googleAds:search`,
      'POST',
      { query }
    )
  }
}

// Dream Decoder keywords
const dreamDecoderKeywords = [
  'dream meaning',
  'dream interpretation',
  'what does my dream mean',
  'dream analyzer',
  'dream symbol meaning',
  'recurring dream meaning',
  'jungian dream analysis',
  'dream decoder',
  'interpret my dream',
  'dream dictionary online'
]

// Dream Decoder ad copy
const dreamDecoderAd: GoogleAdsTextAd = {
  headlines: [
    'Free AI Dream Interpretation',
    'What Does Your Dream Mean?',
    'Jungian Dream Analysis',
    'Decode Your Dreams Free',
    'AI-Powered Dream Decoder',
    'Understand Your Dreams Now',
    'Free Dream Meaning Tool',
    'Your Subconscious Decoded',
    'Recurring Dream? Get Answers',
    'Not Generic Symbol Lists'
  ],
  descriptions: [
    'Free AI tool analyzes dreams using Jungian psychology. Get personalized insights now.',
    'Stop googling dream symbols. Get real psychological analysis of what your dreams mean.',
    'Decode your subconscious messages. Free Jungian dream interpretation in seconds.',
    'Understand recurring dreams. AI-powered analysis based on Carl Jung\'s work.'
  ],
  finalUrl: 'https://brandonmills.com/dream-decoder?utm_source=google&utm_medium=paid&utm_campaign=search',
  path1: 'dream',
  path2: 'decoder'
}

// Create Dream Decoder campaign
export async function createDreamDecoderGoogleCampaign(options: {
  dailyBudget: number // in dollars
}): Promise<void> {
  logger.info('GOOGLE_ADS', 'Creating Dream Decoder Google campaign')

  const accessToken = process.env.GOOGLE_ADS_ACCESS_TOKEN
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

  if (!accessToken || !developerToken || !customerId) {
    logger.error('GOOGLE_ADS', 'Missing Google Ads credentials')
    console.log('\nRequired environment variables:')
    console.log('  GOOGLE_ADS_ACCESS_TOKEN')
    console.log('  GOOGLE_ADS_DEVELOPER_TOKEN')
    console.log('  GOOGLE_ADS_CUSTOMER_ID')
    console.log('\nSetup guide:')
    console.log('1. Create Google Ads account at ads.google.com')
    console.log('2. Go to console.cloud.google.com')
    console.log('3. Create project, enable Google Ads API')
    console.log('4. Create OAuth 2.0 credentials')
    console.log('5. Get developer token from Google Ads (Tools → API Center)')
    return
  }

  const client = new GoogleAdsClient(accessToken, developerToken, customerId.replace(/-/g, ''))

  try {
    // Create budget
    const budgetResourceName = await client.createBudget(
      `Dream Decoder Budget - ${new Date().toISOString().split('T')[0]}`,
      options.dailyBudget * 1000000 // Convert to micros
    )
    logger.info('GOOGLE_ADS', `Created budget: ${budgetResourceName}`)

    // Create campaign
    const campaignResourceName = await client.createCampaign(
      `Dream Decoder Search - ${new Date().toISOString().split('T')[0]}`,
      budgetResourceName
    )
    logger.info('GOOGLE_ADS', `Created campaign: ${campaignResourceName}`)

    // Create ad group
    const adGroupResourceName = await client.createAdGroup(
      'Dream Interpretation Keywords',
      campaignResourceName,
      1500000 // $1.50 CPC bid in micros
    )
    logger.info('GOOGLE_ADS', `Created ad group: ${adGroupResourceName}`)

    // Add keywords
    await client.addKeywords(adGroupResourceName, dreamDecoderKeywords)
    logger.info('GOOGLE_ADS', `Added ${dreamDecoderKeywords.length} keywords`)

    // Create responsive search ad
    const adResourceName = await client.createResponsiveSearchAd(
      adGroupResourceName,
      dreamDecoderAd
    )
    logger.info('GOOGLE_ADS', `Created ad: ${adResourceName}`)

    console.log('\n✅ Google Ads campaign created successfully!')
    console.log(`   Campaign: ${campaignResourceName}`)
    console.log(`   Daily Budget: $${options.dailyBudget}`)
    console.log(`   Status: PAUSED (review before activating)`)
    console.log(`\nNext steps:`)
    console.log('1. Review campaign in Google Ads')
    console.log('2. Enable campaign when ready')
    console.log(`\nManage at: https://ads.google.com`)

  } catch (error: any) {
    logger.error('GOOGLE_ADS', `Failed: ${error.message}`)
    console.error('\nError details:', error.message)
  }
}

// Get campaign stats
export async function getGoogleAdStats(): Promise<void> {
  const accessToken = process.env.GOOGLE_ADS_ACCESS_TOKEN
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

  if (!accessToken || !developerToken || !customerId) {
    console.log('Google Ads not configured')
    return
  }

  const client = new GoogleAdsClient(accessToken, developerToken, customerId.replace(/-/g, ''))

  try {
    const results = await client.getCampaignPerformance()
    console.log('\n📊 Google Ads Campaigns:')

    for (const row of results.results || []) {
      const campaign = row.campaign
      const metrics = row.metrics

      console.log(`\n  ${campaign.name}`)
      console.log(`    ID: ${campaign.id}`)
      console.log(`    Status: ${campaign.status}`)
      console.log(`    Impressions: ${metrics.impressions}`)
      console.log(`    Clicks: ${metrics.clicks}`)
      console.log(`    Spend: $${(parseInt(metrics.costMicros) / 1000000).toFixed(2)}`)
      console.log(`    CTR: ${(parseFloat(metrics.ctr) * 100).toFixed(2)}%`)
      console.log(`    Avg CPC: $${(parseInt(metrics.averageCpc) / 1000000).toFixed(2)}`)
    }
  } catch (error: any) {
    console.error('Error:', error.message)
  }
}

// Run directly
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.includes('--stats')) {
    getGoogleAdStats()
  } else if (args.includes('--create')) {
    const budgetArg = args.find(a => a.startsWith('--budget='))

    createDreamDecoderGoogleCampaign({
      dailyBudget: budgetArg ? parseInt(budgetArg.split('=')[1]) : 5
    })
  } else {
    console.log('Google Ads Automation')
    console.log('')
    console.log('Usage:')
    console.log('  npx tsx scripts/automation/google-ads.ts --stats')
    console.log('  npx tsx scripts/automation/google-ads.ts --create --budget=5')
    console.log('')
    console.log('Setup required:')
    console.log('  GOOGLE_ADS_ACCESS_TOKEN')
    console.log('  GOOGLE_ADS_DEVELOPER_TOKEN')
    console.log('  GOOGLE_ADS_CUSTOMER_ID')
  }
}
