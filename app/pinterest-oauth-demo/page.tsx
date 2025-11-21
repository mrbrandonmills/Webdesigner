'use client'

/**
 * PUBLIC Pinterest OAuth Demo (No Auth Required)
 * For recording Standard Access approval video
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PublicPinterestDemo() {
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
  const REDIRECT_URI = 'https://brandonmills.com/api/pinterest/oauth/callback'

  const startOAuth = () => {
    const scopes = 'boards:read,boards:write,pins:read,pins:write'
    const authUrl = `https://www.pinterest.com/oauth/?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scopes}&state=demo_${Date.now()}`
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Pinterest OAuth Demo
          </h1>
          <p className="text-gray-600">
            Standard Access Approval Video - Complete OAuth Flow + API Integration
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Step 1: Start OAuth Flow</h2>
            <p className="text-gray-600 mb-6">
              Click below to authenticate with Pinterest. You'll see:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
              <li>Pinterest login page</li>
              <li>Authorization screen (click "Allow")</li>
              <li>Redirect back with code in URL bar</li>
              <li>Automatic token exchange</li>
            </ol>
            <button
              onClick={startOAuth}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition text-xl"
            >
              Connect to Pinterest
            </button>
          </div>
        )}

        {step === 2 && accessToken && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-green-600">OAuth Success!</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="font-semibold text-green-900 mb-2">Access Token Received:</p>
              <code className="block bg-white p-3 rounded text-xs break-all border">
                {accessToken}
              </code>
            </div>
            <p className="text-gray-600 mb-4">
              Next: Use this token to create a pin via Pinterest API
            </p>
            <a
              href={`https://brandonmills.com/api/pinterest/create-pin?demo=true&token=${accessToken}`}
              target="_blank"
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-center transition"
            >
              Create Test Pin
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
