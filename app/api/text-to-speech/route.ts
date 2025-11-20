import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TextToSpeechSchema, formatZodErrors } from '@/lib/validations'
import { logger } from '@/lib/logger'

// Cartesia voices - Premium storytelling voices for meditation, poetry, and narration
// Chosen for depth, warmth, and soothing quality (like David Attenborough, Barry White, Denzel Washington, Deepak Chopra)
const VOICES = {
  male: 'f114a467-c40a-4db8-964d-aaba89cd08fa', // Miles - Yogi: Deep, soothing mature male perfect for guidance and meditation
  female: '03496517-369a-4db1-8236-3d3ae459ddf7', // Calypso - ASMR Lady: Soothing female for meditations and calming narration
  'male-indian': '1259b7e3-cb8a-43df-9446-30971a46b8b0', // Devansh - Warm Support Agent: Warm, conversational Indian male (Deepak Chopra vibe)
  'female-indian': 'd7e54830-4754-4b17-952c-bcdb7e80a2fb', // Mabel - Grandma: Friendly, grandmotherly female for empathetic storytelling
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validationResult = TextToSpeechSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { contentId, text, voice } = validationResult.data

    // Check if we have Cartesia API key
    const apiKey = process.env.CARTESIA_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        error: 'Cartesia API key not configured',
        message: 'Please add CARTESIA_API_KEY to environment variables',
      }, { status: 500 })
    }

    const selectedVoiceId = VOICES[voice as keyof typeof VOICES] || VOICES.male

    // Call Cartesia API
    const response = await fetch(
      'https://api.cartesia.ai/tts/bytes',
      {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Cartesia-Version': '2024-06-10',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: 'sonic-english',
          transcript: text,
          voice: {
            mode: 'id',
            id: selectedVoiceId,
          },
          output_format: {
            container: 'mp3',
            encoding: 'mp3',
            sample_rate: 44100,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Cartesia API error: ${response.statusText}`)
    }

    // Get audio data as binary
    const audioBuffer = await response.arrayBuffer()

    // Log audio size for debugging
    logger.info('Generated audio size', { bytes: audioBuffer.byteLength })

    // Verify it's valid MP3 data by checking for either:
    // 1. MP3 frame header (0xFF 0xE0-0xFF) - raw MP3 audio
    // 2. ID3v2 tag header (0x49 0x44 0x33 = "ID3") - MP3 with metadata
    const uint8Array = new Uint8Array(audioBuffer)
    const hasMp3FrameHeader = uint8Array[0] === 0xFF && (uint8Array[1] & 0xE0) === 0xE0
    const hasId3Tag = uint8Array[0] === 0x49 && uint8Array[1] === 0x44 && uint8Array[2] === 0x33
    const isValidMp3 = hasMp3FrameHeader || hasId3Tag

    logger.info('Valid MP3 format:', { data: {
      hasMp3FrameHeader,
      hasId3Tag,
      isValid: isValidMp3
    } })

    if (!isValidMp3) {
      logger.error('Invalid MP3 data received from Cartesia API')
      logger.error('First 10 bytes:', Array.from(uint8Array.slice(0, 10)).map(b => `0x${b.toString(16)}`).join(' '))
      throw new Error('Invalid audio format received')
    }

    // Return raw audio data as binary response instead of base64
    // This is more efficient and avoids localStorage size limits
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error) {
    logger.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio', details: String(error) },
      { status: 500 }
    )
  }
}
