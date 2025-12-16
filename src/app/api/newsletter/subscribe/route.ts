import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/send';
import { generateWelcomeEmail } from '@/lib/email/templates';
import crypto from 'crypto';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://californiabreakingnews.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isVerified && existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }

      // Resend verification email if not verified
      if (!existingSubscriber.isVerified) {
        const verifyToken = crypto.randomBytes(32).toString('hex');

        await prisma.subscriber.update({
          where: { id: existingSubscriber.id },
          data: { verifyToken, isActive: true },
        });

        const verifyUrl = `${SITE_URL}/api/newsletter/verify/${verifyToken}`;
        await sendEmail({
          to: email,
          subject: 'Verify your subscription to California Breaking News',
          html: generateWelcomeEmail(verifyUrl, firstName || existingSubscriber.firstName || undefined),
          type: 'welcome',
        });

        return NextResponse.json({
          success: true,
          message: 'Verification email sent. Please check your inbox.',
        });
      }

      // Reactivate if previously unsubscribed
      if (!existingSubscriber.isActive) {
        const verifyToken = crypto.randomBytes(32).toString('hex');

        await prisma.subscriber.update({
          where: { id: existingSubscriber.id },
          data: {
            verifyToken,
            isActive: true,
            isVerified: false,
            firstName: firstName || existingSubscriber.firstName,
            lastName: lastName || existingSubscriber.lastName,
          },
        });

        const verifyUrl = `${SITE_URL}/api/newsletter/verify/${verifyToken}`;
        await sendEmail({
          to: email,
          subject: 'Welcome back to California Breaking News',
          html: generateWelcomeEmail(verifyUrl, firstName || existingSubscriber.firstName || undefined),
          type: 'welcome',
        });

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Verification email sent.',
        });
      }
    }

    // Create new subscriber
    const verifyToken = crypto.randomBytes(32).toString('hex');

    await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        firstName: firstName || null,
        lastName: lastName || null,
        verifyToken,
        isVerified: false,
        isActive: true,
      },
    });

    // Send welcome/verification email
    const verifyUrl = `${SITE_URL}/api/newsletter/verify/${verifyToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your subscription to California Breaking News',
      html: generateWelcomeEmail(verifyUrl, firstName),
      type: 'welcome',
    });

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing! Please check your email to verify.',
    }, { status: 201 });

  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
