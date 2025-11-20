import { NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for full audit

const StyleGuideSchema = z.object({
  writingStyle: z.object({
    tone: z.string().describe('Overall tone (e.g., professional, casual, artistic, emotional)'),
    voice: z.string().describe('Voice characteristics (e.g., first-person, storytelling, technical)'),
    sentenceStructure: z.string().describe('Typical sentence patterns and length'),
    vocabulary: z.array(z.string()).describe('Commonly used words and phrases'),
    examplePhrases: z.array(z.string()).describe('3-5 example phrases that capture the style'),
  }),

  contentPatterns: z.object({
    titleStyle: z.string().describe('How titles are formatted (length, capitalization, keywords)'),
    descriptionStyle: z.string().describe('How descriptions are written (length, structure, focus)'),
    captionStyle: z.string().describe('How photo captions are written'),
    seoApproach: z.string().describe('SEO strategy and keyword usage'),
  }),

  brandPersonality: z.object({
    values: z.array(z.string()).describe('Brand values expressed in content'),
    targetAudience: z.string().describe('Who the content speaks to'),
    uniqueSellingPoints: z.array(z.string()).describe('What makes this photographer unique'),
    emotionalTone: z.string().describe('Emotional feeling the content creates'),
  }),

  visualStyle: z.object({
    colorPalette: z.array(z.string()).describe('Dominant colors mentioned or implied'),
    photographyStyle: z.string().describe('Photography style (e.g., moody, bright, editorial, candid)'),
    subjectMatter: z.array(z.string()).describe('Common subjects photographed'),
  }),

  businessInfo: z.object({
    services: z.array(z.string()).describe('Services offered'),
    priceIndicators: z.string().describe('Pricing strategy (luxury, affordable, mid-range)'),
    location: z.string().describe('Geographic area served'),
    specialties: z.array(z.string()).describe('Areas of specialization'),
  }),

  recommendations: z.object({
    contentImprovements: z.array(z.string()).describe('3-5 ways to improve content'),
    seoOpportunities: z.array(z.string()).describe('SEO opportunities identified'),
    storeOptimizations: z.array(z.string()).describe('Ways to optimize store/sales'),
    audienceGrowth: z.array(z.string()).describe('Strategies to grow audience'),
  }),
})

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      )
    }

    logger.info('Starting site audit for: ${url}')

    // Step 1: Fetch the homepage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Site-Audit/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch site: ${response.status}`)
    }

    const html = await response.text()

    // Step 2: Extract text content (basic scraping)
    // Remove HTML tags for Claude to analyze
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 50000) // Limit to 50K chars to avoid token limits

    // Step 3: Try to fetch a few gallery/portfolio pages
    const portfolioLinks: string[] = []
    const linkMatches = html.matchAll(/href=["']([^"']+)["']/g)

    for (const match of linkMatches) {
      const link = match[1]
      if (
        link &&
        !link.startsWith('#') &&
        !link.startsWith('mailto:') &&
        !link.startsWith('tel:') &&
        (link.includes('portfolio') ||
          link.includes('gallery') ||
          link.includes('work') ||
          link.includes('blog'))
      ) {
        // Make absolute URL
        const absoluteUrl = link.startsWith('http')
          ? link
          : new URL(link, url).href

        // Only from same domain
        if (absoluteUrl.startsWith(url)) {
          portfolioLinks.push(absoluteUrl)
        }
      }

      if (portfolioLinks.length >= 3) break // Limit to 3 pages
    }

    // Fetch sample portfolio pages
    const portfolioContent: string[] = []
    for (const link of portfolioLinks.slice(0, 2)) {
      try {
        const pageResponse = await fetch(link, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AI-Site-Audit/1.0)' },
        })
        if (pageResponse.ok) {
          const pageHtml = await pageResponse.text()
          const pageText = pageHtml
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 10000)

          portfolioContent.push(pageText)
        }
      } catch (error) {
        logger.info('Could not fetch ${link}:', { data: error })
      }
    }

    logger.info('Fetched ${portfolioContent.length} portfolio pages')

    // Step 4: Analyze with Claude
    const prompt = `You are an expert brand strategist and content analyst. Analyze this photographer's website and create a comprehensive style guide that will help AI generate content that perfectly matches their brand voice, style, and business.

HOMEPAGE CONTENT:
${textContent.slice(0, 30000)}

${portfolioContent.length > 0 ? `\nPORTFOLIO/GALLERY EXAMPLES:\n${portfolioContent.join('\n\n---\n\n').slice(0, 20000)}` : ''}

Analyze:
1. Writing style (tone, voice, patterns)
2. Content structure (titles, descriptions, captions)
3. Brand personality and values
4. Visual style and photography approach
5. Business information (services, pricing, location)
6. Opportunities for improvement

Be specific and actionable. Extract exact phrases they use. Identify their unique voice. This style guide will be used to generate new content that sounds authentically like them.`

    const { object: styleGuide } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'), // Latest Claude Sonnet 4.5
      schema: StyleGuideSchema,
      prompt,
      temperature: 0.3, // Lower temp for more consistent analysis
    })

    logger.info('Style guide generated successfully')

    return NextResponse.json({
      success: true,
      styleGuide,
      analyzedUrl: url,
      pagesAnalyzed: 1 + portfolioContent.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Site audit error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Audit failed',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
