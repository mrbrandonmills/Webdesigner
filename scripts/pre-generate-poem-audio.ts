#!/usr/bin/env ts-node
/**
 * Pre-generate audio for all poems and upload to Vercel Blob storage
 *
 * This script generates audio files for all poems with all available voices
 * and uploads them to Vercel Blob storage for instant playback.
 *
 * Run: npx ts-node scripts/pre-generate-poem-audio.ts
 *
 * Environment variables required:
 * - CARTESIA_API_KEY: Cartesia AI API key
 * - BLOB_READ_WRITE_TOKEN: Vercel Blob storage token
 */

import { put } from '@vercel/blob'
import * as fs from 'fs'
import * as path from 'path'

// Cartesia voices - Ultra-realistic, soothing English accents perfect for meditation and poetry
const VOICES = {
  male: '63ff761f-c1e8-414b-b969-d1833d1c870c', // Classy British Man
  female: '79a125e8-cd45-4c13-8a67-188112f4dd22', // British Lady
  'male-indian': '846d6cb0-2301-48b6-9683-48f5618ea2f6', // Indian Man
  'female-indian': 'e13cae5c-ec59-4f71-b0a6-266df3c9ea12', // Indian Lady
}

// Poem content
const POEMS = {
  'fine-lines': {
    title: 'Fine Lines',
    content: `Fine Lines - By Brandon Mills

Artists with the front facing persona - it's an illusion
Like how you're "fine" walking Upright with that brain contusion

We lean on singular words with multiple meanings,
but we don't know how to use them.

I'm fine!
Girl, yes you are!
Fine I'll pay the fine

Half of those are abusive

We never get the full picture lost in our confusion
Race, gender, sexuality, people excluded
You fight - your black he's white they're Asian
This shit, much more deep rooted

Another word to work out
Our minds, our bodies, our communities are polluted

minds run Proprietary software
What sells? Not photovoltaic cells
Biology tells a different story about the binary
But without an education, you're more worried about
a job with the refinery
Not the fucking finery

One more time with that one again,
Seemed the ostentatious are always winning,
but you vote them into office - complain after they win

Iceberg baby this shit runs deeper
Deeper then the Mariana trench
Pass the last stop on that ghost train haze creeper
We're in Dante's realm now
Yeah, you can call this heater

Do you mean hot as in heat
or hot as-in spicy?

I mean without gun control I'm talking about under your seat

Calm down just breathe

Why didn't you teach me that when I was five
Year old
Before the anxiety grabbed me by the neck and stabbed me in the chest
Daily, weekly, monthly did I say by the minute
by the fraction of a second and every quantum moment
that lies within it

Hmm listen kid

You can beat the drum but the
The battlefields are different
Watch out for codependence learn to be independent

A mind that can contemplate
a mind that thinks outside of what it's told is useful

Grab a plane ticket, go spend a ruble
Then a rupee, then a yen then a franc,
Then come tell me if that Frank was from France
or from Liechtenstein

And then you can tell me which one you like better
cause you will have seen the world
and your eyes are more open
and brother you can enter`,
  },
  'poet-proponent': {
    title: 'Poet, Proponent',
    content: `Poet, Proponent - By Brandon Mills

My fists these cuffs my mouth rips this cus
Cuz cousin this is our life's sis y fus
but don't fuss too much

That's why your hands are in the man's
pushing back their demands - their scripture, their doctrine.
They're fucking high commands

Yo, I'll take it to my man's 125th St., Harlem barbershop
the agora still stands

Politican finger lickin' we got a thing for this diction -
but what we face is restriction -
covalent bonds in the hood,
and we share atoms with addiction

Psychoanalytic methodologies come from survival - just living
Not college curated

We have phd's before prison

They say 10,000 hours to Master
But Master - that time in your debt
steals the song from the laughter -

I'd rather put that time into plaster
Like a Robert Lugo mash up
and find myself

A poet,
a proponent of my life
from here on after`,
  },
  'the-tourbillon': {
    title: 'The Tourbillon',
    content: `The Tourbillon - By Brandon Mills

Did I take the rope off my neck
just to put it around my wrist?

Inorganic elements
mimic a strangling fig vine
constricting the blood flow
that I thought would set me free

but now—
it is just a weight
around my wrist

A reminder
that even in liberation
we seek to be bound

by something beautiful
by something rare
by something that tells the world:

I am here.
I matter.
I exist within constraints of my own choosing.

The tourbillon spins—
defying gravity,
measuring time with mechanical precision,
while I remain

still

bound

to the physical world.`,
  },
}

interface GenerateOptions {
  poemId: string
  text: string
  voice: keyof typeof VOICES
}

/**
 * Generate audio using Cartesia API
 */
async function generateAudio(options: GenerateOptions): Promise<ArrayBuffer> {
  const { text, voice } = options
  const apiKey = process.env.CARTESIA_API_KEY

  if (!apiKey) {
    throw new Error('CARTESIA_API_KEY environment variable is required')
  }

  const selectedVoiceId = VOICES[voice]

  console.log(`  Calling Cartesia API with voice: ${voice}`)

  const response = await fetch('https://api.cartesia.ai/tts/bytes', {
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
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Cartesia API error: ${response.statusText} - ${errorText}`)
  }

  const audioBuffer = await response.arrayBuffer()

  // Verify it's valid MP3 data
  const uint8Array = new Uint8Array(audioBuffer)
  const isMp3 = uint8Array[0] === 0xFF && (uint8Array[1] & 0xE0) === 0xE0

  if (!isMp3) {
    throw new Error('Invalid MP3 data received from Cartesia API')
  }

  console.log(`  Generated ${audioBuffer.byteLength} bytes of audio`)

  return audioBuffer
}

/**
 * Upload audio to Vercel Blob storage
 */
async function uploadToBlob(
  audioBuffer: ArrayBuffer,
  filename: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required')
  }

  console.log(`  Uploading to Vercel Blob: ${filename}`)

  const blob = await put(filename, audioBuffer, {
    access: 'public',
    token,
    contentType: 'audio/mpeg',
    addRandomSuffix: false,
  })

  console.log(`  Uploaded successfully: ${blob.url}`)

  return blob.url
}

/**
 * Main execution
 */
async function main() {
  console.log('Pre-generating audio for all poems...\n')

  const results: Record<string, Record<string, string>> = {}

  // Generate audio for each poem with each voice
  for (const [poemId, poem] of Object.entries(POEMS)) {
    console.log(`Processing: ${poem.title}`)
    results[poemId] = {}

    for (const voice of Object.keys(VOICES) as (keyof typeof VOICES)[]) {
      console.log(`  Voice: ${voice}`)

      try {
        // Generate audio
        const audioBuffer = await generateAudio({
          poemId,
          text: poem.content,
          voice,
        })

        // Upload to Vercel Blob
        const filename = `poems/${poemId}/${voice}.mp3`
        const blobUrl = await uploadToBlob(audioBuffer, filename)

        results[poemId][voice] = blobUrl

        console.log(`  ✓ Success\n`)
      } catch (error) {
        console.error(`  ✗ Failed: ${error}\n`)
        throw error
      }

      // Add a small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  // Save results to a JSON file
  const outputPath = path.join(__dirname, 'pre-generated-audio-urls.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

  console.log('\n✓ All audio files generated successfully!')
  console.log(`\nResults saved to: ${outputPath}`)
  console.log('\nGenerated URLs:')
  console.log(JSON.stringify(results, null, 2))
}

// Run the script
main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
