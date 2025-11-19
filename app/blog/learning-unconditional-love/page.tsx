import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Learning Unconditional Love | Brandon Mills',
  description: 'My Personal Reflection....',
  keywords: ['mental-health', 'meditation', 'personal-growth', 'learning', 'unconditional', 'love'],
  openGraph: {
    title: 'Learning Unconditional Love',
    description: 'My Personal Reflection....',
    type: 'article',
    publishedTime: '2019-05-24',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning Unconditional Love',
    description: 'My Personal Reflection....',
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
              {['mental-health', 'meditation', 'personal-growth', 'learning', 'unconditional', 'love'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Learning Unconditional Love
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2019-05-24">May 23, 2019</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>5 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">My Personal Reflection.</p>
            <p className="text-white/80 leading-relaxed mb-6">I was learning today from my cousin about all these mental health issues from my dad’s side of the family that I didn’t know exist. It’s crazy to know that my dad is alive, but he refuses to talk to me on the phone, or see me. I feel blessed at least that my cousin will share what she knows of our family history. I know that learning about your family roots can help organize the healing process. A healing process I am in the depths of.</p>
            <p className="text-white/80 leading-relaxed mb-6">My cousin mentioned we might be doomed for all the hereditarily mental health issues and addictive behaviour in our family genes. But amongst other things I am dealing with, for me, this is simply another obstacle I will overcome.</p>
            <p className="text-white/80 leading-relaxed mb-6">I have made significant progress, and I will continue to do so by continuing to reshape my interactions and perceptions into a healthy outer mind. By empowering my inner mind, I’m making my ego subservient so that I can view the world through a clear lens and unmask the veil that has clouded my perception of the world around me. I continue to seek new information and new ways to challenge myself.</p>
            <p className="text-white/80 leading-relaxed mb-6">It seems that working on myself has become a full-time job. I realize how easy it is to let weakness creep in. So I look for perspective. Finding healthy challenges in my life allows me to reflect and point out situations that I can have gratitude for. This gratitude makes me stronger.</p>
            <p className="text-white/80 leading-relaxed mb-6">I haven’t checked my partners Instagram in a while. She left me. Same as my Dad. I am sure you are all too familiar with the cycle of digging into your past. But today, I didn’t feel strong enough to do it. But later that evening, after a good meditation, I dared to look.</p>
            <p className="text-white/80 leading-relaxed mb-6">It appears she has made some fantastic new friends. One of them looks like a man who has a romantic affinity for her. He is falling in love with her, as I did. My ego is the part of me that wants to possess her still, while my heart tells me to let go and heal.</p>
            <p className="text-white/80 leading-relaxed mb-6">This is an ultimate test for me and the work that I’m doing.</p>
            <p className="text-white/80 leading-relaxed mb-6">In the past, my ego would want to take control and send me into a skydive of fear and anxiety. I would have given into the jealousy that has been programmed into me, into all of us. But that’s gone now. I have poured out all the doubt and negativity that was in my previous cup and renewed the cup with love and affection.</p>
            <p className="text-white/80 leading-relaxed mb-6">I can feel the new person that I’ve become shining through my third eye chakra and lighting up the rest of my body with a sense of gratitude. I turn to this, and I can tell you that I’m happy that she is experiencing so many amazing things. I’ve learned to overcome the overwhelming desire to share my life with her. It has been replaced by an even greater unconditional love for her and her life. I never thought that I could grow to become a man that could watch my twin flame hold hands with another man and actually feel thankful that I can appreciate her still.</p>
            <p className="text-white/80 leading-relaxed mb-6">Watching her in these small movies, I’m captivated even more by her radiance, and it’s beautiful to see the smile on her face. How can I blame another man for falling in love with someone I too, love so much?</p>
            <p className="text-white/80 leading-relaxed mb-6">Love isn’t mutually exclusive. For all the parts of me that I had to let go (the parts of me I thought were crazy), I’ll happily keep the parts of me that reaffirm how emotionally intelligent I am. This is all coming out of the man who always thought I could just say the right thing, and it would fix any problem. But words are not strong enough in some circumstances. I realize now that most of the things that I want to say to her don’t require words. To bask in her presence and share our breath together in alignment would be a gift from God. Yet at the same time, I can thank God for giving me the strength to be able to let go of my own desires and expectations. To simply view her experience and her choices with appreciation and respect. With no desire to change any aspect of her decisions or control any part of her actions brings the freedom and peace that comes from that liberation.</p>
            <p className="text-white/80 leading-relaxed mb-6">It is a fantastic example of my real awakening to my true self. For I no longer have demons to fight. I only a few left to hug, let rise to the surface and let go.</p>
            <p className="text-white/80 leading-relaxed mb-6">This doesn’t mean I don’t miss her or wish I was the one behind the camera. But I do understand the challenges of being apart and accepting that she might end up with another man. My love for this woman is unconditional. What a feeling to learn to love someone outside of yourself or expectations.</p>
            <p className="text-white/80 leading-relaxed mb-6">Life is a long journey and I look forward to just being in her presences, if ever that day may come. In the meantime, I find serenity in the true love and contentment I feel in just seeing her happy.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'meditation', 'personal-growth', 'learning', 'unconditional', 'love'].map((tag) => (
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
