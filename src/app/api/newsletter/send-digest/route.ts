import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { sendEmail } from '@/lib/email/send';
import { generateWeeklyDigestEmail } from '@/lib/email/templates';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://californiabreakingnews.com';

// POST /api/newsletter/send-digest - Trigger weekly digest (called by n8n)
export async function POST(request: NextRequest) {
  // Validate API key
  const apiKey = request.headers.get('X-API-Key');
  if (!(await validateApiKey(apiKey))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 10;

    // Get posts from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        publishedAt: { gte: oneWeekAgo },
      },
      orderBy: [
        { isBreaking: 'desc' },
        { viewCount: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: limit,
    });

    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts to send in digest',
        sent: 0,
        failed: 0,
      });
    }

    // Get all verified, active subscribers who want weekly emails
    const subscribers = await prisma.subscriber.findMany({
      where: {
        isVerified: true,
        isActive: true,
        preferences: { has: 'weekly' },
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to send to',
        sent: 0,
        failed: 0,
      });
    }

    // Send emails to all subscribers
    let sent = 0;
    let failed = 0;

    // Process in batches to avoid overwhelming the email service
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map(async (subscriber) => {
          const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;

          const result = await sendEmail({
            to: subscriber.email,
            subject: `Weekly Digest: Top California News Stories`,
            html: generateWeeklyDigestEmail(posts, unsubscribeUrl, subscriber.firstName || undefined),
            type: 'weekly_digest',
          });

          if (result.success) {
            // Update last email sent timestamp
            await prisma.subscriber.update({
              where: { id: subscriber.id },
              data: { lastEmailSent: new Date() },
            }).catch(() => {});
          }

          return result;
        })
      );

      results.forEach((result) => {
        if (result.success) sent++;
        else failed++;
      });

      // Small delay between batches to avoid rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Weekly digest sent successfully`,
      sent,
      failed,
      totalSubscribers: subscribers.length,
      postsIncluded: posts.length,
    });

  } catch (error) {
    console.error('Error sending weekly digest:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly digest' },
      { status: 500 }
    );
  }
}

// GET /api/newsletter/send-digest - Get digest stats
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!(await validateApiKey(apiKey))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [subscriberCount, verifiedCount, recentEmails] = await Promise.all([
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.subscriber.count({ where: { isActive: true, isVerified: true } }),
      prisma.emailLog.findMany({
        where: { type: 'weekly_digest' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      subscribers: {
        total: subscriberCount,
        verified: verifiedCount,
      },
      recentDigests: recentEmails,
    });

  } catch (error) {
    console.error('Error getting digest stats:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
