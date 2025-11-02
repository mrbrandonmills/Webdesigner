import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for bulk import

/**
 * Process and import preview data to Webflow CMS
 * This handles bulk import of portfolio items and products
 */
export async function POST(request: Request) {
  try {
    const { portfolioItems, products } = await request.json()

    const webflowToken = process.env.WEBFLOW_API_TOKEN
    const collectionId = process.env.WEBFLOW_COLLECTION_ID

    if (!webflowToken || !collectionId) {
      return NextResponse.json(
        { error: 'Webflow not configured. Please add WEBFLOW_API_TOKEN and WEBFLOW_COLLECTION_ID environment variables.' },
        { status: 400 }
      )
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Import portfolio items to Webflow CMS
    if (portfolioItems && portfolioItems.length > 0) {
      for (const item of portfolioItems) {
        try {
          // Create CMS item in Webflow using SAME format as working publish route
          const fieldData: Record<string, any> = {
            name: item.title,
            slug: item.slug,
            description: stripHTML(item.content),
            'meta-description': truncate(stripHTML(item.description || item.content), 160),
            category: 'Fine Art', // Default category
            tags: item.category || '',
            'seo-keywords': item.category || '',
          }

          // Include Squarespace image URLs (they'll still work as external URLs)
          if (item.images && item.images.length > 0) {
            fieldData['main-image'] = item.images[0]
          }
          if (item.images && item.images.length > 1) {
            fieldData['gallery-images'] = item.images
          }

          const cmsItemData = {
            fieldData,
            isDraft: true, // Import as drafts for review
            isArchived: false,
          }

          console.log(`Importing: ${item.title}`, {
            images: item.images?.length || 0,
            hasMainImage: !!cmsItemData.fieldData['main-image'],
            hasGallery: !!cmsItemData.fieldData['gallery-images'],
          })

          const response = await fetch(
            `https://api.webflow.com/v2/collections/${collectionId}/items`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${webflowToken}`,
                'Content-Type': 'application/json',
                accept: 'application/json',
              },
              body: JSON.stringify(cmsItemData),
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`Webflow API error for "${item.title}":`, errorText)
            throw new Error(`Webflow API error: ${response.status} - ${errorText}`)
          }

          const createdItem = await response.json()
          console.log(`✓ Imported: ${item.title} (ID: ${createdItem.id})`)
          results.imported++
        } catch (error) {
          results.failed++
          results.errors.push(`Failed to import "${item.title}": ${error}`)
          console.error(`Import error for ${item.title}:`, error)
        }

        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    // TODO: Import products (requires separate product collection or store setup)
    // For now, we'll skip product import until Webflow store is configured

    return NextResponse.json({
      success: true,
      imported: results.imported,
      failed: results.failed,
      errors: results.errors,
      message: `Imported ${results.imported} items successfully${results.failed > 0 ? `, ${results.failed} failed` : ''}`,
    })
  } catch (error) {
    console.error('Import process error:', error)
    return NextResponse.json(
      { error: `Import failed: ${error}` },
      { status: 500 }
    )
  }
}

/**
 * Remove HTML tags from text
 */
function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

/**
 * Truncate text to max length
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}
