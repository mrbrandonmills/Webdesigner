#!/usr/bin/env ts-node
/**
 * Update the pre-generated audio URLs in the API route
 *
 * This script reads the generated audio URLs from pre-generated-audio-urls.json
 * and updates the API route file with the new URLs.
 *
 * Run: npx ts-node scripts/update-audio-urls.ts
 */

import * as fs from 'fs'
import * as path from 'path'

async function main() {
  // Read the generated URLs
  const urlsPath = path.join(__dirname, 'pre-generated-audio-urls.json')

  if (!fs.existsSync(urlsPath)) {
    console.error('Error: pre-generated-audio-urls.json not found')
    console.error('Please run: npm run audio:generate')
    process.exit(1)
  }

  const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'))

  // Read the API route file
  const apiRoutePath = path.join(
    __dirname,
    '../app/api/get-poem-audio/route.ts'
  )

  let apiRouteContent = fs.readFileSync(apiRoutePath, 'utf-8')

  // Format the URLs object for TypeScript
  const formattedUrls = JSON.stringify(urls, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join('\n')

  // Replace the PRE_GENERATED_AUDIO constant
  const regex =
    /const PRE_GENERATED_AUDIO: Record<string, Record<string, string>> = \{[^}]*\}/s

  apiRouteContent = apiRouteContent.replace(
    regex,
    `const PRE_GENERATED_AUDIO: Record<string, Record<string, string>> = ${formattedUrls}`
  )

  // Write the updated content back
  fs.writeFileSync(apiRoutePath, apiRouteContent)

  console.log('✓ Successfully updated audio URLs in API route')
  console.log(`  File: ${apiRoutePath}`)
  console.log('\nUpdated URLs:')
  console.log(formattedUrls)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
