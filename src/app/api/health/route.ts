import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks: Record<string, unknown> = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
      nodeEnv: process.env.NODE_ENV,
    },
  };

  try {
    // Test database connection
    const startTime = Date.now();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    const dbLatency = Date.now() - startTime;

    checks.database = {
      connected: true,
      latency: `${dbLatency}ms`,
      result,
    };

    // Count posts
    const postCount = await prisma.post.count();
    checks.posts = { count: postCount };

    checks.status = 'healthy';

    return NextResponse.json(checks);
  } catch (error) {
    checks.status = 'unhealthy';
    checks.database = {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };

    return NextResponse.json(checks, { status: 500 });
  }
}
