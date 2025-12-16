import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://californiabreakingnews.com';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params;

    if (!token) {
      return NextResponse.redirect(`${SITE_URL}?error=invalid-token`);
    }

    // Find subscriber by unsubscribe token
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(`${SITE_URL}?error=invalid-token`);
    }

    // Deactivate the subscriber
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        isActive: false,
      },
    });

    // Redirect to unsubscribed confirmation
    return NextResponse.redirect(`${SITE_URL}?unsubscribed=true`);

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.redirect(`${SITE_URL}?error=unsubscribe-failed`);
  }
}
