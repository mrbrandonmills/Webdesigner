#!/usr/bin/env tsx
/**
 * Campaign Daemon - Persistent Content Automation Monitor
 * Ensures The Alchemy of Embodiment campaign posts are never missed
 * Runs continuously and survives session restarts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

interface ScheduledPost {
  date: string;
  time: string;
  platform: string;
  type: string;
  content: string;
  media?: string[];
  link?: string;
  status: 'pending' | 'scheduled' | 'posted' | 'failed';
  attemptCount?: number;
  lastAttempt?: string;
  error?: string;
}

interface CampaignSchedule {
  campaign: string;
  startDate: string;
  endDate: string;
  totalPosts: number;
  week1: ScheduledPost[];
  week2: ScheduledPost[];
}

const SCHEDULE_PATH = join(process.cwd(), 'scripts/automation/content/alchemy-campaign-schedule.json');
const STATE_PATH = join(process.cwd(), 'scripts/automation/content/campaign-state.json');
const LOG_PATH = join(process.cwd(), 'logs/campaign-daemon.log');

class CampaignDaemon {
  private schedule: CampaignSchedule | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.loadSchedule();
    this.log('🚀 Campaign Daemon initialized');
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());

    try {
      const fs = require('fs');
      fs.appendFileSync(LOG_PATH, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private loadSchedule(): void {
    try {
      if (!existsSync(SCHEDULE_PATH)) {
        this.log('❌ Schedule file not found. Run schedule-alchemy-campaign.ts first.');
        process.exit(1);
      }

      const scheduleData = readFileSync(SCHEDULE_PATH, 'utf-8');
      this.schedule = JSON.parse(scheduleData);
      this.log(`✅ Loaded schedule: ${this.schedule?.totalPosts} posts`);
    } catch (error) {
      this.log(`❌ Error loading schedule: ${error}`);
      process.exit(1);
    }
  }

  private loadState(): ScheduledPost[] {
    try {
      if (existsSync(STATE_PATH)) {
        const stateData = readFileSync(STATE_PATH, 'utf-8');
        return JSON.parse(stateData);
      }
    } catch (error) {
      this.log(`⚠️  Error loading state: ${error}`);
    }
    return [];
  }

  private saveState(posts: ScheduledPost[]): void {
    try {
      writeFileSync(STATE_PATH, JSON.stringify(posts, null, 2));
    } catch (error) {
      this.log(`❌ Error saving state: ${error}`);
    }
  }

  private getAllPosts(): ScheduledPost[] {
    if (!this.schedule) return [];

    const savedState = this.loadState();
    const allPosts = [...this.schedule.week1, ...this.schedule.week2];

    // Merge with saved state
    return allPosts.map(post => {
      const savedPost = savedState.find(
        s => s.date === post.date && s.time === post.time && s.platform === post.platform
      );
      return savedPost || post;
    });
  }

  private isDue(post: ScheduledPost): boolean {
    const now = new Date();
    const postDateTime = new Date(`${post.date}T${post.time}:00`);

    // Post is due if current time is past scheduled time and not already posted
    return now >= postDateTime && post.status !== 'posted';
  }

  private async executePost(post: ScheduledPost): Promise<boolean> {
    this.log(`📤 Attempting to post: ${post.platform} - ${post.type}`);

    try {
      let success = false;

      switch (post.platform.toLowerCase()) {
        case 'twitter':
          success = await this.postToTwitter(post);
          break;
        case 'instagram':
          success = await this.postToInstagram(post);
          break;
        case 'pinterest':
          success = await this.postToPinterest(post);
          break;
        case 'medium':
        case 'website':
        case 'website blog':
        case 'website research':
          this.log(`⚠️  ${post.platform} requires manual posting. Marking as manual review needed.`);
          success = false; // Will retry later for manual verification
          break;
        default:
          this.log(`⚠️  Unknown platform: ${post.platform}`);
          success = false;
      }

      if (success) {
        this.log(`✅ Successfully posted to ${post.platform}`);
        return true;
      } else {
        this.log(`❌ Failed to post to ${post.platform}`);
        return false;
      }
    } catch (error) {
      this.log(`❌ Error posting to ${post.platform}: ${error}`);
      return false;
    }
  }

  private async postToTwitter(post: ScheduledPost): Promise<boolean> {
    return new Promise((resolve) => {
      this.log('🐦 Posting to Twitter...');

      const twitterScript = join(process.cwd(), 'scripts/automation/twitter-poster.ts');
      const child = spawn('npx', ['tsx', twitterScript], {
        env: { ...process.env, TWEET_CONTENT: post.content }
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0 && !output.includes('error')) {
          this.log('✅ Twitter post successful');
          resolve(true);
        } else {
          this.log(`❌ Twitter post failed with code ${code}`);
          resolve(false);
        }
      });

      setTimeout(() => {
        child.kill();
        this.log('⏱️  Twitter posting timeout');
        resolve(false);
      }, 30000); // 30 second timeout
    });
  }

  private async postToInstagram(post: ScheduledPost): Promise<boolean> {
    return new Promise((resolve) => {
      this.log('📸 Posting to Instagram...');

      const instagramScript = join(process.cwd(), 'scripts/automation/instagram-smart-poster.ts');
      const child = spawn('npx', ['tsx', instagramScript], {
        env: {
          ...process.env,
          INSTAGRAM_CAPTION: post.content,
          INSTAGRAM_MEDIA: post.media?.join(',') || ''
        }
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0 && !output.includes('error')) {
          this.log('✅ Instagram post successful');
          resolve(true);
        } else {
          this.log(`❌ Instagram post failed with code ${code}`);
          resolve(false);
        }
      });

      setTimeout(() => {
        child.kill();
        this.log('⏱️  Instagram posting timeout');
        resolve(false);
      }, 60000); // 60 second timeout
    });
  }

  private async postToPinterest(post: ScheduledPost): Promise<boolean> {
    return new Promise((resolve) => {
      this.log('📌 Posting to Pinterest...');

      const pinterestScript = join(process.cwd(), 'scripts/automation/pinterest-api-poster.ts');
      const child = spawn('npx', ['tsx', pinterestScript], {
        env: {
          ...process.env,
          PINTEREST_DESCRIPTION: post.content,
          PINTEREST_MEDIA: post.media?.join(',') || '',
          PINTEREST_LINK: post.link || ''
        }
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0 && !output.includes('error')) {
          this.log('✅ Pinterest post successful');
          resolve(true);
        } else {
          this.log(`❌ Pinterest post failed with code ${code}`);
          resolve(false);
        }
      });

      setTimeout(() => {
        child.kill();
        this.log('⏱️  Pinterest posting timeout');
        resolve(false);
      }, 60000); // 60 second timeout
    });
  }

  private async checkAndPost(): Promise<void> {
    const allPosts = this.getAllPosts();
    const duePosts = allPosts.filter(post => this.isDue(post));

    if (duePosts.length === 0) {
      this.log('✅ No posts due at this time');
      return;
    }

    this.log(`📋 Found ${duePosts.length} post(s) due for posting`);

    for (const post of duePosts) {
      // Skip if already attempted too many times
      if ((post.attemptCount || 0) >= 3) {
        this.log(`⚠️  Skipping ${post.platform} - Max retry attempts reached`);
        continue;
      }

      const success = await this.executePost(post);

      // Update post status
      post.lastAttempt = new Date().toISOString();
      post.attemptCount = (post.attemptCount || 0) + 1;

      if (success) {
        post.status = 'posted';
        this.log(`✅ Post marked as complete: ${post.platform} - ${post.type}`);
      } else {
        post.status = 'failed';
        post.error = `Failed after ${post.attemptCount} attempt(s)`;
        this.log(`❌ Post failed: ${post.platform} - Will retry later`);
      }

      // Save state after each post attempt
      this.saveState(allPosts);

      // Wait 5 seconds between posts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      this.log('⚠️  Daemon already running');
      return;
    }

    this.isRunning = true;
    this.log('🚀 Campaign Daemon started');
    this.log('⏰ Checking for due posts every 5 minutes');

    // Check immediately on start
    await this.checkAndPost();

    // Then check every 5 minutes
    this.checkInterval = setInterval(async () => {
      this.log('🔍 Running scheduled check...');
      await this.checkAndPost();
    }, 5 * 60 * 1000); // 5 minutes

    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  public stop(): void {
    this.log('🛑 Stopping Campaign Daemon...');

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.isRunning = false;
    this.log('✅ Campaign Daemon stopped gracefully');
    process.exit(0);
  }

  public status(): void {
    const allPosts = this.getAllPosts();
    const posted = allPosts.filter(p => p.status === 'posted').length;
    const pending = allPosts.filter(p => p.status === 'pending').length;
    const failed = allPosts.filter(p => p.status === 'failed').length;

    console.log('\n📊 CAMPAIGN STATUS\n');
    console.log(`Total Posts: ${allPosts.length}`);
    console.log(`✅ Posted: ${posted}`);
    console.log(`⏳ Pending: ${pending}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Progress: ${Math.round((posted / allPosts.length) * 100)}%\n`);
  }
}

// CLI handling
const daemon = new CampaignDaemon();

const command = process.argv[2] || 'start';

switch (command) {
  case 'start':
    daemon.start();
    break;
  case 'status':
    daemon.status();
    process.exit(0);
    break;
  case 'stop':
    daemon.stop();
    break;
  default:
    console.log('Usage: campaign-daemon.ts [start|status|stop]');
    process.exit(1);
}
