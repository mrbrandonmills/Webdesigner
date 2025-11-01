import { NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 60

const ContentSchema = z.object({
  title: z.string().describe('SEO-optimized gallery title (50-60 characters)'),
  slug: z.string().describe('URL-friendly slug'),
  description: z.string().describe('Compelling 2-3 sentence description'),
  metaDescription: z.string().describe('SEO meta description (150-160 characters)'),
  tags: z.array(z.string()).describe('Relevant tags/keywords (5-10 tags)'),
  photos: z.array(
    z.object({
      caption: z.string().describe('Photo caption (1-2 sentences)'),
      alt: z.string().describe('Descriptive alt text for accessibility'),
    })
  ),
  seoKeywords: z.array(z.string()).describe('Primary SEO keywords'),
  category: z.string().describe('Content category (e.g., Portrait, Wedding, Product, etc.)'),
})

export async function POST(request: Request) {
  try {
    const { transcription, photoUrls, styleGuide } = await request.json()

    if (!photoUrls || photoUrls.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      )
    }

    // Build style-aware prompt
    let styleSection = ''
    if (styleGuide) {
      styleSection = `
BRAND STYLE GUIDE (CRITICAL - FOLLOW EXACTLY):
You MUST write in this photographer's unique voice and style. This is not generic content - it must sound authentically like them.

Writing Style:
- Tone: ${styleGuide.writingStyle.tone}
- Voice: ${styleGuide.writingStyle.voice}
- Sentence Structure: ${styleGuide.writingStyle.sentenceStructure}
- Use vocabulary like: ${styleGuide.writingStyle.vocabulary.slice(0, 10).join(', ')}
- Example phrases they use: ${styleGuide.writingStyle.examplePhrases.slice(0, 3).map((p: string) => `"${p}"`).join(', ')}

Content Patterns:
- Titles: ${styleGuide.contentPatterns.titleStyle}
- Descriptions: ${styleGuide.contentPatterns.descriptionStyle}
- Captions: ${styleGuide.contentPatterns.captionStyle}
- SEO: ${styleGuide.contentPatterns.seoApproach}

Brand Personality:
- Values: ${styleGuide.brandPersonality.values.join(', ')}
- Target Audience: ${styleGuide.brandPersonality.targetAudience}
- Emotional Tone: ${styleGuide.brandPersonality.emotionalTone}
- Unique Selling Points: ${styleGuide.brandPersonality.uniqueSellingPoints.join(', ')}

Business Context:
- Services: ${styleGuide.businessInfo.services.join(', ')}
- Location: ${styleGuide.businessInfo.location}
- Specialties: ${styleGuide.businessInfo.specialties.join(', ')}

IMPORTANT: Match their existing style EXACTLY. Use their vocabulary, tone, and patterns. Don't be generic!
`
    } else {
      styleSection = `
STYLE GUIDELINES (Generic - run site audit for better results):
- Professional yet approachable tone
- Focus on storytelling and emotion
- Highlight unique aspects of the shoot
- Use industry-standard photography terminology
- Make it compelling for potential clients
`
    }

    // Create the prompt for Claude
    const prompt = `You are a professional photography content creator and SEO expert. Generate compelling, SEO-optimized content for a photography gallery.

${transcription ? `PHOTOGRAPHER'S NOTES:\n${transcription}\n\n` : ''}

You are creating content for ${photoUrls.length} photo${photoUrls.length > 1 ? 's' : ''}.

${styleSection}

REQUIREMENTS:
1. Title: Create an engaging, SEO-optimized title (50-60 characters)
2. Description: Write a compelling 2-3 sentence description that captures the essence of the shoot
3. Photo Captions: Write unique captions for each photo (if transcription mentions specific details, use them)
4. Alt Text: Create descriptive, accessibility-friendly alt text for each image
5. Tags: Generate 5-10 relevant tags/keywords
6. SEO: Extract primary SEO keywords
7. Category: Determine the most appropriate category

Generate the content now. Remember to match the photographer's unique voice!`

    // Generate structured content using Claude
    const { object } = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: ContentSchema,
      prompt,
      temperature: 0.7,
    })

    // Ensure we have captions for all photos
    // If fewer captions than photos, duplicate/adapt the last caption
    while (object.photos.length < photoUrls.length) {
      const lastPhoto = object.photos[object.photos.length - 1]
      object.photos.push({
        caption: lastPhoto.caption,
        alt: `${lastPhoto.alt} - variation`,
      })
    }

    // Trim if we generated too many
    object.photos = object.photos.slice(0, photoUrls.length)

    return NextResponse.json(object)
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Content generation failed',
      },
      { status: 500 }
    )
  }
}
