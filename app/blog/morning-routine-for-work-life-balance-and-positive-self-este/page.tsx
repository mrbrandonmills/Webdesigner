import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Morning routine for work life, balance, and positive self-esteem | Brandon Mills',
  description: 'So here’s a morning routine with step-by-step instructions for developing healthy self-esteem and achieving a successful work-life balance:...',
  keywords: ['mental-health', 'meditation', 'technology', 'personal-growth', 'morning', 'routine', 'work', 'life', 'balance'],
  openGraph: {
    title: 'Morning routine for work life, balance, and positive self-esteem',
    description: 'So here’s a morning routine with step-by-step instructions for developing healthy self-esteem and achieving a successful work-life balance:...',
    type: 'article',
    publishedTime: '2025-11-18',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morning routine for work life, balance, and positive self-esteem',
    description: 'So here’s a morning routine with step-by-step instructions for developing healthy self-esteem and achieving a successful work-life balance:...',
  }
}

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {['mental-health', 'meditation', 'technology', 'personal-growth', 'morning', 'routine', 'work', 'life', 'balance'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Morning routine for work life, balance, and positive self-esteem
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2025-11-18">November 17, 2025</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>2 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">So here’s a morning routine with step-by-step instructions for developing healthy self-esteem and achieving a successful work-life balance:</p>
            <p className="text-white/80 leading-relaxed mb-6">Wake up at a consistent time each day, ideally with enough time to complete your morning routine without feeling rushed or stressed.</p>
            <p className="text-white/80 leading-relaxed mb-6">Start your day with some quiet time to reflect and set intentions for the day ahead. This could include meditation, journaling, or simply sitting in silence.</p>
            <p className="text-white/80 leading-relaxed mb-6">Eat a healthy breakfast that includes protein, complex carbohydrates, and healthy fats. This could be something like oatmeal with nuts and fruit, or eggs with whole grain toast and avocado.</p>
            <p className="text-white/80 leading-relaxed mb-6">Take time to care for your physical body, whether that’s through exercise, stretching, or simply taking a walk outside. This will help you feel energized and ready to take on the day.</p>
            <p className="text-white/80 leading-relaxed mb-6">As you get ready for work, take time to remind yourself of your strengths and accomplishments. This could include affirmations, visualization exercises, or simply reflecting on past successes.</p>
            <p className="text-white/80 leading-relaxed mb-6">Prioritize your tasks for the day, making sure to include both work and personal responsibilities. Be realistic about what you can accomplish, and don’t be afraid to delegate or ask for help if needed.</p>
            <p className="text-white/80 leading-relaxed mb-6">Throughout the day, take breaks to recharge and refocus. This could include going for a walk, taking a few deep breaths, or simply closing your eyes and resting for a few minutes.</p>
            <p className="text-white/80 leading-relaxed mb-6">When you finish work for the day, take time to transition out of work mode and into personal time. This could include a commute home, a quick workout, or simply a few minutes of relaxation or meditation.</p>
            <p className="text-white/80 leading-relaxed mb-6">During your personal time, prioritize activities that help you recharge and relax. This could include spending time with loved ones, pursuing hobbies or interests, or simply taking time to do nothing at all.</p>
            <p className="text-white/80 leading-relaxed mb-6">Before bed, take time to reflect on the day and express gratitude for the positive things that happened. This will help you go to bed with a positive mindset and set you up for success the next day.</p>
            <p className="text-white/80 leading-relaxed mb-6">By following this routine, you’ll be able to develop healthy self-esteem and achieve a successful work-life balance by prioritizing self-care, setting realistic goals, and taking time to recharge and relax.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'meditation', 'technology', 'personal-growth', 'morning', 'routine', 'work', 'life', 'balance'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </main>
  )
}
