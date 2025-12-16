const SITE_NAME = 'California Breaking News';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://californiabreakingnews.com';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string | null;
  publishedAt: Date;
  author: string;
}

const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background-color: #000000; padding: 30px 40px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
  .header p { color: #888888; margin: 5px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
  .content { padding: 40px; }
  .footer { background-color: #1a1a1a; padding: 30px 40px; text-align: center; }
  .footer p { color: #888888; font-size: 12px; margin: 5px 0; }
  .footer a { color: #3b82f6; text-decoration: none; }
  .btn { display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
  .btn:hover { background-color: #2563eb; }
  .article { border-bottom: 1px solid #e5e5e5; padding: 25px 0; }
  .article:last-child { border-bottom: none; }
  .article-category { display: inline-block; background-color: #ef4444; color: #ffffff; padding: 4px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 3px; margin-bottom: 10px; }
  .article-title { margin: 0 0 10px; font-size: 20px; font-weight: 700; line-height: 1.3; }
  .article-title a { color: #111111; text-decoration: none; }
  .article-title a:hover { color: #3b82f6; }
  .article-meta { color: #666666; font-size: 12px; margin-bottom: 10px; }
  .article-excerpt { color: #444444; font-size: 14px; line-height: 1.6; margin: 0; }
  .article-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; }
  .divider { height: 1px; background-color: #e5e5e5; margin: 30px 0; }
  .breaking-badge { display: inline-block; background-color: #dc2626; color: #ffffff; padding: 6px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; animation: pulse 2s infinite; }
`;

export function generateWelcomeEmail(verifyUrl: string, firstName?: string): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Welcome!';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${SITE_NAME}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${SITE_NAME}</h1>
      <p>Voice of the Golden State</p>
    </div>
    <div class="content">
      <h2 style="margin: 0 0 20px; font-size: 24px; color: #111111;">${greeting}</h2>
      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
        Thank you for subscribing to ${SITE_NAME}! You're joining thousands of Californians who stay informed with our breaking news coverage.
      </p>
      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
        Please verify your email address to start receiving our newsletters:
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" class="btn" style="color: #ffffff;">Verify My Email</a>
      </p>
      <div class="divider"></div>
      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
        <strong>What you'll receive:</strong>
      </p>
      <ul style="color: #666666; font-size: 14px; line-height: 1.8; padding-left: 20px;">
        <li>Weekly digest of top California news stories</li>
        <li>Breaking news alerts for major events</li>
        <li>Exclusive content and analysis</li>
      </ul>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      <p>You received this email because you signed up at <a href="${SITE_URL}">${SITE_URL}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateWeeklyDigestEmail(
  posts: Post[],
  unsubscribeUrl: string,
  firstName?: string
): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hello,';
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const articlesHtml = posts.map((post, index) => `
    <div class="article" style="${index === 0 ? 'padding-top: 0;' : ''}">
      ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" class="article-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : ''}
      <span class="article-category" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 4px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 3px; margin-bottom: 10px;">${post.category}</span>
      <h3 class="article-title" style="margin: 0 0 10px; font-size: 20px; font-weight: 700; line-height: 1.3;">
        <a href="${SITE_URL}/news/${post.slug}" style="color: #111111; text-decoration: none;">${post.title}</a>
      </h3>
      <p class="article-meta" style="color: #666666; font-size: 12px; margin-bottom: 10px;">
        By ${post.author} • ${new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      <p class="article-excerpt" style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0 0 15px;">${post.excerpt}</p>
      <a href="${SITE_URL}/news/${post.slug}" style="color: #3b82f6; font-size: 14px; font-weight: 600; text-decoration: none;">Read Full Story →</a>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Digest - ${SITE_NAME}</title>
  <style>${baseStyles}</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div class="header" style="background-color: #000000; padding: 30px 40px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase;">${SITE_NAME}</h1>
      <p style="color: #888888; margin: 5px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Weekly Digest</p>
    </div>
    <div class="content" style="padding: 40px;">
      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">${greeting}</p>
      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
        Here's your weekly roundup of the top California news stories you may have missed.
      </p>

      ${articlesHtml}

      <div style="text-align: center; margin-top: 40px;">
        <a href="${SITE_URL}" class="btn" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Visit ${SITE_NAME}</a>
      </div>
    </div>
    <div class="footer" style="background-color: #1a1a1a; padding: 30px 40px; text-align: center;">
      <p style="color: #888888; font-size: 12px; margin: 5px 0;">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      <p style="color: #888888; font-size: 12px; margin: 5px 0;">
        <a href="${unsubscribeUrl}" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a> |
        <a href="${SITE_URL}" style="color: #3b82f6; text-decoration: none;">Visit Website</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateVerifiedEmail(firstName?: string): string {
  const greeting = firstName ? `Thanks, ${firstName}!` : 'You\'re all set!';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified - ${SITE_NAME}</title>
  <style>${baseStyles}</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div class="header" style="background-color: #000000; padding: 30px 40px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase;">${SITE_NAME}</h1>
      <p style="color: #888888; margin: 5px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Voice of the Golden State</p>
    </div>
    <div class="content" style="padding: 40px; text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #ffffff; font-size: 40px;">✓</span>
      </div>
      <h2 style="margin: 0 0 20px; font-size: 24px; color: #111111;">${greeting}</h2>
      <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
        Your email has been verified. You'll now receive our weekly digest and breaking news alerts.
      </p>
      <a href="${SITE_URL}" class="btn" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Read Latest News</a>
    </div>
    <div class="footer" style="background-color: #1a1a1a; padding: 30px 40px; text-align: center;">
      <p style="color: #888888; font-size: 12px; margin: 5px 0;">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
