import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60 // Allow up to 60 seconds for large file uploads
export const dynamic = 'force-dynamic' // Disable caching to prevent stale responses

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Validate file type (optional)
        return {
          allowedContentTypes: [
            // Images
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic',
            // Audio (for voice memos)
            'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4', 'audio/ogg',
            // Video
            'video/mp4', 'video/quicktime', 'video/webm', 'video/avi',
            // Documents (essays, papers)
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'text/plain', // .txt
            'text/markdown', // .md
            'application/rtf', // .rtf
          ],
          tokenPayload: JSON.stringify({}),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        logger.info('Upload completed:', { data: blob.pathname })
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    logger.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
