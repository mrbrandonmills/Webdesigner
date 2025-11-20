/**
 * Instagram Engagement Automation
 * Auto-reply to comments with personalized responses
 * Natural delays and human-like patterns
 */

import InstagramGraphAPI from './official-api';
import { generateCommentReply } from './caption-generator';
import { logger } from '../logger';
import fs from 'fs/promises';
import path from 'path';

interface EngagementConfig {
  replyProbability: number; // 0-1, chance to reply to a comment
  minDelayMinutes: number;
  maxDelayMinutes: number;
  maxRepliesPerHour: number;
  blacklistedWords: string[];
  autoLikeComments: boolean;
  trackingPath: string;
}

interface CommentTracking {
  commentId: string;
  mediaId: string;
  username: string;
  text: string;
  repliedAt?: string;
  replied: boolean;
  liked: boolean;
}

class InstagramEngagementBot {
  private api: InstagramGraphAPI;
  private config: EngagementConfig;
  private tracking: Map<string, CommentTracking> = new Map();
  private replyQueue: Array<{ commentId: string; delay: number }> = [];

  constructor(api: InstagramGraphAPI, config?: Partial<EngagementConfig>) {
    this.api = api;
    this.config = {
      replyProbability: config?.replyProbability ?? 0.8, // 80% chance to reply
      minDelayMinutes: config?.minDelayMinutes ?? 5,
      maxDelayMinutes: config?.maxDelayMinutes ?? 30,
      maxRepliesPerHour: config?.maxRepliesPerHour ?? 10,
      blacklistedWords: config?.blacklistedWords ?? [
        'spam',
        'bot',
        'fake',
        'scam',
        'buy followers',
        'check my profile',
      ],
      autoLikeComments: config?.autoLikeComments ?? true,
      trackingPath: config?.trackingPath || path.join(process.cwd(), 'data/instagram-engagement.json'),
    };
  }

  /**
   * Initialize and load tracking data
   */
  async initialize(): Promise<void> {
    await this.loadTracking();
    logger.info('Engagement bot initialized');
  }

  /**
   * Load comment tracking from file
   */
  private async loadTracking(): Promise<void> {
    try {
      const data = await fs.readFile(this.config.trackingPath, 'utf-8');
      const trackingArray = JSON.parse(data);

      trackingArray.forEach((item: CommentTracking) => {
        this.tracking.set(item.commentId, item);
      });

      logger.info(`Loaded ${this.tracking.size} tracked comments`);
    } catch (error) {
      logger.info('No existing tracking data found');
    }
  }

  /**
   * Save comment tracking to file
   */
  private async saveTracking(): Promise<void> {
    try {
      const dir = path.dirname(this.config.trackingPath);
      await fs.mkdir(dir, { recursive: true });

      const trackingArray = Array.from(this.tracking.values());
      await fs.writeFile(
        this.config.trackingPath,
        JSON.stringify(trackingArray, null, 2)
      );
    } catch (error) {
      logger.error('Error saving tracking data:', error);
    }
  }

  /**
   * Check if comment contains blacklisted words
   */
  private isSpam(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.config.blacklistedWords.some(word =>
      lowerText.includes(word.toLowerCase())
    );
  }

