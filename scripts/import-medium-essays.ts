/**
 * Import Medium essays from HTML export
 *
 * Parses Medium export HTML files and generates essay data for the website
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { JSDOM } from 'jsdom'

interface Essay {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
}

async function parseHTMLFile(filePath: string): Promise<Essay | null> {
  try {
    const html = await readFile(filePath, 'utf-8')
    const dom = new JSDOM(html)
    const doc = dom.window.document

    // Extract metadata from filename: 2019-05-24_Title-Here-abc123.html
    const filename = path.basename(filePath, '.html')
    const parts = filename.split('_')
    const date = parts[0] // 2019-05-24
    const titleAndId = parts.slice(1).join('_')
    const lastDash = titleAndId.lastIndexOf('-')
    const id = titleAndId.substring(lastDash + 1)
    const titleSlug = titleAndId.substring(0, lastDash)

    // Extract title from <h1> or <title>
    const h1 = doc.querySelector('h1')
    const titleTag = doc.querySelector('title')
    const title = h1?.textContent || titleTag?.textContent || titleSlug.replace(/-/g, ' ')

    // Extract content from <section>
    const section = doc.querySelector('section')
    if (!section) {
      console.warn(`No content section found in ${filename}`)
      return null
    }

    const content = section.innerHTML

    // Extract first paragraph for excerpt
    const firstPara = section.querySelector('p')
    const excerpt = firstPara?.textContent?.substring(0, 200) || ''

    // Calculate read time (approx 200 words/min)
    const wordCount = section.textContent?.split(/\s+/).length || 0
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`

    // Generate clean slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60)

    // Categorize based on keywords in title
    let category = 'Philosophy'
    const titleLower = title.toLowerCase()
    if (titleLower.includes('mental health') || titleLower.includes('codependency') || titleLower.includes('self-esteem')) {
      category = 'Psychology'
    } else if (titleLower.includes('start-up') || titleLower.includes('business') || titleLower.includes('investor')) {
      category = 'Business'
    } else if (titleLower.includes('quantum') || titleLower.includes('technology')) {
      category = 'Technology'
    } else if (titleLower.includes('book') || titleLower.includes('harvard classics')) {
      category = 'Literature'
    } else if (titleLower.includes('history') || titleLower.includes('roman')) {
      category = 'History'
    }

    return {
      id,
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content,
      date,
      readTime,
      category,
      tags: []
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

async function importEssays() {
  const mediumExportDir = '/tmp/medium-export/posts'

  console.log('🔍 Scanning Medium export directory...\n')

  const files = await readdir(mediumExportDir)
  const htmlFiles = files.filter(f => f.endsWith('.html') && !f.startsWith('draft_'))

  console.log(`Found ${htmlFiles.length} published essays\n`)

  const essays: Essay[] = []

  for (const file of htmlFiles) {
    const filePath = path.join(mediumExportDir, file)
    const essay = await parseHTMLFile(filePath)

    if (essay) {
      essays.push(essay)
      console.log(`✅ ${essay.title} (${essay.date})`)
    }
  }

  // Sort by date (newest first)
  essays.sort((a, b) => b.date.localeCompare(a.date))

  console.log(`\n📝 Parsed ${essays.length} essays\n`)

  // Generate TypeScript data file
  const dataFile = `/**
 * Medium Essays Database
 *
 * Auto-generated from Medium export
 * Last updated: ${new Date().toISOString().split('T')[0]}
 */

export interface Essay {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
}

export const mediumEssays: Essay[] = ${JSON.stringify(essays, null, 2)}

export function getEssayBySlug(slug: string): Essay | undefined {
  return mediumEssays.find(essay => essay.slug === slug)
}

export function getEssaysByCategory(category: string): Essay[] {
  return mediumEssays.filter(essay => essay.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(mediumEssays.map(e => e.category)))
}
`

  const outputPath = '/Volumes/Super Mastery/Webdesigner/data/medium-essays.ts'
  await writeFile(outputPath, dataFile, 'utf-8')

  console.log(`✅ Generated ${outputPath}`)
  console.log(`\nCategories:`)
  const categories = getAllCategories(essays)
  categories.forEach(cat => {
    const count = essays.filter(e => e.category === cat).length
    console.log(`  - ${cat}: ${count} essays`)
  })
}

function getAllCategories(essays: Essay[]): string[] {
  return Array.from(new Set(essays.map(e => e.category)))
}

// Run import
importEssays().catch(console.error)
