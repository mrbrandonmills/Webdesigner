'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AudioReader } from '@/components/audio-reader'

export default function SelfEsteemEssayPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const textContent = `
Self-Esteem: Cultivating a Positive Self Image

By Brandon Mills

Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to improved confidence, self-esteem, and a greater sense of self-worth. Here are some strategies you can use to cultivate a positive self-image.

Practice self-compassion. Self-compassion is about treating yourself with the same kindness, concern, and support that you would offer to a good friend. This means being patient and understanding with yourself when things don't go as planned or when you make mistakes. Practice self-compassion by acknowledging your own struggles, failures, and limitations, and by treating yourself with kindness and acceptance.

Practice self-care. Self-care involves taking care of your physical, emotional, and mental health. This can involve things like eating a healthy diet, getting enough sleep, exercising regularly, and engaging in activities that bring you joy and fulfillment. When you take care of yourself, you send a message to yourself that you are worthy of care and attention, which can help boost your self-esteem and self-image.

Focus on your strengths. It's easy to get caught up in your weaknesses and flaws, but focusing on your strengths can help you build a more positive self-image. Make a list of your strengths and accomplishments, and remind yourself of them regularly. When you focus on what you're good at, you're more likely to feel confident and capable.

Surround yourself with positivity. The people and things you surround yourself with can have a big impact on your self-image. Try to spend time with people who uplift and encourage you, and avoid those who bring you down or make you feel bad about yourself. You can also surround yourself with things that bring you joy and positivity, such as music, art, or nature.

Practice positive self-talk. The way you talk to yourself can have a big impact on your self-image. Make an effort to practice positive self-talk by replacing negative thoughts with positive ones. For example, instead of thinking "I can't do this," try thinking "I can do this, I just need to take it one step at a time." Positive self-talk can help you feel more confident and capable, which can in turn help boost your self-image.

Contemplation: Cultivating a positive self-image is a process that takes time and effort, but it's worth it. By practicing self-compassion, self-care, focusing on your strengths, surrounding yourself with positivity, and practicing positive self-talk, you can build a more positive and confident self-image. Remember, the way you see yourself matters, and you have the power to shape that perception.
  `.trim()

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Background Effects */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(201, 160, 80, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(201, 160, 80, 0.2) 0%, transparent 50%)',
        }}
      />
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201, 160, 80, 0.1) 2px, rgba(201, 160, 80, 0.1) 4px)',
        }}
      />

      {/* Navigation */}
      <section className="pt-32 pb-12 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/writing/essays"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase inline-block transition-all hover:tracking-[0.4em]"
          >
            ← Back to Essays
          </Link>
        </div>
      </section>

      {/* Essay Header - Glass Morphism */}
      <section className="pb-16 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative p-12 md:p-16 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-sm"
            style={{
              boxShadow: 'inset 0 0 60px rgba(201, 160, 80, 0.03), 0 0 80px rgba(201, 160, 80, 0.05)',
            }}
          >
            <div className="text-center space-y-6">
              <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
                Psychology
              </p>

              <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight text-white drop-shadow-[0_0_20px_rgba(201,160,80,0.3)]">
                Self-Esteem: Cultivating a Positive Self Image
              </h1>

              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

              <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
                <span>February 20, 2023</span>
                <span>•</span>
                <span>6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Reader */}
      <section className="pb-12 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <AudioReader
            contentId="self-esteem"
            title="Self-Esteem: Cultivating a Positive Self Image"
            textContent={textContent}
            voicePreference="male"
            showVoiceSelector={true}
            contentType="essay"
          />
        </div>
      </section>

      {/* Essay Content - Premium Parchment Effect */}
      <section className="pb-20 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative backdrop-blur-md bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-12 md:p-16"
            style={{
              boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5), 0 0 60px rgba(201, 160, 80, 0.1)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(201,160,80,0.02) 50%, rgba(255,255,255,0.03) 100%)',
            }}
          >
            <div className="prose prose-invert prose-lg space-y-6 text-white/90 leading-relaxed">
            <p>
              Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to improved confidence, self-esteem, and a greater sense of self-worth. Here are some strategies you can use to cultivate a positive self-image.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Practice Self-Compassion</h3>
            <p>
              Self-compassion is about treating yourself with the same kindness, concern, and support that you would offer to a good friend. This means being patient and understanding with yourself when things don't go as planned or when you make mistakes. Practice self-compassion by acknowledging your own struggles, failures, and limitations, and by treating yourself with kindness and acceptance.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Practice Self-Care</h3>
            <p>
              Self-care involves taking care of your physical, emotional, and mental health. This can involve things like eating a healthy diet, getting enough sleep, exercising regularly, and engaging in activities that bring you joy and fulfillment. When you take care of yourself, you send a message to yourself that you are worthy of care and attention, which can help boost your self-esteem and self-image.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Focus on Your Strengths</h3>
            <p>
              It's easy to get caught up in your weaknesses and flaws, but focusing on your strengths can help you build a more positive self-image. Make a list of your strengths and accomplishments, and remind yourself of them regularly. When you focus on what you're good at, you're more likely to feel confident and capable.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Surround Yourself with Positivity</h3>
            <p>
              The people and things you surround yourself with can have a big impact on your self-image. Try to spend time with people who uplift and encourage you, and avoid those who bring you down or make you feel bad about yourself. You can also surround yourself with things that bring you joy and positivity, such as music, art, or nature.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Practice Positive Self-Talk</h3>
            <p>
              The way you talk to yourself can have a big impact on your self-image. Make an effort to practice positive self-talk by replacing negative thoughts with positive ones. For example, instead of thinking "I can't do this," try thinking "I can do this, I just need to take it one step at a time." Positive self-talk can help you feel more confident and capable, which can in turn help boost your self-image.
            </p>

            <div
              className="relative backdrop-blur-sm bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.02] border border-accent-gold/20 p-8 mt-12"
              style={{
                boxShadow: 'inset 0 0 40px rgba(201, 160, 80, 0.1), 0 0 20px rgba(201, 160, 80, 0.05)',
              }}
            >
              <h3 className="text-accent-gold text-sm tracking-wider uppercase mb-4 drop-shadow-[0_0_10px_rgba(201,160,80,0.5)]">Contemplation</h3>
              <p className="text-white/90 italic leading-relaxed">
                Cultivating a positive self-image is a process that takes time and effort, but it's worth it. By practicing self-compassion, self-care, focusing on your strengths, surrounding yourself with positivity, and practicing positive self-talk, you can build a more positive and confident self-image. Remember, the way you see yourself matters, and you have the power to shape that perception.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="pb-32 container-wide relative z-10">
        <div className="max-w-3xl mx-auto pt-12">
          <div className="backdrop-blur-sm bg-white/[0.02] border-t border-white/10 pt-8 px-8 pb-8 flex justify-between">
            <Link
              href="/writing/essays"
              className="text-accent-gold hover:underline text-sm tracking-wider uppercase transition-all hover:tracking-[0.4em]"
            >
              ← All Essays
            </Link>
            <Link
              href="/writing"
              className="text-accent-gold hover:underline text-sm tracking-wider uppercase transition-all hover:tracking-[0.4em]"
            >
              Back to Writing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
