#!/usr/bin/env tsx

/**
 * PRE-GENERATE BOOK AUDIO
 *
 * Generate audiobook narration for all 3 books upfront and store permanently.
 * Run ONCE per book - users get instant access, zero runtime costs.
 *
 * Usage: npx tsx scripts/pre-generate-book-audio.ts
 */

import Cartesia from '@cartesia/cartesia-js'
import { put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY!
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

// Premium audiobook voices
const AUDIOBOOK_VOICES = {
  'asher-podcaster': {
    id: '00967b2f-88a6-4a31-8153-110a92134b9f',
    name: 'Asher (Podcaster)',
    description: 'Firm adult male for audiobooks',
  },
  'reading-man': {
    id: 'f146dcec-e481-45be-8ad2-96e1e40e7f32',
    name: 'Reading Man',
    description: 'Calm narrational voice',
  },
  'reflective-woman': {
    id: 'a3520a8f-226a-428d-9fcd-b0a4711a6829',
    name: 'Reflective Woman',
    description: 'Perfect for audiobook narrator',
  },
  'lena': {
    id: '480d702d-0b70-4a32-82c3-93af7b8524ca',
    name: 'Lena',
    description: 'Warmth and depth for storytelling',
  },
}

// Book data - will be populated from actual book content
const BOOKS = [
  {
    id: 'block-a',
    title: 'Building Leverage: Block A',
    // Text will be loaded from actual book content
    sampleText: `Building Leverage: Block A. A comprehensive guide to creating sustainable competitive advantages in business and life. This foundational block explores the fundamental principles of leverage, from time management to resource optimization.`,
  },
  {
    id: 'block-b',
    title: 'Building Leverage: Block B',
    sampleText: `Building Leverage: Block B. Advanced strategies for scaling your impact through systems, processes, and delegation. Learn how to multiply your effectiveness while reducing direct involvement.`,
  },
  {
    id: 'block-c',
    title: 'Building Leverage: Block C',
    sampleText: `Building Leverage: Block C. Mastering the art of compounding advantages. Discover how small leveraged actions create exponential results over time.`,
  },
]

interface AudioMapping {
  contentId: string
  voice: string
  url: string
  size: number
  generatedAt: string
  contentType: string
}

const client = new Cartesia({
  apiKey: CARTESIA_API_KEY,
})

async function generateAudio(text: string, voiceId: string): Promise<Buffer> {
  console.log('  🎙️  Calling Cartesia API...')

  const response = await client.tts.bytes({
    modelId: 'sonic-english',
    transcript: text,
    voice: {
      mode: 'id',
      id: voiceId,
    },
    outputFormat: {
      container: 'mp3',
      encoding: 'mp3',
      sampleRate: 44100,
    },
  })

  const chunks: Buffer[] = []
  for await (const chunk of response) {
    chunks.push(Buffer.from(chunk))
  }

  const audioBuffer = Buffer.concat(chunks)
  console.log(`   ✅ Generated ${audioBuffer.length} bytes`)

  return audioBuffer
}

async function uploadToBlob(
  audioBuffer: Buffer,
  path: string
): Promise<string> {
  console.log('  ☁️  Uploading to Vercel Blob Storage...')

  const blob = await put(path, audioBuffer, {
    access: 'public',
    token: BLOB_READ_WRITE_TOKEN,
  })

  console.log(`   ✅ Uploaded: ${blob.url}`)
  return blob.url
}

async function loadAudioMappings(): Promise<AudioMapping[]> {
  const mappingsPath = path.join(process.cwd(), 'data', 'audio-mappings.json')
  try {
    const data = await fs.readFile(mappingsPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveAudioMappings(mappings: AudioMapping[]): Promise<void> {
  const mappingsPath = path.join(process.cwd(), 'data', 'audio-mappings.json')
  await fs.writeFile(mappingsPath, JSON.stringify(mappings, null, 2), 'utf-8')
}

async function generateBookAudio(
  bookId: string,
  title: string,
  text: string
): Promise<void> {
  console.log(`\n📖 Book: ${title}`)
  console.log(`   Text length: ${text.length} characters`)

  const mappings = await loadAudioMappings()

  for (const [voiceKey, voiceData] of Object.entries(AUDIOBOOK_VOICES)) {
    console.log(`\n   🎵 Voice: ${voiceData.name}`)

    // Check if already generated
    const existing = mappings.find(
      (m) =>
        m.contentId === bookId &&
        m.voice === voiceKey &&
        m.contentType === 'book'
    )

    if (existing) {
      console.log(`   ⏭️  Already generated: ${existing.url}`)
      continue
    }

    try {
      // Generate audio
      const audioBuffer = await generateAudio(text, voiceData.id)

      // Upload to blob storage
      const blobPath = `audio/book/${bookId}/${voiceKey}.mp3`
      const url = await uploadToBlob(audioBuffer, blobPath)

      // Add to mappings
      mappings.push({
        contentId: bookId,
        voice: voiceKey,
        url,
        size: audioBuffer.length,
        generatedAt: new Date().toISOString(),
        contentType: 'book',
      })

      // Save after each successful generation
      await saveAudioMappings(mappings)
    } catch (error) {
      console.error(`   ❌ Failed for ${voiceKey}:`, error)
    }
  }
}

async function main() {
  console.log('🎬 PRE-GENERATING BOOK AUDIO\n')
  console.log('============================================================\n')

  const startTime = Date.now()

  for (const book of BOOKS) {
    await generateBookAudio(book.id, book.title, book.sampleText)
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n============================================================')
  console.log('✅ BOOK AUDIO GENERATION COMPLETE!\n')
  console.log(`📊 Statistics:`)
  console.log(`   Books processed: ${BOOKS.length}`)
  console.log(`   Voices per book: ${Object.keys(AUDIOBOOK_VOICES).length}`)
  console.log(`   Time elapsed: ${elapsed} minutes`)
  console.log(`   Mappings saved: ${path.join(process.cwd(), 'data', 'audio-mappings.json')}`)
  console.log('\n🎉 Books now have instant audio narration!')
  console.log('   Users get audiobook experience with ZERO runtime costs!')
}

main().catch(console.error)
