import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Brandon Mills',
  description: 'Privacy policy for brandonmills.com - how we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Brandon Mills ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website brandonmills.com.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address when you subscribe to our newsletter or contact us</li>
              <li><strong>Account Information:</strong> Username, password if you create an account for our AI products or meditation store</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
              <li><strong>User Content:</strong> Comments, reviews, or other content you submit</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, and browsing behavior</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> We use cookies to improve user experience and analyze site traffic</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li>Providing and improving our services (blog content, meditation store, AI products, affiliate shop)</li>
              <li>Processing transactions and sending confirmations</li>
              <li>Sending newsletters and promotional content (with your consent)</li>
              <li>Analyzing website traffic and user behavior to improve user experience</li>
              <li>Responding to customer service requests</li>
              <li>Detecting and preventing fraud or abuse</li>
            </ul>

            <h2>4. Third-Party Services</h2>
            <p>We work with trusted third-party services:</p>

            <h3>4.1 Analytics</h3>
            <ul>
              <li><strong>Google Analytics:</strong> Tracks website usage and performance</li>
              <li><strong>Vercel Analytics:</strong> Monitors site performance and uptime</li>
            </ul>

            <h3>4.2 Payment Processing</h3>
            <ul>
              <li><strong>Stripe:</strong> Processes payments securely (PCI DSS compliant)</li>
            </ul>

            <h3>4.3 Email Services</h3>
            <ul>
              <li><strong>Resend:</strong> Sends transactional emails and newsletters</li>
            </ul>

            <h3>4.4 Affiliate Programs</h3>
            <ul>
              <li><strong>Amazon Associates:</strong> We earn commissions on qualifying purchases through affiliate links</li>
              <li>When you click affiliate links, Amazon may collect information per their privacy policy</li>
            </ul>

            <h3>4.5 Content Delivery</h3>
            <ul>
              <li><strong>Vercel Blob Storage:</strong> Stores meditation audio files and images</li>
              <li><strong>Cartesia AI:</strong> Generates text-to-speech audio for meditations</li>
            </ul>

            <h3>4.6 Social Media</h3>
            <ul>
              <li><strong>Pinterest:</strong> We may share blog content on Pinterest</li>
              <li><strong>Twitter:</strong> We may share blog content on Twitter</li>
              <li><strong>Quora:</strong> We may answer questions and reference our content</li>
            </ul>

            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies for:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for site functionality (authentication, shopping cart)</li>
              <li><strong>Analytics Cookies:</strong> Track site usage to improve user experience</li>
              <li><strong>Marketing Cookies:</strong> Track affiliate link performance and conversions</li>
            </ul>
            <p>You can disable cookies in your browser settings, but some features may not work properly.</p>

            <h2>6. Data Security</h2>
            <p>We implement industry-standard security measures:</p>
            <ul>
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data (need-to-know basis)</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
            </ul>
            <p>To exercise these rights, contact us at: <a href="mailto:privacy@brandonmills.com">privacy@brandonmills.com</a></p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect personal information from children.
              If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2>9. Affiliate Disclosure</h2>
            <p>
              This website contains affiliate links, primarily through Amazon Associates. When you purchase through these links,
              we may earn a commission at no additional cost to you. We only recommend products we genuinely believe in and have
              personally tested or researched.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. Changes will be posted on this page with an updated "Last updated" date.
              We encourage you to review this policy regularly.
            </p>

            <h2>11. California Privacy Rights (CCPA)</h2>
            <p>
              California residents have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or shared</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
            <p><strong>We do not sell your personal information.</strong></p>

            <h2>12. European Privacy Rights (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul>
              <li>Right to access, rectification, erasure, and data portability</li>
              <li>Right to restrict processing and object to processing</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h2>13. Data Retention</h2>
            <p>We retain personal data for as long as necessary to:</p>
            <ul>
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p>
              When data is no longer needed, we securely delete or anonymize it.
            </p>

            <h2>14. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
            </p>

            <h2>15. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:privacy@brandonmills.com">privacy@brandonmills.com</a></li>
              <li><strong>Website:</strong> <a href="https://brandonmills.com">brandonmills.com</a></li>
            </ul>

            <hr className="my-8" />

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <strong>Summary:</strong> We collect minimal data necessary to provide our services. We do not sell your information.
              You have full control over your data. We use industry-standard security measures. We are transparent about our
              affiliate relationships. You can contact us anytime with privacy concerns.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
