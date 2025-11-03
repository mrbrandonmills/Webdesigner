import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for long essays

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const category = formData.get('category') as string
    const autoImage = formData.get('autoImage') === 'true'
    const autoPublish = formData.get('autoPublish') === 'true'

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    console.log('Processing voice memo:', audioFile.name, `(${(audioFile.size / 1024 / 1024).toFixed(2)} MB)`)

    // Step 1: Transcribe audio using OpenAI Whisper
    console.log('Transcribing audio...')
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'verbose_json',
    })

    const transcribedText = transcription.text
    const wordCount = transcribedText.split(/\s+/).length

    console.log(`Transcribed ${wordCount} words`)

    // Step 2: Format as professional essay with AI
    console.log('Formatting as essay...')
    const formattingPrompt = `
You are an expert editor helping to transform a voice memo into a polished, professional essay.

The speaker is a cognitive science researcher, model, and actor who explores the intersection of mind, body, and creativity.

Original transcription:
${transcribedText}

Your task:
1. Format this as a well-structured essay with proper paragraphs
2. Fix any grammatical errors or awkward phrasings
3. Add smooth transitions between ideas
4. Maintain the speaker's authentic voice and ideas
5. Organize into logical sections (introduction, body paragraphs, conclusion)
6. Keep the original meaning and insights intact

Return ONLY the formatted essay text, no meta-commentary.
`

    const { text: formattedEssay } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: formattingPrompt,
      maxTokens: 8000,
    })

    // Step 3: Generate title
    console.log('Generating title...')
    const titlePrompt = `
Based on this essay, generate a compelling, thought-provoking title (3-8 words).

Essay:
${formattedEssay.substring(0, 1000)}

Respond with ONLY the title, no quotes or explanation.
`

    const { text: generatedTitle } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: titlePrompt,
    })

    const title = generatedTitle.trim()

    // Step 4: Auto-categorize if not specified
    let finalCategory = category
    if (!category || category === 'auto') {
      const categorizationPrompt = `
Categorize this essay into one of these categories:
- mind: Cognitive science, research, psychology, philosophy
- body: Physical performance, modeling, health, embodiment
- creativity: Acting, creative expression, art
- synthesis: Self-actualization, integration, personal development

Essay title: ${title}
Essay preview: ${formattedEssay.substring(0, 500)}

Respond with ONLY one word: mind, body, creativity, or synthesis.
`

      const { text: categoryResult } = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        prompt: categorizationPrompt,
      })

      finalCategory = categoryResult.trim().toLowerCase()
    }

    // Step 5: Generate SEO meta tags
    console.log('Generating SEO...')
    const seoPrompt = `
Generate SEO meta tags for this essay:

Title: ${title}
Category: ${finalCategory}
Preview: ${formattedEssay.substring(0, 500)}

Generate:
1. A compelling meta description (150-160 characters)
2. 5-8 relevant keywords

Format:
Description: [your description]
Keywords: keyword1, keyword2, keyword3
`

    const { text: seoResult } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: seoPrompt,
    })

    const descriptionMatch = seoResult.match(/Description:\s*(.+)/i)
    const keywordsMatch = seoResult.match(/Keywords:\s*(.+)/i)

    const metaDescription = descriptionMatch?.[1]?.trim() || ''
    const keywords = keywordsMatch?.[1]?.trim() || ''

    // Step 6: Generate excerpt for social sharing
    const excerptPrompt = `
Create a compelling 2-3 sentence excerpt from this essay for social media sharing:

${formattedEssay.substring(0, 800)}

Make it engaging and thought-provoking. Respond with ONLY the excerpt.
`

    const { text: excerpt } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: excerptPrompt,
    })

    // Step 7: Generate visual theme prompt (for future image generation)
    let visualPrompt = ''
    if (autoImage) {
      const visualPromptGeneration = `
Create a DALL-E image generation prompt for this essay:

Title: ${title}
Category: ${finalCategory}
Content: ${formattedEssay.substring(0, 500)}

Generate a detailed image prompt that captures the essay's themes visually.
The style should be: sophisticated, artistic, contemplative, and elegant.

Respond with ONLY the image prompt, no explanation.
`

      const { text: visualPromptResult } = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        prompt: visualPromptGeneration,
      })

      visualPrompt = visualPromptResult.trim()

      // TODO: Actually generate image with DALL-E
      // const imageResponse = await openai.images.generate({
      //   model: 'dall-e-3',
      //   prompt: visualPrompt,
      //   size: '1792x1024',
      //   quality: 'hd',
      // })
    }

    // Step 8: Save content metadata
    const essayData = {
      id: Date.now().toString(),
      title,
      content: formattedEssay,
      excerpt: excerpt.trim(),
      category: finalCategory,
      metaDescription,
      keywords,
      wordCount,
      visualPrompt,
      transcribedText, // Keep original for reference
      createdAt: new Date().toISOString(),
      published: false,
    }

    console.log('Essay processed successfully:', title)

    // Step 9: Auto-publish to Medium (if requested)
    let publishedUrl: string | undefined
    if (autoPublish) {
      console.log('Auto-publishing to Medium...')
      try {
        const mediumResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/publish/medium`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: formattedEssay,
            tags: keywords.split(',').map(k => k.trim()).slice(0, 5),
            publishStatus: 'draft', // Publish as draft first for review
            canonicalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/essays/${essayData.id}`,
          }),
        })

        if (mediumResponse.ok) {
          const mediumData = await mediumResponse.json()
          publishedUrl = mediumData.url
          console.log('✅ Published to Medium:', publishedUrl)
        } else {
          console.error('Medium publish failed:', await mediumResponse.text())
        }
      } catch (error) {
        console.error('Medium publish error:', error)
        // Don't fail the whole request if Medium publish fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...essayData,
        publishedUrl,
      },
      message: `Successfully processed essay: "${title}"${publishedUrl ? ` and published to Medium: ${publishedUrl}` : ''}`,
    })
  } catch (error) {
    console.error('Voice processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
      },
      { status: 500 }
    )
  }
}
