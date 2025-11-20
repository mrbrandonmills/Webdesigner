/**
 * Reddit Ads OAuth Authentication
 *
 * Run this to get your refresh token for the Reddit Ads API.
 *
 * Usage: npx tsx scripts/automation/reddit-ads-auth.ts
 */

import http from 'http'
import { URL } from 'url'

const CLIENT_ID = process.env.REDDIT_ADS_CLIENT_ID || 'Gee-dBGzgLN6F1sKhvg3pg'
const CLIENT_SECRET = process.env.REDDIT_ADS_CLIENT_SECRET || 'xwvkTjsSqpHDwjtCkkvaAnucIsekeg'
const REDIRECT_URI = 'http://localhost:8888/callback'
// Reddit Ads API uses these scopes - includes adsmanage for write access
const SCOPES = 'adsread,adsmanage,adsconversions,history'

async function getRefreshToken() {
  console.log('\n🔐 Reddit Ads OAuth Setup\n')

  // Generate authorization URL
  const state = Math.random().toString(36).substring(7)
  const authUrl = `https://www.reddit.com/api/v1/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `state=${state}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `duration=permanent&` +
    `scope=${encodeURIComponent(SCOPES)}`

  console.log('1. Open this URL in your browser:\n')
  console.log(authUrl)
  console.log('\n2. Authorize the app')
  console.log('3. You\'ll be redirected to localhost - I\'ll capture the code\n')

  // Start local server to capture callback
  return new Promise<string>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url!, `http://localhost:8888`)

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
        console.log('\nExchanging for tokens...\n')

        // Exchange code for tokens
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

        try {
          const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
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
                <p>Reddit Ads API connected. You can close this window.</p>
              </body>
            </html>
          `)

          console.log('✅ Tokens received!\n')
          console.log('Add this to your .env.local:\n')
          console.log(`REDDIT_ADS_REFRESH_TOKEN=${tokens.refresh_token}`)
          console.log('\n')

          server.close()
          resolve(tokens.refresh_token)

        } catch (error: any) {
          res.writeHead(500, { 'Content-Type': 'text/html' })
          res.end(`<h1>Error: ${error.message}</h1>`)
          reject(error)
        }
      }
    })

    server.listen(8888, () => {
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
getRefreshToken().then(() => {
  console.log('🎉 Reddit Ads API setup complete!')
  process.exit(0)
}).catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
