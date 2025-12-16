import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an API key for n8n
  const apiKey = crypto.randomBytes(32).toString('hex');

  await prisma.apiKey.upsert({
    where: { key: apiKey },
    update: {},
    create: {
      key: apiKey,
      name: 'n8n-automation',
      isActive: true,
    },
  });

  console.log('API Key created for n8n:', apiKey);
  console.log('Save this key in your n8n workflow headers as X-API-Key');

  // Create sample posts
  const samplePosts = [
    {
      slug: 'breaking-major-development-downtown-la',
      title: 'Major Development Project Announced for Downtown Los Angeles',
      excerpt: 'City council approves the massive redevelopment plan that promises to transform the skyline and bring thousands of new jobs to the area.',
      content: `<p>Los Angeles city officials have announced a groundbreaking development project that will reshape the downtown skyline over the next decade.</p>
      <p>The project, valued at over $2 billion, includes plans for new residential towers, commercial spaces, and public parks. City planners expect the development to create thousands of construction jobs and permanent positions once completed.</p>
      <p>"This is a transformative moment for our city," said Mayor Karen Bass. "We're not just building structures; we're building a future for Los Angeles that includes affordable housing and sustainable development."</p>
      <p>The first phase of construction is expected to begin in early 2025.</p>`,
      featuredImage: 'https://picsum.photos/id/122/1200/800',
      imageAlt: 'Downtown Los Angeles skyline at sunset',
      category: 'local news',
      tags: ['los angeles', 'development', 'city council', 'downtown'],
      author: 'Maria Santos',
      isBreaking: true,
      isPublished: true,
    },
    {
      slug: 'california-tech-industry-report-2024',
      title: 'California Tech Industry Shows Strong Growth Despite National Trends',
      excerpt: 'Silicon Valley continues to lead innovation with AI and clean energy sectors driving unprecedented expansion.',
      content: `<p>A new report released today shows California's technology sector continues to outpace national trends, with artificial intelligence and clean energy companies leading the charge.</p>
      <p>The report, compiled by the California Technology Council, indicates that tech employment in the state grew by 8% in the past year, compared to a 3% national average.</p>
      <p>Key findings include:</p>
      <ul>
        <li>AI-related job postings increased by 45%</li>
        <li>Clean energy tech companies raised $12 billion in venture funding</li>
        <li>Remote work adoption remains 40% higher than pre-pandemic levels</li>
      </ul>`,
      featuredImage: 'https://picsum.photos/id/1/1200/800',
      imageAlt: 'Silicon Valley tech campus',
      category: 'technology',
      tags: ['tech', 'silicon valley', 'AI', 'jobs'],
      author: 'James Chen',
      isBreaking: false,
      isPublished: true,
    },
    {
      slug: 'sacramento-new-legislation-housing',
      title: 'Sacramento Passes Landmark Housing Legislation',
      excerpt: 'New laws aim to address California housing crisis with streamlined approval processes and affordability requirements.',
      content: `<p>The California State Legislature has passed a comprehensive housing package that supporters say will address the state's ongoing housing crisis.</p>
      <p>The legislation includes provisions for:</p>
      <ul>
        <li>Streamlined approval for multi-family housing projects</li>
        <li>Increased requirements for affordable units in new developments</li>
        <li>Tax incentives for landlords who maintain below-market rents</li>
      </ul>
      <p>Governor Newsom is expected to sign the bill into law next week.</p>`,
      featuredImage: 'https://picsum.photos/id/48/1200/800',
      imageAlt: 'California State Capitol building',
      category: 'politics',
      tags: ['sacramento', 'housing', 'legislation', 'politics'],
      author: 'Patricia Williams',
      isBreaking: false,
      isPublished: true,
    },
    {
      slug: 'golden-state-warriors-playoff-preview',
      title: 'Warriors Eye Championship Run as Playoffs Approach',
      excerpt: 'After a strong regular season, the Golden State Warriors look poised for another championship pursuit.',
      content: `<p>The Golden State Warriors have clinched their playoff spot with an impressive regular season performance, and hopes are high in the Bay Area for another championship run.</p>
      <p>Head coach Steve Kerr praised his team's resilience throughout the season, highlighting the contributions of both veteran players and rising stars.</p>
      <p>"This team has shown incredible character," Kerr said at yesterday's press conference. "We're ready for whatever the playoffs bring."</p>`,
      featuredImage: 'https://picsum.photos/id/237/1200/800',
      imageAlt: 'Basketball action shot',
      category: 'sports',
      tags: ['warriors', 'basketball', 'NBA', 'playoffs'],
      author: 'Michael Johnson',
      isBreaking: false,
      isPublished: true,
    },
    {
      slug: 'hollywood-film-industry-rebound',
      title: 'Hollywood Film Industry Shows Signs of Major Rebound',
      excerpt: 'After years of disruption, studios report increased production and box office revenues.',
      content: `<p>The entertainment industry in Los Angeles is experiencing a significant rebound, with major studios reporting increased production schedules and improving box office numbers.</p>
      <p>Industry analysts point to several factors driving the recovery:</p>
      <ul>
        <li>Audiences returning to theaters in larger numbers</li>
        <li>Streaming services increasing original content budgets</li>
        <li>International markets showing strong demand for American productions</li>
      </ul>
      <p>The recovery is welcome news for the thousands of workers in the entertainment industry who faced uncertainty during recent years.</p>`,
      featuredImage: 'https://picsum.photos/id/28/1200/800',
      imageAlt: 'Hollywood sign at sunset',
      category: 'entertainment',
      tags: ['hollywood', 'movies', 'entertainment', 'studios'],
      author: 'Sarah Martinez',
      isBreaking: false,
      isPublished: true,
    },
  ];

  for (const postData of samplePosts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    });
  }

  console.log(`Created ${samplePosts.length} sample posts`);
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
