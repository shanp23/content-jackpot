import { NextResponse } from 'next/server';

// Local demo handler: settles any jackpots whose endDate < now and not yet settled.
export async function GET() {
  try {
    const now = new Date();
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('jackpots') : null;
    const arr = raw ? JSON.parse(raw) : [];
    let settled = 0;

    for (let i = 0; i < arr.length; i++) {
      const j = arr[i];
      const expired = new Date(j.endDate) <= now;
      const already = j.status === 'SETTLED' || j.status === 'PAID' || (j.winners && j.prizeSplit && j.jackpotPool !== undefined);
      if (expired && !already) {
        // Minimal inline settle to avoid importing window-localStorage from server context
        const participants = (j.participants && j.participants.length > 0)
          ? j.participants.slice()
          : Array.from({ length: 5 }, (_, k) => ({ id: `${j.id}_p${k + 1}`, name: `Creator ${k + 1}`, views: Math.floor(Math.random() * 2000) }));
        const sortedDesc = participants.slice().sort((a: any, b: any) => b.views - a.views);
        const top = sortedDesc.slice(0, 3);

        // Fixed 60/25/15 split to avoid RNG on server demo
        const split = { first: 60, second: 25, third: 15 };
        const pool = j.jackpotPool ?? Math.round((j.jackpotBudget * 0.25) * 100) / 100;
        const winners = top.map((p: any, idx: number) => ({
          id: p.id, name: p.name, views: p.views, rank: idx + 1,
          amount: Math.round((pool * (idx === 0 ? 0.6 : idx === 1 ? 0.25 : 0.15)) * 100) / 100,
        }));

        arr[i] = { ...j, participants, status: 'SETTLED', jackpotPool: pool, prizeSplit: split, winners };
        settled++;
      }
    }

    if (typeof localStorage !== 'undefined') localStorage.setItem('jackpots', JSON.stringify(arr));
    return NextResponse.json({ success: true, settled });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'unknown' }, { status: 500 });
  }
}


