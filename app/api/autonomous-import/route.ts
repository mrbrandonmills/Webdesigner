import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { BRAND_VOICE_PROFILE } from '@/lib/voice-profile'
import fs from 'fs'
import path from 'path'

// Read portfolio content dynamically
function getPortfolioContent() {
  const portfolioContentPath = path.join(process.cwd(), 'portfolio-content.json')
  return JSON.parse(fs.readFileSync(portfolioContentPath, 'utf-8'))
}

const EnhancedContentSchema = z.object({
  title: z.string().describe('SEO-optimized title (keep original meaning, make compelling)'),
  description: z.string().describe('Enhanced 300-500 word description in therapeutic + renaissance voice'),
  metaDescription: z.string().describe('SEO meta description, 150-160 characters'),
  category: z.enum(['Fashion & Modeling', 'Editorial', 'Portrait', 'Fine Art', 'Personal Work', 'Product', 'Commercial']),
  tags: z.array(z.string()).describe('5-7 relevant tags'),
  seoKeywords: z.array(z.string()).describe('8-12 SEO keywords'),
})

export async function POST(req: NextRequest) {
  try {
    const { postIndex } = await req.json()
    const portfolioContent = getPortfolioContent()

    if (postIndex === undefined || postIndex < 0 || postIndex >= portfolioContent.length) {
      return NextResponse.json(
        { error: 'Invalid post index. Must be 0-3.' },
        { status: 400 }
      )
    }

    const post = portfolioContent[postIndex]

    // Enhance content with Claude using brand voice
    console.log(`Enhancing content for: ${post.title}`)

    const enhancementPrompt = `You are writing enhanced portfolio content for Brandon Mills.

BRAND VOICE PROFILE:
${JSON.stringify(BRAND_VOICE_PROFILE, null, 2)}

ORIGINAL POST:
Title: ${post.title}
Current Description: ${post.description}
Date: ${post.date}
Number of Images: ${post.imageCount}
First 5 Image URLs: ${post.images.join('\n')}

TASK:
Enhance this portfolio post with the following requirements:

1. VOICE & TONE:
   - Therapeutic warmth meets renaissance gentleman sophistication
   - Sensorial, present, embodied
   - Zero generic AI marketing language
   - Avoid ALL forbidden patterns: ${BRAND_VOICE_PROFILE.forbidden.join(', ')}

2. CONTENT STRUCTURE:
   - Opening: Set the scene (location, atmosphere, sensory details)
   - Middle: Collaboration details, creative vision, embodiment
   - Closing: Reflection or resonance (not call-to-action)
   - 300-500 words total

3. IDENTITY CONTEXT:
   Brandon is: ${BRAND_VOICE_PROFILE.context.identity}
   This portfolio demonstrates his multifaceted creative work
   NOT offering services - this is a creative/intellectual showcase

4. SEO REQUIREMENTS:
   - Optimize for: fashion modeling, editorial photography, creative collaboration
   - Natural keyword integration (never forced)
   - Meta description: compelling preview that honors the voice

ENHANCE this post while preserving its essence and elevating it with your unique voice.`

    const { object: enhanced } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: EnhancedContentSchema,
      prompt: enhancementPrompt,
      temperature: 0.8, // More creative for content
    })

    console.log('Enhanced content generated:', enhanced)

    // Now publish to Webflow
    const webflowToken = process.env.WEBFLOW_API_TOKEN
    const collectionId = process.env.WEBFLOW_COLLECTION_ID

    if (!webflowToken || !collectionId) {
      throw new Error('Missing Webflow credentials')
    }

    // Use Squarespace images directly (they're already optimized)
    const mainImageUrl = post.images[0]
    const galleryImageUrls = post.images.slice(1) // Rest of images in gallery

    // Create rich text description for Webflow
    const richTextDescription = {
      root: {
        type: 'root',
        children: enhanced.description.split('\n\n').map(paragraph => ({
          type: 'paragraph',
          children: [{ type: 'text', text: paragraph }]
        }))
      }
    }

    const cmsItemData = {
      fieldData: {
        name: enhanced.title,
        slug: post.slug,
        description: richTextDescription,
        'meta-description': enhanced.metaDescription,
        category: enhanced.category,
        tags: enhanced.tags.join(', '),
        'seo-keywords': enhanced.seoKeywords.join(', '),
        'main-image': mainImageUrl,
        'gallery-images': galleryImageUrls.length > 0 ? galleryImageUrls : undefined,
      },
      isDraft: false, // Publish immediately - autonomous!
      isArchived: false,
    }

    console.log('Publishing to Webflow:', cmsItemData.fieldData.name)

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
      console.error('Webflow API error:', errorData)
      throw new Error(`Webflow API error: ${JSON.stringify(errorData)}`)
    }

    const webflowData = await webflowResponse.json()
    console.log('Published to Webflow successfully:', webflowData)

    return NextResponse.json({
      success: true,
      message: `Successfully imported and published: ${enhanced.title}`,
      post: {
        original: post,
        enhanced: enhanced,
        webflowId: webflowData.id,
        webflowUrl: `https://brandonmills.webflow.io/current-work/${post.slug}`,
      }
    })

  } catch (error: any) {
    console.error('Autonomous import error:', error)
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

// GET endpoint to show available posts
export async function GET() {
  const portfolioContent = getPortfolioContent()
  return NextResponse.json({
    availablePosts: portfolioContent.map((post, index) => ({
      index,
      title: post.title,
      imageCount: post.imageCount,
      description: post.description,
      date: post.date,
    })),
    usage: 'POST with { "postIndex": 0-3 } to import a specific post',
  })
}
