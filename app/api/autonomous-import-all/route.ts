import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { BRAND_VOICE_PROFILE } from '@/lib/voice-profile'
import fs from 'fs'
import path from 'path'

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
  metaDescription: z.string().describe('SEO meta description, 150-160 characters'),
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

    console.log(`Enhancing post ${postIndex + 1}/${allPosts.length}: ${post.title}`)
    console.log(`Has real content: ${hasRealContent}`)

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

    console.log('Enhanced content generated:', enhanced.title)

    // Now publish to Webflow
    const webflowToken = process.env.WEBFLOW_API_TOKEN
    const collectionId = process.env.WEBFLOW_COLLECTION_ID

    if (!webflowToken || !collectionId) {
      throw new Error('Missing Webflow credentials')
    }

    // Use Squarespace images directly (they're still accessible)
    const mainImageUrl = post.images[0]
    const galleryImageUrls = post.images.slice(1)

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
