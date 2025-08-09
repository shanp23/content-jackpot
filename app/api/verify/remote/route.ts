import { NextRequest, NextResponse } from 'next/server';
import { __issueStore } from '../issue/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'local-demo-user';
    const { platform, profileUrl } = body as { platform: string; profileUrl: string };
    if (!platform || !profileUrl) return NextResponse.json({ success: false, error: 'platform, profileUrl required' }, { status: 400 });
    const key = `${userId}:${platform}:${encodeURIComponent(profileUrl.trim())}`;
    const entry = __issueStore.codes.get(key);
    if (!entry) return NextResponse.json({ success: false, error: 'code_not_issued' }, { status: 404 });
    if (entry.used) return NextResponse.json({ success: true, verified: true, already: true });

    const res = await fetch(profileUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      cache: 'no-store',
    });
    const html = await res.text();
    const hasCode = html.toUpperCase().includes(entry.code);
    if (!hasCode) return NextResponse.json({ success: true, verified: false });

    entry.used = true;
    __issueStore.codes.set(key, entry);
    return NextResponse.json({ success: true, verified: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'unknown' }, { status: 500 });
  }
}


