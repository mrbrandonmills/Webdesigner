/**
 * CDN Uploader for Instagram Image Processing
 * Uploads processed images to Vercel Blob storage for use with Instagram API
 */

import { put } from '@vercel/blob';
import { logger } from '../logger';

export interface UploadResult {
  url: string;
  size: number;
  uploadedAt: Date;
}

/**
 * Upload a buffer to Vercel Blob storage
 */
export async function uploadToVercelBlob(
  buffer: Buffer,
  filename: string,
  options?: {
    contentType?: string;
    addRandomSuffix?: boolean;
  }
): Promise<UploadResult> {
  try {
    const {
      contentType = 'image/jpeg',
      addRandomSuffix = true,
    } = options || {};

    // Add random suffix to avoid name collisions
    const finalFilename = addRandomSuffix
      ? `${filename.replace(/\.[^.]+$/, '')}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
      : filename;

    logger.info(`Uploading to Vercel Blob: ${finalFilename} (${buffer.length} bytes)`);

    const blob = await put(finalFilename, buffer, {
      access: 'public',
      contentType,
    });

    logger.info(`✅ Uploaded to: ${blob.url}`);

    return {
      url: blob.url,
      size: buffer.length,
      uploadedAt: new Date(),
    };
  } catch (error) {
    logger.error('Error uploading to Vercel Blob:', error);
    throw new Error(`Failed to upload to CDN: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Upload a buffer to Cloudinary (if configured)
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<UploadResult> {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not configured');
    }

    const cloudinary = await import('cloudinary');
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    logger.info(`Uploading to Cloudinary: ${filename} (${buffer.length} bytes)`);

    // Convert buffer to base64 data URI
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(dataUri, {
      folder: 'instagram-processed',
      public_id: filename.replace(/\.[^.]+$/, ''),
      resource_type: 'image',
      format: 'jpg',
    });

    logger.info(`✅ Uploaded to: ${result.secure_url}`);

    return {
      url: result.secure_url,
      size: buffer.length,
      uploadedAt: new Date(),
    };
  } catch (error) {
    logger.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload to Cloudinary: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Smart upload - tries Vercel Blob first, falls back to Cloudinary if needed
 */
export async function uploadImageToCDN(
  buffer: Buffer,
  filename: string,
  preferCloudinary: boolean = false
): Promise<UploadResult> {
  try {
    // Try preferred method first
    if (preferCloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        return await uploadToCloudinary(buffer, filename);
      } catch (cloudinaryError) {
        logger.warn('Cloudinary upload failed, falling back to Vercel Blob:', cloudinaryError);
        return await uploadToVercelBlob(buffer, filename);
      }
    }

    // Default to Vercel Blob
    return await uploadToVercelBlob(buffer, filename);
  } catch (error) {
    // If Vercel Blob fails and Cloudinary is configured, try Cloudinary
    if (!preferCloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      logger.warn('Vercel Blob upload failed, trying Cloudinary:', error);
      try {
        return await uploadToCloudinary(buffer, filename);
      } catch (cloudinaryError) {
        logger.error('Both CDN uploads failed');
        throw error; // Throw original error
      }
    }

    throw error;
  }
}
