import { NextRequest, NextResponse } from 'next/server';
// Simulated payouts endpoint. Stripe disabled in local debug; returns computed totals only.

// POST /api/payouts
// Body: { recipients: { id: string, amount: number, currency: string }[], description?: string }
// Applies 10% commission: charge = sum(amount); platform fee = 10%; creators receive 90% proportionally (simulated)
export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    const { recipients, currency, description } = await req.json();
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'recipients required' }, { status: 400 });
    }
    const total = recipients.reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
    const fee = Math.round(total * 0.10);
    const net = total - fee;

    // In a real Connect flow, you would create a PaymentIntent on-behalf-of the platform and then create Transfers to connected accounts.
    // For prelaunch demo, we only return the computed breakdown.
    return NextResponse.json({ ok: true, total, fee, net, currency: currency || recipients[0]?.currency || 'usd', description: description || 'Jackpot payouts' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Payout error' }, { status: 500 });
  }
}


