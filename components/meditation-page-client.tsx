'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AudioReader } from '@/components/audio-reader'
import { MeditationUnlockGate } from '@/components/meditation-unlock-gate'
import { isMeditationUnlocked, verifyUnlockToken, storeUserEmail } from '@/lib/meditation-unlock'
import type { Meditation } from '@/lib/meditations-data'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface MeditationPageClientProps {
  meditation: Meditation
  scriptContent: string
}

function MeditationPageClientInner({ meditation, scriptContent }: MeditationPageClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkUnlock = async () => {
      // Check if unlock parameter is in URL (returning from Stripe)
      const sessionId = searchParams.get('session_id')
      const shouldUnlock = searchParams.get('unlock') === 'true'

      if (sessionId && shouldUnlock) {
        // Verify the session with our API
        const result = await verifyUnlockToken(sessionId)

        if (result.success) {
          setIsUnlocked(true)
          setShowSuccessMessage(true)

          // Hide success message after 5 seconds
          setTimeout(() => setShowSuccessMessage(false), 5000)

          // Clean URL (remove query params)
          window.history.replaceState({}, '', `/meditations/${meditation.slug}`)
        }
      } else {
        // Check local storage for unlock
        const unlocked = isMeditationUnlocked(meditation.slug)
        setIsUnlocked(unlocked)
      }

      setIsVerifying(false)
    }

    checkUnlock()
  }, [meditation.slug, searchParams])

  if (isVerifying) {
    return (
      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-3 border-accent-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 size={24} className="text-green-400" />
            <div>
              <p className="text-green-400 font-medium">Meditation Unlocked!</p>
              <p className="text-white/60 text-sm">You now have lifetime access to this meditation.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show unlock gate or audio player based on unlock status */}
      {isUnlocked ? (
        <AudioReader
          contentId={meditation.id}
          title={meditation.title}
          textContent={scriptContent}
          voicePreference={meditation.voice}
          showVoiceSelector={true}
        />
      ) : (
        <MeditationUnlockGate
          meditation={meditation}
          onUnlock={() => setIsUnlocked(true)}
        />
      )}
    </div>
  )
}

// Export with Suspense wrapper
export function MeditationPageClient(props: MeditationPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-3 border-accent-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      }
    >
      <MeditationPageClientInner {...props} />
    </Suspense>
  )
}
