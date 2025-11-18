/**
 * Traffic Analytics Dashboard
 *
 * Fetches Google Analytics 4 data and displays:
 * - Daily traffic stats
 * - Top performing pages
 * - Traffic sources (Google, social, direct)
 * - Revenue estimates (based on affiliate click-through)
 * - Proposed solutions to increase traffic
 *
 * Setup:
 * 1. Go to: https://console.cloud.google.com/apis/credentials
 * 2. Create Service Account
 * 3. Download JSON key
 * 4. Add to .env.local:
 *    GA4_PROPERTY_ID=your_property_id
 *    GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * Run: npm run traffic:dashboard
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data'

const propertyId = process.env.GA4_PROPERTY_ID

interface TrafficStats {
  totalUsers: number
  totalPageviews: number
  avgSessionDuration: number
  topPages: Array<{
    page: string
    views: number
    users: number
  }>
  trafficSources: Array<{
    source: string
    users: number
    percentage: number
  }>
  estimatedRevenue: number
}

async function getTrafficStats(): Promise<TrafficStats> {
  const analyticsDataClient = new BetaAnalyticsDataClient()

  // Get overall traffic stats (last 7 days)
  const [overallResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
    ],
  })

  const totalUsers = parseInt(overallResponse.rows?.[0]?.metricValues?.[0]?.value || '0')
  const totalPageviews = parseInt(overallResponse.rows?.[0]?.metricValues?.[1]?.value || '0')
  const avgSessionDuration = parseFloat(overallResponse.rows?.[0]?.metricValues?.[2]?.value || '0')

  // Get top pages (last 7 days)
  const [pagesResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'screenPageViews',
        },
        desc: true,
      },
    ],
    limit: 10,
  })

  const topPages = pagesResponse.rows?.map(row => ({
    page: row.dimensionValues?.[0]?.value || '',
    views: parseInt(row.metricValues?.[0]?.value || '0'),
    users: parseInt(row.metricValues?.[1]?.value || '0'),
  })) || []

  // Get traffic sources (last 7 days)
  const [sourcesResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [
      {
        metric: {
          metricName: 'activeUsers',
        },
        desc: true,
      },
    ],
    limit: 10,
  })

  const trafficSources = sourcesResponse.rows?.map(row => {
    const users = parseInt(row.metricValues?.[0]?.value || '0')
    return {
      source: row.dimensionValues?.[0]?.value || '',
      users,
      percentage: totalUsers > 0 ? (users / totalUsers) * 100 : 0,
    }
  }) || []

  // Estimate revenue (affiliate click-through rate: ~5%, conversion: ~3%, avg commission: $25)
  const estimatedClicks = totalPageviews * 0.05
  const estimatedConversions = estimatedClicks * 0.03
  const estimatedRevenue = estimatedConversions * 25

  return {
    totalUsers,
    totalPageviews,
    avgSessionDuration,
    topPages,
    trafficSources,
    estimatedRevenue,
  }
}

function generateProposedSolutions(stats: TrafficStats): string[] {
  const solutions: string[] = []

  // Check Google organic traffic
  const googleTraffic = stats.trafficSources.find(s => s.source.includes('google'))
  if (!googleTraffic || googleTraffic.percentage < 50) {
    solutions.push(
      '🔍 LOW GOOGLE TRAFFIC: Submit sitemap to Google Search Console and request indexing for top pages'
    )
  }

  // Check if blog posts are performing
  const blogTraffic = stats.topPages.filter(p => p.page.includes('/blog/')).reduce((sum, p) => sum + p.views, 0)
  if (blogTraffic < stats.totalPageviews * 0.3) {
    solutions.push(
      '📝 LOW BLOG ENGAGEMENT: Create more product review blog posts (Braun IPL is performing well)'
    )
  }

  // Check if affiliate shop is getting traffic
  const shopTraffic = stats.topPages.find(p => p.page.includes('/shop'))
  if (!shopTraffic || shopTraffic.views < 100) {
    solutions.push(
      '🛍️ LOW SHOP TRAFFIC: Add internal links from blog posts to affiliate products'
    )
  }

  // Check social traffic
  const socialTraffic = stats.trafficSources.filter(s =>
    s.source.includes('reddit') ||
    s.source.includes('pinterest') ||
    s.source.includes('medium') ||
    s.source.includes('linkedin')
  ).reduce((sum, s) => sum + s.users, 0)

  if (socialTraffic < stats.totalUsers * 0.2) {
    solutions.push(
      '📱 LOW SOCIAL TRAFFIC: Run social media automation scripts (Reddit, Medium, Pinterest)'
    )
  }

  // Check if traffic is growing
  if (stats.totalUsers < 100) {
    solutions.push(
      '📈 LOW OVERALL TRAFFIC: Focus on SEO - add more blog posts, optimize meta tags, build backlinks'
    )
  }

  // Check estimated revenue
  if (stats.estimatedRevenue < 50) {
    solutions.push(
      '💰 LOW REVENUE: Add more affiliate links to blog posts and optimize call-to-action placement'
    )
  }

  if (solutions.length === 0) {
    solutions.push('✅ TRAFFIC LOOKING GOOD: Keep creating content and monitor for changes')
  }

  return solutions
}

async function displayDashboard() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          📊 BRANDON MILLS - TRAFFIC DASHBOARD 📊          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  console.log('📡 Fetching Google Analytics data...\n')

  try {
    const stats = await getTrafficStats()

    console.log('📈 OVERALL STATS (Last 7 Days)')
    console.log('─────────────────────────────────────────────────────────')
    console.log(`Total Users:          ${stats.totalUsers.toLocaleString()}`)
    console.log(`Total Pageviews:      ${stats.totalPageviews.toLocaleString()}`)
    console.log(`Avg Session Duration: ${Math.round(stats.avgSessionDuration)}s`)
    console.log(`Estimated Revenue:    $${stats.estimatedRevenue.toFixed(2)}`)
    console.log('')

    console.log('🏆 TOP 10 PAGES')
    console.log('─────────────────────────────────────────────────────────')
    stats.topPages.forEach((page, i) => {
      const pageName = page.page === '/' ? 'Homepage' : page.page
      console.log(`${i + 1}. ${pageName}`)
      console.log(`   Views: ${page.views.toLocaleString()} | Users: ${page.users.toLocaleString()}`)
    })
    console.log('')

    console.log('🌍 TRAFFIC SOURCES')
    console.log('─────────────────────────────────────────────────────────')
    stats.trafficSources.forEach(source => {
      console.log(`${source.source.padEnd(20)} ${source.users.toLocaleString().padStart(6)} users (${source.percentage.toFixed(1)}%)`)
    })
    console.log('')

    console.log('💡 PROPOSED SOLUTIONS')
    console.log('─────────────────────────────────────────────────────────')
    const solutions = generateProposedSolutions(stats)
    solutions.forEach((solution, i) => {
      console.log(`${i + 1}. ${solution}`)
    })
    console.log('')

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  Next update: Run this script daily to track progress     ║
║  Command: npm run traffic:dashboard                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)
  } catch (error: any) {
    if (error.message.includes('credentials')) {
      console.error('\n❌ ERROR: Google Analytics credentials not found\n')
      console.log('Setup instructions:')
      console.log('1. Go to: https://console.cloud.google.com/apis/credentials')
      console.log('2. Create a Service Account')
      console.log('3. Grant "Viewer" role on your GA4 property')
      console.log('4. Download JSON key file')
      console.log('5. Add to .env.local:')
      console.log('   GA4_PROPERTY_ID=your_property_id')
      console.log('   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json')
      console.log('')
    } else {
      console.error('\n❌ ERROR:', error.message)
    }
    process.exit(1)
  }
}

displayDashboard().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
