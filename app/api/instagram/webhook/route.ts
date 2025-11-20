/**
 * Instagram Webhook Handler
 * Receives notifications from Instagram about comments, mentions, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

/**
 * Verify webhook signature from Meta
 */
function verifySignature(
  signature: string | null,
  body: string,
  appSecret: string
): boolean {
  if (!signature) return false;

  const elements = signature.split('=');
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(body)
    .digest('hex');

  return signatureHash === expectedHash;
}

/**
 * GET /api/instagram/webhook
 * Webhook verification endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'brandonmills_instagram_webhook_2024';

    logger.info('Instagram webhook verification request:', { mode, token });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      logger.info('Instagram webhook verified successfully');
      return new NextResponse(challenge, { status: 200 });
    }

    logger.warn('Instagram webhook verification failed');
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 403 }
    );
  } catch (error) {
    logger.error('Error in webhook verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/instagram/webhook
 * Handle webhook events from Instagram
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256');
    const body = await request.text();

    // Verify signature
    const appSecret = process.env.META_APP_SECRET;
    if (appSecret && !verifySignature(signature, body, appSecret)) {
      logger.warn('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);

    logger.info('Instagram webhook received:', {
      object: data.object,
      entries: data.entry?.length,
    });

    // Process webhook events
    if (data.object === 'instagram') {
      for (const entry of data.entry || []) {
        const userId = entry.id;
        const time = entry.time;

        // Process changes
        for (const change of entry.changes || []) {
          await processWebhookChange(userId, change, time);
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process individual webhook change
 */
async function processWebhookChange(
  userId: string,
  change: any,
  timestamp: number
): Promise<void> {
  try {
    const field = change.field;
    const value = change.value;

    logger.info(`Processing ${field} change for user ${userId}`);

    switch (field) {
      case 'comments':
        await handleCommentEvent(value);
        break;

      case 'mentions':
        await handleMentionEvent(value);
        break;

      case 'story_insights':
        await handleStoryInsights(value);
        break;

      case 'live_comments':
        await handleLiveCommentEvent(value);
        break;

      default:
        logger.info(`Unhandled webhook field: ${field}`);
    }
  } catch (error) {
    logger.error('Error processing webhook change:', error);
  }
}

/**
 * Handle new comment event
 */
async function handleCommentEvent(value: any): Promise<void> {
  try {
    const commentId = value.id;
    const mediaId = value.media_id;
    const text = value.text;
    const from = value.from;

    logger.info(`New comment on media ${mediaId}: "${text}" from @${from?.username}`);

    // Store comment for processing by engagement bot
    // This would trigger the engagement automation
    await storeCommentForProcessing({
      commentId,
      mediaId,
      text,
      username: from?.username,
      userId: from?.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error handling comment event:', error);
  }
}

/**
 * Handle mention event
 */
async function handleMentionEvent(value: any): Promise<void> {
  try {
    const mediaId = value.media_id;
    const commentId = value.comment_id;

    logger.info(`Mentioned in ${mediaId}, comment ${commentId}`);

    // Store mention for manual review or automated response
    await storeMentionForReview({
      mediaId,
      commentId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error handling mention event:', error);
  }
}

/**
 * Handle story insights
 */
async function handleStoryInsights(value: any): Promise<void> {
  try {
    const mediaId = value.media_id;
    const insights = value.insights;

    logger.info(`Story insights for ${mediaId}:`, insights);

    // Store story performance data
    // This could be used for analytics
  } catch (error) {
    logger.error('Error handling story insights:', error);
  }
}

/**
 * Handle live video comment
 */
async function handleLiveCommentEvent(value: any): Promise<void> {
  try {
    const commentId = value.id;
    const text = value.text;

    logger.info(`Live comment: "${text}"`);

    // Live comments could be displayed in real-time or stored
  } catch (error) {
    logger.error('Error handling live comment:', error);
  }
}

/**
 * Store comment for processing by engagement bot
 */
async function storeCommentForProcessing(comment: {
  commentId: string;
  mediaId: string;
  text: string;
  username: string;
  userId: string;
  timestamp: string;
}): Promise<void> {
  try {
    // In production, store in database or queue
    // For now, write to file
    const fs = await import('fs/promises');
    const path = await import('path');

    const queuePath = path.join(process.cwd(), 'data/instagram-comment-queue.json');

    let queue: any[] = [];
    try {
      const data = await fs.readFile(queuePath, 'utf-8');
      queue = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    queue.push(comment);

    const dir = path.dirname(queuePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(queuePath, JSON.stringify(queue, null, 2));

    logger.info(`Stored comment ${comment.commentId} in queue for processing`);
  } catch (error) {
    logger.error('Error storing comment for processing:', error);
  }
}

/**
 * Store mention for review
 */
async function storeMentionForReview(mention: {
  mediaId: string;
  commentId: string;
  timestamp: string;
}): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    const mentionsPath = path.join(process.cwd(), 'data/instagram-mentions.json');

    let mentions: any[] = [];
    try {
      const data = await fs.readFile(mentionsPath, 'utf-8');
      mentions = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    mentions.push(mention);

    const dir = path.dirname(mentionsPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(mentionsPath, JSON.stringify(mentions, null, 2));

    logger.info(`Stored mention for review`);
  } catch (error) {
    logger.error('Error storing mention:', error);
  }
}
