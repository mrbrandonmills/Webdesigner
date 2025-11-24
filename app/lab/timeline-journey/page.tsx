import type { Metadata } from 'next'
import { ScrollJourney } from '@/components/timeline/scroll-journey'

export const metadata: Metadata = {
  title: 'Timeline Journey - Brandon Mills',
  description: 'A scroll-based journey through time. Experience the evolution of work through immersive 3D navigation.',
}

export default function TimelineJourneyPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <ScrollJourney />
    </main>
  )
}
