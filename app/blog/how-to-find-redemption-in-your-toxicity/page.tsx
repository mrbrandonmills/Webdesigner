import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How To Find Redemption In Your Toxicity | Brandon Mills',
  description: 'Off the bat, let me say, you can be both well-intentioned and toxic at the same time. The first step is awareness. If you’re reading this, then I’m proud of you...',
  keywords: ['mental-health', 'philosophy', 'meditation', 'technology', 'martial-arts', 'personal-growth', 'find', 'redemption', 'toxicity'],
  openGraph: {
    title: 'How To Find Redemption In Your Toxicity',
    description: 'Off the bat, let me say, you can be both well-intentioned and toxic at the same time. The first step is awareness. If you’re reading this, then I’m proud of you...',
    type: 'article',
    publishedTime: '2019-09-12',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How To Find Redemption In Your Toxicity',
    description: 'Off the bat, let me say, you can be both well-intentioned and toxic at the same time. The first step is awareness. If you’re reading this, then I’m proud of you...',
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
              {['mental-health', 'philosophy', 'meditation', 'technology', 'martial-arts', 'personal-growth', 'find', 'redemption', 'toxicity'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              How To Find Redemption In Your Toxicity
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2019-09-12">September 11, 2019</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>5 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Off the bat, let me say, you can be both well-intentioned and toxic at the same time. The first step is awareness. If you’re reading this, then I’m proud of you!</p>
            <p className="text-white/80 leading-relaxed mb-6">If you have anything in common with me, you might start looking back on your life, see some beauty, but ultimately feel consumed by the path of destruction left in your wake. Ruined friendships, who’s at fault for a break-up, even failed partnerships. Trying to be an honourable person, as well as ambitious, can be one of the most complicated challenges we face as humans. I’ve been called thoughtful, compassionate, even a visionary at times. But I’m haunted by the people who viewed me as insensitive, self-serving and even narcissistic. So where does the truth lie? Honestly, it’s somewhere in the middle. A place where most good compromises leave us, that’s both fair and uncomfortable.</p>
            <p className="text-white/80 leading-relaxed mb-6">What’s Next?</p>
            <p className="text-white/80 leading-relaxed mb-6">The problem is what happens after this realization. We can be left feeling insecure about our future relationships, wondering where the line is between standing up for what’s right and being selfish. Years can go by, being afraid to try, or fearful of engaging in new relationships. Not trusting who we are — carrying the guilt and shame for our past transgressions. The pain of this can have an emotional gravity akin to a black hole, sucking the light out of us. So how do we start to forgive ourselves? And just as necessary — trust ourselves again.</p>
            <p className="text-white/80 leading-relaxed mb-6">Accept Responsibility for Your Actions</p>
            <p className="text-white/80 leading-relaxed mb-6">For me, it took a failed 4-year relationship, a cancer diagnosis, the loss of my career, and a couple of years alone. This metaphorical, multi-headed sledgehammer to the heart, forced me to look within. I realized I had to stop looking at my life from an analytical perspective. Trying to weight the pros and cons of my actions. I had to finally accept there would be no trial or judgement day while I still walked on this earth. This was not the court case my mind wanted me to think it was. I was forced to surrender to the fact that my unhappiness, was, ultimately my responsibility and not open to debate.</p>
            <p className="text-white/80 leading-relaxed mb-6">Find Something Bigger Then Yourself to Believe In</p>
            <p className="text-white/80 leading-relaxed mb-6">My Grandpa was a gifted preacher. I remember when I was 5, I asked him what Hell was. To this day, I remember him taking my cold little hand in his, so warm from love and wisdom. He looked me in the eye and said: “Brandon, I don’t believe in Hell, but if it had to exist, I hope it’s a place where you learn the ways you hurt people in your life, and then are taught how to make amends.” What a beautiful revelation, a glorious gift of compassion and insight from the man I loved most in the world. Unfortunately, when my Grandpa died, my faith in anything more significant than myself died with him.</p>
            <p className="text-white/80 leading-relaxed mb-6">That sledgehammer was meant to kill me. I woke from what felt like a concussed dream, forced to acknowledge that my life had been ripped apart, by my own hands. I now faced the challenge of accepting the results of my handy work, and moreover, that looking externally for a reason to live was an ongoing exercise in futility. I found Yoga and Meditation. After Grandpa passed, I was no longer interested in religious endeavours. Meditation was a science. It allowed my judging and logical mind to commit to something wholeheartedly — and at its core, was connecting to something bigger than myself. Soon after I started to train my mind to be still, things began to make sense. Clarity washed over me, enlightening me to my suffering. I was able to acknowledge that my internal debate was a myriad of vines, blocking my sight. As if from an ego-driven fig tree had latched onto my soul, suffocating it from the outside in. Yoga helped release the stagnation and fear trapped in my body. Meditation became the machete that helped chop through the vines — Helping release my true essence.</p>
            <p className="text-white/80 leading-relaxed mb-6">Forgive Yourself</p>
            <p className="text-white/80 leading-relaxed mb-6">Don’t get me wrong; It’s hard to suppress the courtroom of personal inquiry. But the more you lean into something bigger than yourself, the easier it is to see yourself as fallible, a work in progress. You can start to embrace more of the vulnerability and authenticity, that in the beginning, may have been forced upon you through tough circumstance.</p>
            <p className="text-white/80 leading-relaxed mb-6">Be Aware of Relapse and Don’t Give Up</p>
            <p className="text-white/80 leading-relaxed mb-6">We are creatures of habit, having spent a lifetime reinforcing the conditioning to get ahead. When I was out in the county, in a trailer on two acres it felt at times like the universe had sent me to a minimum-security prison, but it was what I need at the time. I left feeling durable, ready to take on the world. That’s until I moved back to a big city and saw my first Ferrari. The old me came roaring back. I started falling into bad habits again, fighting the depression. My biochemistry wanted a quick fix, yet something in the work I’d done reminded me to go easy on myself. “Don’t get lost in it Brandon,” I would tell myself. “Stay true to the work, and this too shall pass.” I looked down at my 39-year-old hands and remembered the 5-year-old version sitting in my grandpa’s palm. This journey is like a school you create from yourself, and it’s going to take time, consistency, patience, and compassion to graduate to a place where you’re confident you’ve made amends.</p>
            <p className="text-white/80 leading-relaxed mb-6">We’re in This Together</p>
            <p className="text-white/80 leading-relaxed mb-6">I will be working on this for the rest of my life. So, if you start this journey, remember you’re not alone. Others like us have been cast to the same toxic Hell you feel doomed to repeat. But know it is possible to find a place of peace and happiness. It’s just much easier knowing you’re not the only one.</p>
            <p className="text-white/80 leading-relaxed mb-6">Much Love B</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'meditation', 'technology', 'martial-arts', 'personal-growth', 'find', 'redemption', 'toxicity'].map((tag) => (
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
