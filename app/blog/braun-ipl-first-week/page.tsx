import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ProductSchema } from '@/components/seo/ProductSchema'

const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'brandonmil0e-20'
const BRAUN_AMAZON_URL = `https://www.amazon.com/Braun-i%C2%B7expert-Removal-Holiday-Trimmer/dp/B0CMVPMPZ8?tag=${AFFILIATE_TAG}`

export const metadata: Metadata = {
  title: 'The Hairless Rabbit Diaries: My First Week With Braun IPL | Brandon Mills',
  description: 'Real results from my first week using the Braun Silk Expert Pro 7. Honest review from a male model with photos. Is at-home IPL worth it? Read my experience.',
  keywords: [
    'braun ipl review',
    'at home laser hair removal',
    'ipl before and after',
    'male laser hair removal',
    'braun silk expert pro 7',
    'permanent hair removal at home',
    'ipl results week 1',
    'braun ipl men',
  ],
  openGraph: {
    title: 'The Hairless Rabbit Diaries: My First Week With Braun IPL',
    description: 'Real results from my first week using the Braun Silk Expert Pro 7. Honest review with photos.',
    images: ['/blog/braun-ipl/braun-ipl-results-1.jpg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Hairless Rabbit Diaries: My First Week With Braun IPL',
    description: 'Real results from my first week using the Braun Silk Expert Pro 7.',
    images: ['/blog/braun-ipl/braun-ipl-results-1.jpg'],
  },
}

const braunProduct = {
  name: 'Braun IPL at Home Laser Hair Removal for Women and Men, Silk Expert Pro 7',
  brand: 'Braun',
  price: 499.99,
  rating: 4.5,
  reviewCount: 12847,
  inStock: true,
  slug: 'braun-ipl',
  description: `The Braun Silk Expert Pro 7 is the world's #1 IPL device, offering professional-grade at-home laser hair removal for both women and men.`,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'The Hairless Rabbit Diaries: My First Week With Braun IPL',
  author: {
    '@type': 'Person',
    name: 'Brandon Mills',
    url: 'https://brandonmills.com',
  },
  datePublished: '2025-11-17',
  dateModified: '2025-11-17',
  image: 'https://brandonmills.com/blog/braun-ipl/braun-ipl-results-1.jpg',
  publisher: {
    '@type': 'Person',
    name: 'Brandon Mills',
  },
}

export default function BraunIPLFirstWeekPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
        {/* Hero Section */}
        <header className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <time dateTime="2025-11-17">November 17, 2025</time>
                <span>•</span>
                <span>8 min read</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Personal Review</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent leading-tight">
                The Hairless Rabbit Diaries: My First Week With the Braun IPL Skin i-Expert
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                What happens when a model who's been hairless since sixteen tries at-home laser hair removal? Here's my honest, unfiltered first week.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">4.5/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
          <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
            {/* Hero Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-zinc-200 dark:border-zinc-800">
              <Image
                src="/blog/braun-ipl/braun-ipl-results-1.jpg"
                alt="Brandon Mills' results after one week using Braun IPL at-home laser hair removal"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Stats Box */}
            <div className="not-prose bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-900 mb-12">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">First Week Results At A Glance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-2xl">✓</span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Hair Regrowth</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Sparse, patchy, minimal</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-2xl">✓</span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Pain Level</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">2/10 - Mild warmth only</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-2xl">✓</span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Time Investment</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">15-20 min per session</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-2xl">✓</span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Would I Continue?</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Absolutely YES</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Blog Content */}
            <h2>Why I'm Writing This</h2>
            <p>
              I've been hairless since sixteen. Not by genetics—by choice.
            </p>
            <p>
              Growing up watching Cristiano Ronaldo dominate the pitch, I noticed something beyond his skill: the aesthetic discipline. The clean lines. The deliberate smoothness. I wanted that—not for vanity, but for the same reason you polish a marble sculpture. Form matters.
            </p>
            <p>
              So I've shaved, waxed, trimmed, lasered—chasing permanence. When the{' '}
              <a
                href={BRAUN_AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium underline decoration-emerald-300 dark:decoration-emerald-800 underline-offset-4 transition-colors"
              >
                Braun IPL Skin i-Expert
              </a>{' '}
              arrived, I committed to documenting it honestly. This isn't a sponsored post. Just one week of real use.
            </p>

            <h2>First Impressions: The Unboxing</h2>
            <p>
              The device feels premium—weighted, ergonomic, serious. It's not a toy. The charging dock is minimal. The precision head attachment clicks in with satisfying certainty. Braun knows how to make tools that feel intentional.
            </p>
            <p>
              The instruction manual is... German. Thorough. Safety-first. I appreciate this. IPL is light-based hair removal—it targets melanin in hair follicles. Dark hair on lighter skin works best. I'm a good candidate.
            </p>

            <h2>Week One: The Reality</h2>
            <p>
              <strong>Day 1: First Treatment</strong>
            </p>
            <p>
              I started conservatively—level 3 intensity on my arm. A warm pulse. Not painful. Not pleasant either—just functional. Like a tiny rubber band snap followed by warmth.
            </p>
            <p>
              Session took 15 minutes for both arms. The device auto-adjusts to skin tone (SensoAdapt technology), which gave me confidence to increase intensity. By the end, I was on level 5.
            </p>

            <div className="relative aspect-[3/2] rounded-xl overflow-hidden my-8 border border-zinc-200 dark:border-zinc-800">
              <Image
                src="/blog/braun-ipl/braun-ipl-results-2.jpg"
                alt="Braun IPL treatment progress after one week showing minimal regrowth"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm">Week 1 results: noticeably sparse regrowth on treated areas</p>
              </div>
            </div>

            <p>
              <strong>Day 3: First Shave Post-Treatment</strong>
            </p>
            <p>
              Hair grows slower. I could feel it—or rather, couldn't feel it as much. Usually by day three, there's stubble. This time? Barely anything.
            </p>
            <p>
              I shaved anyway (you have to shave before IPL sessions), and the regrowth pattern was already patchy. Some areas completely bare. Others with wispy, hesitant growth.
            </p>

            <p>
              <strong>Day 5: Second Treatment</strong>
            </p>
            <p>
              Upped to level 7. More confident now. The device has a glide mode where you hold the button and it pulses automatically as you move it across skin. Game changer for large areas like legs.
            </p>
            <p>
              I treated arms, legs, chest. Total time: 25 minutes. That's faster than shaving.
            </p>

            <p>
              <strong>Day 7: The Reckoning</strong>
            </p>
            <p>
              Checked my arm—the first area I treated. Smooth. Not perfectly hairless, but the regrowth is sparse, light, patchy. Like my body's confused about whether it should even bother.
            </p>
            <p>
              My legs tell a similar story. Areas I hit with higher intensity have almost no regrowth. Lower intensity areas have some, but it's finer than before.
            </p>

            <h2>What Surprised Me</h2>
            <h3>1. The Joy of Self-Curation</h3>
            <p>
              There's something meditative about IPL. It's not rushed like shaving. You're deliberate. Methodical. Each pulse is a tiny decision—this area, that intensity, this angle.
            </p>
            <p>
              It's self-curation. The same satisfaction I get from choosing the right book, the right espresso blend, the right shirt. You're crafting your form, intentionally.
            </p>

            <h3>2. It's Not Instant (And That's Fine)</h3>
            <p>
              Week one isn't about perfection—it's about momentum. Hair growth cycles mean you need multiple sessions to catch all follicles in their growth phase.
            </p>
            <p>
              Braun recommends weekly treatments for the first 4-12 weeks, then monthly maintenance. I'm in this for the long game. Patience is part of the aesthetic.
            </p>

            <h3>3. The Device Feels Like It Respects You</h3>
            <p>
              The SensoAdapt sensor reads your skin tone in real-time and adjusts. It won't let you burn yourself. The safety lock prevents accidental pulses. These aren't gimmicks—they're guardrails for intelligent use.
            </p>
            <p>
              German engineering at its finest.
            </p>

            {/* CTA Section 1 */}
            <div className="not-prose my-12 p-8 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-50 rounded-2xl border border-zinc-700 dark:border-zinc-300 text-center">
              <h3 className="text-2xl font-bold text-white dark:text-zinc-900 mb-3">Ready to Try the Braun IPL?</h3>
              <p className="text-zinc-300 dark:text-zinc-600 mb-6 max-w-2xl mx-auto">
                Currently $200 off on Amazon. Free shipping. 90-day money-back guarantee.
              </p>
              <a
                href={BRAUN_AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get the Braun IPL Pro 7 on Amazon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4">
                $499.99 (regularly $699.99) • 12,847 reviews • 4.5/5 stars
              </p>
            </div>

            <h2>The Honest Cons</h2>
            <h3>Not for Everyone</h3>
            <ul>
              <li><strong>Dark skin tones:</strong> IPL targets melanin. On very dark skin, it can't differentiate between hair and skin safely. Not recommended.</li>
              <li><strong>Light hair:</strong> Blonde, red, or gray hair lacks melanin. IPL won't work effectively.</li>
              <li><strong>Impatience:</strong> If you need instant results, this isn't it. Week one shows promise, not completion.</li>
            </ul>

            <h3>The Investment</h3>
            <p>
              At $499 (on sale from $699), it's not cheap. But compare it to:
            </p>
            <ul>
              <li>Professional laser: $300-500 per session × 6-8 sessions = $2,400-4,000</li>
              <li>Lifetime of waxing: $50-80 every 4-6 weeks = $600-1,200/year</li>
              <li>Braun IPL: $499 once, lasts 20+ years with 400,000 flashes</li>
            </ul>
            <p>
              The math favors Braun if you're committed.
            </p>

            <h2>Who Should Buy This?</h2>
            <p>
              <strong>You're a good candidate if you:</strong>
            </p>
            <ul>
              <li>Have light to medium skin tone with dark hair</li>
              <li>Are tired of daily shaving or monthly waxing</li>
              <li>Value long-term investment over short-term fixes</li>
              <li>Want privacy (at-home beats salon appointments)</li>
              <li>Enjoy the ritual of self-maintenance</li>
            </ul>

            <p>
              <strong>Skip it if you:</strong>
            </p>
            <ul>
              <li>Have very dark skin or very light hair</li>
              <li>Need instant gratification</li>
              <li>Don't mind shaving or waxing regularly</li>
              <li>Aren't willing to commit to 4-12 weeks of treatments</li>
            </ul>

            <h2>My Tips After Week One</h2>
            <ol>
              <li><strong>Start conservative, then escalate.</strong> Level 3-5 for the first session. Build confidence. Your skin will adapt.</li>
              <li><strong>Shave right before treatment.</strong> IPL targets the follicle, not the hair shaft. Shaving ensures energy goes where it matters.</li>
              <li><strong>Stay consistent.</strong> Weekly treatments aren't optional—they're the protocol. Trust the process.</li>
              <li><strong>Use glide mode for large areas.</strong> It's faster and more consistent than stamp mode.</li>
              <li><strong>Charge after every use.</strong> You don't want to start a session with low battery mid-way.</li>
            </ol>

            <h2>The Verdict (So Far)</h2>
            <p>
              One week in, I'm impressed. Not because it's magic—it's not. But because it's <em>working exactly as advertised</em>.
            </p>
            <p>
              Slower regrowth. Patchy coverage. Finer hair texture. These aren't dramatic transformations, but they're measurable progress. And that's what matters when you're building something permanent.
            </p>
            <p>
              The device itself feels like it was designed by people who understand both engineering and aesthetics. It's functional, elegant, and respects your intelligence.
            </p>
            <p>
              If I'm this pleased after seven days, I'm genuinely excited for week four.
            </p>

            <p className="text-lg font-semibold">
              <strong>Would I buy it again?</strong> Without hesitation.
            </p>
            <p className="text-lg font-semibold">
              <strong>Would I recommend it?</strong> If you fit the criteria above, yes. If not, be honest with yourself and skip it.
            </p>

            {/* Final CTA */}
            <div className="not-prose my-12 p-10 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-2xl text-white text-center shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">Start Your Own Journey</h3>
              <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
                Join 12,847 people who've discovered the freedom of at-home IPL. Currently $200 off with free shipping.
              </p>
              <a
                href={BRAUN_AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
              >
                Get Braun IPL Pro 7 - Save $200
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-emerald-100">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  90-Day Guarantee
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Free Shipping
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Prime Eligible
                </div>
              </div>
            </div>

            <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

            {/* Author Bio */}
            <div className="not-prose flex items-start gap-6 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  BM
                </div>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg mb-2">About Brandon Mills</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Model, polymath, and advocate for intentional living. I believe form follows function, and both should be cultivated deliberately. When I'm not documenting self-optimization experiments, I'm writing about philosophy, quality products, and the art of deep focus.
                </p>
                <div className="mt-4">
                  <Link
                    href="/about"
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    Learn more about me →
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="not-prose mt-12">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Products I Recommend</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  href="/shop/skinc euticals-ce-ferulic"
                  className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
                >
                  <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-2">
                    SkinCeuticals C E Ferulic
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    The gold standard vitamin C serum for protecting and improving skin quality.
                  </p>
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    View Product →
                  </div>
                </Link>

                <Link
                  href="/shop/la-mer-creme"
                  className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
                >
                  <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-2">
                    La Mer Crème de la Mer
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Legendary luxury moisturizer for healing and transforming skin.
                  </p>
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    View Product →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Want More Honest Reviews?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
              I test and review quality products worth investing in. From tech to philosophy books to meditation tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Browse All Reviews
              </Link>
              <Link
                href="/meditations"
                className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
              >
                Explore Meditations
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
