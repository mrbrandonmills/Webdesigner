/**
 * Instagram Posting Scheduler
 * Randomized posting times with natural variance
 * Tracks history to avoid patterns
 */

import cron from 'node-cron';
import { logger } from '../logger';
import fs from 'fs/promises';
import path from 'path';

interface PostingWindow {
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  probability: number; // 0-1, chance to actually post
}

interface PostingHistory {
  timestamp: string;
  window: string;
  productId: string;
  success: boolean;
}

interface SchedulerConfig {
  windows: PostingWindow[];
  historyPath: string;
  maxHistoryDays: number;
}

/**
 * Default posting windows with natural variance
 * Times: 9-9:30am, 12:15-1pm, 6:30-7:30pm, 8:45-9:30pm
 */
const DEFAULT_WINDOWS: PostingWindow[] = [
  {
    name: 'morning',
    startHour: 9,
    startMinute: 0,
    endHour: 9,
    endMinute: 30,
    probability: 0.7, // 70% chance to post
  },
  {
    name: 'lunch',
    startHour: 12,
    startMinute: 15,
    endHour: 13,
    endMinute: 0,
    probability: 0.7,
  },
  {
    name: 'evening',
    startHour: 18,
    startMinute: 30,
    endHour: 19,
    endMinute: 30,
    probability: 0.7,
  },
  {
    name: 'night',
    startHour: 20,
    startMinute: 45,
    endHour: 21,
    endMinute: 30,
    probability: 0.7,
  },
];

class InstagramScheduler {
  private config: SchedulerConfig;
  private history: PostingHistory[] = [];
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(config?: Partial<SchedulerConfig>) {
    this.config = {
      windows: config?.windows || DEFAULT_WINDOWS,
      historyPath: config?.historyPath || path.join(process.cwd(), 'data/instagram-history.json'),
      maxHistoryDays: config?.maxHistoryDays || 90,
    };
  }

  /**
   * Initialize scheduler and load history
   */
  async initialize(): Promise<void> {
    await this.loadHistory();
    logger.info('Instagram scheduler initialized');
  }

