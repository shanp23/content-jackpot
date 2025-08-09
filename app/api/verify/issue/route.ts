import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for demo/local dev
const store: {
  codes: Map<string, { code: string; expiresAt: number; used: boolean; platform: string; profileUrl: string }>
} = { codes: new Map() };

function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // omit easily-confused letters
  let out = '';
  for (let i = 0; i < 7; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'local-demo-user';
    const { platform, profileUrl } = body as { platform: string; profileUrl: string };
    if (!platform || !profileUrl) {
      return NextResponse.json({ success: false, error: 'platform, profileUrl required' }, { status: 400 });
    }
    const accountKey = encodeURIComponent(profileUrl.trim());
    const key = `${userId}:${platform}:${accountKey}`;
    const code = generateCode();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    store.codes.set(key, { code, expiresAt, used: false, platform, profileUrl });
    return NextResponse.json({ success: true, code, expiresAt });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'unknown' }, { status: 500 });
  }
}

// Export store for check route to import in the same runtime instance
export const __issueStore = store;


