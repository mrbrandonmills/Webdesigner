/**
 * Journey Preferences Manager
 * Handles user preferences for device optimization and accessibility
 */

export type DevicePreference = 'phone' | 'desktop' | 'both'

export interface JourneyPreferences {
  device: DevicePreference
  accessibility: boolean
  onboardingComplete: boolean
  lastVisit: number
}

const STORAGE_KEY = 'journey-preferences'

/**
 * Get stored preferences or return defaults
 */
export function getPreferences(): JourneyPreferences {
  if (typeof window === 'undefined') {
    return getDefaultPreferences()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultPreferences()

    const parsed = JSON.parse(stored) as JourneyPreferences
    return {
      ...getDefaultPreferences(),
      ...parsed
    }
  } catch {
    return getDefaultPreferences()
  }
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: Partial<JourneyPreferences>): void {
  if (typeof window === 'undefined') return

  try {
    const current = getPreferences()
    const updated = {
      ...current,
      ...preferences,
      lastVisit: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save journey preferences:', error)
  }
}

/**
 * Check if onboarding should be shown
 */
export function shouldShowOnboarding(): boolean {
  if (typeof window === 'undefined') return false

  const prefs = getPreferences()
  return !prefs.onboardingComplete
}

/**
 * Mark onboarding as complete
 */
export function completeOnboarding(device: DevicePreference, accessibility: boolean): void {
  savePreferences({
    device,
    accessibility,
    onboardingComplete: true
  })
}

/**
 * Reset preferences (for testing)
 */
export function resetPreferences(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get default preferences
 */
function getDefaultPreferences(): JourneyPreferences {
  return {
    device: 'both',
    accessibility: false,
    onboardingComplete: false,
    lastVisit: 0
  }
}

/**
 * Auto-detect device type
 */
export function detectDevice(): DevicePreference {
  if (typeof window === 'undefined') return 'desktop'

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isTablet = /iPad/i.test(navigator.userAgent)

  if (isMobile && !isTablet) return 'phone'
  return 'desktop'
}
