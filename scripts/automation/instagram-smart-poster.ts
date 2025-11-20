#!/usr/bin/env tsx

/**
 * Instagram Smart Poster - Main Automation Script
 * Fully automated Instagram posting with natural human-like behavior
 */

import InstagramGraphAPI from '../../lib/instagram/official-api';
import { generateInstagramCaption } from '../../lib/instagram/caption-generator';
import InstagramScheduler from '../../lib/instagram/posting-scheduler';
import InstagramProductQueue from '../../lib/instagram/product-queue';
import InstagramEngagementBot from '../../lib/instagram/engagement-bot';
import InstagramAnalytics from '../../lib/instagram/analytics';
import { logger } from '../../lib/logger';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

interface AutomationConfig {
  dryRun: boolean;
  once: boolean;
  productId?: string;
}

class InstagramAutomation {
  private api: InstagramGraphAPI;
  private scheduler: InstagramScheduler;
  private productQueue: InstagramProductQueue;
  private engagementBot: InstagramEngagementBot;
  private analytics: InstagramAnalytics;
  private config: AutomationConfig;
  private activeMonitors: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: AutomationConfig) {
    this.config = config;
    this.api = new InstagramGraphAPI();
    this.scheduler = new InstagramScheduler();
    this.productQueue = new InstagramProductQueue();
    this.engagementBot = new InstagramEngagementBot(this.api);
    this.analytics = new InstagramAnalytics(this.api);
  }

  /**
   * Initialize all systems
   */
  async initialize(): Promise<void> {
    logger.info('🚀 Initializing Instagram automation system...');

    try {
      // Initialize all components
      await this.scheduler.initialize();
      await this.productQueue.initialize();
      await this.engagementBot.initialize();
      await this.analytics.initialize();

      logger.info('✅ All systems initialized');

      // Display stats
      this.displayStats();
    } catch (error) {
      logger.error('❌ Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Display current stats
   */
  private displayStats(): void {
    const queueStats = this.productQueue.getQueueStats();
    const engagementStats = this.engagementBot.getEngagementStats();
    const dashboardMetrics = this.analytics.getDashboardMetrics();

    logger.info('\n📊 CURRENT STATS:');
    logger.info(`  Products in queue: ${queueStats.totalProducts}`);
    logger.info(`  New arrivals: ${queueStats.newArrivals}`);
    logger.info(`  Never promoted: ${queueStats.neverPromoted}`);
    logger.info(`  Total posts: ${dashboardMetrics.totalPosts}`);
    logger.info(`  Total engagement: ${dashboardMetrics.totalEngagement}`);
    logger.info(`  Avg engagement rate: ${dashboardMetrics.averageEngagementRate.toFixed(2)}%`);
    logger.info(`  Comments replied: ${engagementStats.repliedCount}/${engagementStats.totalComments}`);
    logger.info('');
  }

  /**
   * Select content type with natural distribution
   */
  private selectContentType(): 'product' | 'lifestyle' | 'bts' | 'casual' {
    const random = Math.random();

    // Distribution: 50% product, 25% lifestyle, 15% bts, 10% casual
    if (random < 0.5) return 'product';
    if (random < 0.75) return 'lifestyle';
    if (random < 0.9) return 'bts';
    return 'casual';
  }

  /**
   * Create and post a product promotion
   */
  async createPost(): Promise<{ productId: string; success: boolean }> {
    try {
      logger.info('📸 Creating new Instagram post...');

      // Get next product from queue
      const product = this.productQueue.getNextProduct();

      if (!product) {
        logger.error('❌ No products in queue');
        return { productId: 'none', success: false };
      }

      logger.info(`📦 Selected product: ${product.name}`);

      // Select content type
      const contentType = this.selectContentType();
      logger.info(`🎨 Content type: ${contentType}`);

      // Generate caption
      const personalContexts = [
        'shot this in milan, lighting was insane',
        'been wearing this nonstop',
        'ok but the fit on this tho',
        'actually obsessed with how this turned out',
        'new drop',
        'this colorway 🔥',
      ];

      const randomContext = Math.random() < 0.4
        ? personalContexts[Math.floor(Math.random() * personalContexts.length)]
        : undefined;

      const caption = await generateInstagramCaption({
        product: {
          name: product.name,
          category: product.category,
          price: product.price,
          isNewArrival: product.isNewArrival,
        },
        contentType,
        includeHashtags: Math.random() < 0.6, // 60% chance
        includeCTA: Math.random() < 0.5, // 50% chance
        personalContext: randomContext,
      });

      logger.info(`✍️  Caption: ${caption.substring(0, 100)}...`);

      // Generate UTM parameters for tracking
      const utmParams = this.analytics.generateUTMParams(product.productId, contentType);
      const trackingURL = this.analytics.buildTrackingURL(
        'https://brandonmills.com/shop',
        utmParams
      );

      logger.info(`🔗 Tracking URL: ${trackingURL}`);

      // Check if dry run
      if (this.config.dryRun) {
        logger.info('🔍 DRY RUN - Post not actually created');
        logger.info('  Image URL:', product.imageUrl);
        logger.info('  Caption:', caption);
        logger.info('  Tracking URL:', trackingURL);

        return { productId: product.productId, success: true };
      }

      // Post to Instagram (two-step process with random delay)
      logger.info('📤 Posting to Instagram...');
      const result = await this.api.post(product.imageUrl, caption);

      logger.info(`✅ Post created successfully!`);
      logger.info(`  Container ID: ${result.containerId}`);
      logger.info(`  Media ID: ${result.mediaId}`);

      // Track in analytics
      await this.analytics.trackPost(
        result.mediaId,
        product.productId,
        caption,
        utmParams
      );

      // Mark product as promoted
      await this.productQueue.markAsPromoted(product.productId);

      // Start monitoring for engagement
      await this.startPostMonitoring(result.mediaId);

      logger.info('🎉 Post automation complete!');

      return { productId: product.productId, success: true };
    } catch (error) {
      logger.error('❌ Error creating post:', error);
      return { productId: 'error', success: false };
    }
  }

  /**
   * Start monitoring a post for engagement
   */
  private async startPostMonitoring(mediaId: string): Promise<void> {
    logger.info(`👀 Starting engagement monitoring for ${mediaId}`);

    // Monitor comments every 30 minutes
    const commentMonitor = await this.engagementBot.monitorPost(mediaId, 30);
    this.activeMonitors.set(`comments_${mediaId}`, commentMonitor);

    // Update analytics hourly
    const analyticsMonitor = this.analytics.startPeriodicTracking(mediaId);
    this.activeMonitors.set(`analytics_${mediaId}`, analyticsMonitor);

    logger.info('✅ Monitoring started');
  }

  /**
   * Start automated scheduler
   */
  startScheduler(): void {
    logger.info('⏰ Starting automated posting scheduler...');

    this.scheduler.startDailyScheduler(async () => {
      return await this.createPost();
    });

    const nextPost = this.scheduler.getNextPostTime();
    if (nextPost) {
      logger.info(`📅 Next post scheduled for: ${nextPost.toLocaleString()}`);
    }

    logger.info('✅ Scheduler running');
  }

  /**
   * Process comment queue from webhook
   */
  async processCommentQueue(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      const queuePath = path.join(process.cwd(), 'data/instagram-comment-queue.json');

      let queue: any[] = [];
      try {
        const data = await fs.readFile(queuePath, 'utf-8');
        queue = JSON.parse(data);
      } catch {
        return; // No queue file
      }

      if (queue.length === 0) return;

      logger.info(`💬 Processing ${queue.length} comments from webhook queue`);

      for (const comment of queue) {
        // Reply via engagement bot
        await this.engagementBot.processComments(comment.mediaId);
      }

      // Clear queue
      await fs.writeFile(queuePath, JSON.stringify([], null, 2));

      logger.info('✅ Comment queue processed');
    } catch (error) {
      logger.error('Error processing comment queue:', error);
    }
  }

  /**
   * Sync products from Printful
   */
  async syncProducts(): Promise<void> {
    logger.info('🔄 Syncing products from Printful...');
    await this.productQueue.syncWithPrintful();
    logger.info('✅ Product sync complete');
  }

  /**
   * Generate analytics report
   */
  async generateReport(): Promise<void> {
    logger.info('📊 Generating analytics report...');

    const dashboard = this.analytics.getDashboardMetrics();

    console.log('\n' + '='.repeat(60));
    console.log('INSTAGRAM AUTOMATION REPORT');
    console.log('='.repeat(60));

    console.log('\n📈 OVERALL PERFORMANCE:');
    console.log(`  Total Posts: ${dashboard.totalPosts}`);
    console.log(`  Total Engagement: ${dashboard.totalEngagement.toLocaleString()}`);
    console.log(`  Total Impressions: ${dashboard.totalImpressions.toLocaleString()}`);
    console.log(`  Total Reach: ${dashboard.totalReach.toLocaleString()}`);
    console.log(`  Avg Engagement Rate: ${dashboard.averageEngagementRate.toFixed(2)}%`);

    if (dashboard.topPerformingPost) {
      console.log('\n🏆 TOP PERFORMING POST:');
      console.log(`  Product: ${dashboard.topPerformingPost.productId}`);
      console.log(`  Engagement: ${dashboard.topPerformingPost.engagement.toLocaleString()}`);
      console.log(`  Impressions: ${dashboard.topPerformingPost.impressions.toLocaleString()}`);
      console.log(`  Caption: ${dashboard.topPerformingPost.caption.substring(0, 100)}...`);
    }

    console.log('\n🎯 CONVERSION FUNNEL:');
    console.log(`  Impressions: ${dashboard.conversionFunnel.impressions.toLocaleString()}`);
    console.log(`  Profile Visits: ${dashboard.conversionFunnel.profileVisits.toLocaleString()}`);
    console.log(`  Website Clicks: ${dashboard.conversionFunnel.websiteClicks.toLocaleString()}`);
    console.log(`  Conversion Rate: ${dashboard.conversionFunnel.conversionRate.toFixed(2)}%`);

    console.log('\n' + '='.repeat(60) + '\n');

    // Export to CSV
    const csvPath = await this.analytics.exportToCSV();
    logger.info(`📄 Full report exported to: ${csvPath}`);
  }

  /**
   * Stop all automation
   */
  stop(): void {
    logger.info('🛑 Stopping automation...');

    this.scheduler.stopAll();

    this.activeMonitors.forEach((monitor, key) => {
      clearInterval(monitor);
      logger.info(`Stopped monitor: ${key}`);
    });

    this.activeMonitors.clear();

    logger.info('✅ Automation stopped');
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  const config: AutomationConfig = {
    dryRun: args.includes('--dry-run'),
    once: args.includes('--once'),
    productId: args.find(arg => arg.startsWith('--product='))?.split('=')[1],
  };

  if (args.includes('--help')) {
    console.log(`
Instagram Smart Poster - Automated Instagram Marketing

Usage:
  npm run automate:instagram [options]

Options:
  --once              Post once and exit (don't start scheduler)
  --dry-run           Test mode - don't actually post
  --product=ID        Post specific product by ID
  --sync              Sync products from Printful and exit
  --report            Generate analytics report and exit
  --help              Show this help message

Examples:
  npm run automate:instagram --once --dry-run
  npm run automate:instagram --sync
  npm run automate:instagram --report
  npm run automate:instagram              # Start automated scheduler
`);
    process.exit(0);
  }

  const automation = new InstagramAutomation(config);

  try {
    await automation.initialize();

    // Handle specific commands
    if (args.includes('--sync')) {
      await automation.syncProducts();
      process.exit(0);
    }

    if (args.includes('--report')) {
      await automation.generateReport();
      process.exit(0);
    }

    if (config.once) {
      // Post once and exit
      await automation.createPost();
      await automation.processCommentQueue();
      process.exit(0);
    }

    // Start full automation
    automation.startScheduler();

    // Process comment queue every 15 minutes
    setInterval(() => {
      automation.processCommentQueue();
    }, 15 * 60 * 1000);

    // Sync products daily
    setInterval(() => {
      automation.syncProducts();
    }, 24 * 60 * 60 * 1000);

    logger.info('🤖 Instagram automation running. Press Ctrl+C to stop.');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.info('\n👋 Shutting down gracefully...');
      automation.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default InstagramAutomation;
