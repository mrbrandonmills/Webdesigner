#!/usr/bin/env tsx

/**
 * Pre-generate ALL audio files for instant playback
 *
 * Generates audio for:
 * - 3 poems × 4 voices = 12 files
 * - 10 meditations × 4 voices = 40 files
 * - 1 research paper × 4 voices = 4 files
 * Total: 56 audio files
 *
 * Uploads to Vercel Blob Storage for instant loading
 *
 * Run with: npx tsx scripts/pre-generate-all-audio.ts
 */

import { put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

const VOICES = {
  male: 'f114a467-c40a-4db8-964d-aaba89cd08fa', // Miles - Yogi
  female: '03496517-369a-4db1-8236-3d3ae459ddf7', // Calypso - ASMR Lady
  'male-indian': '1259b7e3-cb8a-43df-9446-30971a46b8b0', // Devansh - Warm Support
  'female-indian': 'd7e54830-4754-4b17-952c-bcdb7e80a2fb', // Mabel - Grandma
}

interface AudioMapping {
  contentId: string
  voice: string
  url: string
  size: number
  generatedAt: string
}

const mappings: AudioMapping[] = []

async function generateAudio(text: string, voiceId: string): Promise<Buffer> {
  console.log('  🎙️  Calling Cartesia API...')

  const response = await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST',
    headers: {
      'X-API-Key': CARTESIA_API_KEY!,
      'Cartesia-Version': '2024-06-10',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: 'sonic-english',
      transcript: text,
      voice: {
        mode: 'id',
        id: voiceId,
      },
      output_format: {
        container: 'mp3',
        encoding: 'mp3',
        sample_rate: 44100,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Cartesia API error: ${response.status} ${response.statusText}`)
  }

  const audioBuffer = await response.arrayBuffer()
  return Buffer.from(audioBuffer)
}

async function uploadToBlob(buffer: Buffer, fileName: string): Promise<string> {
  console.log('  ☁️  Uploading to Vercel Blob Storage...')

  const blob = await put(fileName, buffer, {
    access: 'public',
    token: BLOB_READ_WRITE_TOKEN,
  })

  return blob.url
}

async function extractPoemText(poemSlug: string): Promise<string> {
  const pagePath = path.join(process.cwd(), `app/writing/poetry/${poemSlug}/page.tsx`)
  const content = await fs.readFile(pagePath, 'utf-8')

  // Extract textContent from the file
  const match = content.match(/const textContent = `([\s\S]*?)`/)
  if (!match) {
    throw new Error(`Could not extract text content from ${poemSlug}`)
  }

  return match[1].trim()
}

async function extractMeditationText(meditationFile: string): Promise<string> {
  const filePath = path.join(process.cwd(), `content/meditations/${meditationFile}`)
  const content = await fs.readFile(filePath, 'utf-8')

  // Remove markdown frontmatter and formatting, keep only the script text
  const scriptMatch = content.match(/## Script\n\n([\s\S]*?)(?:\n---|\n##|$)/)
  if (!scriptMatch) {
    // If no script section, just remove the metadata and use everything
    return content
      .replace(/^---[\s\S]*?---\n/, '') // Remove frontmatter
      .replace(/^#.*$/gm, '') // Remove headers
      .replace(/\*\[.*?\]\*/g, '') // Remove pause markers
      .trim()
  }

  return scriptMatch[1]
    .replace(/\*\[.*?\]\*/g, '') // Remove pause markers like *[Pause 3 seconds]*
    .replace(/^#{1,6}\s+.*$/gm, '') // Remove any remaining headers
    .trim()
}

async function extractResearchText(researchSlug: string): Promise<string> {
  const pagePath = path.join(process.cwd(), `app/writing/research/${researchSlug}/page.tsx`)
  const content = await fs.readFile(pagePath, 'utf-8')

  // Extract textContent from the file
  const match = content.match(/const textContent = `([\s\S]*?)`/)
  if (!match) {
    throw new Error(`Could not extract text content from ${researchSlug}`)
  }

  return match[1].trim()
}

async function processContent(contentId: string, text: string, type: 'poem' | 'meditation' | 'research') {
  console.log(`\n📝 ${type === 'poem' ? 'Poem' : type === 'meditation' ? 'Meditation' : 'Research Paper'}: ${contentId}`)
  console.log(`   Text length: ${text.length} characters`)

  for (const [voiceKey, voiceId] of Object.entries(VOICES)) {
    console.log(`\n   🎵 Voice: ${voiceKey}`)

    try {
      // Generate audio
      const audioBuffer = await generateAudio(text, voiceId)
      console.log(`   ✅ Generated ${audioBuffer.length} bytes`)

      // Upload to blob storage
      const fileName = `audio/${type}/${contentId}/${voiceKey}.mp3`
      const url = await uploadToBlob(audioBuffer, fileName)
      console.log(`   ✅ Uploaded: ${url}`)

      // Save mapping
      mappings.push({
        contentId,
        voice: voiceKey,
        url,
        size: audioBuffer.length,
        generatedAt: new Date().toISOString(),
      })

      // Rate limit: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))

    } catch (error) {
      console.error(`   ❌ Failed for ${voiceKey}:`, error)
    }
  }
}

async function main() {
  console.log('🎬 PRE-GENERATING ALL AUDIO FILES\n')
  console.log('=' .repeat(60))

  if (!CARTESIA_API_KEY) {
    console.error('❌ CARTESIA_API_KEY not found')
    process.exit(1)
  }

  if (!BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not found')
    process.exit(1)
  }

  const startTime = Date.now()

  // POEMS
  console.log('\n📖 GENERATING POEM AUDIO\n')
  const poems = ['fine-lines', 'poet-proponent', 'the-tourbillon']

  for (const poemSlug of poems) {
    const text = await extractPoemText(poemSlug)
    await processContent(poemSlug, text, 'poem')
  }

  // MEDITATIONS
  console.log('\n\n🧘 GENERATING MEDITATION AUDIO\n')
  const meditations = [
    { file: '01-morning-mindfulness.md', id: 'morning-mindfulness' },
    { file: '02-deep-sleep.md', id: 'deep-sleep' },
    { file: '03-anxiety-relief.md', id: 'anxiety-relief' },
    { file: '04-self-actualization.md', id: 'self-actualization' },
    { file: '05-body-scan-pain.md', id: 'body-scan-pain' },
    { file: '06-confidence-power.md', id: 'confidence-power' },
    { file: '07-loving-kindness.md', id: 'loving-kindness' },
    { file: '08-creative-unblocking.md', id: 'creative-unblocking' },
    { file: '09-grief-loss.md', id: 'grief-loss' },
    { file: '10-entrepreneurial-mindset.md', id: 'entrepreneurial-mindset' },
  ]

  for (const { file, id } of meditations) {
    const text = await extractMeditationText(file)
    await processContent(id, text, 'meditation')
  }

  // RESEARCH PAPERS
  console.log('\n\n📚 GENERATING RESEARCH PAPER AUDIO\n')
  const researchPapers = ['quantum-coherence']

  for (const researchSlug of researchPapers) {
    const text = await extractResearchText(researchSlug)
    await processContent(researchSlug, text, 'research')
  }

  // Save mappings
  const mappingsFile = path.join(process.cwd(), 'data/audio-mappings.json')
  await fs.mkdir(path.dirname(mappingsFile), { recursive: true })
  await fs.writeFile(mappingsFile, JSON.stringify(mappings, null, 2))

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(60))
  console.log('✅ GENERATION COMPLETE!\n')
  console.log(`📊 Statistics:`)
  console.log(`   Total files: ${mappings.length}`)
  console.log(`   Total size: ${(mappings.reduce((sum, m) => sum + m.size, 0) / 1024 / 1024).toFixed(2)} MB`)
  console.log(`   Time elapsed: ${elapsed} minutes`)
  console.log(`   Mappings saved: ${mappingsFile}`)
  console.log('\n🎉 All audio pre-generated and uploaded to Vercel Blob Storage!')
  console.log('   Users will now experience INSTANT playback with no generation wait!\n')
}

main().catch(console.error)
