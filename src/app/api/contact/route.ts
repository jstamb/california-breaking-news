import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@californiabreakingnews.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Generate contact email HTML
    const html = generateContactEmailHtml({ name, email, subject, message });

    // Send email to contact inbox
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `[Contact Form] ${subject} - from ${name}`,
      html,
      type: 'contact',
      replyTo: email,
    });

    // Send confirmation to user
    await sendEmail({
      to: email,
      subject: 'We received your message - California Breaking News',
      html: generateConfirmationEmailHtml(name),
      type: 'contact-confirmation',
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent. We\'ll get back to you soon!',
    });

  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

function generateContactEmailHtml({ name, email, subject, message }: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px;">
                California Breaking News
              </h1>
              <p style="margin: 8px 0 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                Contact Form Submission
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">From</p>
                    <p style="margin: 0; font-size: 16px; color: #1a1a1a; font-weight: 600;">${name}</p>
                    <p style="margin: 4px 0 0; font-size: 14px; color: #666;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Subject</p>
                    <p style="margin: 0; font-size: 16px; color: #1a1a1a; font-weight: 600;">${subject}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <p style="margin: 0 0 12px; font-size: 12px; color: #666; text-transform: uppercase;">Message</p>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #dc2626;">
                      <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                Reply directly to this email to respond to ${name}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateConfirmationEmailHtml(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px;">
                California Breaking News
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 30px;">✓</span>
              </div>
              <h2 style="margin: 0 0 16px; font-size: 24px; color: #1a1a1a;">Message Received!</h2>
              <p style="margin: 0 0 24px; font-size: 16px; color: #666; line-height: 1.6;">
                Hi ${name},<br><br>
                Thank you for reaching out to California Breaking News. We've received your message and will get back to you as soon as possible.
              </p>
              <p style="margin: 0; font-size: 14px; color: #888;">
                Typical response time: 1-2 business days
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                &copy; ${new Date().getFullYear()} California Breaking News. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
