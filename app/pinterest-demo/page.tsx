'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PinterestDemoContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const success = searchParams?.get('success')
    const token = searchParams?.get('access_token')
    const err = searchParams?.get('error')

    if (err) {
      setError(`Error: ${err}`)
      setStep(1)
    }

    if (success === 'true' && token) {
      setAccessToken(token)
      setStep(2)
    }
  }, [searchParams])

  const APP_ID = '1537033'

  // Auto-detect if running on localhost or production
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const REDIRECT_URI = isLocalhost
    ? 'http://localhost:8889/callback'
    : 'https://www.brandonmills.com/api/pinterest/oauth/callback'

  const startOAuth = () => {
    const scopes = 'boards:read,boards:write,pins:read,pins:write'
    const authUrl = `https://www.pinterest.com/oauth/?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scopes}&state=demo_${Date.now()}`
    console.log('Starting OAuth with redirect:', REDIRECT_URI)
    window.location.href = authUrl
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #fee2e2, #fecaca);
          padding: 2rem;
        }
      `}</style>
      <div style={{
        maxWidth: '56rem',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '0.5rem'
          }}>Pinterest OAuth Demo</h1>
          <p style={{ color: '#4b5563' }}>
            Standard Access Approval Video - Complete OAuth Flow + API Integration
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            borderLeft: '4px solid #ef4444',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#991b1b',
            fontWeight: '500'
          }}>{error}</div>
        )}

        {step === 1 && (
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>Step 1: Start OAuth Flow</h2>
            <p style={{
              color: '#4b5563',
              marginBottom: '1.5rem'
            }}>
              Click below to authenticate with Pinterest. You'll see:
            </p>
            <ol style={{
              listStyleType: 'decimal',
              marginLeft: '2rem',
              marginBottom: '1.5rem',
              color: '#374151',
              lineHeight: '1.75'
            }}>
              <li>Pinterest login page</li>
              <li>Authorization screen (click &quot;Allow&quot;)</li>
              <li>Redirect back with code in URL bar</li>
              <li>Automatic token exchange</li>
            </ol>
            <button style={{
              width: '100%',
              background: '#dc2626',
              color: 'white',
              fontWeight: 'bold',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }} onClick={startOAuth}>
              Connect to Pinterest
            </button>
          </div>
        )}

        {step === 2 && accessToken && (
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#059669'
            }}>OAuth Success!</h2>
            <div style={{
              background: '#ecfdf5',
              borderLeft: '4px solid #10b981',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{
                fontWeight: '600',
                color: '#065f46',
                marginBottom: '0.5rem'
              }}>Access Token Received:</p>
              <code style={{
                display: 'block',
                background: 'white',
                padding: '0.75rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                border: '1px solid #d1d5db'
              }}>{accessToken}</code>
            </div>
            <p style={{
              color: '#4b5563',
              marginBottom: '1rem'
            }}>
              Next: Use this token to create a pin via Pinterest API
            </p>
            <a
              href={`https://brandonmills.com/api/pinterest/create-pin?demo=true&token=${accessToken}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                background: '#dc2626',
                color: 'white',
                fontWeight: 'bold',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
            >
              Create Test Pin
            </a>
          </div>
        )}
      </div>
    </>
  )
}

export default function PinterestDemo() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fee2e2, #fecaca)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#dc2626', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    }>
      <PinterestDemoContent />
    </Suspense>
  )
}
