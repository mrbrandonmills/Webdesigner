'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ImportBooksPage() {
  const [amazonUrl, setAmazonUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImport = async () => {
    setImporting(true)
    try {
      const response = await fetch('/api/admin/books/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amazonUrl }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to import book' })
    }
    setImporting(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-light font-serif mb-2">Import Books from Amazon</h1>
          <p className="text-white/60">
            Paste Amazon book URLs or ASINs to automatically import to store
          </p>
        </div>

        {/* Import Form */}
        <div className="border border-white/10 p-8 space-y-6">
          <div>
            <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
              Amazon URL or ASIN
            </label>
            <input
              type="text"
              value={amazonUrl}
              onChange={(e) => setAmazonUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/ASIN or just the ASIN"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-accent-gold/50 focus:outline-none transition-colors"
            />
            <p className="text-white/40 text-sm mt-2">
              Example: B088LTFXRH or https://amazon.com/dp/B088LTFXRH
            </p>
          </div>

          <button
            onClick={handleImport}
            disabled={!amazonUrl || importing}
            className="w-full px-8 py-4 bg-accent-gold text-black font-medium tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'IMPORTING...' : 'IMPORT BOOK'}
          </button>
        </div>

        {/* Known Books */}
        <div className="border border-white/10 p-8">
          <h2 className="text-2xl font-light font-serif mb-6">Your Books on Amazon</h2>

          <div className="space-y-4">
            <div className="bg-white/5 p-6 space-y-3">
              <h3 className="text-lg text-accent-gold">Random Acts of Self-Actualization</h3>
              <p className="text-white/60 text-sm">
                Co-authored with Jesse Doherty
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setAmazonUrl('Random Acts of Self-Actualization')}
                  className="px-4 py-2 border border-accent-gold/50 text-accent-gold text-sm hover:bg-accent-gold/10 transition-colors"
                >
                  IMPORT THIS BOOK
                </button>
              </div>
            </div>

            <div className="text-white/40 text-sm p-4 border border-white/5">
              More books will appear here once imported
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border p-6 ${result.error ? 'border-red-500/50 bg-red-500/5' : 'border-green-500/50 bg-green-500/5'}`}
          >
            <h3 className="text-lg mb-2">{result.error ? 'Error' : 'Success'}</h3>
            <pre className="text-sm text-white/70 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 p-8 space-y-4">
          <h3 className="text-xl font-light font-serif">How It Works</h3>
          <ol className="space-y-2 text-white/70 list-decimal list-inside">
            <li>Find your book on Amazon</li>
            <li>Copy the URL or find the ASIN (in the product details)</li>
            <li>Paste it above and click Import</li>
            <li>The system will extract: title, description, cover image, price, reviews</li>
            <li>Book automatically added to your Store</li>
            <li>Link to Amazon for purchases (you earn royalties)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
