import { NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getBrandVoiceDirective } from '@/lib/voice-profile'

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

    // Build style-aware prompt with custom voice profile
    const brandVoiceDirective = getBrandVoiceDirective()

    let styleSection = ''
    if (styleGuide) {
      styleSection = `
${brandVoiceDirective}

ADDITIONAL SITE-SPECIFIC STYLE GUIDE (from brandonmills.com analysis):
You have been given a custom voice directive above. Use these specific patterns from the site analysis to enhance authenticity:

Writing Style:
- Tone: ${styleGuide.writingStyle.tone}
- Voice: ${styleGuide.writingStyle.voice}
- Sentence Structure: ${styleGuide.writingStyle.sentenceStructure}
- Vocabulary patterns: ${styleGuide.writingStyle.vocabulary.slice(0, 10).join(', ')}
- Example phrases: ${styleGuide.writingStyle.examplePhrases.slice(0, 3).map((p: string) => `"${p}"`).join(', ')}

Content Patterns:
- Titles: ${styleGuide.contentPatterns.titleStyle}
- Descriptions: ${styleGuide.contentPatterns.descriptionStyle}
- Captions: ${styleGuide.contentPatterns.captionStyle}
- SEO: ${styleGuide.contentPatterns.seoApproach}

Brand Personality:
- Values: ${styleGuide.brandPersonality.values.join(', ')}
- Target Audience: ${styleGuide.brandPersonality.targetAudience}
- Emotional Tone: ${styleGuide.brandPersonality.emotionalTone}
- Unique Aspects: ${styleGuide.brandPersonality.uniqueSellingPoints.join(', ')}

Professional Context:
- Identity: Fashion Model, Actor, Author, Cognitive Researcher, Student, AI Engineer
- NOT selling: Photography services, modeling services, or any commercial services
- Location: ${styleGuide.businessInfo.location}
- Creative/Academic Specialties: ${styleGuide.businessInfo.specialties.join(', ')}

CRITICAL: Combine the custom brand voice directive above with these site-specific patterns. The therapeutic + renaissance gentleman voice takes priority.
`
    } else {
      styleSection = brandVoiceDirective
    }

    // Create the prompt for Claude
    const prompt = `You are writing portfolio content for Brandon Mills: fashion model, actor, author, cognitive researcher, student, and AI engineer.

This is a CREATIVE AND INTELLECTUAL PORTFOLIO showcasing multifaceted work—NOT a business selling services.

${transcription ? `BRANDON'S VOICE NOTES:\n${transcription}\n\n` : ''}

You are creating content for ${photoUrls.length} photo${photoUrls.length > 1 ? 's' : ''} to showcase in the portfolio section.

${styleSection}

CONTENT REQUIREMENTS:
1. **Title** (40-55 characters): Evocative but not clickbait. Invites discovery. No generic photographer/model marketing.
2. **Description** (2-3 sentences): Create atmosphere, invite feeling. Peer-to-peer tone, sharing work not selling services.
3. **Photo Captions** (1 thoughtful sentence each): Add context or invite deeper looking. Use voice notes if provided.
4. **Alt Text**: Descriptive for accessibility but maintain sophistication.
5. **Tags** (5-8 thoughtful tags): Specific and relevant, no keyword stuffing.
6. **SEO Keywords** (4-6 primary keywords): Organic from content, not forced.
7. **Category**: Choose from: Portrait, Fashion, Product, Editorial, Fine Art, Personal Work, Commercial, Other

CRITICAL REMINDERS:
- This is a creative/intellectual portfolio for a model, actor, researcher, student, author, AI engineer
- NOT selling photography, modeling, or any commercial services
- Therapeutic warmth + renaissance gentleman sophistication
- Write like a thoughtful researcher/creative, not an AI or marketing agency
- Zero tolerance for: "stunning", "amazing", "capture your story", "hire me" language
- Quality over flash. Invitation over instruction. Depth over hype.
- Balance performance (modeling/acting) with intellect (research/study) and creativity (writing/photography) and technology (AI)

Generate content that feels authentically human, intellectually curious, and genuinely sophisticated.`

    // Generate structured content using Claude
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'), // Latest Claude Sonnet 4.5
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
