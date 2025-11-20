/**
 * Instagram Image Processor
 * Ensures images meet Instagram's aspect ratio requirements
 *
 * Instagram supported aspect ratios:
 * - Square: 1:1
 * - Portrait: 4:5 (0.8)
 * - Landscape: 1.91:1 (max)
 *
 * Any image outside these bounds will be adjusted to fit within Instagram limits.
 */

import sharp from 'sharp';
import { logger } from '../logger';

export interface ImageProcessingResult {
  buffer: Buffer;
  width: number;
  height: number;
  originalAspectRatio: number;
  processedAspectRatio: number;
  wasModified: boolean;
  method: 'none' | 'crop' | 'pad';
}

export interface ImageProcessingOptions {
  preferredMethod?: 'crop' | 'pad';
  backgroundColor?: string;
  quality?: number;
}

// Instagram aspect ratio limits
const INSTAGRAM_MAX_LANDSCAPE = 1.91; // 1.91:1
const INSTAGRAM_MAX_PORTRAIT = 0.8; // 4:5
const INSTAGRAM_SQUARE = 1.0; // 1:1

// Small tolerance for floating point comparison
const ASPECT_RATIO_TOLERANCE = 0.01;

/**
 * Check if an aspect ratio is within Instagram's acceptable range
 * Includes a small tolerance for floating point precision
 */
export function isValidInstagramAspectRatio(aspectRatio: number): boolean {
  return (
    aspectRatio >= INSTAGRAM_MAX_PORTRAIT - ASPECT_RATIO_TOLERANCE &&
    aspectRatio <= INSTAGRAM_MAX_LANDSCAPE + ASPECT_RATIO_TOLERANCE
  );
}

/**
 * Determine the best target aspect ratio for an out-of-bounds image
 */
function getTargetAspectRatio(aspectRatio: number): number {
  if (aspectRatio < INSTAGRAM_MAX_PORTRAIT) {
    // Too tall - target portrait max (4:5)
    return INSTAGRAM_MAX_PORTRAIT;
  } else if (aspectRatio > INSTAGRAM_MAX_LANDSCAPE) {
    // Too wide - target landscape max (1.91:1)
    return INSTAGRAM_MAX_LANDSCAPE;
  }
  // Within bounds
  return aspectRatio;
}

/**
 * Crop image to target aspect ratio (from center)
 */
async function cropToAspectRatio(
  image: sharp.Sharp,
  metadata: sharp.Metadata,
  targetAspectRatio: number
): Promise<sharp.Sharp> {
  const { width = 0, height = 0 } = metadata;

  const currentAspectRatio = width / height;

  let newWidth: number;
  let newHeight: number;

  if (currentAspectRatio > targetAspectRatio) {
    // Image is too wide - crop width
    newHeight = height;
    newWidth = Math.round(height * targetAspectRatio);
  } else {
    // Image is too tall - crop height
    newWidth = width;
    newHeight = Math.round(width / targetAspectRatio);
  }

  logger.info(`Cropping from ${width}x${height} to ${newWidth}x${newHeight}`);

  return image.extract({
    left: Math.round((width - newWidth) / 2),
    top: Math.round((height - newHeight) / 2),
    width: newWidth,
    height: newHeight,
  });
}

/**
 * Pad image to target aspect ratio (center with background)
 */
async function padToAspectRatio(
  image: sharp.Sharp,
  metadata: sharp.Metadata,
  targetAspectRatio: number,
  backgroundColor: string
): Promise<sharp.Sharp> {
  const { width = 0, height = 0 } = metadata;

  const currentAspectRatio = width / height;

  let newWidth: number;
  let newHeight: number;

  if (currentAspectRatio > targetAspectRatio) {
    // Image is too wide - add padding to height
    newWidth = width;
    newHeight = Math.round(width / targetAspectRatio);
  } else {
    // Image is too tall - add padding to width
    newHeight = height;
    newWidth = Math.round(height * targetAspectRatio);
  }

  logger.info(`Padding from ${width}x${height} to ${newWidth}x${newHeight}`);

  const paddingTop = Math.round((newHeight - height) / 2);
  const paddingLeft = Math.round((newWidth - width) / 2);

  return image.extend({
    top: paddingTop,
    bottom: newHeight - height - paddingTop,
    left: paddingLeft,
    right: newWidth - width - paddingLeft,
    background: backgroundColor,
  });
}

