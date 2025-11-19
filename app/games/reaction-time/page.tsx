'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RotateCcw, Trophy, Share2, Twitter, Clock, Target, Brain } from 'lucide-react'
import Navigation from '@/components/navigation'

type GameState = 'waiting' | 'ready' | 'go' | 'clicked' | 'early' | 'results'

const performanceRatings = [
  { max: 150, label: 'Exceptional', color: 'text-accent-gold', description: 'Elite reflexes - top 1% of humans' },
  { max: 200, label: 'Excellent', color: 'text-green-400', description: 'Fighter pilot tier reactions' },
  { max: 250, label: 'Great', color: 'text-blue-400', description: 'Above average cognitive speed' },
  { max: 300, label: 'Good', color: 'text-purple-400', description: 'Normal healthy reaction time' },
  { max: 400, label: 'Average', color: 'text-white/60', description: 'Room for improvement' },
  { max: Infinity, label: 'Slow', color: 'text-red-400', description: 'Consider sleep and hydration' }
]

export default function ReactionTimeGame() {
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [attempts, setAttempts] = useState<number[]>([])
  const [bestTime, setBestTime] = useState<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getRandomDelay = () => Math.random() * 4000 + 1000 // 1-5 seconds

  const startGame = useCallback(() => {
    setGameState('ready')
    const delay = getRandomDelay()

    timeoutRef.current = setTimeout(() => {
      setGameState('go')
      setStartTime(performance.now())
    }, delay)
  }, [])

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      startGame()
    } else if (gameState === 'ready') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setGameState('early')
    } else if (gameState === 'go') {
      const endTime = performance.now()
      const time = Math.round(endTime - startTime)
      setReactionTime(time)
      setAttempts(prev => [...prev, time])

      if (!bestTime || time < bestTime) {
        setBestTime(time)
      }

      setGameState('clicked')
    } else if (gameState === 'early' || gameState === 'clicked') {
      setGameState('waiting')
    }
  }, [gameState, startTime, bestTime, startGame])

  const showResults = () => {
    setGameState('results')
  }

  const reset = () => {
    setAttempts([])
    setBestTime(null)
    setGameState('waiting')
  }

  const getRating = (time: number) => {
    return performanceRatings.find(r => time <= r.max) || performanceRatings[performanceRatings.length - 1]
  }

  const averageTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : 0

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Handle keyboard and full-screen clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleClick()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClick])

  return (
    <main
      className={`min-h-screen text-white cursor-pointer select-none transition-colors duration-200 ${
        gameState === 'waiting' ? 'bg-black' :
        gameState === 'ready' ? 'bg-red-900/30' :
        gameState === 'go' ? 'bg-accent-gold' :
        gameState === 'early' ? 'bg-red-600' :
        'bg-black'
      }`}
      onClick={handleClick}
    >
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-4 py-2 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-sm tracking-wider uppercase flex items-center gap-2">
                <Brain size={14} />
                Cognitive Assessment
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mb-4">
              Reaction Time <span className="text-accent-gold">Test</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Test your reflexes and cognitive processing speed. Click as fast as you can when the screen turns gold.
            </p>
          </motion.div>

          {/* Game Area - Visual indicator only, clicking anywhere on page works */}
          <motion.div
            className={`relative aspect-[16/9] overflow-hidden transition-colors duration-200 ${
              gameState === 'waiting' ? 'bg-white/5 border border-white/10' :
              gameState === 'ready' ? 'bg-red-500/20 border border-red-500/40' :
              gameState === 'go' ? 'bg-black/50 border-4 border-black' :
              gameState === 'early' ? 'bg-black/30 border border-red-400' :
              'bg-white/5 border border-white/10'
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {gameState === 'waiting' && (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <Target className="mx-auto mb-4 text-accent-gold" size={48} />
                    <p className="text-2xl font-serif mb-2">Click to Start</p>
                    <p className="text-white/40 text-sm">Wait for gold, then click!</p>
                  </motion.div>
                )}

                {gameState === 'ready' && (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <Clock className="mx-auto mb-4 text-red-400 animate-pulse" size={48} />
                    <p className="text-2xl font-serif text-red-400">Wait...</p>
                    <p className="text-white/40 text-sm">Don't click yet!</p>
                  </motion.div>
                )}

                {gameState === 'go' && (
                  <motion.div
                    key="go"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <Zap className="mx-auto mb-4 text-black" size={64} />
                    <p className="text-4xl font-serif text-black font-bold">CLICK!</p>
                  </motion.div>
                )}

                {gameState === 'early' && (
                  <motion.div
                    key="early"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <p className="text-3xl font-serif mb-2">Too Early!</p>
                    <p className="text-white/80">Click to try again</p>
                  </motion.div>
                )}

                {gameState === 'clicked' && (
                  <motion.div
                    key="clicked"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <p className="text-6xl font-light text-accent-gold mb-2">{reactionTime}ms</p>
                    <p className={`text-xl ${getRating(reactionTime).color}`}>
                      {getRating(reactionTime).label}
                    </p>
                    <p className="text-white/40 text-sm mt-2">Click to continue</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Attempts</p>
              <p className="text-2xl font-light">{attempts.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Average</p>
              <p className="text-2xl font-light">{averageTime || '-'}ms</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Best</p>
              <p className="text-2xl font-light text-accent-gold">{bestTime || '-'}ms</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4 justify-center">
            {attempts.length >= 3 && (
              <button
                onClick={showResults}
                className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors flex items-center gap-2"
              >
                <Trophy size={18} />
                View Results
              </button>
            )}
            {attempts.length > 0 && (
              <button
                onClick={reset}
                className="px-6 py-3 border border-white/20 hover:border-accent-gold/50 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            )}
          </div>

          {/* Results Modal */}
          <AnimatePresence>
            {gameState === 'results' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                onClick={() => setGameState('waiting')}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-black border border-accent-gold/30 p-8 max-w-md w-full"
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className="text-3xl font-serif text-center mb-6">Your Results</h2>

                  <div className="text-center mb-6">
                    <p className="text-6xl font-light text-accent-gold mb-2">{averageTime}ms</p>
                    <p className={`text-xl ${getRating(averageTime).color}`}>
                      {getRating(averageTime).label}
                    </p>
                    <p className="text-white/40 text-sm mt-1">
                      {getRating(averageTime).description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 text-center">
                      <p className="text-sm text-white/40">Best</p>
                      <p className="text-xl text-accent-gold">{bestTime}ms</p>
                    </div>
                    <div className="bg-white/5 p-3 text-center">
                      <p className="text-sm text-white/40">Attempts</p>
                      <p className="text-xl">{attempts.length}</p>
                    </div>
                  </div>

                  {/* Attempt History */}
                  <div className="mb-6">
                    <p className="text-sm text-white/40 mb-2">Attempt History</p>
                    <div className="flex flex-wrap gap-2">
                      {attempts.map((time, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 text-sm ${
                            time === bestTime ? 'bg-accent-gold/20 text-accent-gold' : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {time}ms
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Share */}
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=I%20scored%20${averageTime}ms%20average%20reaction%20time%20(${getRating(averageTime).label})%20on%20the%20cognitive%20test!&url=https://brandonmills.com/games/reaction-time`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-accent-gold text-black text-center font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Twitter size={16} />
                      Share
                    </a>
                    <button
                      onClick={() => setGameState('waiting')}
                      className="flex-1 px-4 py-3 border border-white/20 hover:border-accent-gold/50 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6">
              <Zap className="text-accent-gold mb-3" size={24} />
              <h3 className="text-lg font-serif mb-2">Why Test This?</h3>
              <p className="text-sm text-white/60">
                Reaction time reflects your brain's processing speed and can indicate overall cognitive health, sleep quality, and focus levels.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <Target className="text-accent-gold mb-3" size={24} />
              <h3 className="text-lg font-serif mb-2">Improve Your Score</h3>
              <p className="text-sm text-white/60">
                Better sleep, hydration, and regular exercise can improve reaction time. Meditation also enhances focus and response speed.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <Brain className="text-accent-gold mb-3" size={24} />
              <h3 className="text-lg font-serif mb-2">The Science</h3>
              <p className="text-sm text-white/60">
                Average human reaction time is 200-300ms. Under 200ms indicates excellent neural efficiency and cognitive processing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
