/**
 * Instagram Analytics Integration
 * Track post performance, Instagram Insights, and conversion funnel
 */

import InstagramGraphAPI from './official-api';
import { logger } from '../logger';
import fs from 'fs/promises';
import path from 'path';

interface PostAnalytics {
  mediaId: string;
  productId: string;
  postedAt: string;
  caption: string;
  engagement: number;
  impressions: number;
  reach: number;
  saved: number;
  likes?: number;
  comments?: number;
  videoViews?: number;
  profileVisits?: number;
  websiteClicks?: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

interface AnalyticsConfig {
  dataPath: string;
  trackingInterval: number; // minutes
  retentionDays: number;
}

interface DashboardMetrics {
  totalPosts: number;
  totalEngagement: number;
  totalImpressions: number;
  totalReach: number;
  averageEngagementRate: number;
  topPerformingPost: PostAnalytics | null;
  recentPosts: PostAnalytics[];
  conversionFunnel: {
    impressions: number;
    profileVisits: number;
    websiteClicks: number;
    conversionRate: number;
  };
}

class InstagramAnalytics {
  private api: InstagramGraphAPI;
  private config: AnalyticsConfig;
  private analytics: Map<string, PostAnalytics> = new Map();

  constructor(api: InstagramGraphAPI, config?: Partial<AnalyticsConfig>) {
    this.api = api;
    this.config = {
      dataPath: config?.dataPath || path.join(process.cwd(), 'data/instagram-analytics.json'),
      trackingInterval: config?.trackingInterval ?? 60, // 1 hour
      retentionDays: config?.retentionDays ?? 90,
    };
  }

  /**
   * Initialize analytics
   */
  async initialize(): Promise<void> {
    await this.loadAnalytics();
    logger.info('Instagram analytics initialized');
  }

  /**
   * Load analytics data from file
   */
  private async loadAnalytics(): Promise<void> {
    try {
      const data = await fs.readFile(this.config.dataPath, 'utf-8');
      const analyticsArray = JSON.parse(data);

      analyticsArray.forEach((item: PostAnalytics) => {
        this.analytics.set(item.mediaId, item);
      });

      // Clean old data
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

      this.analytics.forEach((value, key) => {
        if (new Date(value.postedAt) < cutoffDate) {
          this.analytics.delete(key);
        }
      });

      logger.info(`Loaded ${this.analytics.size} analytics records`);
    } catch (error) {
      logger.info('No existing analytics data found');
    }
  }

  /**
   * Save analytics data to file
   */
  private async saveAnalytics(): Promise<void> {
    try {
      const dir = path.dirname(this.config.dataPath);
      await fs.mkdir(dir, { recursive: true });

      const analyticsArray = Array.from(this.analytics.values());
      await fs.writeFile(
        this.config.dataPath,
        JSON.stringify(analyticsArray, null, 2)
      );
    } catch (error) {
      logger.error('Error saving analytics data:', error);
    }
  }

  /**
   * Generate UTM parameters for tracking
   */
  generateUTMParams(productId: string, postType: string): {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  } {
    return {
      utmSource: 'instagram',
      utmMedium: 'social',
      utmCampaign: `product_${productId}_${postType}_${Date.now()}`,
    };
  }

  /**
   * Build tracking URL with UTM parameters
   */
  buildTrackingURL(
    baseUrl: string,
    utmParams: { utmSource: string; utmMedium: string; utmCampaign: string }
  ): string {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', utmParams.utmSource);
    url.searchParams.set('utm_medium', utmParams.utmMedium);
    url.searchParams.set('utm_campaign', utmParams.utmCampaign);
    return url.toString();
  }

  /**
   * Track a new post
   */
  async trackPost(
    mediaId: string,
    productId: string,
    caption: string,
    utmParams: { utmSource: string; utmMedium: string; utmCampaign: string }
  ): Promise<void> {
    const postAnalytics: PostAnalytics = {
      mediaId,
      productId,
      postedAt: new Date().toISOString(),
      caption,
      engagement: 0,
      impressions: 0,
      reach: 0,
      saved: 0,
      ...utmParams,
    };

    this.analytics.set(mediaId, postAnalytics);
    await this.saveAnalytics();

    logger.info(`Tracking post ${mediaId} for product ${productId}`);
  }

  /**
   * Update post metrics from Instagram Insights
   */
  async updatePostMetrics(mediaId: string): Promise<void> {
    try {
      const analytics = this.analytics.get(mediaId);

      if (!analytics) {
        logger.warn(`No analytics record found for media ${mediaId}`);
        return;
      }

      // Fetch insights from Instagram API
      const insights = await this.api.getMediaInsights(mediaId);

      // Update analytics
      analytics.engagement = insights.engagement;
      analytics.impressions = insights.impressions;
      analytics.reach = insights.reach;
      analytics.saved = insights.saved;

      this.analytics.set(mediaId, analytics);
      await this.saveAnalytics();

      logger.info(`Updated metrics for post ${mediaId}: ${insights.engagement} engagement, ${insights.impressions} impressions`);
    } catch (error) {
      logger.error(`Error updating metrics for post ${mediaId}:`, error);
    }
  }

