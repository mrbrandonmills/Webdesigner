import { NextResponse } from 'next/server'

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

    // Create CMS item in Webflow API v2 format
    const cmsItemData = {
      fieldData: {
        name: content.title,
        slug: content.slug,
        description: content.description,
        'meta-description': content.metaDescription,
        category: content.category,
        tags: content.tags.join(', '),
        'seo-keywords': content.seoKeywords.join(', '),
        'main-image': imageAssets[0]?.url || '', // Main image URL
      },
      isDraft: draft,
      isArchived: false,
    }

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

    return NextResponse.json({
      success: true,
      itemId: createdItem.id,
      draft,
      message: draft ? 'Draft saved successfully' : 'Published successfully',
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
