export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p>
              When you use our Pinterest integration, we collect only the information necessary to provide the service:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Pinterest OAuth tokens (stored securely)</li>
              <li>Board and pin data accessed through Pinterest API</li>
              <li>Basic usage analytics for service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Authenticate your Pinterest account</li>
              <li>Create and manage pins on your behalf</li>
              <li>Provide automated content posting services</li>
              <li>Improve our service functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. Your Pinterest access
              tokens are encrypted and stored securely. We never share your information with third parties
              except as required to provide the Pinterest integration service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Pinterest API Usage</h2>
            <p>
              Our application uses Pinterest API to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Read your boards and pins</li>
              <li>Create new pins</li>
              <li>Schedule content posting</li>
            </ul>
            <p className="mt-2">
              You can revoke access at any time through your Pinterest account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your data</li>
              <li>Request data deletion</li>
              <li>Revoke Pinterest API access</li>
              <li>Opt out of analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p>
              For privacy concerns or data requests, contact us at:{' '}
              <a href="mailto:hello@brandonmills.com" className="text-blue-600 hover:underline">
                hello@brandonmills.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Updates</h2>
            <p>
              This privacy policy may be updated periodically. Last updated: November 25, 2024
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
