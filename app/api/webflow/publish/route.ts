import { NextResponse } from 'next/server'
import { convertToWebflowHTML } from '@/lib/webflow-richtext'

export const runtime = 'nodejs'
export const maxDuration = 60

interface PublishRequest {
  content: {
    title: string
    slug: string
    description: string
    metaDescription: string
    tags: string[]
    photos: Array<{
      caption: string
      alt: string
    }>
    seoKeywords: string[]
    category: string
  }
  photos: Array<{
    id: string
    url: string
    optimizedUrl?: string
  }>
  draft: boolean
}

export async function POST(request: Request) {
  try {
    const { content, photos, draft }: PublishRequest = await request.json()

    const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN
    const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID
    const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID

    if (!WEBFLOW_API_TOKEN || !WEBFLOW_SITE_ID || !WEBFLOW_COLLECTION_ID) {
      return NextResponse.json(
        {
          error: 'Webflow configuration missing. Please set WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID, and WEBFLOW_COLLECTION_ID environment variables.',
        },
        { status: 500 }
      )
    }

    // Prepare image assets for Webflow
    const imageAssets = photos.map(photo => ({
      url: photo.optimizedUrl || photo.url,
      alt: content.photos[photos.indexOf(photo)]?.alt || '',
    }))

    // Convert description to rich text HTML format
    const richTextDescription = convertToWebflowHTML(content.description)

    // Prepare multi-image gallery URLs
    const galleryImageUrls = imageAssets.map(img => img.url)

    // Create CMS item in Webflow API v2 format
    const cmsItemData = {
      fieldData: {
        name: content.title,
        slug: content.slug,
        // FEATURE 2: Rich text formatting for descriptions
        description: richTextDescription,
        'meta-description': content.metaDescription,
        category: content.category,
        tags: content.tags.join(', '),
        'seo-keywords': content.seoKeywords.join(', '),
        // Main hero image (first photo)
        'main-image': imageAssets[0]?.url || '',
        // FEATURE 1: Multiple image gallery support
        'multi-gallery': galleryImageUrls.length > 1 ? galleryImageUrls : undefined,
      },
      isDraft: draft,
      isArchived: false,
    }

    // Remove undefined fields
    Object.keys(cmsItemData.fieldData).forEach(key => {
      if (cmsItemData.fieldData[key as keyof typeof cmsItemData.fieldData] === undefined) {
        delete cmsItemData.fieldData[key as keyof typeof cmsItemData.fieldData]
      }
    })

    console.log('Creating Webflow item with data:', JSON.stringify(cmsItemData, null, 2))

    // Create the item via Webflow API v2
    const createResponse = await fetch(
      `https://api.webflow.com/v2/collections/${WEBFLOW_COLLECTION_ID}/items`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(cmsItemData),
      }
    )

    if (!createResponse.ok) {
      const errorData = await createResponse.text()
      console.error('Webflow API error:', errorData)
      throw new Error(`Webflow API error: ${createResponse.status} - ${errorData}`)
    }

    const createdItem = await createResponse.json()

    // If publishing live (not draft), trigger site publish
    if (!draft) {
      const publishResponse = await fetch(
        `https://api.webflow.com/v2/sites/${WEBFLOW_SITE_ID}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            customDomains: [],
          }),
        }
      )

      if (!publishResponse.ok) {
        console.error('Site publish warning:', await publishResponse.text())
        // Don't fail the whole request if publish fails
      }
    }

    // FEATURE 4: n8n Social Media Auto-Posting
    // Trigger n8n workflow for social media distribution (if published live)
    if (!draft && process.env.N8N_WEBHOOK_URL) {
      try {
        const n8nPayload = {
          title: content.title,
          description: content.description,
          category: content.category,
          tags: content.tags,
          images: imageAssets.map(img => ({
            url: img.url,
            alt: img.alt,
          })),
          webflowUrl: `https://${WEBFLOW_SITE_ID}.webflow.io`, // Update with actual domain
          itemId: createdItem.id,
          timestamp: new Date().toISOString(),
        }

        console.log('Triggering n8n workflow for social media posting...')

        const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n8nPayload),
        })

        if (n8nResponse.ok) {
          console.log('n8n workflow triggered successfully')
        } else {
          console.error('n8n webhook failed:', await n8nResponse.text())
          // Don't fail the whole request if n8n fails
        }
      } catch (n8nError) {
        console.error('Error triggering n8n webhook:', n8nError)
        // Non-blocking - social media posting is optional
      }
    }

    return NextResponse.json({
      success: true,
      itemId: createdItem.id,
      draft,
      message: draft ? 'Draft saved successfully' : 'Published successfully',
      socialMediaQueued: !draft && !!process.env.N8N_WEBHOOK_URL,
    })
  } catch (error) {
    console.error('Webflow publish error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Publishing failed',
      },
      { status: 500 }
    )
  }
}