  /**
   * Load posting history from file
   */
  private async loadHistory(): Promise<void> {
    try {
      const data = await fs.readFile(this.config.historyPath, 'utf-8');
      this.history = JSON.parse(data);

      // Clean old history
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.maxHistoryDays);

      this.history = this.history.filter(
        entry => new Date(entry.timestamp) > cutoffDate
      );

      logger.info(`Loaded ${this.history.length} posting history entries`);
    } catch (error) {
      // File doesn't exist yet, that's fine
      this.history = [];
      logger.info('No posting history found, starting fresh');
    }
  }

  /**
   * Save posting history to file
   */
  private async saveHistory(): Promise<void> {
    try {
      const dir = path.dirname(this.config.historyPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        this.config.historyPath,
        JSON.stringify(this.history, null, 2)
      );
    } catch (error) {
      logger.error('Error saving posting history:', error);
    }
  }

  /**
   * Add entry to posting history
   */
  async addToHistory(
    window: string,
    productId: string,
    success: boolean
  ): Promise<void> {
    this.history.push({
      timestamp: new Date().toISOString(),
      window,
      productId,
      success,
    });

    await this.saveHistory();
  }

  /**
   * Calculate random time within a posting window
   */
  private calculateRandomTime(window: PostingWindow): Date {
    const now = new Date();
    const randomDate = new Date(now);

    // Random hour and minute within window
    const totalMinutesInWindow =
      (window.endHour * 60 + window.endMinute) -
      (window.startHour * 60 + window.startMinute);

    const randomMinutes = Math.floor(Math.random() * totalMinutesInWindow);
    const startMinutes = window.startHour * 60 + window.startMinute;
    const targetMinutes = startMinutes + randomMinutes;

    randomDate.setHours(Math.floor(targetMinutes / 60));
    randomDate.setMinutes(targetMinutes % 60);
    randomDate.setSeconds(0);
    randomDate.setMilliseconds(0);

    // If time has passed today, schedule for tomorrow
    if (randomDate < now) {
      randomDate.setDate(randomDate.getDate() + 1);
    }

    return randomDate;
  }

  /**
   * Check if should post (based on probability)
   */
  private shouldPost(window: PostingWindow): boolean {
    return Math.random() < window.probability;
  }

  /**
   * Get posting pattern analysis
   * Ensures we're not creating detectable patterns
   */
  getPatternAnalysis(): {
    totalPosts: number;
    postsPerWindow: Record<string, number>;
    averageTimeGaps: number[];
    detectablePattern: boolean;
  } {
    const analysis = {
      totalPosts: this.history.length,
      postsPerWindow: {} as Record<string, number>,
      averageTimeGaps: [] as number[],
      detectablePattern: false,
    };

    // Count posts per window
    this.history.forEach(entry => {
      analysis.postsPerWindow[entry.window] =
        (analysis.postsPerWindow[entry.window] || 0) + 1;
    });

    // Calculate time gaps
    const sortedHistory = [...this.history].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (let i = 1; i < sortedHistory.length; i++) {
      const gap =
        new Date(sortedHistory[i].timestamp).getTime() -
        new Date(sortedHistory[i - 1].timestamp).getTime();
      analysis.averageTimeGaps.push(gap / (1000 * 60 * 60)); // Convert to hours
    }

    // Check for detectable patterns
    // If all time gaps are very similar, that's suspicious
    if (analysis.averageTimeGaps.length > 5) {
      const avgGap =
        analysis.averageTimeGaps.reduce((a, b) => a + b, 0) /
        analysis.averageTimeGaps.length;
      const variance =
        analysis.averageTimeGaps.reduce(
          (sum, gap) => sum + Math.pow(gap - avgGap, 2),
          0
        ) / analysis.averageTimeGaps.length;

      // Low variance = detectable pattern
      analysis.detectablePattern = variance < 2; // Less than 2 hour variance
    }

    return analysis;
  }

  /**
   * Schedule a post with random delay
   */
  async schedulePost(
    window: PostingWindow,
    postCallback: () => Promise<{ productId: string; success: boolean }>
  ): Promise<void> {
    const postTime = this.calculateRandomTime(window);
    const now = new Date();
    const delay = postTime.getTime() - now.getTime();

    logger.info(
      `Scheduling ${window.name} post for ${postTime.toLocaleString()} (in ${Math.round(delay / 1000 / 60)} minutes)`
    );

    // Check if should actually post
    if (!this.shouldPost(window)) {
      logger.info(`Skipping ${window.name} post (random skip based on probability)`);
      return;
    }

    // Schedule the post
    setTimeout(async () => {
      try {
        logger.info(`Executing ${window.name} post...`);
        const result = await postCallback();

        await this.addToHistory(window.name, result.productId, result.success);

        if (result.success) {
          logger.info(`Successfully posted in ${window.name} window`);
        } else {
          logger.warn(`Post failed in ${window.name} window`);
        }
      } catch (error) {
        logger.error(`Error executing ${window.name} post:`, error);
        await this.addToHistory(window.name, 'unknown', false);
      }
    }, delay);
  }

  /**
   * Start automated scheduler with cron
   * Runs every day and schedules posts for that day
   */
  startDailyScheduler(
    postCallback: () => Promise<{ productId: string; success: boolean }>
  ): void {
    // Run at midnight to schedule posts for the day
    const dailyScheduler = cron.schedule('0 0 * * *', async () => {
      logger.info('Daily scheduler running - planning posts for today');

      // Schedule posts for each window
      for (const window of this.config.windows) {
        await this.schedulePost(window, postCallback);
      }

      // Log pattern analysis
      const analysis = this.getPatternAnalysis();
      logger.info('Pattern analysis:', analysis);

      if (analysis.detectablePattern) {
        logger.warn('⚠️ Posting pattern may be detectable - consider adjusting');
      }
    });

    this.scheduledJobs.set('daily', dailyScheduler);
    logger.info('Daily scheduler started');

    // Also schedule posts for today immediately
    this.config.windows.forEach(window => {
      this.schedulePost(window, postCallback);
    });
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll(): void {
    this.scheduledJobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped scheduler: ${name}`);
    });
    this.scheduledJobs.clear();
  }

  /**
   * Get next scheduled post time
   */
  getNextPostTime(): Date | null {
    const now = new Date();
    let nextTime: Date | null = null;

    for (const window of this.config.windows) {
      const time = this.calculateRandomTime(window);
      if (!nextTime || time < nextTime) {
        nextTime = time;
      }
    }

    return nextTime;
  }

  /**
   * Get recent posting history
   */
  getRecentHistory(days: number = 7): PostingHistory[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.history.filter(
      entry => new Date(entry.timestamp) > cutoff
    );
  }
}

export default InstagramScheduler;
export type { PostingWindow, PostingHistory, SchedulerConfig };
export { DEFAULT_WINDOWS };
