import * as fs from 'fs'
import * as path from 'path'
import { JSDOM } from 'jsdom'

interface MediumArticle {
  title: string
  slug: string
  date: string
  content: string
  excerpt: string
  keywords: string[]
  featuredImage?: string
  originalUrl?: string
}

// Category keywords for auto-tagging
const categoryKeywords: Record<string, string[]> = {
  'mental-health': ['mental health', 'therapy', 'anxiety', 'depression', 'psychology', 'emotional', 'wellbeing', 'self-esteem', 'codependency', 'addiction'],
  'philosophy': ['philosophy', 'stoic', 'existential', 'ancient texts', 'wisdom', 'contemplation', 'ethics', 'virtue'],
  'meditation': ['meditation', 'mindfulness', 'breath', 'awareness', 'present moment', 'consciousness'],
  'business': ['startup', 'entrepreneur', 'investor', 'business', 'marketing', 'venture'],
  'science': ['quantum', 'physics', 'biology', 'astronomy', 'research', 'scientific'],
  'technology': ['crypto', 'blockchain', 'AI', 'computing', 'digital', 'technology'],
  'martial-arts': ['martial arts', 'combat', 'fighting', 'warrior', 'discipline', 'training'],
  'personal-growth': ['growth', 'improvement', 'habits', 'productivity', 'success', 'goals', 'learning']
}

function extractKeywords(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase()
  const keywords: string[] = []

  for (const [category, terms] of Object.entries(categoryKeywords)) {
    if (terms.some(term => text.includes(term.toLowerCase()))) {
      keywords.push(category)
    }
  }

  // Add title words as keywords (excluding common words)
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'it', 'its', 'how', 'what', 'why', 'when', 'where', 'who', 'which', 'that', 'this', 'these', 'those', 'your', 'you', 'we', 'i', 'me', 'my', 'our', 'their', 'them']
  const titleWords = title.toLowerCase().split(/[\s\-:,]+/).filter(w => w.length > 3 && !stopWords.includes(w))
  keywords.push(...titleWords.slice(0, 5))

  return [...new Set(keywords)]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function parseDate(filename: string): string {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : new Date().toISOString().split('T')[0]
}

function parseMediumHtml(filepath: string): MediumArticle | null {
  const html = fs.readFileSync(filepath, 'utf-8')
  const dom = new JSDOM(html)
  const doc = dom.window.document

  // Extract title
  const titleEl = doc.querySelector('h1.p-name') || doc.querySelector('h3.graf--title')
  const title = titleEl?.textContent?.trim() || ''
  if (!title) return null

  // Extract content paragraphs
  const paragraphs = doc.querySelectorAll('section[data-field="body"] p.graf')
  const contentParts: string[] = []

  paragraphs.forEach(p => {
    const text = p.textContent?.trim()
    if (text) contentParts.push(text)
  })

  const content = contentParts.join('\n\n')
  if (!content) return null

  // Extract featured image
  const imgEl = doc.querySelector('img.graf-image')
  const featuredImage = imgEl?.getAttribute('src') || undefined

  // Extract excerpt (first paragraph, max 160 chars for SEO)
  const excerpt = contentParts[0]?.slice(0, 160).trim() + '...' || ''

  // Get original URL
  const canonicalEl = doc.querySelector('a.p-canonical')
  const originalUrl = canonicalEl?.getAttribute('href') || undefined

  // Parse filename for date and generate slug
  const filename = path.basename(filepath)
  const date = parseDate(filename)
  const slug = generateSlug(title)

  // Generate keywords
  const keywords = extractKeywords(title, content)

  return {
    title,
    slug,
    date,
    content,
    excerpt,
    keywords,
    featuredImage,
    originalUrl
  }
}

function generateBlogPost(article: MediumArticle): string {
  const keywordsString = article.keywords.map(k => `'${k}'`).join(', ')

  return `import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${article.title.replace(/'/g, "\\'")} | Brandon Mills',
  description: '${article.excerpt.replace(/'/g, "\\'")}',
  keywords: [${keywordsString}],
  openGraph: {
    title: '${article.title.replace(/'/g, "\\'")}',
    description: '${article.excerpt.replace(/'/g, "\\'")}',
    type: 'article',
    publishedTime: '${article.date}',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${article.title.replace(/'/g, "\\'")}',
    description: '${article.excerpt.replace(/'/g, "\\'")}',
  }
}

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {[${keywordsString}].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              ${article.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="${article.date}">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>${Math.ceil(article.content.split(' ').length / 200)} min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            ${article.content.split('\n\n').map(p => `<p className="text-white/80 leading-relaxed mb-6">${p.replace(/'/g, "\\'")}</p>`).join('\n            ')}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {[${keywordsString}].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </main>
  )
}
`
}

async function main() {
  const inputDir = '/private/tmp/medium-export/posts'
  const outputDir = '/Volumes/Super Mastery/Webdesigner/app/blog'

  // Get all HTML files
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.html'))

  console.log(`Found ${files.length} Medium articles to convert`)

  let converted = 0
  let skipped = 0
  const articles: MediumArticle[] = []

  for (const file of files) {
    const filepath = path.join(inputDir, file)
    const article = parseMediumHtml(filepath)

    if (!article) {
      console.log(`⏭️  Skipping ${file} (no content)`)
      skipped++
      continue
    }

    // Skip very short articles
    if (article.content.split(' ').length < 100) {
      console.log(`⏭️  Skipping ${article.title} (too short)`)
      skipped++
      continue
    }

    // Create blog post directory
    const postDir = path.join(outputDir, article.slug)
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true })
    }

    // Generate and write blog post
    const postContent = generateBlogPost(article)
    fs.writeFileSync(path.join(postDir, 'page.tsx'), postContent)

    articles.push(article)
    converted++
    console.log(`✅ Converted: ${article.title} -> /blog/${article.slug}`)
  }

  // Generate blog index data
  const indexData = articles.map(a => ({
    title: a.title,
    slug: a.slug,
    date: a.date,
    excerpt: a.excerpt,
    keywords: a.keywords
  }))

  fs.writeFileSync(
    path.join(outputDir, 'articles.json'),
    JSON.stringify(indexData, null, 2)
  )

  console.log(`\n✨ Done! Converted ${converted} articles, skipped ${skipped}`)
  console.log(`📁 Blog posts created in: ${outputDir}`)
  console.log(`📊 Index saved to: ${outputDir}/articles.json`)
}

main().catch(console.error)
