// /app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { NewsletterSubscribeSchema, formatZodErrors } from '@/lib/validations'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    const apiKey = process.env.RESEND_API_KEY
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!apiKey) {
      logger.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'Email service is not configured',
          hint: 'Please contact support'
        },
        { status: 503 }
      )
    }

    if (!audienceId) {
      logger.error('RESEND_AUDIENCE_ID is not configured')
      return NextResponse.json(
        {
          error: 'Email audience is not configured',
          hint: 'Please contact support'
        },
        { status: 503 }
      )
    }

    // Initialize Resend inside handler to avoid build-time errors
    const resend = new Resend(apiKey)

    const body = await request.json()

    // Validate input with Zod
    const validationResult = NewsletterSubscribeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { email, source } = validationResult.data

    // Add to Resend audience with retry logic
    let contactAdded = false
    let retries = 3
    let lastError: Error | null = null

    while (!contactAdded && retries > 0) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
          firstName: '',
          lastName: ''
        })
        contactAdded = true
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error')
        retries--
        if (retries > 0) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, (3 - retries) * 1000))
        }
      }
    }

    if (!contactAdded) {
      logger.error('Failed to add contact to Resend audience after retries:', lastError)
      return NextResponse.json(
        {
          error: 'Failed to subscribe. Please try again.',
          hint: 'If the problem persists, contact support'
        },
        { status: 500 }
      )
    }

    // Send welcome email with retry logic
    let emailSent = false
    retries = 3
    lastError = null

    while (!emailSent && retries > 0) {
      try {
        await resend.emails.send({
          from: 'Brandon Mills <hello@brandonmills.com>',
          to: email,
          subject: 'Your Mind Visualization Report',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: system-ui; background: #000; color: #fff; padding: 40px; }
                .container { max-width: 600px; margin: 0 auto; }
                h1 { font-family: Georgia, serif; color: #C9A050; }
                .cta { display: inline-block; padding: 12px 24px; background: #C9A050; color: #000; text-decoration: none; border-radius: 8px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Welcome to the Journey</h1>
                <p>Thanks for exploring your mind with us.</p>
                <p>Your visualization revealed fascinating patterns in how you think and process information.</p>
                <p>Over the next few days, I'll send you:</p>
                <ul>
                  <li>Deep dive into your dominant archetype</li>
                  <li>Personalized meditation recommendations</li>
                  <li>Techniques to enhance your cognitive patterns</li>
                </ul>
                <p>
                  <a href="https://brandonmills.com/meditations" class="cta">Explore Meditations</a>
                </p>
                <p style="color: #666; font-size: 14px;">- Brandon</p>
              </div>
            </body>
            </html>
          `
        })
        emailSent = true
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error')
        retries--
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, (3 - retries) * 1000))
        }
      }
    }

    if (!emailSent) {
      logger.error('Failed to send welcome email after retries:', lastError)
      // Still return success since contact was added
      return NextResponse.json({
        success: true,
        warning: 'Subscribed successfully, but welcome email may be delayed'
      })
    }

    logger.info(`Newsletter subscription successful: ${email} (source: ${source || 'unknown'})`)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for your report.'
    })
  } catch (error) {
    logger.error('Newsletter subscription error:', error)

    // Provide specific error messages
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            error: 'Network error. Please check your connection and try again.',
            hint: 'The issue may be temporary'
          },
          { status: 503 }
        )
      }

      if (error.message.includes('duplicate') || error.message.includes('already')) {
        return NextResponse.json(
          {
            error: 'This email is already subscribed',
            hint: 'Check your inbox for previous emails'
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Subscription failed. Please try again.',
        hint: 'If the problem persists, contact support'
      },
      { status: 500 }
    )
  }
}
