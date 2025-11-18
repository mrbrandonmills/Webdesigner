import { NextRequest, NextResponse } from 'next/server'
import { createPinterestPin } from '@/lib/pinterest-automation'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for browser automation

interface PostToPinterestRequest {
  title: string
  description: string
  imageUrl: string
  link: string
  boardName?: string
  altText?: string
  email?: string
  password?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PostToPinterestRequest = await request.json()

    const { title, description, imageUrl, link, boardName, altText, email, password } = body

    // Validation
    if (!title || !description || !imageUrl || !link) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, imageUrl, link' },
        { status: 400 }
      )
    }

    // Prepare credentials if provided
    const credentials = email && password ? { email, password } : undefined

    // Create Pin using browser automation
    const result = await createPinterestPin(
      {
        title,
        description,
        imageUrl,
        link,
        boardName,
        altText,
      },
      credentials,
      true // Run in headless mode in production
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        pinUrl: result.pinUrl,
        message: 'Pin created successfully',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to create Pin',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Pinterest posting error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
