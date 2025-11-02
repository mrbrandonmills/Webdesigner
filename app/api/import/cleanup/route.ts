import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for cleanup

/**
 * Delete all draft items from Webflow CMS
 * This cleans up broken/test imports
 */
export async function POST(request: Request) {
  try {
    const { confirm } = await request.json()

    if (!confirm) {
      return NextResponse.json(
        { error: 'Confirmation required. Pass { confirm: true } to delete all drafts.' },
        { status: 400 }
      )
    }

    const webflowToken = process.env.WEBFLOW_API_TOKEN
    const collectionId = process.env.WEBFLOW_COLLECTION_ID

    if (!webflowToken || !collectionId) {
      return NextResponse.json(
        { error: 'Webflow not configured' },
        { status: 400 }
      )
    }

    const results = {
      deleted: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Fetch all items from collection
    console.log('Fetching all items from Webflow collection...')

    const listResponse = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${webflowToken}`,
          accept: 'application/json',
        },
      }
    )

    if (!listResponse.ok) {
      const error = await listResponse.text()
      throw new Error(`Failed to fetch items: ${listResponse.status} - ${error}`)
    }

    const { items } = await listResponse.json()
    console.log(`Found ${items.length} total items`)

    // Filter for draft items
    const draftItems = items.filter((item: any) => item.isDraft === true)
    console.log(`Found ${draftItems.length} draft items to delete`)

    // Delete each draft item
    for (const item of draftItems) {
      try {
        console.log(`Deleting: ${item.fieldData?.name || item.id}`)

        const deleteResponse = await fetch(
          `https://api.webflow.com/v2/collections/${collectionId}/items/${item.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${webflowToken}`,
              accept: 'application/json',
            },
          }
        )

        if (!deleteResponse.ok) {
          const error = await deleteResponse.text()
          throw new Error(`Delete failed: ${deleteResponse.status} - ${error}`)
        }

        console.log(`✓ Deleted: ${item.fieldData?.name || item.id}`)
        results.deleted++

        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to delete "${item.fieldData?.name || item.id}": ${error}`)
        console.error(`Delete error:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      deleted: results.deleted,
      failed: results.failed,
      errors: results.errors,
      message: `Deleted ${results.deleted} draft items${results.failed > 0 ? `, ${results.failed} failed` : ''}`,
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: `Cleanup failed: ${error}` },
      { status: 500 }
    )
  }
}
