'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AudioReader } from '@/components/audio-reader'
import { Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'

export default function SocialTheoryEssayPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const textContent = `
An Intro to "Social Theory" by Charles Lamert

By Brandon Mills

Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines such as sociology, psychology, anthropology, philosophy, and political science. A social theory textbook covers a wide range of concepts, ideas, and perspectives on society and its functioning. In this article, we will outline some of the most important points from a social theory textbook.

The concept of social structure: One of the key concepts in social theory is social structure. It refers to the patterned social arrangements that shape and guide individual and group behavior. Social structure encompasses various elements such as social institutions, norms, values, roles, and status. Social structure influences how people behave, interact with each other, and make decisions.

The role of power and inequality: Social theory acknowledges the presence of power and inequality in society. Power refers to the ability to influence others and control resources, while inequality refers to the unequal distribution of resources, opportunities, and benefits. Social theorists examine how power and inequality operate in different social contexts and how they affect individual and group behavior.

The significance of culture: Social theory recognizes the importance of culture in shaping individual and collective behavior. Culture refers to the shared beliefs, values, practices, and symbols that define a society. Social theorists explore how culture influences people's attitudes, behaviors, and perceptions of the world around them.

The impact of globalization: Social theory also examines the impact of globalization on society. Globalization refers to the increasing interconnectedness of the world, resulting from advancements in technology, transportation, and communication. Social theorists study how globalization affects different aspects of society such as culture, economics, politics, and social interactions.

The role of social change: Social theory also addresses the question of how society changes over time. Social change refers to the transformation of social structures and relationships over time. Social theorists explore the causes and consequences of social change and how it affects individuals and society as a whole.

The influence of social movements: Social theory also examines the role of social movements in promoting social change. Social movements refer to organized efforts by individuals or groups to bring about social, cultural, or political change. Social theorists explore the dynamics of social movements and how they influence society.

"Social Theory" by Charles Lemert is a comprehensive and accessible introduction to the field of social theory. The book provides a thorough overview of the major schools of thought in social theory, from classical to contemporary perspectives.

Lemert begins the book by discussing the origins of social theory in the Enlightenment, and how it evolved in response to the social and political changes that have occurred over the centuries. He then moves on to discuss the major schools of thought in social theory, including structural-functionalism, conflict theory, symbolic interactionism, and postmodernism. For each school of thought, Lemert explains the key concepts and ideas, as well as the historical and intellectual context in which they emerged.

One of the strengths of "Social Theory" is its emphasis on the practical implications of social theory. Throughout the book, Lemert shows how social theory can be used to better understand the social world and to effect social change. He provides numerous examples of how social theory has been used to analyze and address social problems, from poverty to racial inequality to environmental degradation.

Another strength of the book is its accessibility. Lemert's writing is clear and engaging, and he does an excellent job of making complex ideas and concepts understandable to a general audience. He also includes numerous examples and illustrations to help readers grasp the key concepts and ideas.

While "Social Theory" is primarily an introduction to the field of social theory, it also provides some critical analysis of the limitations and challenges of each school of thought. Lemert acknowledges the critiques and challenges to social theory, including the criticism that it can be overly abstract and detached from real-world concerns. He also notes the ongoing debates and controversies within the field, such as the tension between individualism and collectivism.

Overall, "Social Theory" is an excellent introduction to the field of social theory. It provides a comprehensive overview of the major schools of thought, and it emphasizes the practical implications of social theory for understanding and addressing social problems. Lemert's clear writing and accessible style make this book an ideal resource for students and anyone interested in understanding the social world.
  `.trim()

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('An Intro to Social Theory by Charles Lemert - by Brandon Mills')}`, '_blank')
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
  }

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
                Philosophy
              </p>

              <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight text-white drop-shadow-[0_0_20px_rgba(201,160,80,0.3)]">
                An Intro to "Social Theory" by Charles Lamert
              </h1>

              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

              <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
                <span>February 2023</span>
                <span>•</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Info */}
      <section className="pb-8 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between p-6 backdrop-blur-sm bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center">
                <span className="text-accent-gold font-serif text-lg">BM</span>
              </div>
              <div>
                <p className="text-white font-medium">Brandon Mills</p>
                <p className="text-white/60 text-sm">Writer & Philosopher</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={shareOnTwitter} className="p-2 text-white/60 hover:text-accent-gold transition-colors" aria-label="Share on Twitter">
                <Twitter size={18} />
              </button>
              <button onClick={shareOnLinkedIn} className="p-2 text-white/60 hover:text-accent-gold transition-colors" aria-label="Share on LinkedIn">
                <Linkedin size={18} />
              </button>
              <button onClick={copyLink} className="p-2 text-white/60 hover:text-accent-gold transition-colors" aria-label="Copy link">
                <LinkIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Reader */}
      <section className="pb-12 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <AudioReader
            contentId="social-theory"
            title="An Intro to Social Theory by Charles Lamert"
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
              Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines such as sociology, psychology, anthropology, philosophy, and political science. A social theory textbook covers a wide range of concepts, ideas, and perspectives on society and its functioning. In this article, we will outline some of the most important points from a social theory textbook.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Key Concepts in Social Theory</h3>

            <div className="space-y-4 pl-4 border-l-2 border-accent-gold/20">
              <div>
                <h4 className="text-lg font-serif text-accent-gold/90 mb-2">The concept of social structure</h4>
                <p>
                  One of the key concepts in social theory is social structure. It refers to the patterned social arrangements that shape and guide individual and group behavior. Social structure encompasses various elements such as social institutions, norms, values, roles, and status. Social structure influences how people behave, interact with each other, and make decisions.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif text-accent-gold/90 mb-2">The role of power and inequality</h4>
                <p>
                  Social theory acknowledges the presence of power and inequality in society. Power refers to the ability to influence others and control resources, while inequality refers to the unequal distribution of resources, opportunities, and benefits. Social theorists examine how power and inequality operate in different social contexts and how they affect individual and group behavior.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif text-accent-gold/90 mb-2">The significance of culture</h4>
                <p>
                  Social theory recognizes the importance of culture in shaping individual and collective behavior. Culture refers to the shared beliefs, values, practices, and symbols that define a society. Social theorists explore how culture influences people's attitudes, behaviors, and perceptions of the world around them.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif text-accent-gold/90 mb-2">The impact of globalization</h4>
                <p>
                  Social theory also examines the impact of globalization on society. Globalization refers to the increasing interconnectedness of the world, resulting from advancements in technology, transportation, and communication. Social theorists study how globalization affects different aspects of society such as culture, economics, politics, and social interactions.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif text-accent-gold/90 mb-2">The role of social change</h4>
                <p>
                  Social theory also addresses the question of how society changes over time. Social change refers to the transformation of social structures and relationships over time. Social theorists explore the causes and consequences of social change and how it affects individuals and society as a whole.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-serif text-accent-gold/90 mb-2">The influence of social movements</h4>
                <p>
                  Social theory also examines the role of social movements in promoting social change. Social movements refer to organized efforts by individuals or groups to bring about social, cultural, or political change. Social theorists explore the dynamics of social movements and how they influence society.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-8 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">About "Social Theory" by Charles Lemert</h3>

            <p>
              "Social Theory" by Charles Lemert is a comprehensive and accessible introduction to the field of social theory. The book provides a thorough overview of the major schools of thought in social theory, from classical to contemporary perspectives.
            </p>

            <p>
              Lemert begins the book by discussing the origins of social theory in the Enlightenment, and how it evolved in response to the social and political changes that have occurred over the centuries. He then moves on to discuss the major schools of thought in social theory, including structural-functionalism, conflict theory, symbolic interactionism, and postmodernism. For each school of thought, Lemert explains the key concepts and ideas, as well as the historical and intellectual context in which they emerged.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Strengths of the Book</h3>

            <p>
              One of the strengths of "Social Theory" is its emphasis on the practical implications of social theory. Throughout the book, Lemert shows how social theory can be used to better understand the social world and to effect social change. He provides numerous examples of how social theory has been used to analyze and address social problems, from poverty to racial inequality to environmental degradation.
            </p>

            <p>
              Another strength of the book is its accessibility. Lemert's writing is clear and engaging, and he does an excellent job of making complex ideas and concepts understandable to a general audience. He also includes numerous examples and illustrations to help readers grasp the key concepts and ideas.
            </p>

            <h3 className="text-2xl font-light font-serif text-accent-gold pt-6 drop-shadow-[0_0_10px_rgba(201,160,80,0.4)]">Critical Analysis</h3>

            <p>
              While "Social Theory" is primarily an introduction to the field of social theory, it also provides some critical analysis of the limitations and challenges of each school of thought. Lemert acknowledges the critiques and challenges to social theory, including the criticism that it can be overly abstract and detached from real-world concerns. He also notes the ongoing debates and controversies within the field, such as the tension between individualism and collectivism.
            </p>

            <div
              className="relative backdrop-blur-sm bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.02] border border-accent-gold/20 p-8 mt-12"
              style={{
                boxShadow: 'inset 0 0 40px rgba(201, 160, 80, 0.1), 0 0 20px rgba(201, 160, 80, 0.05)',
              }}
            >
              <h3 className="text-accent-gold text-sm tracking-wider uppercase mb-4 drop-shadow-[0_0_10px_rgba(201,160,80,0.5)]">Conclusion</h3>
              <p className="text-white/90 italic leading-relaxed">
                Overall, "Social Theory" is an excellent introduction to the field of social theory. It provides a comprehensive overview of the major schools of thought, and it emphasizes the practical implications of social theory for understanding and addressing social problems. Lemert's clear writing and accessible style make this book an ideal resource for students and anyone interested in understanding the social world.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Reading */}
      <section className="pb-16 container-wide relative z-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-serif text-white mb-6">Related Reading</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/writing/essays/enlightenment-through-science"
              className="p-6 backdrop-blur-sm bg-white/[0.02] border border-white/10 hover:border-accent-gold/50 transition-colors group"
            >
              <p className="text-accent-gold text-xs tracking-wider uppercase mb-2">Consciousness</p>
              <p className="text-white group-hover:text-accent-gold transition-colors">Enlightenment Through Science</p>
            </Link>
            <Link
              href="/writing/essays/self-esteem-cultivating-positive-self-image"
              className="p-6 backdrop-blur-sm bg-white/[0.02] border border-white/10 hover:border-accent-gold/50 transition-colors group"
            >
              <p className="text-accent-gold text-xs tracking-wider uppercase mb-2">Psychology</p>
              <p className="text-white group-hover:text-accent-gold transition-colors">Self-Esteem: Cultivating a Positive Self Image</p>
            </Link>
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
