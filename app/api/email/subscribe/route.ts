import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Add to audience with custom fields
    const contact = await resend.contacts.create({
      email: email.toLowerCase().trim(),
      firstName: name.trim(),
      audienceId,
      unsubscribed: false,
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Brandon Mills <brandon@brandonmills.com>',
      to: email,
      subject: "You're on the Block 3 Launch List 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Georgia', serif; line-height: 1.6; color: #1A1512; background: #F4ECD8; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border: 2px solid #CD7F32; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1A1512 0%, #2d2419 100%); padding: 40px 20px; text-align: center;">
                <h1 style="margin: 0; color: #D4AF37; font-size: 28px; font-weight: 600;">Random Acts of Self-Actualization</h1>
                <p style="margin: 10px 0 0; color: #E8DCC4; font-size: 16px; font-style: italic;">The Laboratory of Living</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #CD7F32; margin-top: 0;">Welcome, ${name}! 🎉</h2>

                <p>Thank you for joining the Block 3 launch list!</p>

                <p>You're now part of an exclusive group who will be the <strong>first to know</strong> when the final chapter of the trilogy is published on Amazon.</p>

                <div style="background: #F4ECD8; border-left: 4px solid #D4AF37; padding: 20px; margin: 30px 0;">
                  <h3 style="margin-top: 0; color: #1A1512;">What to expect:</h3>
                  <ul style="margin-bottom: 0; padding-left: 20px;">
                    <li>Launch notification the moment Block 3 goes live</li>
                    <li>Exclusive launch-day pricing (if available)</li>
                    <li>Behind-the-scenes insights into the writing process</li>
                    <li>Early access to bonus content and companion materials</li>
                  </ul>
                </div>

                <p>In the meantime, you can read Block 3 for free online at:</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="https://www.brandonmills.com/book/block-3" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%); color: #1A1512; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Read Block 3 Now</a>
                </p>

                <p>Haven't read Books 1 & 2 yet? Get them on Amazon:</p>
                <p style="text-align: center;">
                  <a href="https://www.amazon.com/Random-Acts-Self-Actualization-Building-Addictive-ebook/dp/B0DRDXCJZQ?tag=brandonmil0e-20" style="color: #CD7F32; text-decoration: none; font-weight: bold;">Volume 1: Building a Non-Addictive Life →</a>
                  <br>
                  <a href="https://www.amazon.com/Random-Acts-Self-Actualization-Block-B-ebook/dp/B0DSY6Z4YP?tag=brandonmil0e-20" style="color: #CD7F32; text-decoration: none; font-weight: bold;">Block B →</a>
                </p>

                <p style="margin-top: 40px;">With gratitude,</p>
                <p style="margin: 5px 0;"><strong>Brandon Mills</strong></p>
                <p style="margin: 5px 0; color: #6B5D52; font-style: italic;">Polymath, Philosopher, Author</p>
              </div>

              <!-- Footer -->
              <div style="background: #F4ECD8; padding: 30px; text-align: center; border-top: 2px solid #E8DCC4;">
                <p style="margin: 0; font-size: 14px; color: #6B5D52;">
                  You're receiving this because you subscribed to Block 3 launch notifications at brandonmills.com
                </p>
                <p style="margin: 10px 0; font-size: 12px; color: #6B5D52;">
                  <a href="https://www.brandonmills.com" style="color: #CD7F32; text-decoration: none;">Visit Website</a> •
                  <a href="https://www.instagram.com/mrbrandonmills/" style="color: #CD7F32; text-decoration: none;">Instagram</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Block 3 notifications',
      contactId: contact.id,
    })
  } catch (error: any) {
    console.error('Subscription error:', error)

    // Handle duplicate contact
    if (error?.message?.includes('already exists') || error?.statusCode === 400) {
      return NextResponse.json({
        success: true,
        message: 'You're already subscribed!',
      })
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
