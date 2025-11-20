#!/usr/bin/env node
/**
 * Refresh Instagram Access Token
 * Instagram access tokens expire after 60 days
 * This script exchanges the current token for a new one
 */

import dotenv from 'dotenv';
import path from 'path';
import InstagramGraphAPI from '../../lib/instagram/official-api.js';
import { logger } from '../../lib/logger.js';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function refreshToken() {
  try {
    logger.info('🔄 Refreshing Instagram access token...');

    const api = new InstagramGraphAPI();
    const result = await api.refreshAccessToken();

    logger.info('✅ Token refreshed successfully!');
    logger.info(`Expires in: ${result.expires_in} seconds (${Math.floor(result.expires_in / 86400)} days)`);
    logger.info('');
    logger.info('⚠️  IMPORTANT: Update .env.local with this new token:');
    logger.info('');
    logger.info(`INSTAGRAM_ACCESS_TOKEN=${result.access_token}`);
    logger.info('');
    logger.info('Copy the line above and replace the INSTAGRAM_ACCESS_TOKEN in .env.local');
  } catch (error) {
    logger.error('❌ Error refreshing token:', error);
    process.exit(1);
  }
}

refreshToken();
