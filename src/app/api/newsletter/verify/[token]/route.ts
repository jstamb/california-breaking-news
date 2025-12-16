import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/send';
import { generateVerifiedEmail } from '@/lib/email/templates';

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

    // Find subscriber by verify token
    const subscriber = await prisma.subscriber.findUnique({
      where: { verifyToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(`${SITE_URL}?error=invalid-token`);
    }

    if (subscriber.isVerified) {
      return NextResponse.redirect(`${SITE_URL}?message=already-verified`);
    }

    // Verify the subscriber
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        isVerified: true,
        verifyToken: null,
      },
    });

    // Send confirmation email
    await sendEmail({
      to: subscriber.email,
      subject: 'Welcome to California Breaking News!',
      html: generateVerifiedEmail(subscriber.firstName || undefined),
      type: 'verify',
    });

    // Redirect to success page
    return NextResponse.redirect(`${SITE_URL}?subscribed=true`);

  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.redirect(`${SITE_URL}?error=verification-failed`);
  }
}
