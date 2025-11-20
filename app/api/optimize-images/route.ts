import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface PhotoToOptimize {
  id: string
  url: string
}

export async function POST(request: Request) {
  try {
    const { photos }: { photos: PhotoToOptimize[] } = await request.json()

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      )
    }

    // Optimize images in parallel (with a concurrency limit)
    const optimizedPhotos = await Promise.all(
      photos.map(async (photo) => {
        try {
          // Upload to Cloudinary with optimizations
          const result = await cloudinary.uploader.upload(photo.url, {
            folder: 'ai-photography-automation',
            transformation: [
              { quality: 'auto:best' },
              { fetch_format: 'auto' }, // Auto WebP/AVIF
              { width: 2400, crop: 'limit' }, // Max width for high-res displays
            ],
            use_filename: true,
            unique_filename: true,
            // Handle large files by downloading with timeout
            timeout: 120000, // 2 minutes
          })

          // Generate optimized URL and thumbnail
          const optimizedUrl = result.secure_url

          // Use 'fit' with padding to preserve entire subject (no cropping)
          const thumbnailUrl = cloudinary.url(result.public_id, {
            width: 600,
            height: 600,
            crop: 'fit', // Changed from 'fill' - preserves entire image
            background: 'auto', // Smart background color
            quality: 'auto:good',
            fetch_format: 'auto',
          })

          return {
            id: photo.id,
            optimizedUrl,
            thumbnailUrl,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          }
        } catch (error: any) {
          logger.error('Error optimizing photo ${photo.id}:', error)

          // If file is too large for Cloudinary free tier, use original Blob URL
          if (error?.http_code === 400 && error?.message?.includes('File size too large')) {
            logger.info('Photo ${photo.id} exceeds Cloudinary limit, using Blob URL')
            return {
              id: photo.id,
              optimizedUrl: photo.url, // Use Vercel Blob URL directly
              thumbnailUrl: photo.url,
              skipped: true,
              reason: 'File size exceeds Cloudinary free tier (10MB)',
            }
          }

          // Return original if optimization fails for other reasons
          return {
            id: photo.id,
            optimizedUrl: photo.url,
            thumbnailUrl: photo.url,
            error: 'Optimization failed',
          }
        }
      })
    )

    return NextResponse.json(optimizedPhotos)
  } catch (error) {
    logger.error('Image optimization error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Optimization failed',
      },
      { status: 500 }
    )
  }
}