  /**
   * Start periodic tracking for a post
   */
  startPeriodicTracking(mediaId: string): NodeJS.Timeout {
    // Initial update
    this.updatePostMetrics(mediaId);

    // Set up periodic updates
    const interval = setInterval(async () => {
      await this.updatePostMetrics(mediaId);
    }, this.config.trackingInterval * 60 * 1000);

    logger.info(`Started periodic tracking for post ${mediaId} (every ${this.config.trackingInterval} minutes)`);

    return interval;
  }

  /**
   * Calculate engagement rate
   */
  calculateEngagementRate(post: PostAnalytics): number {
    if (post.reach === 0) return 0;
    return (post.engagement / post.reach) * 100;
  }

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics(): DashboardMetrics {
    const posts = Array.from(this.analytics.values());

    const metrics: DashboardMetrics = {
      totalPosts: posts.length,
      totalEngagement: 0,
      totalImpressions: 0,
      totalReach: 0,
      averageEngagementRate: 0,
      topPerformingPost: null,
      recentPosts: [],
      conversionFunnel: {
        impressions: 0,
        profileVisits: 0,
        websiteClicks: 0,
        conversionRate: 0,
      },
    };

    if (posts.length === 0) {
      return metrics;
    }

    // Calculate totals
    posts.forEach(post => {
      metrics.totalEngagement += post.engagement;
      metrics.totalImpressions += post.impressions;
      metrics.totalReach += post.reach;
      metrics.conversionFunnel.impressions += post.impressions;
      metrics.conversionFunnel.profileVisits += post.profileVisits || 0;
      metrics.conversionFunnel.websiteClicks += post.websiteClicks || 0;
    });

    // Calculate average engagement rate
    const engagementRates = posts.map(post => this.calculateEngagementRate(post));
    metrics.averageEngagementRate =
      engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;

    // Find top performing post
    const sorted = [...posts].sort((a, b) => b.engagement - a.engagement);
    metrics.topPerformingPost = sorted[0];

    // Get recent posts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    metrics.recentPosts = posts
      .filter(post => new Date(post.postedAt) > sevenDaysAgo)
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    // Calculate conversion rate
    if (metrics.conversionFunnel.impressions > 0) {
      metrics.conversionFunnel.conversionRate =
        (metrics.conversionFunnel.websiteClicks / metrics.conversionFunnel.impressions) * 100;
    }

    return metrics;
  }

  /**
   * Get product performance
   */
  getProductPerformance(productId: string): {
    posts: PostAnalytics[];
    totalEngagement: number;
    totalImpressions: number;
    averageEngagementRate: number;
  } {
    const posts = Array.from(this.analytics.values()).filter(
      post => post.productId === productId
    );

    const performance = {
      posts,
      totalEngagement: 0,
      totalImpressions: 0,
      averageEngagementRate: 0,
    };

    posts.forEach(post => {
      performance.totalEngagement += post.engagement;
      performance.totalImpressions += post.impressions;
    });

    if (posts.length > 0) {
      const engagementRates = posts.map(post => this.calculateEngagementRate(post));
      performance.averageEngagementRate =
        engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;
    }

    return performance;
  }

  /**
   * Get time-based analytics
   */
  getTimeAnalytics(days: number = 30): {
    date: string;
    posts: number;
    engagement: number;
    impressions: number;
  }[] {
    const timeMap = new Map<string, { posts: number; engagement: number; impressions: number }>();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    Array.from(this.analytics.values())
      .filter(post => new Date(post.postedAt) > cutoffDate)
      .forEach(post => {
        const date = post.postedAt.split('T')[0]; // Get date part

        if (!timeMap.has(date)) {
          timeMap.set(date, { posts: 0, engagement: 0, impressions: 0 });
        }

        const entry = timeMap.get(date)!;
        entry.posts++;
        entry.engagement += post.engagement;
        entry.impressions += post.impressions;
      });

    // Convert to array and sort by date
    return Array.from(timeMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Export analytics to CSV
   */
  async exportToCSV(filePath?: string): Promise<string> {
    const outputPath = filePath || path.join(process.cwd(), 'data/instagram-analytics.csv');

    const headers = [
      'Media ID',
      'Product ID',
      'Posted At',
      'Engagement',
      'Impressions',
      'Reach',
      'Saved',
      'Engagement Rate',
      'UTM Campaign',
    ];

    const rows = Array.from(this.analytics.values()).map(post => [
      post.mediaId,
      post.productId,
      post.postedAt,
      post.engagement,
      post.impressions,
      post.reach,
      post.saved,
      this.calculateEngagementRate(post).toFixed(2),
      post.utmCampaign,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    await fs.writeFile(outputPath, csv);
    logger.info(`Exported analytics to ${outputPath}`);

    return outputPath;
  }

  /**
   * Get post analytics by ID
   */
  getPostAnalytics(mediaId: string): PostAnalytics | undefined {
    return this.analytics.get(mediaId);
  }

  /**
   * Get all analytics
   */
  getAllAnalytics(): PostAnalytics[] {
    return Array.from(this.analytics.values());
  }
}

export default InstagramAnalytics;
export type { PostAnalytics, AnalyticsConfig, DashboardMetrics };
