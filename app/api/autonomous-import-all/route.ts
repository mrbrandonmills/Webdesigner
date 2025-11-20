import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { BRAND_VOICE_PROFILE } from '@/lib/voice-profile'
import fs from 'fs'
import path from 'path'
import { logger } from '@/lib/logger'

// Increase timeout to 60 seconds (requires Vercel Pro plan)
export const maxDuration = 60

// Portfolio post interface
interface PortfolioPost {
  title: string
  slug: string
  date: string
  status: string
  description: string
  imageCount: number
  images: string[]
  category: string
  excerpt: string
}

// Read all posts from analysis
function getAllPosts(): PortfolioPost[] {
  const allPostsPath = path.join(process.cwd(), 'all-posts.json')
  return JSON.parse(fs.readFileSync(allPostsPath, 'utf-8'))
}

const EnhancedContentSchema = z.object({
  title: z.string().describe('SEO-optimized title (keep original meaning, make compelling)'),
  description: z.string().describe('Enhanced or generated 300-500 word description in therapeutic + renaissance voice'),
  metaDescription: z.string().describe('SEO meta description, EXACTLY 150-160 characters, no more'),
  category: z.enum(['Fashion & Modeling', 'Editorial', 'Portrait', 'Fine Art', 'Personal Work', 'Product', 'Commercial']),
  tags: z.array(z.string()).describe('5-7 relevant tags'),
  seoKeywords: z.array(z.string()).describe('8-12 SEO keywords'),
})

