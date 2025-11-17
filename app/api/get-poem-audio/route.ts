import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * Get pre-generated audio URLs for poems and meditations
 * Audio files are pre-generated via: npx tsx scripts/pre-generate-all-audio.ts
 * URLs are stored in: data/audio-mappings.json
 */

interface AudioMapping {
  contentId: string
  voice: string
  url: string
  size: number
  generatedAt: string
}

let audioMappings: AudioMapping[] | null = null

function loadAudioMappings(): AudioMapping[] {
  if (audioMappings) return audioMappings

  try {
    const mappingsPath = path.join(process.cwd(), 'data/audio-mappings.json')
    const data = fs.readFileSync(mappingsPath, 'utf-8')
    audioMappings = JSON.parse(data)
    return audioMappings!
  } catch (error) {
    console.warn('Audio mappings file not found. Run: npx tsx scripts/pre-generate-all-audio.ts')
    return []
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const contentId = searchParams.get('contentId')
  const voice = searchParams.get('voice') || 'male'

  if (!contentId) {
    return NextResponse.json({ error: 'contentId is required' }, { status: 400 })
  }

  // Load pre-generated audio mappings
  const mappings = loadAudioMappings()

  // Find matching audio URL
  const audioMapping = mappings.find(
    m => m.contentId === contentId && m.voice === voice
  )

  if (audioMapping) {
    return NextResponse.json({
      audioUrl: audioMapping.url,
      preGenerated: true,
      contentId,
      voice,
      size: audioMapping.size,
      generatedAt: audioMapping.generatedAt,
    })
  }

  // No pre-generated audio available
  return NextResponse.json({
    audioUrl: null,
    preGenerated: false,
    message: 'No pre-generated audio available. Use on-demand generation.',
  })
}
