/**
 * Social Media Dashboard
 *
 * Web-based interface for managing social media posts:
 * - Reddit post creation and scheduling
 * - Medium import management
 * - Post performance tracking
 * - Multi-platform publishing
 */

import { Metadata } from 'next'
import SocialDashboard from './SocialDashboard'

export const metadata: Metadata = {
  title: 'Social Media Dashboard | Brandon Mills',
  description: 'Manage social media posts and track performance',
  robots: 'noindex, nofollow', // Don't index admin pages
}

export default function SocialDashboardPage() {
  return <SocialDashboard />
}
