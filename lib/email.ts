/**
 * Email Service - Order Confirmations & Notifications
 *
 * Uses Resend for reliable email delivery
 * Documentation: https://resend.com/docs
 */

import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface OrderEmailData {
  orderId: string
  customerEmail: string
  customerName: string
  items: Array<{
    productTitle: string
    variantName: string
    quantity: number
    price: string
    image: string
  }>
  totalAmount: number
  shippingAddress: any
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!resend) {
    console.warn('⚠️ Resend not configured - skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const emailHtml = generateOrderConfirmationHTML(data)

    const result = await resend.emails.send({
      from: 'Brandon Mills Photography <orders@brandonmills.com>',
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderId}`,
      html: emailHtml,
    })

    if (result.error) {
      throw new Error(`Email failed: ${result.error.message}`)
    }

    console.log('✅ Order confirmation email sent:', result.data.id)
    return { success: true, emailId: result.data.id }
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send order confirmation to admin
 */
export async function sendAdminNotification(data: OrderEmailData) {
  if (!resend) {
    console.warn('⚠️ Resend not configured - skipping admin notification')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const emailHtml = generateAdminNotificationHTML(data)

    const result = await resend.emails.send({
      from: 'Brandon Mills Store <notifications@brandonmills.com>',
      to: 'bmilly23@gmail.com', // Admin email
      subject: `🎉 New Order: ${data.orderId} - $${data.totalAmount}`,
      html: emailHtml,
    })

    if (result.error) {
      throw new Error(`Email failed: ${result.error.message}`)
    }

    console.log('✅ Admin notification email sent:', result.data.id)
    return { success: true, emailId: result.data.id }
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error)
    return { success: false, error }
  }
}

/**
 * Generate beautiful HTML email for customer order confirmation
 */
function generateOrderConfirmationHTML(data: OrderEmailData): string {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.productTitle}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 12px; vertical-align: middle;" />
        <span style="vertical-align: middle;">
          <strong>${item.productTitle}</strong><br />
          <span style="color: #666; font-size: 14px;">${item.variantName}</span>
        </span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price}
      </td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-size: 32px; font-weight: 300; margin: 0; color: #000;">Brandon Mills</h1>
    <p style="font-size: 14px; color: #666; margin: 8px 0 0 0; letter-spacing: 2px;">PHOTOGRAPHY</p>
  </div>

  <!-- Success Message -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
    <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
    <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 500;">Order Confirmed!</h2>
    <p style="margin: 0; opacity: 0.9;">Thank you for your purchase, ${data.customerName}</p>
  </div>

  <!-- Order Details -->
  <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Order Details</h3>
    <p style="margin: 8px 0; color: #666;"><strong>Order Number:</strong> ${data.orderId}</p>
    <p style="margin: 8px 0; color: #666;"><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>
  </div>

  <!-- Items Table -->
  <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 2px solid #000;">
        <th style="padding: 12px 0; text-align: left; font-weight: 600;">Product</th>
        <th style="padding: 12px 0; text-align: center; font-weight: 600;">Qty</th>
        <th style="padding: 12px 0; text-align: right; font-weight: 600;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding: 16px 0; text-align: right; font-weight: 600; font-size: 18px;">Total:</td>
        <td style="padding: 16px 0; text-align: right; font-weight: 600; font-size: 18px;">$${data.totalAmount.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Shipping Address -->
  <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Shipping Address</h3>
    <p style="margin: 4px 0; color: #666;">${data.customerName}</p>
    <p style="margin: 4px 0; color: #666;">${data.shippingAddress?.line1 || ''}</p>
    ${data.shippingAddress?.line2 ? `<p style="margin: 4px 0; color: #666;">${data.shippingAddress.line2}</p>` : ''}
    <p style="margin: 4px 0; color: #666;">
      ${data.shippingAddress?.city || ''}, ${data.shippingAddress?.state || ''} ${data.shippingAddress?.postal_code || ''}
    </p>
    <p style="margin: 4px 0; color: #666;">${data.shippingAddress?.country || ''}</p>
  </div>

  <!-- What's Next -->
  <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
    <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">What Happens Next?</h3>
    <ol style="margin: 0; padding-left: 20px; color: #78350f;">
      <li style="margin: 8px 0;">Your order is being prepared for printing</li>
      <li style="margin: 8px 0;">We'll send you a shipping notification with tracking</li>
      <li style="margin: 8px 0;">Your beautiful prints will arrive in 7-10 business days</li>
    </ol>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 30px 0; border-top: 1px solid #eee; color: #666; font-size: 14px;">
    <p style="margin: 8px 0;">Questions about your order?</p>
    <p style="margin: 8px 0;">
      <a href="mailto:hello@brandonmills.com" style="color: #667eea; text-decoration: none;">hello@brandonmills.com</a>
    </p>
    <p style="margin: 20px 0 8px 0; color: #999; font-size: 12px;">
      © ${new Date().getFullYear()} Brandon Mills Photography. All rights reserved.
    </p>
  </div>

</body>
</html>
  `
}

/**
 * Generate admin notification email
 */
function generateAdminNotificationHTML(data: OrderEmailData): string {
  const itemsList = data.items.map(item =>
    `${item.quantity}x ${item.productTitle} (${item.variantName}) - $${item.price}`
  ).join('<br />')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>🎉 New Order Received!</h2>

  <p><strong>Order ID:</strong> ${data.orderId}</p>
  <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
  <p><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>

  <h3>Items:</h3>
  <p>${itemsList}</p>

  <h3>Shipping To:</h3>
  <p>
    ${data.customerName}<br />
    ${data.shippingAddress?.line1 || ''}<br />
    ${data.shippingAddress?.line2 ? `${data.shippingAddress.line2}<br />` : ''}
    ${data.shippingAddress?.city || ''}, ${data.shippingAddress?.state || ''} ${data.shippingAddress?.postal_code || ''}<br />
    ${data.shippingAddress?.country || ''}
  </p>

  <p style="margin-top: 30px;">
    <a href="https://brandonmills.com/admin/orders" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
      View in Admin Dashboard
    </a>
  </p>
</body>
</html>
  `
}

/**
 * Send shipping notification (when Printful ships)
 */
export async function sendShippingNotification(data: {
  orderId: string
  customerEmail: string
  customerName: string
  trackingNumber: string
  trackingUrl: string
  carrier: string
}) {
  if (!resend) {
    console.warn('⚠️ Resend not configured - skipping shipping email')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>📦 Your Order Has Shipped!</h2>

  <p>Hi ${data.customerName},</p>

  <p>Great news! Your order <strong>${data.orderId}</strong> has been shipped and is on its way to you.</p>

  <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Carrier:</strong> ${data.carrier}</p>
    <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
    <p style="margin-top: 16px;">
      <a href="${data.trackingUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Track Your Package
      </a>
    </p>
  </div>

  <p>Your order should arrive within 5-7 business days.</p>

  <p>If you have any questions, reply to this email or contact us at hello@brandonmills.com</p>

  <p style="margin-top: 30px;">
    Thanks for your purchase!<br />
    Brandon Mills Photography
  </p>
</body>
</html>
    `

    const result = await resend.emails.send({
      from: 'Brandon Mills Photography <shipping@brandonmills.com>',
      to: data.customerEmail,
      subject: `Your Order Has Shipped! 📦 - ${data.orderId}`,
      html: emailHtml,
    })

    if (result.error) {
      throw new Error(`Email failed: ${result.error.message}`)
    }

    console.log('✅ Shipping notification sent:', result.data.id)
    return { success: true, emailId: result.data.id }
  } catch (error) {
    console.error('❌ Failed to send shipping notification:', error)
    return { success: false, error }
  }
}
