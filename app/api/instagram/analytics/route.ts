/**
 * Instagram Analytics API
 * Provides dashboard data and analytics endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import InstagramGraphAPI from '@/lib/instagram/official-api';
import InstagramAnalytics from '@/lib/instagram/analytics';

/**
 * GET /api/instagram/analytics
 * Get analytics dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';
    const productId = searchParams.get('productId');
    const days = parseInt(searchParams.get('days') || '30');

    // Initialize API and analytics
    const api = new InstagramGraphAPI();
    const analytics = new InstagramAnalytics(api);
    await analytics.initialize();

    let data: any;

    switch (type) {
      case 'dashboard':
        data = analytics.getDashboardMetrics();
        break;

      case 'product':
        if (!productId) {
          return NextResponse.json(
            { error: 'productId required for product analytics' },
            { status: 400 }
          );
        }
        data = analytics.getProductPerformance(productId);
        break;

      case 'time':
        data = analytics.getTimeAnalytics(days);
        break;

      case 'export':
        const filePath = await analytics.exportToCSV();
        return NextResponse.json({ filePath });

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/instagram/analytics
 * Manually update analytics for a specific post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaId } = body;

    if (!mediaId) {
      return NextResponse.json(
        { error: 'mediaId required' },
        { status: 400 }
      );
    }

    // Initialize API and analytics
    const api = new InstagramGraphAPI();
    const analytics = new InstagramAnalytics(api);
    await analytics.initialize();

    // Update metrics
    await analytics.updatePostMetrics(mediaId);

    const postAnalytics = analytics.getPostAnalytics(mediaId);

    return NextResponse.json({
      success: true,
      analytics: postAnalytics,
    });
  } catch (error) {
    logger.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