export async function POST(req: NextRequest) {
  try {
    const { postIndex } = await req.json()
    const allPosts = getAllPosts()

    if (postIndex === undefined || postIndex < 0 || postIndex >= allPosts.length) {
      return NextResponse.json(
        { error: `Invalid post index. Must be 0-${allPosts.length - 1}.` },
        { status: 400 }
      )
    }

    const post = allPosts[postIndex]

    // Determine if this post has real content or Lorem ipsum
    const hasRealContent = !post.description.toLowerCase().includes('lorem ipsum')

    logger.info('Enhancing post ${postIndex + 1}/${allPosts.length}: ${post.title}')
    logger.info('Has real content: ${hasRealContent}')

    const enhancementPrompt = hasRealContent
      ? `You are enhancing existing portfolio content for Brandon Mills.

BRAND VOICE PROFILE:
${JSON.stringify(BRAND_VOICE_PROFILE, null, 2)}

ORIGINAL POST:
Title: ${post.title}
Current Description: ${post.description}
Date: ${post.date}
Number of Images: ${post.imageCount}
First 5 Image URLs: ${post.images.slice(0, 5).join('\n')}
Status: ${post.status}

TASK: ENHANCE existing content
The post already has meaningful content. Your job is to:
1. Keep the essence and core message
2. Elevate the language with therapeutic warmth + renaissance sophistication
3. Expand to 300-500 words if needed
4. Remove any generic photography language
5. Apply brand voice consistently
6. Generate compelling SEO metadata

VOICE REQUIREMENTS:
- Therapeutic warmth meets renaissance gentleman sophistication
- Sensorial, present, embodied
- Zero generic AI marketing language
- Avoid ALL: ${BRAND_VOICE_PROFILE.forbidden.join(', ')}

Brandon is: ${BRAND_VOICE_PROFILE.context.identity}
This portfolio demonstrates his multifaceted creative work.
NOT offering services - this is a creative/intellectual showcase.

ENHANCE this post while preserving its unique story.`
      : `You are creating NEW portfolio content for Brandon Mills.

BRAND VOICE PROFILE:
${JSON.stringify(BRAND_VOICE_PROFILE, null, 2)}

POST TO CREATE:
Title: ${post.title}
Number of Images: ${post.imageCount}
First 5 Image URLs: ${post.images.slice(0, 5).join('\n')}
Original Status: ${post.status}
Category Hint: ${post.category}

TASK: GENERATE entirely new content
This post only has Lorem ipsum placeholder text. Create meaningful content based on:
1. The title (what does it suggest?)
2. The number and type of images
3. The category/context
4. Brandon's brand voice

Generate a compelling 300-500 word narrative that:
- Sets the scene (location, atmosphere, sensory details)
- Describes the creative vision or collaboration
- Reflects on the work (not call-to-action)
- Feels authentic to Brandon's multifaceted identity

VOICE REQUIREMENTS:
- Therapeutic warmth meets renaissance gentleman sophistication
- Sensorial, present, embodied
- Zero generic AI marketing language
- Avoid ALL: ${BRAND_VOICE_PROFILE.forbidden.join(', ')}

Brandon is: ${BRAND_VOICE_PROFILE.context.identity}
This is a creative/intellectual portfolio, NOT selling services.

CREATE original content that honors the title and images.`

    const { object: enhanced } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: EnhancedContentSchema,
      prompt: enhancementPrompt,
      temperature: hasRealContent ? 0.7 : 0.8, // More creative for generated content
    })

    logger.info('Enhanced content generated:', { data: enhanced.title })

    // Now publish to Webflow
    const webflowToken = process.env.WEBFLOW_API_TOKEN
    const collectionId = process.env.WEBFLOW_COLLECTION_ID

    if (!webflowToken || !collectionId) {
      throw new Error('Missing Webflow credentials')
    }

    // Use Squarespace images directly (they're still accessible)
    const mainImageUrl = post.images[0]
    const galleryImageUrls = post.images.slice(1)

    // Ensure meta description is exactly 160 chars or less
    const metaDesc = enhanced.metaDescription.length > 160
      ? enhanced.metaDescription.substring(0, 157) + '...'
      : enhanced.metaDescription

    // Map category text to a safe default (skip category if mapping fails)
    // This prevents import failures due to category mismatch
    const categoryMapping: Record<string, string> = {
      'Personal Work': 'ca43f6ee2a73e06c027d3cf0db27be3a', // Found in successful imports
      'Editorial': '0d81fd326bf9222f21f2f78b2e9db807', // Found in successful imports
      'Portrait': 'c7253afa691deb9e46aebd726db56a2a', // Found in successful imports
    }

    // Default to Personal Work if category not mapped
    const webflowCategory = categoryMapping[enhanced.category] || categoryMapping['Personal Work']

    const cmsItemData = {
      fieldData: {
        name: enhanced.title,
        slug: post.slug,
        description: enhanced.description, // Plain string, not rich text
        'meta-description': metaDesc,
        category: webflowCategory, // Use mapped ID instead of text
        tags: enhanced.tags.join(', '),
        'seo-keywords': enhanced.seoKeywords.join(', '),
        'main-image': mainImageUrl,
        'gallery-images': galleryImageUrls.length > 0 ? galleryImageUrls : undefined,
      },
      isDraft: false, // Publish immediately - autonomous!
      isArchived: false,
    }

    logger.info('Publishing to Webflow:', { data: cmsItemData.fieldData.name })

    const webflowResponse = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${webflowToken}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(cmsItemData),
      }
    )

    if (!webflowResponse.ok) {
      const errorData = await webflowResponse.json()
      logger.error('Webflow API error:', errorData)
      throw new Error(`Webflow API error: ${JSON.stringify(errorData)}`)
    }

    const webflowData = await webflowResponse.json()
    logger.info('Published to Webflow successfully:', { data: webflowData })

    return NextResponse.json({
      success: true,
      message: `Successfully imported and published: ${enhanced.title}`,
      post: {
        original: {
          title: post.title,
          hadRealContent: hasRealContent,
          imageCount: post.imageCount,
        },
        enhanced: enhanced,
        webflowId: webflowData.id,
        webflowUrl: `https://brandonmills.webflow.io/current-work/${post.slug}`,
      }
    })

  } catch (error: any) {
    logger.error('Autonomous import error:', error)
    return NextResponse.json(
      {
        error: 'Import failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}

// GET endpoint to show all available posts
export async function GET() {
  const allPosts = getAllPosts()
  return NextResponse.json({
    totalPosts: allPosts.length,
    availablePosts: allPosts.map((post, index) => ({
      index,
      title: post.title,
      imageCount: post.imageCount,
      status: post.status,
      hasRealContent: !post.description.toLowerCase().includes('lorem ipsum'),
      description: post.description.substring(0, 100) + '...',
      date: post.date,
    })),
    usage: `POST with { "postIndex": 0-${allPosts.length - 1} } to import a specific post`,
  })
}
