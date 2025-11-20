/**
 * Pinterest OAuth Flow - SANDBOX
 *
 * Gets a sandbox access token with write permissions.
 *
 * Usage: npx tsx scripts/automation/pinterest-oauth-sandbox.ts
 */

import http from 'http'
import { URL } from 'url'
import { config } from 'dotenv'
import * as path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })

const CLIENT_ID = '1537033'
const CLIENT_SECRET = '5622572870c8bb2d30afd94394ef5db31196f78c'
const REDIRECT_URI = 'http://localhost:8889/callback'

// Request ALL scopes including write
const SCOPES = [
  'ads:read',
  'ads:write',
  'boards:read',
  'boards:read_secret',
  'boards:write',
  'boards:write_secret',
  'catalogs:read',
  'catalogs:write',
  'pins:read',
  'pins:read_secret',
  'pins:write',
  'pins:write_secret',
  'user_accounts:read'
].join(',')

async function getAccessToken() {
  console.log('\n🔐 Pinterest OAuth Flow - SANDBOX\n')

  // Generate authorization URL
  const state = Math.random().toString(36).substring(7)
  const authUrl = `https://www.pinterest.com/oauth/?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(SCOPES)}&` +
    `state=${state}`

  console.log('1. Open this URL in your browser:\n')
  console.log(authUrl)
  console.log('\n2. Authorize the app')
  console.log('3. You\'ll be redirected to localhost - I\'ll capture the code\n')

  // Start local server to capture callback
  return new Promise<string>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url!, `http://localhost:8889`)

      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code')
        const returnedState = url.searchParams.get('state')

        if (returnedState !== state) {
          res.writeHead(400, { 'Content-Type': 'text/html' })
          res.end('<h1>Error: State mismatch</h1>')
          reject(new Error('State mismatch'))
          return
        }

        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' })
          res.end('<h1>Error: No code received</h1>')
          reject(new Error('No code received'))
          return
        }

        console.log('✅ Authorization code received!')
        console.log('\nExchanging for SANDBOX tokens...\n')

        // Exchange code for tokens - USE SANDBOX ENDPOINT
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

        try {
          // NOTE: Using api-sandbox.pinterest.com for sandbox token
          const tokenResponse = await fetch('https://api-sandbox.pinterest.com/v5/oauth/token', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
          })

          if (!tokenResponse.ok) {
            const error = await tokenResponse.text()
            throw new Error(`Token exchange failed: ${error}`)
          }

          const tokens = await tokenResponse.json()

          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1>✅ Success!</h1>
                <p>Pinterest SANDBOX API connected with write permissions.</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `)

          console.log('✅ SANDBOX Tokens received!\n')
          console.log('Add this to your .env.local:\n')
          console.log(`PINTEREST_SANDBOX_ACCESS_TOKEN=${tokens.access_token}`)
          if (tokens.refresh_token) {
            console.log(`PINTEREST_SANDBOX_REFRESH_TOKEN=${tokens.refresh_token}`)
          }
          console.log('\n')

          server.close()
          resolve(tokens.access_token)

        } catch (error: any) {
          res.writeHead(500, { 'Content-Type': 'text/html' })
          res.end(`<h1>Error: ${error.message}</h1>`)
          reject(error)
        }
      }
    })

    server.listen(8889, () => {
      console.log('Waiting for authorization...\n')
    })

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close()
      reject(new Error('Timeout waiting for authorization'))
    }, 300000)
  })
}

// Run
getAccessToken().then(() => {
  console.log('🎉 Pinterest SANDBOX OAuth complete!')
  process.exit(0)
}).catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
