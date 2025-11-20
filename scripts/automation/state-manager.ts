/**
 * State Manager
 *
 * Tracks which content has been posted to avoid duplicates
 * Manages posting history and rotation
 */

import * as fs from 'fs'
import * as path from 'path'
import { pathsConfig } from './config'
import { logger } from './logger'

interface PostRecord {
  id: string
  platform: string
  contentId: string
  title?: string
  subreddit?: string
  url?: string
  postedAt: string
  success: boolean
  error?: string
}

interface PlatformState {
  lastPostIndex: number
  lastPostTime: string
  totalPosts: number
  postsToday: number
  lastDayReset: string
}

interface AutomationState {
  reddit: PlatformState
  twitter: PlatformState
  quora: PlatformState
  linkedin: PlatformState
  pinterest: PlatformState
  hackernews: PlatformState
  postHistory: PostRecord[]
  generatedContent: {
    lastGenerated: string
    count: number
  }
}

type PlatformName = 'reddit' | 'twitter' | 'quora' | 'linkedin' | 'pinterest' | 'hackernews'

const defaultState: AutomationState = {
  reddit: {
    lastPostIndex: -1,
    lastPostTime: '',
    totalPosts: 0,
    postsToday: 0,
    lastDayReset: new Date().toDateString(),
  },
  twitter: {
    lastPostIndex: -1,
    lastPostTime: '',
    totalPosts: 0,
    postsToday: 0,
    lastDayReset: new Date().toDateString(),
  },
  quora: {
    lastPostIndex: -1,
    lastPostTime: '',
    totalPosts: 0,
    postsToday: 0,
    lastDayReset: new Date().toDateString(),
  },
  linkedin: {
    lastPostIndex: -1,
    lastPostTime: '',
    totalPosts: 0,
    postsToday: 0,
    lastDayReset: new Date().toDateString(),
  },
  pinterest: {
    lastPostIndex: -1,
    lastPostTime: '',
    totalPosts: 0,
    postsToday: 0,
    lastDayReset: new Date().toDateString(),
  },
  hackernews: {
    lastPostIndex: -1,
    lastPostTime: '',
    totalPosts: 0,
    postsToday: 0,
    lastDayReset: new Date().toDateString(),
  },
  postHistory: [],
  generatedContent: {
    lastGenerated: '',
    count: 0,
  },
}

class StateManager {
  private statePath: string
  private state: AutomationState

  constructor() {
    this.statePath = pathsConfig.automationState
    this.ensureDataDirectory()
    this.state = this.loadState()
  }

  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.statePath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }

  private loadState(): AutomationState {
    try {
      if (fs.existsSync(this.statePath)) {
        const content = fs.readFileSync(this.statePath, 'utf-8')
        const loaded = JSON.parse(content)
        // Merge with defaults to handle new fields
        return { ...defaultState, ...loaded }
      }
    } catch (error) {
      logger.error('STATE', 'Failed to load state, using defaults', error)
    }
    return { ...defaultState }
  }

  private saveState(): void {
    try {
      fs.writeFileSync(this.statePath, JSON.stringify(this.state, null, 2))
    } catch (error) {
      logger.error('STATE', 'Failed to save state', error)
    }
  }

  // Reset daily counts if it's a new day
  private checkDayReset(platform: PlatformName): void {
    const today = new Date().toDateString()
    // Ensure platform exists in state
    if (!this.state[platform]) {
      this.state[platform] = {
        lastPostIndex: -1,
        lastPostTime: '',
        totalPosts: 0,
        postsToday: 0,
        lastDayReset: today,
      }
    }
    if (this.state[platform].lastDayReset !== today) {
      this.state[platform].postsToday = 0
      this.state[platform].lastDayReset = today
      this.saveState()
    }
  }

  // Get the next content index for rotation
  getNextIndex(platform: PlatformName, totalItems: number): number {
    this.checkDayReset(platform)
    const nextIndex = (this.state[platform].lastPostIndex + 1) % totalItems
    return nextIndex
  }

  // Record a successful post
  recordPost(
    platform: PlatformName,
    contentId: string,
    success: boolean,
    details: {
      title?: string
      subreddit?: string
      url?: string
      error?: string
      index?: number
      postId?: string
      pinId?: string
      hnId?: string
    }
  ): void {
    this.checkDayReset(platform)

    // Update platform state
    if (success) {
      if (details.index !== undefined) {
        this.state[platform].lastPostIndex = details.index
      } else {
        this.state[platform].lastPostIndex++
      }
      this.state[platform].totalPosts++
      this.state[platform].postsToday++
    }
    this.state[platform].lastPostTime = new Date().toISOString()

    // Add to history
    const record: PostRecord = {
      id: `${platform}-${Date.now()}`,
      platform,
      contentId,
      title: details.title,
      subreddit: details.subreddit,
      url: details.url,
      postedAt: new Date().toISOString(),
      success,
      error: details.error,
    }

    this.state.postHistory.push(record)

    // Keep only last 1000 records
    if (this.state.postHistory.length > 1000) {
      this.state.postHistory = this.state.postHistory.slice(-1000)
    }

    this.saveState()
  }

  // Check if we've hit daily limit
  canPostToday(platform: PlatformName, limit: number): boolean {
    this.checkDayReset(platform)
    return this.state[platform].postsToday < limit
  }

  // Get posts remaining today
  getPostsRemaining(platform: PlatformName, limit: number): number {
    this.checkDayReset(platform)
    return Math.max(0, limit - this.state[platform].postsToday)
  }

  // Check if content was already posted
  wasPosted(platform: string, contentId: string): boolean {
    return this.state.postHistory.some(
      record => record.platform === platform &&
                record.contentId === contentId &&
                record.success
    )
  }

  // Get all posted content IDs for a platform
  getPostedIds(platform: string): string[] {
    return this.state.postHistory
      .filter(record => record.platform === platform && record.success)
      .map(record => record.contentId)
  }

  // Get recent post history for a platform
  getRecentPosts(platform?: string, limit: number = 50): PostRecord[] {
    let records = this.state.postHistory
    if (platform) {
      records = records.filter(r => r.platform === platform)
    }
    return records.slice(-limit)
  }

  // Get platform statistics
  getStats(platform: PlatformName): PlatformState {
    this.checkDayReset(platform)
    return { ...this.state[platform] }
  }

  // Get all statistics
  getAllStats(): { [key: string]: PlatformState } {
    return {
      reddit: this.getStats('reddit'),
      twitter: this.getStats('twitter'),
      quora: this.getStats('quora'),
      linkedin: this.getStats('linkedin'),
      pinterest: this.getStats('pinterest'),
      hackernews: this.getStats('hackernews'),
    }
  }

  // Record content generation
  recordContentGeneration(count: number): void {
    this.state.generatedContent.lastGenerated = new Date().toISOString()
    this.state.generatedContent.count += count
    this.saveState()
  }

  // Get last generation time
  getLastGeneration(): { lastGenerated: string; count: number } {
    return { ...this.state.generatedContent }
  }

  // Reset state for a platform (use with caution)
  resetPlatform(platform: PlatformName): void {
    this.state[platform] = { ...defaultState[platform] }
    this.saveState()
    logger.info('STATE', `Reset state for ${platform}`)
  }

  // Export state for backup
  exportState(): AutomationState {
    return { ...this.state }
  }

  // Import state from backup
  importState(newState: AutomationState): void {
    this.state = { ...defaultState, ...newState }
    this.saveState()
    logger.info('STATE', 'State imported successfully')
  }
}

// Export singleton instance
export const stateManager = new StateManager()
export default stateManager
