import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60 // Allow up to 60 seconds for transcription

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Check file size (max 25MB for Whisper)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large (max 25MB)' },
        { status: 400 }
      )
    }

    // Upload audio to Vercel Blob for storage
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Can make this configurable
      response_format: 'verbose_json',
    })

    return NextResponse.json({
      url: blob.url,
      transcription: transcription.text,
      duration: transcription.duration,
      language: transcription.language,
    })
  } catch (error) {
    logger.error('Transcription error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Transcription failed',
      },
      { status: 500 }
    )
  }
}
