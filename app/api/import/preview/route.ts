import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * Parse Squarespace XML and CSV exports
 * Returns preview of what will be imported
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const xmlFile = formData.get('xml') as File | null
    const csvFile = formData.get('csv') as File | null

    const result: any = {
      portfolioItems: [],
      products: [],
    }

    // Parse XML (Squarespace portfolio export)
    if (xmlFile) {
      const xmlText = await xmlFile.text()
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      })

      const xmlData = parser.parse(xmlText)

      // WordPress export format (what Squarespace uses)
      const items = xmlData.rss?.channel?.item || []
      const itemsArray = Array.isArray(items) ? items : [items]

      result.portfolioItems = itemsArray
        .filter((item: any) => item) // Filter out empty items
        .map((item: any) => ({
          title: item.title || 'Untitled',
          description: item.description || item['content:encoded'] || '',
          content: item['content:encoded'] || item.description || '',
          date: item.pubDate || item['wp:post_date'] || new Date().toISOString(),
          category: item.category || 'Uncategorized',
          images: extractImages(item['content:encoded'] || item.description || ''),
          slug: createSlug(item.title || 'untitled'),
        }))
    }

    // Parse CSV (product export)
    if (csvFile) {
      const csvText = await csvFile.text()
      const lines = csvText.split('\n').filter(line => line.trim())

      if (lines.length > 1) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

        result.products = lines.slice(1).map(line => {
          const values = parseCSVLine(line)
          const product: any = {}

          headers.forEach((header, idx) => {
            product[header.toLowerCase().replace(/\s+/g, '-')] = values[idx] || ''
          })

          return product
        })
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: `Preview failed: ${error}` },
      { status: 500 }
    )
  }
}

/**
 * Extract image URLs from HTML content
 */
function extractImages(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const images: string[] = []
  let match

  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1])
  }

  return images
}

/**
 * Create URL-friendly slug
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  values.push(current.trim())
  return values
}
