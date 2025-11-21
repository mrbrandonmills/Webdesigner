'use client'

/**
 * Pinterest OAuth & API Demo
 *
 * This page demonstrates Pinterest OAuth flow and API integration
 * for Standard Access approval video.
 *
 * What Pinterest wants to see:
 * 1. Complete OAuth flow (login → authorize → code → token)
 * 2. API usage (create pin)
 * 3. Verification (show pin on Pinterest)
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PinterestDemoPage() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [expiresIn, setExpiresIn] = useState('')
  const [boards, setBoards] = useState<any[]>([])
  const [selectedBoard, setSelectedBoard] = useState('')
  const [pinCreated, setPinCreated] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const APP_ID = process.env.NEXT_PUBLIC_PINTEREST_APP_ID || '1537033'
  const REDIRECT_URI = typeof window !== 'undefined'
    ? `${window.location.origin}/api/pinterest/oauth/callback`
    : 'https://brandonmills.com/api/pinterest/oauth/callback'

  // Check for OAuth callback success
  useEffect(() => {
    const success = searchParams?.get('success')
    const token = searchParams?.get('access_token')
    const refresh = searchParams?.get('refresh_token')
    const expires = searchParams?.get('expires_in')
    const err = searchParams?.get('error')

    if (err) {
      setError(`OAuth Error: ${err}`)
      setStep(1)
    }

    if (success === 'true' && token) {
      setAccessToken(token)
      setRefreshToken(refresh || '')
      setExpiresIn(expires || '')
      setStep(2)
      setError('')
    }
  }, [searchParams])

  // Step 1: Start OAuth Flow
  const startOAuthFlow = () => {
    const scopes = [
      'boards:read',
      'boards:write',
      'pins:read',
      'pins:write'
    ].join(',')

    const authUrl = `https://www.pinterest.com/oauth/?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scopes}&state=demo_${Date.now()}`

    window.location.href = authUrl
  }

  // Step 2: Fetch Boards
  const fetchBoards = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/pinterest/create-pin?access_token=${accessToken}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch boards')
      }

      setBoards(data.boards || [])
      setSelectedBoard(data.boards[0]?.id || '')
      setStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Create Pin
  const createPin = async () => {
    if (!selectedBoard) {
      setError('Please select a board')
      return
    }

    setLoading(true)
    setError('')

    try {
      const pinData = {
        access_token: accessToken,
        title: 'Brandon Mills - Fine Lines Poetry',
        description: 'Explore the raw and authentic poetry collection "Fine Lines" by Brandon Mills. A journey through self-actualization and truth.',
        link: 'https://brandonmills.com/writing/fine-lines',
        media_source: {
          source_type: 'image_url',
          url: 'https://brandonmills.com/images/fine-lines-cover.jpg'
        },
        board_id: selectedBoard
      }

      const res = await fetch('/api/pinterest/create-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pinData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Pin creation failed')
      }

      setPinCreated(data.pin)
      setStep(4)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Pinterest OAuth & API Demo
          </h1>
          <p className="text-gray-600">
            Standard Access Approval Video - Complete OAuth Flow + API Integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  step >= num ? 'bg-red-600' : 'bg-gray-300'
                }`}>
                  {num}
                </div>
                {num < 4 && (
                  <div className={`w-24 h-1 ${step > num ? 'bg-red-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div>OAuth Flow</div>
            <div>Get Token</div>
            <div>Create Pin</div>
            <div>Verify</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Step 1: Start OAuth */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Step 1: OAuth Authorization</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to start the Pinterest OAuth flow. You'll be redirected to Pinterest
              to log in and authorize the app.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="font-semibold text-blue-900 mb-2">What happens next:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Pinterest login page</li>
                <li>Authorization screen (grant permissions)</li>
                <li>Redirect back with authorization code</li>
                <li>Exchange code for access token</li>
              </ol>
            </div>

            <button
              onClick={startOAuthFlow}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition"
            >
              Connect to Pinterest
            </button>
          </div>
        )}

        {/* Step 2: Token Received */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Step 2: OAuth Success! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Authorization code was successfully exchanged for an access token.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="font-semibold text-green-900 mb-2">Token Details:</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-800">Access Token:</span>
                  <code className="block bg-white p-2 rounded mt-1 text-xs break-all">
                    {accessToken}
                  </code>
                </div>
                {refreshToken && (
                  <div>
                    <span className="font-medium text-green-800">Refresh Token:</span>
                    <code className="block bg-white p-2 rounded mt-1 text-xs break-all">
                      {refreshToken}
                    </code>
                  </div>
                )}
                {expiresIn && (
                  <div>
                    <span className="font-medium text-green-800">Expires In:</span>
                    <span className="ml-2">{expiresIn} seconds</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={fetchBoards}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Loading Boards...' : 'Fetch Boards (API Call)'}
            </button>
          </div>
        )}

        {/* Step 3: Create Pin */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Step 3: Create Pin</h2>
            <p className="text-gray-600 mb-6">
              Select a board and create a pin using the Pinterest API.
            </p>

            <div className="mb-6">
              <label className="block font-medium mb-2">Select Board:</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
              >
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name} ({board.pin_count} pins)
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="font-semibold mb-2">Pin Details:</p>
              <div className="space-y-1 text-sm">
                <div><strong>Title:</strong> Brandon Mills - Fine Lines Poetry</div>
                <div><strong>Description:</strong> Explore the raw and authentic poetry collection...</div>
                <div><strong>Link:</strong> https://brandonmills.com/writing/fine-lines</div>
                <div><strong>Image:</strong> fine-lines-cover.jpg</div>
              </div>
            </div>

            <button
              onClick={createPin}
              disabled={loading || !selectedBoard}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating Pin...' : 'Create Pin on Pinterest'}
            </button>
          </div>
        )}

        {/* Step 4: Verification */}
        {step === 4 && pinCreated && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Step 4: Pin Created! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Pin was successfully created on Pinterest. Verify it appears on the platform.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="font-semibold text-green-900 mb-2">Pin Details:</p>
              <div className="space-y-2 text-sm">
                <div><strong>Pin ID:</strong> {pinCreated.id}</div>
                <div><strong>Title:</strong> {pinCreated.title}</div>
                <div><strong>Board ID:</strong> {pinCreated.board_id}</div>
                <div><strong>Created:</strong> {pinCreated.created_at}</div>
              </div>
            </div>

            <a
              href={pinCreated.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-center transition"
            >
              View Pin on Pinterest →
            </a>

            <button
              onClick={() => {
                setStep(1)
                setAccessToken('')
                setPinCreated(null)
              }}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              Reset Demo
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
          <h3 className="font-bold text-yellow-900 mb-2">📹 Video Recording Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-800 text-sm">
            <li>Start screen recording</li>
            <li>Click "Connect to Pinterest" and log in</li>
            <li>Approve app permissions</li>
            <li>Show the authorization code in URL bar</li>
            <li>Show token exchange success</li>
            <li>Click "Fetch Boards" to show API call</li>
            <li>Select a board and click "Create Pin"</li>
            <li>Click "View Pin on Pinterest" and show it loaded</li>
            <li>Stop recording</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
