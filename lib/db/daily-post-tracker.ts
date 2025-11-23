/**
 * Daily Post Tracker
 * Tracks if we've already posted today using a simple in-memory cache
 * This prevents duplicate posts within the same day in stateless mode
 */

// Simple in-memory cache (resets when serverless function cold starts)
const dailyPostCache = new Map<string, string>()

export function hasPostedToday(key: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  const lastPosted = dailyPostCache.get(key)
  return lastPosted === today
}

export function markPostedToday(key: string): void {
  const today = new Date().toISOString().split('T')[0]
  dailyPostCache.set(key, today)
}