/**
 * Process an image URL or buffer to meet Instagram requirements
 */
export async function processImageForInstagram(
  input: string | Buffer,
  options: ImageProcessingOptions = {}
): Promise<ImageProcessingResult> {
  const {
    preferredMethod = 'crop',
    backgroundColor = '#FFFFFF',
    quality = 90,
  } = options;

  try {
    // Load image
    let image = sharp(input);
    const metadata = await image.metadata();

    const { width = 0, height = 0, format } = metadata;
    const originalAspectRatio = width / height;

    logger.info(`Processing image: ${width}x${height}, aspect ratio: ${originalAspectRatio.toFixed(2)}:1`);

    // Check if processing is needed
    if (isValidInstagramAspectRatio(originalAspectRatio)) {
      logger.info('Image aspect ratio is already valid for Instagram');

      // Convert to JPEG if needed and return
      const buffer = await image
        .jpeg({ quality })
        .toBuffer();

      return {
        buffer,
        width,
        height,
        originalAspectRatio,
        processedAspectRatio: originalAspectRatio,
        wasModified: false,
        method: 'none',
      };
    }

    // Determine target aspect ratio
    const targetAspectRatio = getTargetAspectRatio(originalAspectRatio);

    logger.info(`Adjusting to target aspect ratio: ${targetAspectRatio.toFixed(2)}:1`);

    // Apply chosen method
    if (preferredMethod === 'crop') {
      image = await cropToAspectRatio(image, metadata, targetAspectRatio);
    } else {
      image = await padToAspectRatio(image, metadata, targetAspectRatio, backgroundColor);
    }

    // Convert to buffer first to ensure processing is complete
    const intermediateBuffer = await image.toBuffer();
    image = sharp(intermediateBuffer);

    // Get new metadata
    const newMetadata = await image.metadata();
    const newWidth = newMetadata.width || 0;
    const newHeight = newMetadata.height || 0;
    const processedAspectRatio = newWidth / newHeight;

    // Convert to JPEG and optimize
    const buffer = await image
      .jpeg({ quality })
      .toBuffer();

    logger.info(`✅ Image processed: ${newWidth}x${newHeight}, aspect ratio: ${processedAspectRatio.toFixed(2)}:1`);

    return {
      buffer,
      width: newWidth,
      height: newHeight,
      originalAspectRatio,
      processedAspectRatio,
      wasModified: true,
      method: preferredMethod,
    };
  } catch (error) {
    logger.error('Error processing image:', error);
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Download an image from a URL
 */
export async function downloadImage(url: string): Promise<Buffer> {
  try {
    logger.info(`Downloading image from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    logger.info(`✅ Image downloaded: ${buffer.length} bytes`);

    return buffer;
  } catch (error) {
    logger.error('Error downloading image:', error);
    throw new Error(`Image download failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Convert a buffer to a data URL
 */
export function bufferToDataURL(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Get image dimensions and aspect ratio from URL
 */
export async function getImageInfo(url: string): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
  format: string;
  isValidForInstagram: boolean;
}> {
  try {
    const buffer = await downloadImage(url);
    const metadata = await sharp(buffer).metadata();

    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const aspectRatio = width / height;
    const format = metadata.format || 'unknown';
    const isValidForInstagram = isValidInstagramAspectRatio(aspectRatio);

    return {
      width,
      height,
      aspectRatio,
      format,
      isValidForInstagram,
    };
  } catch (error) {
    logger.error('Error getting image info:', error);
    throw error;
  }
}

/**
 * Convenience function for the common use case:
 * Download from URL and process for Instagram
 */
export async function downloadAndProcessForInstagram(
  url: string,
  options: ImageProcessingOptions = {}
): Promise<ImageProcessingResult> {
  const buffer = await downloadImage(url);
  return processImageForInstagram(buffer, options);
}
