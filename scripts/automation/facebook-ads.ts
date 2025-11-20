/**
 * Facebook/Meta Marketing API Automation
 *
 * Creates and manages Facebook/Instagram ad campaigns.
 *
 * Setup:
 * 1. Go to https://developers.facebook.com/apps
 * 2. Create App → Select "Other" → Select "Business"
 * 3. Add Marketing API product
 * 4. Go to Marketing API → Tools → Access Token Tool
 * 5. Select permissions: ads_management, ads_read
 * 6. Generate token and extend it (60 day expiry)
 * 7. Get your Ad Account ID from Business Manager
 */

import { logger } from './logger'

interface FacebookCampaign {
  name: string
  objective: 'OUTCOME_TRAFFIC' | 'OUTCOME_AWARENESS' | 'OUTCOME_ENGAGEMENT' | 'OUTCOME_LEADS'
  dailyBudget: number // in cents
  status: 'ACTIVE' | 'PAUSED'
}

interface FacebookAdSet {
  name: string
  campaignId: string
  dailyBudget: number // in cents
  bidAmount?: number // in cents
  targeting: {
    geoLocations: { countries: string[] }
    ageMin?: number
    ageMax?: number
    interests?: { id: string; name: string }[]
  }
  optimizationGoal: 'LINK_CLICKS' | 'IMPRESSIONS' | 'REACH'
  billingEvent: 'IMPRESSIONS' | 'LINK_CLICKS'
}

interface FacebookAd {
  name: string
  adSetId: string
  creative: {
    title: string
    body: string
    linkUrl: string
    imageHash?: string
    callToAction: 'LEARN_MORE' | 'SIGN_UP' | 'DOWNLOAD'
  }
}

// Facebook Marketing API client
class FacebookAdsClient {
  private baseUrl = 'https://graph.facebook.com/v18.0'

  constructor(
    private accessToken: string,
    private adAccountId: string
  ) {}

  // Make API request
  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (method === 'GET' && body) {
      Object.entries(body).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    url.searchParams.append('access_token', this.accessToken)

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (method === 'POST' && body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url.toString(), options)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // Get ad account info
  async getAdAccount(): Promise<any> {
    return this.request(`/act_${this.adAccountId}`, 'GET', {
      fields: 'name,account_status,balance,currency'
    })
  }

  // Create campaign
  async createCampaign(campaign: FacebookCampaign): Promise<string> {
    const result = await this.request(`/act_${this.adAccountId}/campaigns`, 'POST', {
      name: campaign.name,
      objective: campaign.objective,
      status: campaign.status,
      special_ad_categories: '[]'
    })
    return result.id
  }

  // Create ad set
  async createAdSet(adSet: FacebookAdSet): Promise<string> {
    const result = await this.request(`/act_${this.adAccountId}/adsets`, 'POST', {
      name: adSet.name,
      campaign_id: adSet.campaignId,
      daily_budget: adSet.dailyBudget,
      bid_amount: adSet.bidAmount,
      billing_event: adSet.billingEvent,
      optimization_goal: adSet.optimizationGoal,
      targeting: JSON.stringify(adSet.targeting),
      status: 'ACTIVE'
    })
    return result.id
  }

  // Upload image and get hash
  async uploadImage(imageUrl: string): Promise<string> {
    const result = await this.request(`/act_${this.adAccountId}/adimages`, 'POST', {
      url: imageUrl
    })
    const imageData = Object.values(result.images)[0] as any
    return imageData.hash
  }

  // Create ad creative
  async createAdCreative(creative: {
    name: string
    title: string
    body: string
    linkUrl: string
    imageHash: string
    callToAction: string
  }): Promise<string> {
    const result = await this.request(`/act_${this.adAccountId}/adcreatives`, 'POST', {
      name: creative.name,
      object_story_spec: JSON.stringify({
        page_id: process.env.FACEBOOK_PAGE_ID,
        link_data: {
          link: creative.linkUrl,
          message: creative.body,
          name: creative.title,
          image_hash: creative.imageHash,
          call_to_action: {
            type: creative.callToAction
          }
        }
      })
    })
    return result.id
  }

  // Create ad
  async createAd(ad: { name: string; adSetId: string; creativeId: string }): Promise<string> {
    const result = await this.request(`/act_${this.adAccountId}/ads`, 'POST', {
      name: ad.name,
      adset_id: ad.adSetId,
      creative: JSON.stringify({ creative_id: ad.creativeId }),
      status: 'ACTIVE'
    })
    return result.id
  }

  // Get campaign insights
  async getCampaignInsights(campaignId: string): Promise<any> {
    return this.request(`/${campaignId}/insights`, 'GET', {
      fields: 'impressions,clicks,spend,cpc,ctr,reach'
    })
  }

  // Pause campaign
  async pauseCampaign(campaignId: string): Promise<void> {
    await this.request(`/${campaignId}`, 'POST', {
      status: 'PAUSED'
    })
  }

  // Get all campaigns
  async getCampaigns(): Promise<any[]> {
    const result = await this.request(`/act_${this.adAccountId}/campaigns`, 'GET', {
      fields: 'name,status,objective,daily_budget,lifetime_budget'
    })
    return result.data
  }
}

// Dream Decoder targeting
const dreamDecoderTargeting = {
  geoLocations: { countries: ['US', 'CA', 'GB', 'AU'] },
  ageMin: 25,
  ageMax: 54,
  interests: [
    { id: '6003139266461', name: 'Dream interpretation' },
    { id: '6003384248053', name: 'Carl Jung' },
    { id: '6003397425735', name: 'Psychology' },
    { id: '6003107902433', name: 'Self-improvement' },
    { id: '6003384248895', name: 'Spirituality' },
    { id: '6003020834693', name: 'Meditation' }
  ]
}

// Create Dream Decoder campaign
export async function createDreamDecoderFacebookCampaign(options: {
  dailyBudget: number // in dollars
  duration?: number // in days
}): Promise<void> {
  logger.info('FB_ADS', 'Creating Dream Decoder Facebook campaign')

  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!accessToken || !adAccountId) {
    logger.error('FB_ADS', 'Missing Facebook Ads credentials')
    console.log('\nRequired environment variables:')
    console.log('  FACEBOOK_ACCESS_TOKEN - Get from Marketing API Tools')
    console.log('  FACEBOOK_AD_ACCOUNT_ID - Get from Business Manager')
    console.log('  FACEBOOK_PAGE_ID - Your Facebook Page ID')
    console.log('\nSetup guide:')
    console.log('1. Go to https://developers.facebook.com/apps')
    console.log('2. Create App → Other → Business')
    console.log('3. Add Marketing API product')
    console.log('4. Tools → Access Token Tool → Generate')
    console.log('5. Get Ad Account ID from Business Manager')
    return
  }

