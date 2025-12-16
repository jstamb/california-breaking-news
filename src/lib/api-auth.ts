import { prisma } from './prisma';

export async function validateApiKey(apiKey: string | null): Promise<boolean> {
  if (!apiKey) return false;

  const key = await prisma.apiKey.findFirst({
    where: {
      key: apiKey,
      isActive: true
    },
  });

  if (!key) return false;

  // Update last used timestamp (fire and forget)
  prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsed: new Date() },
  }).catch(console.error);

  return true;
}
