'use client'

/**
 * Meditation Unlock State Management
 * Handles checking and storing unlocked meditation state
 * Uses localStorage for persistence + session verification
 */

export interface UnlockedMeditation {
  slug: string
  unlockedAt: string
  sessionId?: string
}

const STORAGE_KEY = 'meditation_unlocks'
const EMAIL_KEY = 'meditation_user_email'

/**
 * Check if a meditation is unlocked locally
 */
export function isMeditationUnlocked(slug: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const unlocks = getLocalUnlocks()

    // Check if bundle is unlocked (unlocks all)
    if (unlocks.some(u => u.slug === 'all')) {
      return true
    }

    // Check if specific meditation is unlocked
    return unlocks.some(u => u.slug === slug)
  } catch (error) {
    console.error('Error checking meditation unlock:', error)
    return false
  }
}

/**
 * Get all locally unlocked meditations
 */
export function getLocalUnlocks(): UnlockedMeditation[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading unlocks:', error)
    return []
  }
}

/**
 * Store an unlocked meditation locally
 */
export function storeUnlock(slug: string, sessionId?: string): void {
  if (typeof window === 'undefined') return

  try {
    const unlocks = getLocalUnlocks()

    // Don't duplicate
    if (unlocks.some(u => u.slug === slug)) {
      return
    }

    unlocks.push({
      slug,
      unlockedAt: new Date().toISOString(),
      sessionId,
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocks))
  } catch (error) {
    console.error('Error storing unlock:', error)
  }
}

/**
 * Store user email for future unlock verification
 */
export function storeUserEmail(email: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(EMAIL_KEY, email)
  } catch (error) {
    console.error('Error storing email:', error)
  }
}

/**
 * Get stored user email
 */
export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(EMAIL_KEY)
  } catch (error) {
    console.error('Error reading email:', error)
    return null
  }
}

/**
 * Verify unlock token from URL and store locally
 */
export async function verifyUnlockToken(sessionId: string): Promise<{
  success: boolean
  meditationSlug?: string
  error?: string
}> {
  try {
    const response = await fetch('/api/meditation/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })

    const data = await response.json()

    if (data.unlocked && data.meditationSlug) {
      // Store unlock locally
      if (data.purchaseType === 'meditation_bundle') {
        storeUnlock('all', sessionId)
      } else {
        storeUnlock(data.meditationSlug, sessionId)
      }

      return {
        success: true,
        meditationSlug: data.meditationSlug,
      }
    }

    return {
      success: false,
      error: data.error || 'Unlock verification failed',
    }
  } catch (error) {
    console.error('Error verifying unlock token:', error)
    return {
      success: false,
      error: 'Network error during verification',
    }
  }
}

/**
 * Sync unlocks with server for logged-in user
 */
export async function syncUnlocksWithServer(email: string): Promise<void> {
  try {
    const response = await fetch(`/api/meditation/unlock?email=${encodeURIComponent(email)}`)
    const data = await response.json()

    if (data.meditations && Array.isArray(data.meditations)) {
      // Store all server-side unlocked meditations locally
      data.meditations.forEach((slug: string) => {
        storeUnlock(slug)
      })
    }
  } catch (error) {
    console.error('Error syncing unlocks:', error)
  }
}

/**
 * Clear all unlocks (for testing or logout)
 */
export function clearUnlocks(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(EMAIL_KEY)
  } catch (error) {
    console.error('Error clearing unlocks:', error)
  }
}

/**
 * Get count of unlocked meditations
 */
export function getUnlockCount(): number {
  const unlocks = getLocalUnlocks()

  // If bundle is unlocked, count as all 10
  if (unlocks.some(u => u.slug === 'all')) {
    return 10
  }

  return unlocks.length
}

/**
 * Check if bundle is unlocked
 */
export function isBundleUnlocked(): boolean {
  const unlocks = getLocalUnlocks()
  return unlocks.some(u => u.slug === 'all')
}
