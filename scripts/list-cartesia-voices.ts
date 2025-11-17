#!/usr/bin/env tsx

/**
 * Fetch all available Cartesia voices to choose the best ones
 * Run with: npx tsx scripts/list-cartesia-voices.ts
 */

async function listCartesiaVoices() {
  const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY

  if (!CARTESIA_API_KEY) {
    console.error('❌ CARTESIA_API_KEY not found')
    process.exit(1)
  }

  console.log('🎤 Fetching Cartesia voices...\n')

  try {
    const response = await fetch('https://api.cartesia.ai/voices', {
      method: 'GET',
      headers: {
        'X-API-Key': CARTESIA_API_KEY,
        'Cartesia-Version': '2024-06-10',
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Found voices:\n')

    // Filter for English voices with descriptive names
    const englishVoices = data.filter((v: any) => v.language === 'en')

    // Group by male/female if possible
    const maleVoices = englishVoices.filter((v: any) =>
      v.name.toLowerCase().includes('man') ||
      v.name.toLowerCase().includes('male') ||
      v.description?.toLowerCase().includes('male')
    )

    const femaleVoices = englishVoices.filter((v: any) =>
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('lady') ||
      v.name.toLowerCase().includes('female') ||
      v.description?.toLowerCase().includes('female')
    )

    console.log('=== MALE VOICES (Deep, Smooth, Storytelling) ===\n')
    maleVoices.forEach((voice: any) => {
      console.log(`Name: ${voice.name}`)
      console.log(`ID: ${voice.id}`)
      if (voice.description) console.log(`Description: ${voice.description}`)
      console.log('---')
    })

    console.log('\n=== FEMALE VOICES (Warm, Soothing, Maternal) ===\n')
    femaleVoices.forEach((voice: any) => {
      console.log(`Name: ${voice.name}`)
      console.log(`ID: ${voice.id}`)
      if (voice.description) console.log(`Description: ${voice.description}`)
      console.log('---')
    })

    console.log('\n=== ALL ENGLISH VOICES ===\n')
    englishVoices.forEach((voice: any) => {
      console.log(`${voice.name} (${voice.id})`)
    })

    console.log(`\n📊 Total voices: ${data.length}`)
    console.log(`📊 English voices: ${englishVoices.length}`)

  } catch (error) {
    console.error('❌ Error fetching voices:', error)
    process.exit(1)
  }
}

listCartesiaVoices()
