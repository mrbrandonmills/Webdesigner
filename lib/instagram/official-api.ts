/**
 * Instagram Official Graph API Wrapper
 * Uses Meta's official Graph API for Instagram Business Accounts
 * Two-step process: createMediaContainer -> publishMedia
 */

import { logger } from '../logger';
import {
  downloadAndProcessForInstagram,
  getImageInfo,
  bufferToDataURL,
  type ImageProcessingOptions,
} from './image-processor';
import { uploadImageToCDN } from './cdn-uploader';

interface InstagramCredentials {
  businessAccountId: string;
  accessToken: string;
  pageId: string;
}

interface MediaContainerResponse {
  id: string;
  status?: string;
}

interface PublishResponse {
  id: string;
}

interface MediaInsights {
  engagement: number;
  impressions: number;
  reach: number;
  saved: number;
  likes?: number;
  comments?: number;
}

interface Comment {
  id: string;
  text: string;
  timestamp: string;
  username: string;
  from: {
    id: string;
    username: string;
  };
}

class InstagramGraphAPI {
  private credentials: InstagramCredentials;
  private baseUrl = 'https://graph.facebook.com/v21.0';

  constructor(credentials?: InstagramCredentials) {
    this.credentials = credentials || {
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
      pageId: process.env.FACEBOOK_PAGE_ID || '',
    };

    if (!this.credentials.businessAccountId || !this.credentials.accessToken) {
      logger.warn('Instagram credentials not fully configured');
    }
  }

  /**
   * Add random delay to simulate human behavior
   */
  private async randomDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    logger.info(`Waiting ${Math.round(delay / 1000)}s before next action...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Step 1: Create a media container (draft)
   * This prepares the post without publishing it
   */
  async createMediaContainer(
    imageUrl: string,
    caption: string,
    productTags?: Array<{ product_id: string; x: number; y: number }>
  ): Promise<MediaContainerResponse> {
    try {
      const params = new URLSearchParams({
        image_url: imageUrl,
        caption: caption,
        access_token: this.credentials.accessToken,
      });

      // Add product tags if provided
      if (productTags && productTags.length > 0) {
        params.append('product_tags', JSON.stringify(productTags));
      }

      const response = await fetch(
        `${this.baseUrl}/${this.credentials.businessAccountId}/media`,
        {
          method: 'POST',
          body: params,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create media container: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      logger.info(`Media container created: ${data.id}`);
      return data;
    } catch (error) {
      logger.error('Error creating media container:', error);
      throw error;
    }
  }

  /**
   * Step 2: Publish the media container
   * This makes the post live on Instagram
   */
  async publishMedia(containerId: string): Promise<PublishResponse> {
    try {
      const params = new URLSearchParams({
        creation_id: containerId,
        access_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${this.credentials.businessAccountId}/media_publish`,
        {
          method: 'POST',
          body: params,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to publish media: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      logger.info(`Media published successfully: ${data.id}`);
      return data;
    } catch (error) {
      logger.error('Error publishing media:', error);
      throw error;
    }
  }

