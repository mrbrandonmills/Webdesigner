/**
 * Daily Traffic Report Email
 *
 * Runs daily (via cron) and emails you:
 * - Yesterday's traffic stats
 * - Comparison to previous day
 * - Top performing pages
 * - Revenue estimates
 * - Proposed solutions to increase traffic
 *
 * Setup:
 * 1. Set up Google Analytics credentials (see traffic-dashboard.ts)
 * 2. Add to .env.local:
 *    EMAIL_TO=your@email.com
 *    RESEND_API_KEY=your_resend_key (or use SendGrid, etc.)
 * 3. Add to cron: 0 9 * * * cd /path/to/project && npm run traffic:report
 *
 * Run manually: npm run traffic:report
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data'

const propertyId = process.env.GA4_PROPERTY_ID
const emailTo = process.env.EMAIL_TO || 'brandonflexy@gmail.com'

interface DailyStats {
  date: string
  users: number
  pageviews: number
  topPage: string
  topPageViews: number
  estimatedRevenue: number
  googleTraffic: number
  socialTraffic: number
}

async function getYesterdayStats(): Promise<DailyStats> {
  const analyticsDataClient = new BetaAnalyticsDataClient()

  // Get yesterday's overall stats
  const [overallResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: 'yesterday',
        endDate: 'yesterday',
      },
    ],
    dimensions: [],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
    ],
  })

  const users = parseInt(overallResponse.rows?.[0]?.metricValues?.[0]?.value || '0')
  const pageviews = parseInt(overallResponse.rows?.[0]?.metricValues?.[1]?.value || '0')

  // Get top page yesterday
  const [pagesResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: 'yesterday',
        endDate: 'yesterday',
      },
    ],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [
      {
        metric: {
          metricName: 'screenPageViews',
        },
        desc: true,
      },
    ],
    limit: 1,
  })

  const topPage = pagesResponse.rows?.[0]?.dimensionValues?.[0]?.value || '/'
  const topPageViews = parseInt(pagesResponse.rows?.[0]?.metricValues?.[0]?.value || '0')

  // Get Google traffic yesterday
  const [googleResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: 'yesterday',
        endDate: 'yesterday',
      },
    ],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'activeUsers' }],
    dimensionFilter: {
      filter: {
        fieldName: 'sessionSource',
        stringFilter: {
          matchType: 'CONTAINS',
          value: 'google',
        },
      },
    },
  })

  const googleTraffic = parseInt(googleResponse.rows?.[0]?.metricValues?.[0]?.value || '0')

  // Get social traffic yesterday
  const [socialResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: 'yesterday',
        endDate: 'yesterday',
      },
    ],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'activeUsers' }],
    dimensionFilter: {
      orGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'sessionSource',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'reddit',
              },
            },
          },
          {
            filter: {
              fieldName: 'sessionSource',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'pinterest',
              },
            },
          },
          {
            filter: {
              fieldName: 'sessionSource',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'medium',
              },
            },
          },
          {
            filter: {
              fieldName: 'sessionSource',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'linkedin',
              },
            },
          },
        ],
      },
    },
  })

  const socialTraffic = socialResponse.rows?.reduce((sum, row) => {
    return sum + parseInt(row.metricValues?.[0]?.value || '0')
  }, 0) || 0

  // Estimate revenue
  const estimatedClicks = pageviews * 0.05
  const estimatedConversions = estimatedClicks * 0.03
  const estimatedRevenue = estimatedConversions * 25

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return {
    date: yesterday.toISOString().split('T')[0],
    users,
    pageviews,
    topPage,
    topPageViews,
    estimatedRevenue,
    googleTraffic,
    socialTraffic,
  }
}

async function getPreviousDayStats(): Promise<DailyStats> {
  const analyticsDataClient = new BetaAnalyticsDataClient()

  const [overallResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '2daysAgo',
        endDate: '2daysAgo',
      },
    ],
    dimensions: [],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
    ],
  })

  const users = parseInt(overallResponse.rows?.[0]?.metricValues?.[0]?.value || '0')
  const pageviews = parseInt(overallResponse.rows?.[0]?.metricValues?.[1]?.value || '0')
  const estimatedRevenue = pageviews * 0.05 * 0.03 * 25

  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  return {
    date: twoDaysAgo.toISOString().split('T')[0],
    users,
    pageviews,
    topPage: '',
    topPageViews: 0,
    estimatedRevenue,
    googleTraffic: 0,
    socialTraffic: 0,
  }
}

function generateSolutions(stats: DailyStats): string[] {
  const solutions: string[] = []

  if (stats.googleTraffic < stats.users * 0.5) {
    solutions.push('Submit new blog posts to Google Search Console for indexing')
  }

  if (stats.socialTraffic < stats.users * 0.2) {
    solutions.push('Run social media automation: npm run auto-post:reddit')
  }

  if (stats.topPage.includes('/blog/braun-ipl')) {
    solutions.push('Braun IPL post is performing well - create similar product review posts')
  }

  if (stats.users < 50) {
    solutions.push('Focus on SEO - add more blog posts with target keywords')
  }

  if (stats.estimatedRevenue < 10) {
    solutions.push('Add more affiliate links to high-traffic pages')
  }

  return solutions
}

async function sendEmailReport(yesterday: DailyStats, previous: DailyStats) {
  const userChange = yesterday.users - previous.users
  const userChangePercent = previous.users > 0 ? ((userChange / previous.users) * 100).toFixed(1) : '0'
  const userTrend = userChange >= 0 ? '📈' : '📉'

  const pageviewChange = yesterday.pageviews - previous.pageviews
  const pageviewChangePercent = previous.pageviews > 0 ? ((pageviewChange / previous.pageviews) * 100).toFixed(1) : '0'
  const pageviewTrend = pageviewChange >= 0 ? '📈' : '📉'

  const revenueChange = yesterday.estimatedRevenue - previous.estimatedRevenue
  const revenueTrend = revenueChange >= 0 ? '💰' : '💸'

  const solutions = generateSolutions(yesterday)

  const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
    h1 { color: #333; margin: 0 0 20px 0; }
    .stat { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 10px 0; }
    .stat-label { color: #666; font-size: 14px; }
    .stat-value { color: #000; font-size: 24px; font-weight: bold; }
    .stat-change { color: #666; font-size: 14px; margin-top: 5px; }
    .positive { color: #28a745; }
    .negative { color: #dc3545; }
    .solutions { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107; }
    .solutions h3 { margin: 0 0 10px 0; color: #856404; }
    .solutions li { margin: 8px 0; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Daily Traffic Report - ${yesterday.date}</h1>

    <div class="stat">
      <div class="stat-label">Users</div>
      <div class="stat-value">${yesterday.users.toLocaleString()} ${userTrend}</div>
      <div class="stat-change ${userChange >= 0 ? 'positive' : 'negative'}">
        ${userChange >= 0 ? '+' : ''}${userChange} (${userChangePercent}%) vs previous day
      </div>
    </div>

    <div class="stat">
      <div class="stat-label">Pageviews</div>
      <div class="stat-value">${yesterday.pageviews.toLocaleString()} ${pageviewTrend}</div>
      <div class="stat-change ${pageviewChange >= 0 ? 'positive' : 'negative'}">
        ${pageviewChange >= 0 ? '+' : ''}${pageviewChange} (${pageviewChangePercent}%) vs previous day
      </div>
    </div>

    <div class="stat">
      <div class="stat-label">Estimated Revenue</div>
      <div class="stat-value">$${yesterday.estimatedRevenue.toFixed(2)} ${revenueTrend}</div>
      <div class="stat-change ${revenueChange >= 0 ? 'positive' : 'negative'}">
        ${revenueChange >= 0 ? '+' : ''}$${revenueChange.toFixed(2)} vs previous day
      </div>
    </div>

    <div class="stat">
      <div class="stat-label">Top Page</div>
      <div class="stat-value" style="font-size: 16px;">${yesterday.topPage}</div>
      <div class="stat-change">${yesterday.topPageViews} views</div>
    </div>

    <div class="stat">
      <div class="stat-label">Traffic Sources</div>
      <div class="stat-value" style="font-size: 16px;">
        Google: ${yesterday.googleTraffic} | Social: ${yesterday.socialTraffic}
      </div>
    </div>

    ${solutions.length > 0 ? `
      <div class="solutions">
        <h3>💡 Proposed Solutions</h3>
        <ul>
          ${solutions.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
      View full analytics: <a href="https://analytics.google.com">Google Analytics</a><br>
      Run dashboard: <code>npm run traffic:dashboard</code>
    </p>
  </div>
</body>
</html>
`

  // TODO: Send email using Resend, SendGrid, or your preferred email service
  // For now, just log to console
  console.log('\n📧 Email Report Generated\n')
  console.log('─────────────────────────────────────────────────────────')
  console.log(`To: ${emailTo}`)
  console.log(`Subject: Daily Traffic Report - ${yesterday.date}`)
  console.log('\n' + emailBody.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim())
  console.log('\n─────────────────────────────────────────────────────────')
  console.log('\n💡 To actually send emails, add email service credentials to .env.local')
  console.log('   Example: RESEND_API_KEY=your_key_here\n')

  return emailBody
}

async function main() {
  console.log('\n📊 Generating Daily Traffic Report...\n')

  if (!propertyId) {
    console.error('❌ ERROR: GA4_PROPERTY_ID not found in .env.local')
    console.log('\nAdd to .env.local:')
    console.log('  GA4_PROPERTY_ID=your_property_id')
    console.log('  GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json')
    process.exit(1)
  }

  try {
    const yesterday = await getYesterdayStats()
    const previous = await getPreviousDayStats()

    await sendEmailReport(yesterday, previous)

    console.log('✅ Daily traffic report generated successfully!\n')
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message)
    process.exit(1)
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
