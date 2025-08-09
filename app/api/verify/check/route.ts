import { NextRequest, NextResponse } from 'next/server';
import { __issueStore } from '../issue/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'local-demo-user';
    const { platform, profileUrl, bio } = body as { platform: string; profileUrl: string; bio?: string };
    if (!platform || !profileUrl) {
      return NextResponse.json({ success: false, error: 'platform, profileUrl required' }, { status: 400 });
    }
    const accountKey = encodeURIComponent(profileUrl.trim());
    const key = `${userId}:${platform}:${accountKey}`;
    const entry = __issueStore.codes.get(key);
    if (!entry) return NextResponse.json({ success: false, error: 'code_not_issued' }, { status: 404 });
    if (entry.used) return NextResponse.json({ success: true, verified: true, already: true });
    if (Date.now() > entry.expiresAt) return NextResponse.json({ success: false, error: 'expired' }, { status: 410 });

    // For demo: rely on provided bio text containing the code (case-insensitive)
    const source = (bio || '').toUpperCase();
    if (!source || !source.includes(entry.code)) {
      return NextResponse.json({ success: false, verified: false, error: 'code_not_found_in_bio' }, { status: 400 });
    }

    entry.used = true;
    __issueStore.codes.set(key, entry);
    return NextResponse.json({ success: true, verified: true, platform, profileUrl: entry.profileUrl });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'unknown' }, { status: 500 });
  }
}