  /**
   * Calculate random delay for reply
   */
  private calculateReplyDelay(): number {
    const minMs = this.config.minDelayMinutes * 60 * 1000;
    const maxMs = this.config.maxDelayMinutes * 60 * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  /**
   * Check if should reply to comment
   */
  private shouldReply(comment: string): boolean {
    // Don't reply to spam
    if (this.isSpam(comment)) {
      return false;
    }

    // Random probability
    return Math.random() < this.config.replyProbability;
  }

  /**
   * Get recent replies count (last hour)
   */
  private getRecentRepliesCount(): number {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    let count = 0;
    this.tracking.forEach(item => {
      if (item.repliedAt && new Date(item.repliedAt) > oneHourAgo) {
        count++;
      }
    });

    return count;
  }

  /**
   * Process comments on a media post
   */
  async processComments(mediaId: string): Promise<void> {
    try {
      logger.info(`Processing comments for media ${mediaId}`);

      // Fetch comments
      const comments = await this.api.getComments(mediaId);

      logger.info(`Found ${comments.length} comments`);

      for (const comment of comments) {
        // Skip if already tracked
        if (this.tracking.has(comment.id)) {
          continue;
        }

        // Track comment
        const tracking: CommentTracking = {
          commentId: comment.id,
          mediaId,
          username: comment.from?.username || comment.username,
          text: comment.text,
          replied: false,
          liked: false,
        };

        this.tracking.set(comment.id, tracking);

        // Auto-like if enabled
        if (this.config.autoLikeComments && !this.isSpam(comment.text)) {
          // Note: Instagram Graph API doesn't have a like endpoint for comments
          // This would need to be done through Instagram's mobile API or manually
          tracking.liked = true;
          logger.info(`Would like comment from @${tracking.username}`);
        }

        // Check if should reply
        if (this.shouldReply(comment.text)) {
          // Check rate limiting
          if (this.getRecentRepliesCount() >= this.config.maxRepliesPerHour) {
            logger.warn('Reply rate limit reached, skipping reply');
            continue;
          }

          await this.scheduleReply(comment.id, comment.text);
        }
      }

      await this.saveTracking();
    } catch (error) {
      logger.error('Error processing comments:', error);
    }
  }

  /**
   * Schedule a reply with random delay
   */
  private async scheduleReply(commentId: string, commentText: string): Promise<void> {
    const delay = this.calculateReplyDelay();

    logger.info(`Scheduling reply to comment ${commentId} in ${Math.round(delay / 1000 / 60)} minutes`);

    setTimeout(async () => {
      await this.executeReply(commentId, commentText);
    }, delay);
  }

  /**
   * Execute a reply to a comment
   */
  private async executeReply(commentId: string, commentText: string): Promise<void> {
    try {
      const tracking = this.tracking.get(commentId);

      if (!tracking || tracking.replied) {
        return;
      }

      // Generate personalized reply
      const reply = await generateCommentReply(commentText);

      // Post reply
      await this.api.replyToComment(commentId, reply);

      // Update tracking
      tracking.replied = true;
      tracking.repliedAt = new Date().toISOString();

      this.tracking.set(commentId, tracking);
      await this.saveTracking();

      logger.info(`Replied to @${tracking.username}: "${reply}"`);
    } catch (error) {
      logger.error(`Error executing reply to comment ${commentId}:`, error);
    }
  }

  /**
   * Monitor a post for new comments (run periodically)
   */
  async monitorPost(mediaId: string, intervalMinutes: number = 30): Promise<NodeJS.Timeout> {
    // Process comments immediately
    await this.processComments(mediaId);

    // Set up periodic monitoring
    const interval = setInterval(async () => {
      await this.processComments(mediaId);
    }, intervalMinutes * 60 * 1000);

    logger.info(`Monitoring post ${mediaId} every ${intervalMinutes} minutes`);

    return interval;
  }

  /**
   * Detect and respond to specific comment types
   */
  async respondToCommentType(
    commentText: string
  ): Promise<{ type: string; reply: string } | null> {
    const lowerText = commentText.toLowerCase();

    // Question about product
    if (lowerText.includes('?') && (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much'))) {
      return {
        type: 'price_inquiry',
        reply: await generateCommentReply(commentText, 'User asking about price'),
      };
    }

    // Shipping question
    if (lowerText.includes('ship') || lowerText.includes('deliver')) {
      return {
        type: 'shipping_inquiry',
        reply: await generateCommentReply(commentText, 'User asking about shipping'),
      };
    }

    // Compliment
    if (lowerText.includes('love') || lowerText.includes('amazing') || lowerText.includes('beautiful') || lowerText.includes('fire') || lowerText.includes('🔥')) {
      return {
        type: 'compliment',
        reply: await generateCommentReply(commentText, 'User giving compliment'),
      };
    }

    // Request for collaboration
    if (lowerText.includes('collab') || lowerText.includes('work together') || lowerText.includes('partnership')) {
      return {
        type: 'collaboration',
        reply: await generateCommentReply(commentText, 'User requesting collaboration'),
      };
    }

    return null;
  }

  /**
   * Get engagement statistics
   */
  getEngagementStats(): {
    totalComments: number;
    repliedCount: number;
    likedCount: number;
    spamFiltered: number;
    replyRate: number;
  } {
    const stats = {
      totalComments: this.tracking.size,
      repliedCount: 0,
      likedCount: 0,
      spamFiltered: 0,
      replyRate: 0,
    };

    this.tracking.forEach(item => {
      if (item.replied) stats.repliedCount++;
      if (item.liked) stats.likedCount++;
      if (this.isSpam(item.text)) stats.spamFiltered++;
    });

    if (stats.totalComments > 0) {
      stats.replyRate = stats.repliedCount / stats.totalComments;
    }

    return stats;
  }

  /**
   * Hide spam comments
   */
  async hideSpamComments(mediaId: string): Promise<number> {
    try {
      const comments = await this.api.getComments(mediaId);
      let hiddenCount = 0;

      for (const comment of comments) {
        if (this.isSpam(comment.text)) {
          await this.api.hideComment(comment.id, true);
          hiddenCount++;
          logger.info(`Hidden spam comment from @${comment.from?.username}`);

          // Small delay between actions
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return hiddenCount;
    } catch (error) {
      logger.error('Error hiding spam comments:', error);
      return 0;
    }
  }

  /**
   * Get unanswered comments
   */
  getUnansweredComments(): CommentTracking[] {
    return Array.from(this.tracking.values()).filter(
      item => !item.replied && !this.isSpam(item.text)
    );
  }
}

export default InstagramEngagementBot;
export type { EngagementConfig, CommentTracking };
