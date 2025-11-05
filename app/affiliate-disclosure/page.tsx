import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Brandon Mills',
  description: 'Transparency about our affiliate partnerships and how we monetize content while maintaining editorial integrity.',
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Affiliate Disclosure</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to Transparency</h2>
            <p className="text-gray-700 mb-4">
              At Brandon Mills Photography, we believe in complete transparency with our readers. This page explains
              how we use affiliate marketing to support our content creation while maintaining our editorial integrity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Are Affiliate Links?</h2>
            <p className="text-gray-700 mb-4">
              Some of the links on this website are affiliate links, which means we earn a commission if you click
              through and make a purchase. This commission comes at no additional cost to you – you pay the same
              price whether you use our link or go directly to the vendor's website.
            </p>
            <p className="text-gray-700 mb-4">
              When you click on an affiliate link, a cookie is placed on your browser to track sales and credit
              commissions. These cookies typically expire within 24 hours to 90 days, depending on the program.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Affiliate Partners</h2>
            <p className="text-gray-700 mb-4">
              We participate in affiliate programs with companies whose products align with our values and expertise.
              Our current affiliate partners include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Amazon Associates Program:</strong> As an Amazon Associate, we earn from qualifying purchases</li>
              <li><strong>ShareASale:</strong> Connecting us with art, home decor, and lifestyle brands</li>
              <li><strong>CJ Affiliate (Commission Junction):</strong> Premium and luxury brand partnerships</li>
              <li><strong>Printful:</strong> Print-on-demand services we use for our own products</li>
              <li><strong>B&H Photo:</strong> Professional photography equipment and accessories</li>
              <li><strong>Adobe:</strong> Creative software and tools for photographers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Review Policy</h2>
            <p className="text-gray-700 mb-4">
              <strong>Our opinions are our own.</strong> We only recommend products and services that we personally use,
              have thoroughly researched, or genuinely believe will provide value to our readers.
            </p>
            <p className="text-gray-700 mb-4">
              We will never:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Recommend a product solely for commission</li>
              <li>Give a positive review in exchange for compensation</li>
              <li>Hide negative aspects of products we review</li>
              <li>Promote products that don't align with our values</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How This Benefits You</h2>
            <p className="text-gray-700 mb-4">
              Affiliate commissions help us:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Keep our content free and accessible to everyone</li>
              <li>Invest in better photography equipment to create higher quality content</li>
              <li>Spend more time researching and testing products</li>
              <li>Maintain website hosting and technical infrastructure</li>
              <li>Create in-depth tutorials and educational resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">FTC Compliance</h2>
            <p className="text-gray-700 mb-4">
              In accordance with the FTC guidelines concerning the use of endorsements and testimonials in advertising,
              please be aware of the following:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>We disclose affiliate relationships on pages containing affiliate links</li>
              <li>We use #affiliate or #ad hashtags on social media posts with affiliate links</li>
              <li>We clearly mark sponsored content when applicable</li>
              <li>All product claims are based on our genuine experience or research</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Products We've Purchased</h2>
            <p className="text-gray-700 mb-4">
              Many of the products we recommend were purchased with our own money before we ever joined affiliate
              programs. We continue to buy and test products regularly to ensure our recommendations remain current
              and valuable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Questions or Concerns?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our affiliate relationships or would like more information about a
              specific product recommendation, please don't hesitate to{' '}
              <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
            </p>
            <p className="text-gray-700 mb-4">
              We value your trust above any commission and are committed to maintaining the highest standards of
              integrity in all our content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Thank You</h2>
            <p className="text-gray-700 mb-4">
              Thank you for supporting Brandon Mills Photography. When you use our affiliate links, you're directly
              supporting independent content creation and helping us continue to provide valuable resources to the
              photography community.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              This disclosure page is regularly updated to reflect our current affiliate partnerships.
              For specific questions about affiliate links or partnerships, please contact us at{' '}
              <a href="mailto:affiliates@brandonmills.com" className="text-blue-600 hover:underline">
                affiliates@brandonmills.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}