import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import OpenAI from 'openai'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for batch processing

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CollectionData {
  id: string
  type: 'modeling' | 'acting' | 'web-video'
  title: string
  description: string
  vibe: string
  location?: string
  style?: string
  keywords: string[]
  files: {
    url: string
    type: 'image' | 'video'
    filename: string
    size: number
  }[]
  voiceMemo?: {
    url: string
    transcription: string
  }
  createdAt: string
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const audioFile = formData.get('audio') as File | null
    const collectionType = formData.get('type') as 'modeling' | 'acting' | 'web-video'
    const userProvidedTitle = formData.get('title') as string | null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    logger.info('Processing ${files.length} files for ${collectionType} collection')

    // Step 1: Upload all files to Vercel Blob
    logger.info('Uploading files to storage...')
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const filename = `${collectionType}/${Date.now()}-${file.name}`
        const blob = await put(filename, file, {
          access: 'public',
        })

        return {
          url: blob.url,
          type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
          filename: file.name,
          size: file.size,
        }
      })
    )

    // Step 2: Process voice memo if provided
    let voiceMemoData: CollectionData['voiceMemo'] | undefined
    let transcription = ''

    if (audioFile) {
      logger.info('Transcribing voice memo...')
      const whisperResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
        response_format: 'verbose_json',
      })

      transcription = whisperResponse.text
      logger.info('Transcribed ${transcription.split(/\s+/).length} words')

      // Upload voice memo to storage
      const audioFilename = `${collectionType}/voice-memos/${Date.now()}-${audioFile.name}`
      const audioBlob = await put(audioFilename, audioFile, {
        access: 'public',
      })

      voiceMemoData = {
        url: audioBlob.url,
        transcription,
      }
    }

    // Step 3: Use AI to generate collection metadata
    logger.info('Generating collection metadata...')

    const fileTypes = uploadedFiles.map(f => f.type).join(', ')
    const hasVideo = uploadedFiles.some(f => f.type === 'video')
    const hasImages = uploadedFiles.some(f => f.type === 'image')

    const metadataPrompt = `
You are analyzing a ${collectionType} content collection to generate metadata.

${hasImages ? `Image count: ${uploadedFiles.filter(f => f.type === 'image').length}` : ''}
${hasVideo ? `Video count: ${uploadedFiles.filter(f => f.type === 'video').length}` : ''}
${transcription ? `Voice memo transcription:\n${transcription}` : 'No voice description provided.'}
${userProvidedTitle ? `User provided title: "${userProvidedTitle}"` : ''}

Based on the content type and voice memo, generate:

1. **Title**: ${userProvidedTitle || 'A compelling, professional collection title (3-6 words)'}
2. **Description**: A 1-2 sentence description of this collection
3. **Vibe**: The overall mood/aesthetic in 2-4 words (e.g., "Moody editorial noir", "Bright commercial energy")
4. **Location**: Where this was shot (if mentioned), or leave blank
5. **Style**: The creative style/genre (e.g., "High fashion editorial", "Character headshots", "Hero background")
6. **Keywords**: 5-8 relevant keywords for search/filtering

Context based on collection type:
${collectionType === 'modeling' ? '- This is a modeling photoshoot collection\n- Focus on fashion, editorial style, brand partnerships\n- Keywords should include style, mood, aesthetic' : ''}
${collectionType === 'acting' ? '- This is acting performance content\n- Focus on character work, roles, theatrical performance\n- Keywords should include performance type, character traits' : ''}
${collectionType === 'web-video' ? '- This is web content for the portfolio site\n- Focus on purpose (hero video, background, showcase)\n- Keywords should include usage context' : ''}

Respond in this exact format:
Title: [title here]
Description: [description here]
Vibe: [vibe here]
Location: [location or leave blank]
Style: [style here]
Keywords: keyword1, keyword2, keyword3, keyword4, keyword5
`

    const { text: metadataResult } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: metadataPrompt,
      maxTokens: 1000,
    })

    // Parse AI response
    const titleMatch = metadataResult.match(/Title:\s*(.+)/i)
    const descriptionMatch = metadataResult.match(/Description:\s*(.+)/i)
    const vibeMatch = metadataResult.match(/Vibe:\s*(.+)/i)
    const locationMatch = metadataResult.match(/Location:\s*(.+)/i)
    const styleMatch = metadataResult.match(/Style:\s*(.+)/i)
    const keywordsMatch = metadataResult.match(/Keywords:\s*(.+)/i)

    const collection: CollectionData = {
      id: Date.now().toString(),
      type: collectionType,
      title: titleMatch?.[1]?.trim() || userProvidedTitle || 'Untitled Collection',
      description: descriptionMatch?.[1]?.trim() || '',
      vibe: vibeMatch?.[1]?.trim() || '',
      location: locationMatch?.[1]?.trim() || undefined,
      style: styleMatch?.[1]?.trim() || '',
      keywords: keywordsMatch?.[1]?.split(',').map(k => k.trim()) || [],
      files: uploadedFiles,
      voiceMemo: voiceMemoData,
      createdAt: new Date().toISOString(),
    }

    // Step 4: Detect video type if applicable (reel vs clip)
    if (hasVideo) {
      const videoFiles = uploadedFiles.filter(f => f.type === 'video')
      videoFiles.forEach(file => {
        const sizeInMB = file.size / 1024 / 1024
        // Rough heuristic: files over 50MB or certain naming patterns suggest reels
        const likelyReel = sizeInMB > 50 || file.filename.toLowerCase().includes('reel')
        logger.info('Log message', { template: `Video ${file.filename}: ${sizeInMB.toFixed(2)}MB - ${likelyReel ? 'REEL' : 'CLIP'}` })
      })
    }

    logger.info('Log message', { template: `✅ Collection created: "${collection.title}"` })

    // TODO: Save collection to database
    // For now, return the collection data
    // In production, you'd save this to your database (Supabase, MongoDB, etc.)

    return NextResponse.json({
      success: true,
      data: collection,
      message: `Successfully created ${collectionType} collection: "${collection.title}"`,
    })
  } catch (error) {
    logger.error('Collection upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    )
  }
}
