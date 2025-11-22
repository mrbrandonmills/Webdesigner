import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Anybody Sick of All the Cheap S*%t from China? | Brandon Mills',
  description: 'I sure as hell am — so join me for a little vent session....',
  keywords: ['mental-health', 'technology', 'anybody', 'sick', 'cheap', 's*%t', 'china?'],
  openGraph: {
    title: 'Anybody Sick of All the Cheap S*%t from China?',
    description: 'I sure as hell am — so join me for a little vent session....',
    type: 'article',
    publishedTime: '2019-09-02',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anybody Sick of All the Cheap S*%t from China?',
    description: 'I sure as hell am — so join me for a little vent session....',
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
              {['mental-health', 'technology', 'anybody', 'sick', 'cheap', 's*%t', 'china?'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Anybody Sick of All the Cheap S*%t from China?
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2019-09-02">September 1, 2019</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">I sure as hell am — so join me for a little vent session.</p>
            <p className="text-white/80 leading-relaxed mb-6">First let me say that In a lot of ways, I feel, the world has become a much better place. Our seemingly effortless ability to connect, internationally, 24/7 — allows for this type of fantastic discussion that brings the rich and diverse dialogue to the table. It also allows us to raise and debate issues that are more important than ever.</p>
            <p className="text-white/80 leading-relaxed mb-6">Look, I love a lot of Chinese culture. But our transition to an instant gratification society, especially here in the west, has enabled the type of behaviour that empowers Chinese manufacturing to sabotage our community completely.</p>
            <p className="text-white/80 leading-relaxed mb-6">What happened to the days when the only option was handmade furniture?</p>
            <p className="text-white/80 leading-relaxed mb-6">I know it was before my time. But I do remember that old antique chest of drawers. That beautiful trunk, the smell of Pinesol that brought the pristine finish back, removed the dust and left a shimmer, as the morning light glimmered off the polished wood. And it was real wood! You could tell because that shit was heavy! And you knew that every time Grandma asked you to rearrange a room! And it wasn’t just the furniture. It was the beauty in the angles, the subtle imperfections in the depression glass. Whether rich or poor like I was, you found houses filled with what not only looked and felt like timeless craftsmanship. It was.</p>
            <p className="text-white/80 leading-relaxed mb-6">Skip forward to my generation and beyond- you see our landfills saturated with cheap Chinese products, along with the explosion of a dollar and big-box stores like Walmart that sell it.</p>
            <p className="text-white/80 leading-relaxed mb-6">When you order Chinese products online, you often get misleading details that end in receiving the wrong model. (In the case of the Chinese operating system on the North American phone I ordered). You often get clothing sizes that are way off (Like a Men’s XL that wouldn’t fit at 12 years old). The list is seemingly endless and good luck with returns.</p>
            <p className="text-white/80 leading-relaxed mb-6">I’m not sure how many children have to taste led. How much water-downed honey or prisoner peeled garlic, we have to eat. (Watch the series “Rotten” on Netflix) Or ultimately, how many messages our world has to explicitly send us before we realize its time to pump the e-breaks and find ways to simplify.</p>
            <p className="text-white/80 leading-relaxed mb-6">It not easy. We’ve built up our addiction to this way of life and cutting the ties a bit will have side effects like trade wars. But it will also create the discussion we need to move from addicts of the instant-to a more mindful mentality. This shift will only happen if we healthily support each other as we learn together. We should start making it a priority to reinforce our values and the commitment to our local economy.</p>
            <p className="text-white/80 leading-relaxed mb-6">So next time you’re out shopping, remember to ask the right questions, keeping in mind cheaper isn’t always better. Next time you are throwing out that Chinese futon after one year because it broke already. Ask yourself if there is a better approach. Maybe think about the Kitchen set your grandma bought. It cost a lot more, but it was made local, its a classic, and more importantly, its lasted 100+ years.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'technology', 'anybody', 'sick', 'cheap', 's*%t', 'china?'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="anybody-sick-of-all-the-cheap-st-from-china" />
</div>
      </article>
    </main>
  )
}
