import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

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
          })

          // Generate optimized URL and thumbnail
          const optimizedUrl = result.secure_url
          const thumbnailUrl = cloudinary.url(result.public_id, {
            width: 600,
            height: 600,
            crop: 'fill',
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
        } catch (error) {
          console.error(`Error optimizing photo ${photo.id}:`, error)
          // Return original if optimization fails
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
    console.error('Image optimization error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Optimization failed',
      },
      { status: 500 }
    )
  }
}
