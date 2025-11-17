import { NextRequest, NextResponse } from 'next/server'

// Cartesia voices - Ultra-realistic, soothing English accents perfect for meditation and poetry
const VOICES = {
  male: '63ff761f-c1e8-414b-b969-d1833d1c870c', // Classy British Man - Soothing, sophisticated, perfect for philosophy
  female: '79a125e8-cd45-4c13-8a67-188112f4dd22', // British Lady - Calm, elegant, ideal for poetry
  'male-indian': '846d6cb0-2301-48b6-9683-48f5618ea2f6', // Indian Man - Warm, soothing, meditative quality
  'female-indian': 'e13cae5c-ec59-4f71-b0a6-266df3c9ea12', // Indian Lady - Gentle, calming, spiritual tone
}

export async function POST(request: NextRequest) {
  try {
    const { contentId, text, voice = 'male' } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 })
    }

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
    console.log('Generated audio size:', audioBuffer.byteLength, 'bytes')

    // Verify it's valid MP3 data by checking for either:
    // 1. MP3 frame header (0xFF 0xE0-0xFF) - raw MP3 audio
    // 2. ID3v2 tag header (0x49 0x44 0x33 = "ID3") - MP3 with metadata
    const uint8Array = new Uint8Array(audioBuffer)
    const hasMp3FrameHeader = uint8Array[0] === 0xFF && (uint8Array[1] & 0xE0) === 0xE0
    const hasId3Tag = uint8Array[0] === 0x49 && uint8Array[1] === 0x44 && uint8Array[2] === 0x33
    const isValidMp3 = hasMp3FrameHeader || hasId3Tag

    console.log('Valid MP3 format:', {
      hasMp3FrameHeader,
      hasId3Tag,
      isValid: isValidMp3
    })

    if (!isValidMp3) {
      console.error('Invalid MP3 data received from Cartesia API')
      console.error('First 10 bytes:', Array.from(uint8Array.slice(0, 10)).map(b => `0x${b.toString(16)}`).join(' '))
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
    console.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio', details: String(error) },
      { status: 500 }
    )
  }
}
