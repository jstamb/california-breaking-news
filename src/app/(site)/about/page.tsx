import type { Metadata } from 'next';

const SITE_NAME = 'California Breaking News';
const SITE_DESCRIPTION = 'Your trusted source for breaking California news.';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn more about ${SITE_NAME} - your trusted source for California news and community updates.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">About {SITE_NAME}</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-xl leading-relaxed text-muted-foreground mb-8">{SITE_DESCRIPTION}</p>
        <p>
          Founded in 2024, {SITE_NAME} is dedicated to providing real-time, accurate, and
          community-focused news coverage across the Golden State. We believe that local news is
          the backbone of a healthy democracy and a thriving community.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower our readers with information that matters. From Sacramento
          politics to San Francisco tech, Los Angeles entertainment to San Diego business, we
          cover the stories that impact Californians&apos; daily lives.
        </p>
        <h2>The Team</h2>
        <p>
          Our team is comprised of dedicated journalists, photographers, and editors who live and
          work throughout California. We are your neighbors, committed to telling our collective
          story with integrity.
        </p>
        <h2>Contact Us</h2>
        <p>
          Got a tip? Want to advertise? <br />
          Email us at{' '}
          <a href="mailto:contact@californiabreakingnews.com" className="text-primary hover:underline">
            contact@californiabreakingnews.com
          </a>
        </p>
      </div>
    </div>
  );
}
