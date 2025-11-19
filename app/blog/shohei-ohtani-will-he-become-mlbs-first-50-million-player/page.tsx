import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shohei Ohtani: Will he Become MLB’s First $50 Million Player? | Brandon Mills',
  description: 'Shohei Ohtani is undoubtedly one of the most exciting players in Major League Baseball (MLB) today. The Los Angeles Angels’ two-way superstar has already made h...',
  keywords: ['philosophy', 'technology', 'personal-growth', 'shohei', 'ohtani', 'become', 'mlb’s', 'first'],
  openGraph: {
    title: 'Shohei Ohtani: Will he Become MLB’s First $50 Million Player?',
    description: 'Shohei Ohtani is undoubtedly one of the most exciting players in Major League Baseball (MLB) today. The Los Angeles Angels’ two-way superstar has already made h...',
    type: 'article',
    publishedTime: '2023-02-21',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shohei Ohtani: Will he Become MLB’s First $50 Million Player?',
    description: 'Shohei Ohtani is undoubtedly one of the most exciting players in Major League Baseball (MLB) today. The Los Angeles Angels’ two-way superstar has already made h...',
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
              {['philosophy', 'technology', 'personal-growth', 'shohei', 'ohtani', 'become', 'mlb’s', 'first'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Shohei Ohtani: Will he Become MLB’s First $50 Million Player?
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-21">February 20, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Shohei Ohtani is undoubtedly one of the most exciting players in Major League Baseball (MLB) today. The Los Angeles Angels’ two-way superstar has already made history by becoming the first player to be selected as both an All-Star pitcher and hitter in the same season. His incredible talent has generated much discussion about his potential earning power, with some speculating that he could become the first player to earn $50 million a year. But is this a realistic possibility?</p>
            <p className="text-white/80 leading-relaxed mb-6">To answer this question, we first need to understand how player salaries are determined in MLB. Unlike some other sports leagues, MLB does not have a salary cap. Instead, teams are subject to a luxury tax, which is a penalty that is imposed on teams that exceed a certain payroll threshold. This means that teams are free to offer whatever salary they like to their players, as long as they are willing to pay the luxury tax.</p>
            <p className="text-white/80 leading-relaxed mb-6">So, in theory, there is no reason why Ohtani couldn’t become the first $50 million a year player. However, in practice, there are a number of factors that make this unlikely.</p>
            <p className="text-white/80 leading-relaxed mb-6">First and foremost, Ohtani is still under contract with the Angels for the next two seasons. He signed a six-year, $25 million deal with the team in 2018, which means that he will earn an average of $4.1 million per year over the course of his contract. While this is certainly a very modest salary for a player of his caliber, it does give the Angels a certain degree of control over his future earnings. If Ohtani continues to perform at his current level over the next two seasons, the Angels will almost certainly look to sign him to a long-term extension. This would likely involve a significant increase in his salary, but it is unlikely that it would be enough to reach the $50 million mark.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another factor to consider is the state of the current market for baseball players. While there are certainly players earning large salaries in MLB, the highest-paid players typically earn around $35 million a year. Currently, the highest-paid player in the league is Mike Trout, who signed a 12-year, $426.5 million extension with the Angels in 2019. This deal averages out to just over $35 million per year, which is still a long way short of the $50 million mark.</p>
            <p className="text-white/80 leading-relaxed mb-6">It is worth noting that there have been a number of factors that have contributed to the relatively stagnant market for baseball salaries in recent years. One of the most significant of these is the increasing use of advanced analytics in player evaluation. Teams are becoming more sophisticated in their approach to player acquisitions, which means that they are less likely to overpay for players who don’t offer sufficient value. Additionally, teams are becoming more cautious about committing to long-term contracts, as they are aware of the risks associated with giving large sums of money to players who may not perform as well in the future.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: While it is technically possible that Ohtani could become the first $50 million a year player, it is unlikely to happen anytime soon. The combination of his current contract, the state of the current market for baseball salaries, and the cautious approach of teams to player acquisitions all make it unlikely that he will achieve this milestone in the near future. However, it is clear that Ohtani is one of the most talented players in the league, and his continued success is sure to generate plenty of excitement among baseball fans for years to come.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'personal-growth', 'shohei', 'ohtani', 'become', 'mlb’s', 'first'].map((tag) => (
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
