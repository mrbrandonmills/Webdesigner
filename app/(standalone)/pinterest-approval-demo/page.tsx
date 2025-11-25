'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const APP_ID = process.env.NEXT_PUBLIC_PINTEREST_APP_ID || '1537033'
const DEFAULT_REDIRECT = (
  process.env.NEXT_PUBLIC_PINTEREST_APPROVAL_REDIRECT_URI ||
  process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI ||
  'https://webdesigner-jdffd1f8e-brandons-projects-c4dfa14a.vercel.app/api/pinterest/approval-callback'
).trim()

function truncateToken(token: string) {
  if (!token) return ''
  if (token.length <= 16) return token
  return `${token.slice(0, 8)}...${token.slice(-4)}`
}

function PinterestApprovalDemoContent() {
  const searchParams = useSearchParams()
  const [accessToken, setAccessToken] = useState('')
  const [expiresIn, setExpiresIn] = useState('')
  const [boards, setBoards] = useState<any[]>([])
  const [selectedBoard, setSelectedBoard] = useState('')
  const [pinResult, setPinResult] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectUri = useMemo(() => DEFAULT_REDIRECT, [])

  useEffect(() => {
    const success = searchParams.get('success')
    const token = searchParams.get('access_token')
    const expiry = searchParams.get('expires_in') || ''
    const err = searchParams.get('error')

    if (err) {
      setError(err)
      return
    }

    if ((success === '1' || success === 'true') && token) {
      setAccessToken(token)
      setExpiresIn(expiry)
    }
  }, [searchParams])

  const startOAuth = () => {
    const scopes = [
      'boards:read',
      'boards:write',
      'pins:read',
      'pins:write'
    ].join(',')

    const authUrl = `https://www.pinterest.com/oauth/?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scopes}&state=approval_${Date.now()}`

    window.location.href = authUrl
  }

  const fetchBoards = async () => {
    setLoading(true)
    setStatus('Fetching boards from sandbox...')
    setError('')
    setBoards([])
    setPinResult(null)

    try {
      const res = await fetch('/api/pinterest/approval-boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch boards')
      }

      const items = data.boards || []
      setBoards(items)
      setSelectedBoard(items[0]?.id || '')
      setStatus(`Loaded ${items.length || 0} boards from sandbox`)
    } catch (err: any) {
      setError(err.message)
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  const createPin = async () => {
    if (!selectedBoard) {
      setError('Select a board first')
      return
    }

    setLoading(true)
    setStatus('Creating sandbox pin...')
    setError('')

    const payload = {
      accessToken,
      boardId: selectedBoard,
      title: 'Pinterest Sandbox Approval Demo',
      description:
        'Created via sandbox API for Standard Access approval walkthrough.',
      link: 'https://brandonmills.com',
      media_source: {
        source_type: 'image_url',
        url: 'https://brandonmills.com/images/og-image.jpg'
      }
    }

    try {
      const res = await fetch('/api/pinterest/approval-pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create pin')
      }

      setPinResult(data.pin)
      setStatus('Pin created successfully in sandbox!')
    } catch (err: any) {
      setError(err.message)
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 py-12 px-6 relative z-10">
      <div className="max-w-3xl mx-auto space-y-6 relative z-20">
        <div className="bg-white rounded-2xl shadow p-6 border border-red-100">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Pinterest Approval Demo
          </h1>
          <p className="text-gray-600">
            Minimal OAuth + sandbox API flow to record the Standard Access video.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-red-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Redirect URI</p>
              <p className="text-sm text-gray-500 break-all">{redirectUri}</p>
            </div>
            <button
              onClick={startOAuth}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Connect to Pinterest
            </button>
          </div>

          {searchParams.get('code') && (
            <div className="text-xs text-gray-500">
              Received code: {searchParams.get('code')}
            </div>
          )}

          {accessToken && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800">Access Token</p>
                <p className="text-xs text-green-700 break-all">
                  {truncateToken(accessToken)}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800">Expires In</p>
                <p className="text-xs text-blue-700">{expiresIn || 'Not provided'} seconds</p>
              </div>
            </div>
          )}

          {status && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              {status}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-red-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Sandbox API</h2>
            <div className="flex gap-3">
              <button
                onClick={fetchBoards}
                disabled={!accessToken || loading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Fetch Boards (Sandbox)
              </button>
              <button
                onClick={createPin}
                disabled={!accessToken || !selectedBoard || loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Create Test Pin
              </button>
            </div>
          </div>

          {boards.length > 0 ? (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3"
              >
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name} ({board.privacy || 'public'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Click "Fetch Boards" after connecting to load sandbox boards.
            </p>
          )}

          {pinResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-green-800">Pin Created</p>
              <p className="text-sm text-green-700">ID: {pinResult.id}</p>
              {pinResult.link && (
                <a
                  href={pinResult.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-red-700 underline"
                >
                  View pin
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-red-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Recording steps</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Press "Connect to Pinterest" and grant access.</li>
            <li>Return to this page with the token displayed.</li>
            <li>Fetch boards from the sandbox API.</li>
            <li>Create the test pin and open it on Pinterest.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function PinterestApprovalDemo() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">Loading...</div>
      </div>
    }>
      <PinterestApprovalDemoContent />
    </Suspense>
  )
}
