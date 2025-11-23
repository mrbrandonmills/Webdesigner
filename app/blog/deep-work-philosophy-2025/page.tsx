import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/json-ld'
import { EbookCTA } from '@/components/ebook-cta'

export const metadata: Metadata = {
  title: 'Deep Work in 2025: Why Focus Is The New Luxury | Brandon Mills',
  description: 'In an age of infinite distraction, deep work has become the ultimate luxury. How I built a focus system that delivers 10x productivity without burning out.',
  keywords: [
    'deep work',
    'focus techniques 2025',
    'productivity without burnout',
    'digital minimalism',
    'deep focus methods',
    'distraction-free work',
    'flow state productivity',
    'intentional living',
  ],
  openGraph: {
    title: 'Deep Work in 2025: Why Focus Is The New Luxury',
    description: 'In an age of infinite distraction, deep work has become the ultimate luxury. My system for 10x productivity.',
    images: ['/og-deep-work.jpg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Work in 2025: Why Focus Is The New Luxury',
    description: 'How I built a focus system that delivers 10x productivity without burning out.',
    images: ['/og-deep-work.jpg'],
  },
}

const articleSchema = generateArticleSchema({
  title: 'Deep Work in 2025: Why Focus Is The New Luxury',
  description: 'In an age of infinite distraction, deep work has become the ultimate luxury. How I built a focus system that delivers 10x productivity without burning out.',
  image: '/og-deep-work.jpg',
  datePublished: '2025-11-23',
  dateModified: '2025-11-23',
  url: '/blog/deep-work-philosophy-2025',
  category: 'Philosophy',
  wordCount: 2100,
})

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Deep Work Philosophy', url: '/blog/deep-work-philosophy-2025' },
])

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is deep work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deep work is the ability to focus without distraction on a cognitively demanding task. Coined by Cal Newport, it refers to professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long should a deep work session be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Optimal deep work sessions range from 90-120 minutes for most people. Beginners should start with 60-minute blocks and gradually increase. The key is uninterrupted, distraction-free focus during these periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I eliminate distractions for deep work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Eliminate distractions by: turning off all notifications, using website blockers, putting phone in another room, closing all unnecessary apps, using noise-canceling headphones, and scheduling deep work sessions when you have natural energy peaks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I do deep work every day?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, but limit it to 4-5 hours per day maximum. Deep work is cognitively exhausting. Most people can sustain 1-2 deep work blocks daily while maintaining quality. Recovery time between sessions is essential.',
      },
    },
  ],
}

