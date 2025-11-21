import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { getMeditationBySlug } from '@/lib/meditations-data'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/meditations/content?slug=morning-mindfulness
 *
 * Returns the full meditation script content from the markdown file.
 * This content is used by the AudioReader after purchase.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Meditation slug is required' },
        { status: 400 }
      )
    }

    const meditation = getMeditationBySlug(slug)
    if (!meditation) {
      return NextResponse.json(
        { error: 'Meditation not found' },
        { status: 404 }
      )
    }

    // Read the meditation content from the markdown file
    // contentFile is like '/content/meditations/01-morning-mindfulness.md'
    const contentPath = path.join(process.cwd(), meditation.contentFile)

    try {
      const rawContent = await readFile(contentPath, 'utf-8')

      // Extract just the script portion (after "## Script" heading)
      const scriptContent = extractScriptContent(rawContent)

      return NextResponse.json({
        slug: meditation.slug,
        title: meditation.title,
        content: scriptContent,
      })
    } catch (fileError) {
      logger.error('Failed to read meditation content file:', { slug, contentPath, error: fileError })
      return NextResponse.json(
        { error: 'Meditation content not available' },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error('Error fetching meditation content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meditation content' },
      { status: 500 }
    )
  }
}

/**
 * Extract the script content from the markdown file.
 * Looks for content after "## Script" heading and before "---" or "**Recording Notes:**"
 */
function extractScriptContent(markdown: string): string {
  // Find the script section
  const scriptMatch = markdown.match(/## Script\s*\n([\s\S]*?)(?=\n---|\*\*Recording Notes:\*\*|$)/)

  if (scriptMatch && scriptMatch[1]) {
    // Clean up the content - remove markdown formatting for audio
    let content = scriptMatch[1].trim()

    // Remove pause indicators for cleaner audio (keep them in for natural pacing)
    // Actually, let's keep the pauses as the TTS can interpret them
    // Remove markdown emphasis markers but keep the text
    content = content.replace(/\*\[([^\]]+)\]\*/g, '[$1]') // Keep pause markers
    content = content.replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    content = content.replace(/\*([^*]+)\*/g, '$1') // Remove italic

    return content
  }

  // Fallback: return everything after the frontmatter
  const lines = markdown.split('\n')
  let inFrontmatter = false
  let contentLines: string[] = []

  for (const line of lines) {
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true
      } else {
        inFrontmatter = false
      }
      continue
    }

    if (!inFrontmatter && line.trim() && !line.startsWith('#') && !line.startsWith('**')) {
      contentLines.push(line)
    }
  }

  return contentLines.join('\n').trim()
}
