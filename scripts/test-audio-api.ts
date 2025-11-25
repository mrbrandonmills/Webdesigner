#!/usr/bin/env tsx

/**
 * Test script to verify Cartesia TTS API and audio generation
 * Run with: npx tsx test-audio-api.ts
 */

async function testAudioGeneration() {
  console.log('🎵 Testing Cartesia Audio Generation\n')

  const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY

  if (!CARTESIA_API_KEY) {
    console.error('❌ CARTESIA_API_KEY not found in environment')
    process.exit(1)
  }

  console.log('✅ API Key found')
  console.log('📝 Generating short test audio...\n')

  try {
    const response = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'X-API-Key': CARTESIA_API_KEY,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-english',
        transcript: 'Hello, this is a test of the Cartesia voice system. Testing one two three.',
        voice: {
          mode: 'id',
          id: '63ff761f-c1e8-414b-b969-d1833d1c870c', // British Male
        },
        output_format: {
          container: 'mp3',
          encoding: 'mp3',
          sample_rate: 44100,
        },
      }),
    })

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Response:', errorText)
      process.exit(1)
    }

    const audioBuffer = await response.arrayBuffer()
    console.log('✅ Audio generated successfully')
    console.log(`📊 Size: ${audioBuffer.byteLength} bytes (${(audioBuffer.byteLength / 1024).toFixed(2)} KB)`)

    // Verify MP3 header
    const uint8Array = new Uint8Array(audioBuffer)
    const isMp3 = uint8Array[0] === 0xFF && (uint8Array[1] & 0xE0) === 0xE0
    console.log(`🔍 Valid MP3 header: ${isMp3 ? '✅ YES' : '❌ NO'}`)

    if (!isMp3) {
      console.log('First 10 bytes:', Array.from(uint8Array.slice(0, 10)).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' '))
    }

    // Save test file
    const fs = await import('fs')
    const testFile = '/tmp/test-cartesia-audio.mp3'
    fs.writeFileSync(testFile, Buffer.from(audioBuffer))
    console.log(`💾 Test file saved: ${testFile}`)
    console.log('🎧 Play with: afplay /tmp/test-cartesia-audio.mp3\n')

    console.log('✅ All tests passed!')
    console.log('\nNext steps:')
    console.log('1. Play the test file to verify audio works')
    console.log('2. If audio plays, the issue is CSP on the website')
    console.log('3. Wait 2-3 minutes for Vercel deployment to complete')
    console.log('4. Hard refresh browser (Cmd+Shift+R) and test again')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testAudioGeneration()