  const client = new FacebookAdsClient(accessToken, adAccountId)

  try {
    // Verify account
    const account = await client.getAdAccount()
    logger.info('FB_ADS', `Using account: ${account.name}`)

    // Create campaign
    const campaignId = await client.createCampaign({
      name: `Dream Decoder - ${new Date().toISOString().split('T')[0]}`,
      objective: 'OUTCOME_TRAFFIC',
      dailyBudget: options.dailyBudget * 100,
      status: 'PAUSED' // Start paused for review
    })
    logger.info('FB_ADS', `Created campaign: ${campaignId}`)

    // Create ad set
    const adSetId = await client.createAdSet({
      name: 'Dream/Psychology Interests',
      campaignId,
      dailyBudget: options.dailyBudget * 100,
      targeting: dreamDecoderTargeting,
      optimizationGoal: 'LINK_CLICKS',
      billingEvent: 'IMPRESSIONS'
    })
    logger.info('FB_ADS', `Created ad set: ${adSetId}`)

    // Upload image (use a dream-related image)
    const imageHash = await client.uploadImage(
      'https://brandonmills.com/images/dream-decoder-ad.jpg'
    )
    logger.info('FB_ADS', `Uploaded image: ${imageHash}`)

    // Create ad creative
    const creativeId = await client.createAdCreative({
      name: 'Dream Decoder Main Creative',
      title: 'What Do Your Dreams Mean?',
      body: 'Free AI tool uses Jungian psychology to decode your dreams. Not generic definitions—personalized analysis based on YOUR dream context.',
      linkUrl: 'https://brandonmills.com/dream-decoder?utm_source=facebook&utm_medium=paid&utm_campaign=launch',
      imageHash,
      callToAction: 'LEARN_MORE'
    })
    logger.info('FB_ADS', `Created creative: ${creativeId}`)

    // Create ad
    const adId = await client.createAd({
      name: 'Dream Decoder Ad 1',
      adSetId,
      creativeId
    })
    logger.info('FB_ADS', `Created ad: ${adId}`)

    console.log('\n✅ Facebook campaign created successfully!')
    console.log(`   Campaign ID: ${campaignId}`)
    console.log(`   Daily Budget: $${options.dailyBudget}`)
    console.log(`   Status: PAUSED (review before activating)`)
    console.log(`\nNext steps:`)
    console.log('1. Review campaign in Ads Manager')
    console.log('2. Set campaign status to ACTIVE when ready')
    console.log(`\nManage at: https://www.facebook.com/adsmanager/manage/campaigns?act=${adAccountId}`)

  } catch (error: any) {
    logger.error('FB_ADS', `Failed: ${error.message}`)
    console.error('\nError details:', error.message)
  }
}

// Get campaign stats
export async function getFacebookAdStats(): Promise<void> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID

  if (!accessToken || !adAccountId) {
    console.log('Facebook Ads not configured')
    return
  }

  const client = new FacebookAdsClient(accessToken, adAccountId)

  try {
    const campaigns = await client.getCampaigns()
    console.log('\n📊 Facebook Ad Campaigns:')

    for (const campaign of campaigns) {
      console.log(`\n  ${campaign.name}`)
      console.log(`    ID: ${campaign.id}`)
      console.log(`    Status: ${campaign.status}`)
      console.log(`    Objective: ${campaign.objective}`)

      // Get insights
      try {
        const insights = await client.getCampaignInsights(campaign.id)
        if (insights.data && insights.data[0]) {
          const data = insights.data[0]
          console.log(`    Impressions: ${data.impressions}`)
          console.log(`    Clicks: ${data.clicks}`)
          console.log(`    Spend: $${(parseFloat(data.spend)).toFixed(2)}`)
          console.log(`    CPC: $${data.cpc}`)
          console.log(`    CTR: ${data.ctr}%`)
        }
      } catch (e) {
        // No insights yet
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
    getFacebookAdStats()
  } else if (args.includes('--create')) {
    const budgetArg = args.find(a => a.startsWith('--budget='))

    createDreamDecoderFacebookCampaign({
      dailyBudget: budgetArg ? parseInt(budgetArg.split('=')[1]) : 10
    })
  } else {
    console.log('Facebook Ads Automation')
    console.log('')
    console.log('Usage:')
    console.log('  npx tsx scripts/automation/facebook-ads.ts --stats')
    console.log('  npx tsx scripts/automation/facebook-ads.ts --create --budget=10')
    console.log('')
    console.log('Setup required:')
    console.log('  FACEBOOK_ACCESS_TOKEN')
    console.log('  FACEBOOK_AD_ACCOUNT_ID')
    console.log('  FACEBOOK_PAGE_ID')
  }
}