export default function DeepWorkPhilosophyPage() {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, faqSchema]} />

      <article className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
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
                <time dateTime="2025-11-23">November 23, 2025</time>
                <span>•</span>
                <span>10 min read</span>
                <span>•</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Philosophy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent leading-tight">
                Deep Work in 2025: Why Focus Is The New Luxury
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                In an age of infinite distraction, the ability to focus deeply has become rarer than gold. Here's why I treat deep work as a luxury worth protecting.
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
          <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
            <h2>The Attention Economy Stole Your Focus</h2>
            <p>
              Every app on your phone is engineered by PhDs in behavioral psychology whose sole job is to steal your attention. Infinite scroll. Push notifications. Red badge counters. Autoplay videos.
            </p>
            <p>
              They're not competing for your time. They're competing for your <em>consciousness</em>.
            </p>
            <p>
              And most people have already lost.
            </p>

            <blockquote className="border-l-4 border-purple-500 pl-6 italic text-zinc-700 dark:text-zinc-300 my-8">
              "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill will thrive."
              <footer className="text-sm mt-2 not-italic">— Cal Newport, Deep Work</footer>
            </blockquote>

            <h2>What Is Deep Work (Really)?</h2>
            <p>
              Deep work isn't just "working hard" or "being productive." It's a specific state of focused, uninterrupted concentration on cognitively demanding tasks.
            </p>
            <p>
              It's the opposite of what most people do: shallow work. Emails. Meetings. Slack messages. Context switching between 47 browser tabs.
            </p>
            <p>
              <strong>Deep work is:</strong>
            </p>
            <ul>
              <li>Writing a complex essay for 2 hours straight</li>
              <li>Coding a new feature without checking your phone once</li>
              <li>Reading a philosophy book and actually thinking about it</li>
              <li>Designing a system architecture with zero interruptions</li>
            </ul>
            <p>
              <strong>Shallow work is:</strong>
            </p>
            <ul>
              <li>Responding to 50 emails</li>
              <li>Attending meetings that could've been emails</li>
              <li>Switching between tasks every 6 minutes</li>
              <li>Checking notifications "real quick"</li>
            </ul>

            <div className="not-prose bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl p-8 border border-purple-200 dark:border-purple-900 my-12">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">The Deep Work Formula</h3>
              <div className="text-center py-6">
                <div className="text-3xl font-mono text-purple-600 dark:text-purple-400">
                  High-Quality Work = Time Spent × Intensity of Focus
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
                You can work 12 hours with constant interruptions and produce less than 2 hours of uninterrupted deep focus. Intensity matters more than hours logged.
              </p>
            </div>

            <h2>Why 2025 Is Different</h2>
            <p>
              Five years ago, deep work was a competitive advantage. Today? It's a survival skill.
            </p>
            <p>
              <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline">AI is commoditizing surface-level knowledge work</Link>. ChatGPT can write your emails. Copilot can generate boilerplate code. Midjourney can create quick graphics.
            </p>
            <p>
              What AI can't do (yet): think deeply, synthesize complex ideas, make nuanced decisions, create truly original work.
            </p>
            <p>
              The future belongs to those who can still think.
            </p>

            <h2>My Deep Work System (2025 Edition)</h2>
            <p>
              I've spent years refining my approach. Here's what actually works:
            </p>

            <h3>1. The 90-Minute Block</h3>
            <p>
              I schedule two 90-minute deep work blocks daily. Morning (6:30-8:00am) and afternoon (2:00-3:30pm). These are non-negotiable. No meetings, no calls, no "quick questions."
            </p>
            <p>
              Why 90 minutes? It aligns with ultradian rhythms—natural energy cycles. Most people can't sustain true focus beyond 90 minutes anyway. Going longer leads to diminishing returns.
            </p>

            <h3>2. The Environment</h3>
            <p>
              <strong>Phone:</strong> In another room. Not "on silent." Not "face down." In. Another. Room.
            </p>
            <p>
              <strong>Computer:</strong> All notifications off. Email closed. <Link href="/shop" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline">Noise-canceling headphones</Link> on (even in silence—it's a psychological trigger).
            </p>
            <p>
              <strong>Apps blocked:</strong> Freedom.to blocks every distraction site. Can't bypass it even if I try.
            </p>
            <p>
              <strong>Location:</strong> I have a specific chair where I only do deep work. Never check email there. Never scroll Twitter there. Classical conditioning.
            </p>

            <h3>3. The Pre-Work Ritual</h3>
            <p>
              Before each deep work session:
            </p>
            <ol>
              <li><strong>Define the goal:</strong> "Write 1,500 words of Chapter 3" not "work on book"</li>
              <li><strong>Gather materials:</strong> Everything I need within arm's reach. No mid-session trips.</li>
              <li><strong>Breathwork:</strong> 2 minutes of box breathing (4-4-4-4). <Link href="/meditations" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline">Meditation practice</Link> trains your focus muscle.</li>
              <li><strong>Timer starts:</strong> Commitment device. I honor the 90 minutes.</li>
            </ol>

            <h3>4. The Recovery Protocol</h3>
            <p>
              Deep work is exhausting. You can't do it all day. After each session:
            </p>
            <ul>
              <li><strong>Walk outside:</strong> 15 minutes minimum. Nature resets the brain.</li>
              <li><strong>No screens:</strong> Don't go from deep work to doomscrolling.</li>
              <li><strong>Hydration:</strong> Mental work depletes you. Drink water.</li>
              <li><strong>Nutrition:</strong> High-protein snack. Your brain burned serious calories.</li>
            </ul>

            <h2>What Deep Work Gave Me</h2>
            <p>
              Since implementing this system:
            </p>
            <ul>
              <li><strong>10x output:</strong> I write more, code better, think clearer. Two focused hours beats eight scattered ones.</li>
              <li><strong>Better ideas:</strong> Deep thinking produces insights you can't get from quick takes.</li>
              <li><strong>Less stress:</strong> When you know you did real work, you don't carry guilt.</li>
              <li><strong>Competitive edge:</strong> While everyone's in meetings, I'm shipping.</li>
            </ul>

            <div className="not-prose my-12 p-10 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-2xl text-white text-center shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">Start Your Deep Work Practice</h3>
              <p className="text-purple-50 text-lg mb-8 max-w-2xl mx-auto">
                Explore my curated collection of tools and resources for building unshakeable focus.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 hover:bg-purple-50 font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
              >
                Browse Focus Tools
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <h2>The Hard Truth</h2>
            <p>
              Most people will never do deep work. It's uncomfortable. It requires discipline. It means saying no to dopamine hits.
            </p>
            <p>
              But that's exactly why it's valuable.
            </p>
            <p>
              In 2025, everyone has access to the same information, the same tools, the same AI. The differentiator isn't what you know—it's your ability to <em>think</em> with what you know.
            </p>
            <p>
              Focus is the new luxury. Protect it like you'd protect your most valuable possession.
            </p>
            <p>
              Because it is.
            </p>

            <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

            <div className="not-prose flex items-start gap-6 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  BM
                </div>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg mb-2">About Brandon Mills</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Model, writer, and advocate for intentional living. I believe the quality of your attention determines the quality of your life. When I'm not practicing deep work, I'm writing about philosophy, productivity, and the art of deliberate focus.
                </p>
                <div className="mt-4">
                  <Link
                    href="/about"
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Learn more about me →
                  </Link>
                </div>
              </div>
            </div>

            <div className="not-prose mt-12">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Related Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  href="/meditations"
                  className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all"
                >
                  <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-2">
                    Guided Meditations
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Train your focus muscle with curated meditation practices.
                  </p>
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    Explore →
                  </div>
                </Link>

                <Link
                  href="/shop"
                  className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all"
                >
                  <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-2">
                    Productivity Tools
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Noise-canceling headphones, books, and gear for deep work.
                  </p>
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    View Products →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Want More Philosophy?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
              I write about intentional living, productivity, and the philosophy of focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Read More Articles
              </Link>
              <Link
                href="/us-collaboration"
                className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
              >
                Join US Collaboration
              </Link>
            </div>
          </div>

          <EbookCTA variant="footer" source="deep-work-philosophy-2025" />
        </div>
      </article>
    </>
  )
}
