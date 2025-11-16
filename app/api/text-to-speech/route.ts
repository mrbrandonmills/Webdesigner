import { NextRequest, NextResponse } from 'next/server'
import Cartesia from '@cartesia/cartesia-js'

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

    // Get audio data
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`

    return NextResponse.json({
      audioUrl,
      contentId,
      voice,
      duration: null, // Will be set by the audio element
    })
  } catch (error) {
    console.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio', details: String(error) },
      { status: 500 }
    )
  }
}
