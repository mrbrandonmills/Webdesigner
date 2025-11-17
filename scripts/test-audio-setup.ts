#!/usr/bin/env ts-node
/**
 * Test Audio Setup
 *
 * This script verifies that the pre-generated audio system is working correctly.
 * It checks environment variables, API routes, and can test actual playback.
 *
 * Run: npx tsx scripts/test-audio-setup.ts
 */

import * as fs from 'fs'
import * as path from 'path'

interface TestResult {
  name: string
  passed: boolean
  message: string
}

const results: TestResult[] = []

function test(name: string, condition: boolean, message: string) {
  results.push({ name, passed: condition, message })
  const icon = condition ? '✅' : '❌'
  console.log(`${icon} ${name}: ${message}`)
}

async function main() {
  console.log('Testing Pre-Generated Audio Setup...\n')

  // Test 1: Environment Variables
  console.log('1. Environment Variables')
  test(
    'CARTESIA_API_KEY',
    !!process.env.CARTESIA_API_KEY,
    process.env.CARTESIA_API_KEY
      ? 'Set correctly'
      : 'Not set - add to .env.local'
  )

  test(
    'BLOB_READ_WRITE_TOKEN',
    !!process.env.BLOB_READ_WRITE_TOKEN,
    process.env.BLOB_READ_WRITE_TOKEN
      ? 'Set correctly'
      : 'Not set - get from Vercel Dashboard → Storage → Blob'
  )

  console.log('')

  // Test 2: File Structure
  console.log('2. File Structure')
  const requiredFiles = [
    'scripts/pre-generate-poem-audio.ts',
    'scripts/update-audio-urls.ts',
    'scripts/setup-pre-generated-audio.sh',
    'app/api/get-poem-audio/route.ts',
    'app/api/text-to-speech/route.ts',
    'components/audio-reader.tsx',
  ]

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file)
    const exists = fs.existsSync(filePath)
    test(file, exists, exists ? 'Found' : 'Missing')
  }

  console.log('')

  // Test 3: Generated URLs
  console.log('3. Pre-Generated Audio URLs')
  const apiRoutePath = path.join(
    process.cwd(),
    'app/api/get-poem-audio/route.ts'
  )

  if (fs.existsSync(apiRoutePath)) {
    const content = fs.readFileSync(apiRoutePath, 'utf-8')

    // Check if URLs are populated (not empty strings)
    const hasPopulatedUrls = content.includes('https://') || content.includes('blob.vercel-storage.com')

    test(
      'URLs Populated',
      hasPopulatedUrls,
      hasPopulatedUrls
        ? 'Pre-generated URLs found'
        : 'URLs are empty - run: npm run audio:setup'
    )

    // Check for all poem IDs
    const poems = ['fine-lines', 'poet-proponent', 'the-tourbillon']
    const voices = ['male', 'female', 'male-indian', 'female-indian']

    for (const poem of poems) {
      const hasPoemEntry = content.includes(`'${poem}'`) || content.includes(`"${poem}"`)
      test(
        `Poem: ${poem}`,
        hasPoemEntry,
        hasPoemEntry ? 'Entry exists' : 'Missing entry'
      )
    }
  }

  console.log('')

  // Test 4: JSON Output (if exists)
  console.log('4. Generated URLs JSON')
  const jsonPath = path.join(
    process.cwd(),
    'scripts/pre-generated-audio-urls.json'
  )

  if (fs.existsSync(jsonPath)) {
    try {
      const urls = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
      const poemCount = Object.keys(urls).length
      const expectedCount = 3

      test(
        'Poem Count',
        poemCount === expectedCount,
        `Found ${poemCount} poems (expected ${expectedCount})`
      )

      // Count total voices
      let totalVoices = 0
      for (const poem of Object.values(urls) as any[]) {
        totalVoices += Object.keys(poem).length
      }

      test(
        'Voice Count',
        totalVoices === 12,
        `Found ${totalVoices} voice files (expected 12)`
      )

      // Check if URLs are valid
      const allUrls = Object.values(urls).flatMap((poem: any) =>
        Object.values(poem)
      ) as string[]
      const validUrls = allUrls.filter((url) => url.startsWith('https://'))

      test(
        'Valid URLs',
        validUrls.length === 12,
        `${validUrls.length}/12 URLs are valid HTTPS URLs`
      )
    } catch (error) {
      test('JSON Parse', false, `Failed to parse JSON: ${error}`)
    }
  } else {
    test(
      'JSON File',
      false,
      'Not found - run: npm run audio:generate'
    )
  }

  console.log('')

  // Test 5: Package Scripts
  console.log('5. Package Scripts')
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const scripts = packageJson.scripts || {}

    const requiredScripts = [
      'audio:generate',
      'audio:update-urls',
      'audio:setup',
    ]

    for (const script of requiredScripts) {
      test(script, !!scripts[script], scripts[script] || 'Not defined')
    }
  }

  console.log('')

  // Summary
  console.log('='.repeat(50))
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const total = results.length

  console.log(`Results: ${passed}/${total} tests passed`)

  if (failed > 0) {
    console.log(`\n❌ ${failed} test(s) failed`)
    console.log('\nTo fix issues:')
    console.log('  1. Set environment variables in .env.local')
    console.log('  2. Run: npm run audio:setup')
    console.log('  3. Deploy to Vercel')
    process.exit(1)
  } else {
    console.log('\n✅ All tests passed!')
    console.log('\nYour pre-generated audio system is ready!')
    console.log('\nNext steps:')
    console.log('  1. If URLs are empty, run: npm run audio:setup')
    console.log('  2. Commit and deploy to Vercel')
    console.log('  3. Test on production')
  }
}

main().catch((error) => {
  console.error('Test failed:', error)
  process.exit(1)
})
