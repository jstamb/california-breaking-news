# California Breaking News

A high-performance, SEO-optimized local breaking news site built with Next.js 14+ (App Router), PostgreSQL, and Prisma. Designed to receive automated content from n8n workflows via REST API and deployed on Google Cloud Run.

## Features

- **Next.js 14+ with App Router** - Modern React framework with server components
- **PostgreSQL + Prisma ORM** - Robust database with type-safe queries
- **REST API for n8n** - Automated content publishing from workflows
- **SEO Optimized** - Dynamic sitemaps, meta tags, JSON-LD structured data
- **ISR (Incremental Static Regeneration)** - Fast page loads with automatic updates
- **Dark Mode** - Full theme support with next-themes
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Docker Ready** - Optimized Dockerfile for Cloud Run deployment

## Tech Stack

- **Framework:** Next.js 14+
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Deployment:** Docker → Google Cloud Run
- **Authentication:** API key for n8n endpoints

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/california_breaking_news"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database with sample data:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## API Endpoints

### Create Post (n8n Webhook)

```
POST /api/posts
Header: X-API-Key: your-api-key
```

**Request Body:**
```json
{
  "title": "Breaking: Major Development in California",
  "content": "<p>Full HTML content...</p>",
  "excerpt": "Brief summary for cards and meta descriptions",
  "category": "Local News",
  "tags": ["california", "development"],
  "author": "Jane Smith",
  "featuredImage": "https://example.com/image.jpg",
  "imageAlt": "Image description",
  "isBreaking": true,
  "isPublished": true,
  "metaTitle": "Optional SEO title",
  "metaDescription": "Optional meta description"
}
```

### Other Endpoints

- `GET /api/posts` - List all posts (with pagination)
- `GET /api/posts/[slug]` - Get single post
- `PATCH /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post
- `POST /api/revalidate` - Trigger ISR revalidation

## n8n Integration

1. Create an HTTP Request node in your n8n workflow
2. Set method to `POST`
3. URL: `https://your-domain.com/api/posts`
4. Add header: `X-API-Key: your-api-key`
5. Set Content-Type to `application/json`
6. Map your workflow data to the expected payload format

## Docker Deployment

Build and run locally:
```bash
docker build -t california-breaking-news .
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" california-breaking-news
```

### Cloud Run Deployment

1. Build and push to Google Container Registry:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/california-breaking-news
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy california-breaking-news \
     --image gcr.io/PROJECT_ID/california-breaking-news \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars DATABASE_URL="your-cloud-sql-url"
   ```

## Project Structure

```
/src
├── /app
│   ├── /api
│   │   ├── /posts          # REST API endpoints
│   │   └── /revalidate     # ISR trigger
│   ├── /(site)
│   │   ├── /news           # News pages
│   │   ├── /category       # Category pages
│   │   └── /about          # About page
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── /components
│   ├── /ui                 # UI components
│   ├── /layout             # Header, Footer
│   ├── /news               # Article components
│   └── /seo                # Schema markup
├── /lib
│   ├── prisma.ts           # Prisma client
│   ├── api-auth.ts         # API key validation
│   └── utils.ts            # Utility functions
└── /prisma
    └── schema.prisma       # Database schema
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Your site's public URL |
| `NEXT_PUBLIC_SITE_NAME` | Site name (default: California Breaking News) |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

## License

Private - All rights reserved.
