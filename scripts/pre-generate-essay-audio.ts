#!/usr/bin/env tsx

/**
 * PRE-GENERATE ESSAY AUDIO
 *
 * Generate TTS narration for all essays using premium audiobook voices.
 * Run ONCE per essay - users get instant playback forever.
 *
 * Usage: npx tsx scripts/pre-generate-essay-audio.ts
 */

import { put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY!
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

// Premium voices for essay narration
const ESSAY_VOICES = {
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

// Essays to generate audio for
const ESSAYS = [
  {
    id: 'self-esteem',
    title: 'Self-Esteem: Cultivating a Positive Self Image',
    text: `Self-Esteem: Cultivating a Positive Self Image

By Brandon Mills

Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to improved confidence, self-esteem, and a greater sense of self-worth. Here are some strategies you can use to cultivate a positive self-image.

Practice self-compassion. Self-compassion is about treating yourself with the same kindness, concern, and support that you would offer to a good friend. This means being patient and understanding with yourself when things don't go as planned or when you make mistakes. Practice self-compassion by acknowledging your own struggles, failures, and limitations, and by treating yourself with kindness and acceptance.

Practice self-care. Self-care involves taking care of your physical, emotional, and mental health. This can involve things like eating a healthy diet, getting enough sleep, exercising regularly, and engaging in activities that bring you joy and fulfillment. When you take care of yourself, you send a message to yourself that you are worthy of care and attention, which can help boost your self-esteem and self-image.

Focus on your strengths. It's easy to get caught up in your weaknesses and flaws, but focusing on your strengths can help you build a more positive self-image. Make a list of your strengths and accomplishments, and remind yourself of them regularly. When you focus on what you're good at, you're more likely to feel confident and capable.

Surround yourself with positivity. The people and things you surround yourself with can have a big impact on your self-image. Try to spend time with people who uplift and encourage you, and avoid those who bring you down or make you feel bad about yourself. You can also surround yourself with things that bring you joy and positivity, such as music, art, or nature.

Practice positive self-talk. The way you talk to yourself can have a big impact on your self-image. Make an effort to practice positive self-talk by replacing negative thoughts with positive ones. For example, instead of thinking "I can't do this," try thinking "I can do this, I just need to take it one step at a time." Positive self-talk can help you feel more confident and capable, which can in turn help boost your self-image.

Contemplation: Cultivating a positive self-image is a process that takes time and effort, but it's worth it. By practicing self-compassion, self-care, focusing on your strengths, surrounding yourself with positivity, and practicing positive self-talk, you can build a more positive and confident self-image. Remember, the way you see yourself matters, and you have the power to shape that perception.`,
  },
  {
    id: 'social-theory',
    title: 'An Intro to Social Theory by Charles Lamert',
    text: `An Intro to "Social Theory" by Charles Lamert

By Brandon Mills

Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines such as sociology, psychology, anthropology, philosophy, and political science. A social theory textbook covers a wide range of concepts, ideas, and perspectives on society and its functioning. In this article, we will outline some of the most important points from a social theory textbook.

The concept of social structure: One of the key concepts in social theory is social structure. It refers to the patterned social arrangements that shape and guide individual and group behavior. Social structure encompasses various elements such as social institutions, norms, values, roles, and status. Social structure influences how people behave, interact with each other, and make decisions.

The role of power and inequality: Social theory acknowledges the presence of power and inequality in society. Power refers to the ability to influence others and control resources, while inequality refers to the unequal distribution of resources, opportunities, and benefits. Social theorists examine how power and inequality operate in different social contexts and how they affect individual and group behavior.

The significance of culture: Social theory recognizes the importance of culture in shaping individual and collective behavior. Culture refers to the shared beliefs, values, practices, and symbols that define a society. Social theorists explore how culture influences people's attitudes, behaviors, and perceptions of the world around them.

The impact of globalization: Social theory also examines the impact of globalization on society. Globalization refers to the increasing interconnectedness of the world, resulting from advancements in technology, transportation, and communication. Social theorists study how globalization affects different aspects of society such as culture, economics, politics, and social interactions.

The role of social change: Social theory also addresses the question of how society changes over time. Social change refers to the transformation of social structures and relationships over time. Social theorists explore the causes and consequences of social change and how it affects individuals and society as a whole.

The influence of social movements: Social theory also examines the role of social movements in promoting social change. Social movements refer to organized efforts by individuals or groups to bring about social, cultural, or political change. Social theorists explore the dynamics of social movements and how they influence society.

"Social Theory" by Charles Lemert is a comprehensive and accessible introduction to the field of social theory. The book provides a thorough overview of the major schools of thought in social theory, from classical to contemporary perspectives.

Lemert begins the book by discussing the origins of social theory in the Enlightenment, and how it evolved in response to the social and political changes that have occurred over the centuries. He then moves on to discuss the major schools of thought in social theory, including structural-functionalism, conflict theory, symbolic interactionism, and postmodernism. For each school of thought, Lemert explains the key concepts and ideas, as well as the historical and intellectual context in which they emerged.

One of the strengths of "Social Theory" is its emphasis on the practical implications of social theory. Throughout the book, Lemert shows how social theory can be used to better understand the social world and to effect social change. He provides numerous examples of how social theory has been used to analyze and address social problems, from poverty to racial inequality to environmental degradation.

Another strength of the book is its accessibility. Lemert's writing is clear and engaging, and he does an excellent job of making complex ideas and concepts understandable to a general audience. He also includes numerous examples and illustrations to help readers grasp the key concepts and ideas.

While "Social Theory" is primarily an introduction to the field of social theory, it also provides some critical analysis of the limitations and challenges of each school of thought. Lemert acknowledges the critiques and challenges to social theory, including the criticism that it can be overly abstract and detached from real-world concerns. He also notes the ongoing debates and controversies within the field, such as the tension between individualism and collectivism.

Overall, "Social Theory" is an excellent introduction to the field of social theory. It provides a comprehensive overview of the major schools of thought, and it emphasizes the practical implications of social theory for understanding and addressing social problems. Lemert's clear writing and accessible style make this book an ideal resource for students and anyone interested in understanding the social world.`,
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

  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = Buffer.from(arrayBuffer)
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

async function generateEssayAudio(
  essayId: string,
  title: string,
  text: string
): Promise<void> {
  console.log(`\n📝 Essay: ${title}`)
  console.log(`   Text length: ${text.length} characters`)

  const mappings = await loadAudioMappings()

  for (const [voiceKey, voiceData] of Object.entries(ESSAY_VOICES)) {
    console.log(`\n   🎵 Voice: ${voiceData.name}`)

    // Check if already generated
    const existing = mappings.find(
      (m) =>
        m.contentId === essayId &&
        m.voice === voiceKey &&
        m.contentType === 'essay'
    )

    if (existing) {
      console.log(`   ⏭️  Already generated: ${existing.url}`)
      continue
    }

    try {
      // Generate audio
      const audioBuffer = await generateAudio(text, voiceData.id)

      // Upload to blob storage
      const blobPath = `audio/essay/${essayId}/${voiceKey}.mp3`
      const url = await uploadToBlob(audioBuffer, blobPath)

      // Add to mappings
      mappings.push({
        contentId: essayId,
        voice: voiceKey,
        url,
        size: audioBuffer.length,
        generatedAt: new Date().toISOString(),
        contentType: 'essay',
      })

      // Save after each successful generation
      await saveAudioMappings(mappings)
    } catch (error) {
      console.error(`   ❌ Failed for ${voiceKey}:`, error)
    }
  }
}

async function main() {
  console.log('🎬 PRE-GENERATING ESSAY AUDIO\n')
  console.log('============================================================\n')

  const startTime = Date.now()
  let totalGenerated = 0

  for (const essay of ESSAYS) {
    await generateEssayAudio(essay.id, essay.title, essay.text)
    totalGenerated += Object.keys(ESSAY_VOICES).length
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
  const mappings = await loadAudioMappings()
  const essayMappings = mappings.filter((m) => m.contentType === 'essay')
  const totalSize = (
    essayMappings.reduce((sum, m) => sum + m.size, 0) /
    (1024 * 1024)
  ).toFixed(2)

  console.log('\n============================================================')
  console.log('✅ ESSAY AUDIO GENERATION COMPLETE!\n')
  console.log(`📊 Statistics:`)
  console.log(`   Essays processed: ${ESSAYS.length}`)
  console.log(`   Total files: ${essayMappings.length}`)
  console.log(`   Total size: ${totalSize} MB`)
  console.log(`   Time elapsed: ${elapsed} minutes`)
  console.log(`   Mappings saved: ${path.join(process.cwd(), 'data', 'audio-mappings.json')}`)
  console.log('\n🎉 Essays now have instant premium narration!')
  console.log('   Users get audiobook-quality voice with ZERO runtime costs!')
}

main().catch(console.error)
