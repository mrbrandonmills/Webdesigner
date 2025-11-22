'use client'

import { useState } from 'react'

export default function PinterestDemo() {
  const [token, setToken] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [pinUrl, setPinUrl] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<string[]>(['Ready to test Pinterest API'])

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const handleCreatePin = async () => {
    if (!token) {
      setError('Please enter your Pinterest access token')
      return
    }

    setIsCreating(true)
    setError('')
    addLog('Starting pin creation...')

    try {
      addLog('Calling Pinterest API: POST /v5/pins')

      const response = await fetch('/api/pinterest/create-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: token,
          title: 'Pinterest API Integration Demo',
          description: 'This pin was created programmatically to demonstrate Pinterest API Standard Access. Created via brandonmills.com demo application.',
          link: 'https://www.brandonmills.com/pinterest-demo',
          media_source: {
            source_type: 'image_url',
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
          },
          board_id: '926263917051256124'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create pin')
      }

      addLog('✅ Pin created successfully!')
      addLog(`Pin ID: ${data.pin.id}`)
      setPinUrl(data.pin.url)

    } catch (err: any) {
      addLog(`❌ Error: ${err.message}`)
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          padding: 2rem;
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#e60023',
            marginBottom: '0.5rem'
          }}>
            Pinterest API Demo
          </h1>
          <p style={{ color: '#666' }}>
            Standard Access Approval - API Integration Test
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>

          {!pinUrl ? (
            <>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                Step 1: Enter Access Token
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#333'
                }}>
                  Pinterest Sandbox Access Token:
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="pina_..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#fee',
                  border: '1px solid #fcc',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#c00',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleCreatePin}
                disabled={isCreating || !token}
                style={{
                  width: '100%',
                  background: token ? '#e60023' : '#ccc',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: token ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                {isCreating ? 'Creating Pin...' : 'Create Test Pin via API'}
              </button>
            </>
          ) : (
            <>
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#d4edda',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '3rem'
                }}>
                  ✓
                </div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#155724',
                  marginBottom: '0.5rem'
                }}>
                  Success!
                </h2>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                  Pin created successfully via Pinterest API
                </p>
              </div>

              <a
                href={pinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  background: '#e60023',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}
              >
                Open Pin on Pinterest.com →
              </a>

              <button
                onClick={() => {
                  setPinUrl('')
                  setLogs(['Ready to test Pinterest API'])
                }}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#333',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Reset Demo
              </button>
            </>
          )}
        </div>

        {/* Logs */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            color: '#4ade80',
            fontWeight: 'bold',
            marginBottom: '1rem',
            fontFamily: 'monospace'
          }}>
            API Logs:
          </h3>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#86efac',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
