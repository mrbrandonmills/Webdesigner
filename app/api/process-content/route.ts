import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

interface ProcessContentRequest {
  url: string
  fileName: string
  fileType: string
  contentType: 'research' | 'essay' | 'modeling' | 'creative'
  category: string
  title: string
  autoImage: boolean
  autoPublish: boolean
}

export async function POST(request: Request) {
  try {
    const body: ProcessContentRequest = await request.json()
    const { url, fileName, fileType, contentType, category, title, autoImage, autoPublish } = body

    logger.info('Processing content:', { data: { fileName, fileType, contentType } })

    // Step 1: Extract text content from document (if applicable)
    let extractedText = ''
    if (fileType === 'application/pdf' || fileType.includes('word') || fileType === 'text/plain') {
      // For now, we'll handle PDFs and docs in a future update
      // This would require libraries like pdf-parse or mammoth
      extractedText = `[Document uploaded: ${fileName}]`
    }

    // Step 2: Categorize content with AI if not specified
    let finalCategory = category
    if (!category || category === 'auto') {
      const categorizationPrompt = `
You are categorizing content for a portfolio that showcases the intersection of:
- Mind: Cognitive science research and academic work
- Body: Modeling and physical performance
- Creativity: Acting and creative projects
- Synthesis: Self-actualization and personal development

Content type: ${contentType}
File name: ${fileName}
${extractedText ? `Content: ${extractedText.substring(0, 500)}` : ''}

Based on this information, categorize this content into one of: mind, body, creativity, or synthesis.

Respond with ONLY one word: mind, body, creativity, or synthesis.
`

      const { text: categoryResult } = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        prompt: categorizationPrompt,
      })

      finalCategory = categoryResult.trim().toLowerCase()
    }

    // Step 3: Generate title if not provided
    let finalTitle = title
    if (!title) {
      const titlePrompt = `
Generate a compelling title for this content:
Content type: ${contentType}
Category: ${finalCategory}
File name: ${fileName}
${extractedText ? `Preview: ${extractedText.substring(0, 500)}` : ''}

Generate a short, elegant title (3-8 words) that captures the essence of this work.
Respond with ONLY the title, no quotes or explanation.
`

      const { text: titleResult } = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        prompt: titlePrompt,
      })

      finalTitle = titleResult.trim()
    }

    // Step 4: Generate SEO meta tags
    const seoPrompt = `
Generate SEO meta tags for this content:
Title: ${finalTitle}
Category: ${finalCategory}
Type: ${contentType}

Generate:
1. A meta description (150-160 characters)
2. 5-8 relevant keywords

Format:
Description: [your description]
Keywords: keyword1, keyword2, keyword3, etc.
`

    const { text: seoResult } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: seoPrompt,
    })

    const descriptionMatch = seoResult.match(/Description:\s*(.+)/i)
    const keywordsMatch = seoResult.match(/Keywords:\s*(.+)/i)

    const metaDescription = descriptionMatch?.[1]?.trim() || ''
    const keywords = keywordsMatch?.[1]?.trim() || ''

    // Step 5: Generate visual theme (if requested)
    let visualUrl = url // Default to uploaded file if it's an image/video
    if (autoImage && !fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      // TODO: Integrate with image generation API (DALL-E, Midjourney, etc.)
      // For now, we'll skip this and implement in next iteration
      logger.info('Visual generation requested but not yet implemented')
    }

    // Step 6: Save content metadata
    // TODO: Implement database storage (Vercel KV, Postgres, etc.)
    const contentMetadata = {
      id: Date.now().toString(),
      url,
      fileName,
      fileType,
      contentType,
      category: finalCategory,
      title: finalTitle,
      metaDescription,
      keywords,
      visualUrl,
      createdAt: new Date().toISOString(),
      published: false,
    }

    logger.info('Content processed:', { data: contentMetadata })

    // Step 7: Auto-publish to platforms (if requested)
    if (autoPublish) {
      // TODO: Implement Medium, LinkedIn, Instagram posting
      // For now, we'll log it and implement in next iteration
      logger.info('Auto-publish requested but not yet implemented')
    }

    return NextResponse.json({
      success: true,
      data: contentMetadata,
      message: `Successfully processed "${finalTitle}"`,
    })
  } catch (error) {
    logger.error('Content processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
      },
      { status: 500 }
    )
  }
}
