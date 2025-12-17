import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';

// Common words to ignore when comparing titles
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
  'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it',
  'its', 'his', 'her', 'their', 'our', 'your', 'my', 'into', 'about',
  'than', 'so', 'no', 'not', 'only', 'just', 'more', 'most', 'some',
  'any', 'all', 'both', 'each', 'few', 'many', 'much', 'other', 'such',
  'what', 'when', 'where', 'why', 'how', 'if', 'then', 'because',
  'while', 'although', 'after', 'before', 'during', 'until', 'unless',
  'says', 'said', 'new', 'now', 'also', 'over', 'out', 'up', 'down',
  'here', 'there', 'being', 'get', 'gets', 'got', 'report', 'reports',
  'study', 'finds', 'shows', 'reveals', 'according'
]);

/**
 * Normalize and extract keywords from a title
 */
function extractKeywords(title: string): Set<string> {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));

  return new Set(normalized);
}

/**
 * Calculate Jaccard similarity between two sets of keywords
 */
function calculateSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Check if titles share significant keywords (for catching near-duplicates)
 */
function getSharedKeywords(set1: Set<string>, set2: Set<string>): string[] {
  return [...set1].filter(x => set2.has(x));
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!await validateApiKey(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, hours = 168, threshold = 0.4 } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const inputKeywords = extractKeywords(title);

    const existingPosts = await prisma.post.findMany({
      where: {
        publishedAt: { gte: since }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        publishedAt: true
      },
      orderBy: { publishedAt: 'desc' }
    });

    // Find similar posts
    const similarPosts = existingPosts
      .map(post => {
        const postKeywords = extractKeywords(post.title);
        const similarity = calculateSimilarity(inputKeywords, postKeywords);
        const sharedKeywords = getSharedKeywords(inputKeywords, postKeywords);

        return {
          id: post.id,
          slug: post.slug,
          title: post.title,
          publishedAt: post.publishedAt,
          similarity: Math.round(similarity * 100) / 100,
          sharedKeywords
        };
      })
      .filter(post => post.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);

    const isDuplicate = similarPosts.length > 0;
    const bestMatch = similarPosts[0] || null;

    return NextResponse.json({
      isDuplicate,
      inputTitle: title,
      inputKeywords: [...inputKeywords],
      threshold,
      bestMatch,
      similarPosts,
      checkedCount: existingPosts.length
    });

  } catch (error) {
    console.error('Error checking post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
