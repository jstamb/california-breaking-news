import { prisma } from '@/lib/prisma';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'California Breaking News <news@californiabreakingnews.com>';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  type: 'welcome' | 'verify' | 'weekly_digest' | 'breaking';
}

interface ResendResponse {
  id?: string;
  error?: { message: string };
}

export async function sendEmail({ to, subject, html, type }: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const data: ResendResponse = await response.json();

    if (!response.ok) {
      // Log failed email
      await prisma.emailLog.create({
        data: {
          email: to,
          subject,
          type,
          status: 'failed',
        },
      });
      return { success: false, error: data.error?.message || 'Failed to send email' };
    }

    // Log successful email
    await prisma.emailLog.create({
      data: {
        email: to,
        subject,
        type,
        status: 'sent',
        messageId: data.id,
      },
    });

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending email:', error);

    // Log failed email
    await prisma.emailLog.create({
      data: {
        email: to,
        subject,
        type,
        status: 'failed',
      },
    }).catch(() => {});

    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendBulkEmails(
  emails: SendEmailOptions[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  // Send emails in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(sendEmail));

    results.forEach((result) => {
      if (result.success) sent++;
      else failed++;
    });

    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { sent, failed };
}
