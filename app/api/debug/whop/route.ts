import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID || process.env.WHOP_APP_ID || '';
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || '';
  const agent = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID || '';
  const hasApiKey = Boolean(process.env.WHOP_API_KEY);
  return NextResponse.json({
    appId,
    companyId,
    agent,
    hasApiKey,
    note: 'Verify appId matches the App Section ID you are previewing in Whop.'
  });
}