  /**
   * Complete two-step posting process with random delay
   * Includes automatic image preprocessing to meet Instagram requirements
   */
  async post(
    imageUrl: string,
    caption: string,
    productTags?: Array<{ product_id: string; x: number; y: number }>,
    imageProcessingOptions?: ImageProcessingOptions
  ): Promise<{ containerId: string; mediaId: string }> {
    try {
      logger.info('📸 Starting Instagram post process...');

      // Step 0: Check image aspect ratio and preprocess if needed
      logger.info('🔍 Checking image aspect ratio...');
      const imageInfo = await getImageInfo(imageUrl);

      logger.info(
        `Image info: ${imageInfo.width}x${imageInfo.height}, ` +
        `aspect ratio: ${imageInfo.aspectRatio.toFixed(2)}:1, ` +
        `valid: ${imageInfo.isValidForInstagram}`
      );

      let finalImageUrl = imageUrl;

      if (!imageInfo.isValidForInstagram) {
        logger.warn(
          '⚠️  Image aspect ratio outside Instagram limits ' +
          `(${imageInfo.aspectRatio.toFixed(2)}:1). Processing...`
        );

        // Process the image
        const processedImage = await downloadAndProcessForInstagram(
          imageUrl,
          imageProcessingOptions || { preferredMethod: 'crop', quality: 90 }
        );

        logger.info(
          `✅ Image processed: ${processedImage.method} applied, ` +
          `new aspect ratio: ${processedImage.processedAspectRatio.toFixed(2)}:1`
        );

        // Upload processed image to CDN
        logger.info('📤 Uploading processed image to CDN...');
        const filename = `instagram-processed-${Date.now()}.jpg`;
        const uploadResult = await uploadImageToCDN(processedImage.buffer, filename);

        logger.info(`✅ Image uploaded to CDN: ${uploadResult.url}`);

        // Use the CDN URL for Instagram
        finalImageUrl = uploadResult.url;
      } else {
        logger.info('✅ Image aspect ratio is valid for Instagram');
      }

      // Step 1: Create container
      const container = await this.createMediaContainer(finalImageUrl, caption, productTags);

      // Random delay between 3-15 minutes to appear natural
      const minDelay = 3 * 60 * 1000; // 3 minutes
      const maxDelay = 15 * 60 * 1000; // 15 minutes
      await this.randomDelay(minDelay, maxDelay);

      // Step 2: Publish
      const media = await this.publishMedia(container.id);

      return {
        containerId: container.id,
        mediaId: media.id,
      };
    } catch (error) {
      logger.error('Error in two-step posting process:', error);
      throw error;
    }
  }

  /**
   * Get media insights (analytics)
   */
  async getMediaInsights(mediaId: string): Promise<MediaInsights> {
    try {
      const metrics = ['engagement', 'impressions', 'reach', 'saved'];
      const params = new URLSearchParams({
        metric: metrics.join(','),
        access_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${mediaId}/insights?${params}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get insights: ${JSON.stringify(error)}`);
      }

      const data = await response.json();

      // Parse insights data
      const insights: MediaInsights = {
        engagement: 0,
        impressions: 0,
        reach: 0,
        saved: 0,
      };

      data.data.forEach((metric: any) => {
        const name = metric.name as keyof MediaInsights;
        insights[name] = metric.values[0]?.value || 0;
      });

      return insights;
    } catch (error) {
      logger.error('Error getting media insights:', error);
      throw error;
    }
  }

  /**
   * Get comments on a post
   */
  async getComments(mediaId: string): Promise<Comment[]> {
    try {
      const params = new URLSearchParams({
        fields: 'id,text,timestamp,username,from',
        access_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${mediaId}/comments?${params}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get comments: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      logger.error('Error getting comments:', error);
      throw error;
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    try {
      // Add random delay before replying (5-30 minutes)
      const minDelay = 5 * 60 * 1000;
      const maxDelay = 30 * 60 * 1000;
      await this.randomDelay(minDelay, maxDelay);

      const params = new URLSearchParams({
        message: message,
        access_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${commentId}/replies`,
        {
          method: 'POST',
          body: params,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to reply to comment: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      logger.info(`Replied to comment ${commentId}`);
      return data;
    } catch (error) {
      logger.error('Error replying to comment:', error);
      throw error;
    }
  }

  /**
   * Hide/unhide a comment
   */
  async hideComment(commentId: string, hide: boolean = true): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        hide: hide.toString(),
        access_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${commentId}`,
        {
          method: 'POST',
          body: params,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to hide comment: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.success || false;
    } catch (error) {
      logger.error('Error hiding comment:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getProfile(): Promise<any> {
    try {
      const params = new URLSearchParams({
        fields: 'id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url',
        access_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/${this.credentials.businessAccountId}?${params}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get profile: ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error getting profile:', error);
      throw error;
    }
  }

  /**
   * Refresh access token (long-lived tokens last 60 days)
   */
  async refreshAccessToken(): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    try {
      if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) {
        throw new Error('META_APP_ID and META_APP_SECRET required for token refresh');
      }

      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: this.credentials.accessToken,
      });

      const response = await fetch(
        `${this.baseUrl}/oauth/access_token?${params}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to refresh token: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      logger.info('Access token refreshed successfully');
      return data;
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      throw error;
    }
  }
}

export default InstagramGraphAPI;
export type { InstagramCredentials, MediaContainerResponse, PublishResponse, MediaInsights, Comment };
