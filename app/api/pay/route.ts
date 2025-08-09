import { NextRequest, NextResponse } from 'next/server';
// Stripe temporarily disabled for local debug; re-enable when ready for payments

// POST /api/pay
// Body: { amount: number, currency: 'usd'|'eur'|'gbp', description?: string }
// Returns: { clientSecret } for Payment Intent (card collection handled by Whop/host page)
export async function POST(req: NextRequest) {
  try {
    const { amount, currency, description } = await req.json();
    if (!amount || !currency) return NextResponse.json({ error: 'amount and currency required' }, { status: 400 });
    // Demo stub: return a mock clientSecret so UI can proceed without Stripe
    return NextResponse.json({ clientSecret: 'demo_client_secret', amount, currency, description: description || 'Content Jackpot Budget' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Stripe error' }, { status: 500 });
  }
}


