'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Compass, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { VoiceInput } from '@/components/voice-input'
import GenerationLoader from '@/components/generation-loader'
import { ActivityCounter } from '@/components/social-proof/activity-counter'
import { TestimonialCarousel } from '@/components/social-proof/testimonials'

interface Question {
  id: string
  question: string
  placeholder: string
}

const questions: Question[] = [
  {
    id: 'values',
    question: 'What do you value most in life?',
    placeholder: 'e.g., Family, freedom, creativity, security, adventure...'
  },
  {
    id: 'fears',
    question: 'What fears hold you back?',
    placeholder: 'e.g., Fear of failure, rejection, being alone, not being enough...'
  },
  {
    id: 'goals',
    question: 'What are your biggest goals for the next 5 years?',
    placeholder: 'e.g., Career advancement, starting a business, finding love, traveling...'
  },
  {
    id: 'strengths',
    question: 'What are your greatest strengths?',
    placeholder: 'e.g., Empathy, determination, creativity, leadership, patience...'
  },
  {
    id: 'relationships',
    question: 'How do you approach relationships?',
    placeholder: 'e.g., I give my all, I keep people at a distance, I seek deep connection...'
  },
  {
    id: 'challenges',
    question: 'What challenges are you currently facing?',
    placeholder: 'e.g., Career transition, health issues, relationship difficulties...'
  },
  {
    id: 'dreams',
    question: 'If money were no object, what would you do?',
    placeholder: 'e.g., Travel the world, start a charity, create art, build a community...'
  },
  {
    id: 'legacy',
    question: 'What legacy do you want to leave?',
    placeholder: 'e.g., To be remembered as kind, to have made a difference, to inspire others...'
  }
]

export default function LifePathOraclePage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isFirstQuestion = currentQuestion === 0
  const isLastQuestion = currentQuestion === questions.length - 1
  const currentAnswer = answers[questions[currentQuestion].id] || ''

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/gemini/lifepath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()
      router.push(`/oracle/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-[#C9A050]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Intro - Only shown on first question */}
          <AnimatePresence mode="wait">
            {isFirstQuestion && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
                  <Compass className="w-4 h-4 text-[#C9A050]" />
                  <span className="text-sm text-[#C9A050]">Life Path Oracle</span>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl mb-6">
                  Discover Your Archetype
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
                  Answer 8 questions to reveal your dominant archetype and unlock
                  personalized guidance for your life path.
                </p>

                {/* Activity Counter */}
                <ActivityCounter type="oracle" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
            >
              {/* Question Counter */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm text-[#C9A050]">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <Sparkles className="w-5 h-5 text-[#C9A050]" />
              </div>

              {/* Question */}
              <h2 className="font-serif text-2xl md:text-3xl mb-8">
                {questions[currentQuestion].question}
              </h2>

              {/* Answer Input */}
              <div className="relative">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={questions[currentQuestion].placeholder}
                  className="w-full h-40 p-4 pb-14 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 resize-none"
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 left-3">
                  <VoiceInput
                    onTranscript={(transcript) => handleAnswerChange(currentAnswer ? currentAnswer + ' ' + transcript : transcript)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-red-400 text-sm">{error}</p>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={isFirstQuestion || isLoading}
                  className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!currentAnswer.trim() || isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Compass className="w-5 h-5" />
                    Reveal My Path
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim() || isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Loading Bar */}
          <GenerationLoader
            isLoading={isLoading}
            message="Revealing your life path..."
            subMessage="AI is analyzing your responses and generating your personalized archetype visualization. This takes 1-2 minutes."
            color="#C9A050"
          />

          {/* Question Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuestion
                    ? 'bg-[#C9A050]'
                    : index < currentQuestion
                    ? 'bg-[#C9A050]/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-16">Transformative Insights</h2>
          <TestimonialCarousel filter="oracle" />
        </div>
      </section>
    </div>
  )
}
