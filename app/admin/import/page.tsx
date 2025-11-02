'use client'

import { useState } from 'react'

export default function ImportPage() {
  const [xmlFile, setXmlFile] = useState<File | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<string[]>([])
  const [preview, setPreview] = useState<any>(null)

  const handleXmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setXmlFile(e.target.files[0])
      setProgress([...progress, `✓ XML file uploaded: ${e.target.files[0].name}`])
    }
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0])
      setProgress([...progress, `✓ CSV file uploaded: ${e.target.files[0].name}`])
    }
  }

  const handlePreview = async () => {
    if (!xmlFile && !csvFile) {
      alert('Please upload at least one file')
      return
    }

    setIsProcessing(true)
    setProgress([...progress, '🔍 Analyzing files...'])

    try {
      const formData = new FormData()
      if (xmlFile) formData.append('xml', xmlFile)
      if (csvFile) formData.append('csv', csvFile)

      const response = await fetch('/api/import/preview', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Preview failed')

      const data = await response.json()
      setPreview(data)
      setProgress([
        ...progress,
        `✓ Found ${data.portfolioItems?.length || 0} portfolio items`,
        `✓ Found ${data.products?.length || 0} products`,
      ])
    } catch (error) {
      setProgress([...progress, `❌ Error: ${error}`])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async () => {
    if (!preview) {
      alert('Please preview files first')
      return
    }

    setIsProcessing(true)
    setProgress([...progress, '🚀 Starting import to Webflow...'])

    try {
      const response = await fetch('/api/import/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preview),
      })

      if (!response.ok) throw new Error('Import failed')

      const data = await response.json()
      setProgress([
        ...progress,
        `✓ Imported ${data.imported} items successfully`,
        `✓ All done! Check Webflow CMS`,
      ])
    } catch (error) {
      setProgress([...progress, `❌ Error: ${error}`])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            ← Back to Upload
          </a>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Import from Squarespace
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upload your Squarespace export files and import to Webflow
        </p>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* XML Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              📄 Portfolio Export (XML)
            </h3>
            <input
              type="file"
              accept=".xml"
              onChange={handleXmlUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {xmlFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {xmlFile.name} ({(xmlFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* CSV Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              🛍️ Products Export (CSV)
            </h3>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {csvFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handlePreview}
            disabled={isProcessing || (!xmlFile && !csvFile)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? '🔍 Analyzing...' : '🔍 Preview Files'}
          </button>

          {preview && (
            <button
              onClick={handleImport}
              disabled={isProcessing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? '🚀 Importing...' : '🚀 Import to Webflow'}
            </button>
          )}
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              Preview
            </h3>

            {preview.portfolioItems?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Portfolio Items ({preview.portfolioItems.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {preview.portfolioItems.slice(0, 5).map((item: any, idx: number) => (
                    <div key={idx} className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 truncate">{item.description}</p>
                    </div>
                  ))}
                  {preview.portfolioItems.length > 5 && (
                    <p className="text-sm text-gray-500">...and {preview.portfolioItems.length - 5} more</p>
                  )}
                </div>
              </div>
            )}

            {preview.products?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Products ({preview.products.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {preview.products.slice(0, 5).map((product: any, idx: number) => (
                    <div key={idx} className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">${product.price}</p>
                    </div>
                  ))}
                  {preview.products.length > 5 && (
                    <p className="text-sm text-gray-500">...and {preview.products.length - 5} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Log */}
        {progress.length > 0 && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
            <h3 className="font-semibold mb-4">Progress Log</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {progress.map((log, idx) => (
                <p key={idx}>{log}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
