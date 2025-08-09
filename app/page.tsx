"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { TrophyIcon, PlusIcon, BarChart2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIframeSdk } from '@whop/react';

type StoredJackpot = {
  id: string;
  campaignName: string;
  contentRewardsCampaignUrl: string;
  jackpotBudget: number;
  currency: 'USD' | 'EUR' | 'GBP';
  startDate: string;
  endDate: string;
  platforms: { tiktok: boolean; instagram: boolean; youtube: boolean; twitter: boolean };
  contentRequirements: string;
  rewardRatePer1k?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'DRAFT' | 'SETTLED' | 'PAID';
  views?: number;
  submissions?: number;
  lastUpdated?: string;
  participants?: { id: string; name: string; views: number }[];
  jackpotPool?: number;
  prizeSplit?: { first: number; second: number; third: number };
  winners?: { id: string; name: string; views: number; rank: number; amount: number }[];
  settledAt?: string;
};

function isActive(j: StoredJackpot) {
  if (j.status === 'SETTLED' || j.status === 'PAID' || j.status === 'COMPLETED') return false;
  const now = new Date();
  return new Date(j.endDate) > now;
}

function formatCurrency(value: number, currency: StoredJackpot['currency']) {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return symbol + value.toLocaleString();
}

function useJackpotsWithLiveMetrics() {
  const [jackpots, setJackpots] = useState<StoredJackpot[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('jackpots');
      if (raw) setJackpots(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // Simulate live metrics and auto-expire
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpots((prev): StoredJackpot[] => {
        const updated: StoredJackpot[] = prev.map((j): StoredJackpot => {
          const now = new Date();
          const expired = new Date(j.endDate) <= now;
          // If expired and already finalized, keep as-is to avoid re-randomizing
          if (expired && j.status === 'COMPLETED' && j.winners && j.prizeSplit && typeof j.jackpotPool === 'number') {
            return j;
          }

          // Initialize participants for active or first-time completion
          let participants = j.participants ?? [];
          const ensureSeed = () => {
            if (participants.length === 0) {
              const seed = Math.max(3, j.submissions || 3);
              participants = Array.from({ length: seed }, (_, i) => ({
                id: `${j.id}_p${i + 1}`,
                name: `Creator ${i + 1}`,
                views: Math.floor(Math.random() * 2000),
              }));
            }
          };

          if (expired) {
            // First time moving to COMPLETED: finalize once
            ensureSeed();
            const subs = participants.length;
            const bottomCreators = subs > 0 ? Math.max(1, Math.ceil((DEFAULT_BOTTOM_PERCENTILE / 100) * subs)) : 0;
            const sortedAsc = participants.slice().sort((a, b) => a.views - b.views);
            const bottomList = bottomCreators > 0 ? sortedAsc.slice(0, bottomCreators) : [];
            const bottomEarnings = bottomList.reduce((s, p) => s + (p.views / 1000) * BASE_RATE_PER_1K, 0);
            const pool = (DEFAULT_STRIP_PERCENT / 100) * bottomEarnings;

            // Randomized split within constraints
            let first = 60, second = 25, third = 15;
            const randFirst = 50 + Math.floor(Math.random() * 21); // 50-70
            const remaining = 100 - randFirst;
            const thirdMax = Math.min(30, Math.floor(remaining / 2) - 1);
            const thirdMin = 10;
            if (thirdMax >= thirdMin) {
              const randThird = thirdMin + Math.floor(Math.random() * (thirdMax - thirdMin + 1));
              const randSecond = remaining - randThird;
              first = randFirst; second = randSecond; third = randThird;
            }

            const sortedDesc = participants.slice().sort((a, b) => b.views - a.views);
            const top = sortedDesc.slice(0, 3);
            let split = { first, second, third };
            if (top.length === 2) split = { first: 60, second: 40, third: 0 };
            else if (top.length === 1) split = { first: 100, second: 0, third: 0 };

            const winners = top.map((p, idx) => ({
              id: p.id,
              name: p.name,
              views: p.views,
              rank: idx + 1,
              amount: (pool * (idx === 0 ? split.first : idx === 1 ? split.second : split.third)) / 100,
            }));

            return {
              ...j,
              participants,
              status: 'COMPLETED' as const,
              lastUpdated: new Date().toISOString(),
              jackpotPool: Number(pool.toFixed(2)),
              prizeSplit: split,
              winners,
              views: participants.reduce((s, p) => s + p.views, 0),
              submissions: participants.length,
            };
          }

          // Initialize participants if missing (active only)
          ensureSeed();

          // Occasionally add a new participant (up to 50)
          if (participants.length < 50 && Math.random() < 0.25) {
            const idx = participants.length + 1;
            participants = participants.concat({
              id: `${j.id}_p${idx}`,
              name: `Creator ${idx}`,
              views: Math.floor(Math.random() * 500),
            });
          }

          // Distribute some new views among random participants
          const bumps = Math.floor(Math.random() * 5) + 1; // 1-5 bumps
          for (let k = 0; k < bumps; k++) {
            const pick = Math.floor(Math.random() * participants.length);
            const add = Math.floor(Math.random() * 300); // up to 300 views per tick
            participants[pick] = { ...participants[pick], views: participants[pick].views + add };
          }

          const totalViews = participants.reduce((s, p) => s + p.views, 0);
          const subs = participants.length;

          const next: StoredJackpot = {
            ...j,
            participants,
            status: 'ACTIVE' as const,
            views: totalViews,
            submissions: subs,
            lastUpdated: new Date().toISOString(),
          };
          return next;
        });
        localStorage.setItem('jackpots', JSON.stringify(updated));
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const active = useMemo(() => jackpots.filter(isActive), [jackpots]);
  const completed = useMemo(() => jackpots.filter(j => !isActive(j)), [jackpots]);

  return { active, completed };
}

// Demo-economics for budget usage and stripping preview
const BASE_RATE_PER_1K = 2.5; // fallback $ per 1k views
const getRate = (j: StoredJackpot) => (typeof (j as any).rewardRatePer1k === 'number' ? (j as any).rewardRatePer1k : BASE_RATE_PER_1K);
const DEFAULT_BOTTOM_PERCENTILE = 25; // bottom % of creators
const DEFAULT_STRIP_PERCENT = 50; // % stripped from bottom percentile

function formatTimeLeft(endIso: string) {
  const end = new Date(endIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function Page() {
  const router = useRouter();
  const sdk = typeof window !== 'undefined' ? (useIframeSdk() as any) : null;
  // If embedded in Whop and user is a creator (not staff), start them on Create Jackpot only on first visit
  useEffect(() => {
    try {
      const isStaff = sdk?.context?.is_staff as boolean | undefined;
      if (sdk && !isStaff) {
        const k = 'creator_first_visit_done';
        const done = localStorage.getItem(k);
        if (!done) {
          localStorage.setItem(k, '1');
          router.replace('/create');
        }
      }
    } catch {}
  }, [sdk, router]);
  const { active, completed } = useJackpotsWithLiveMetrics();
  const [tab, setTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
	return (
        <div className="min-h-screen bg-app py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
				{/* Hero Section */}
                <div className="text-center mb-16">
					<div className="card p-8">
						<div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10 border border-subtle">
                        <TrophyIcon className="w-12 h-12 text-primary" />
							</div>
						</div>
                    <h1 className="text-3xl font-bold text-app mb-3">
							Content Jackpot
					</h1>
                    <p className="text-muted mb-6 max-w-lg mx-auto">
							Add competition to your Content Rewards campaigns
						</p>
						<Link href="/create" className="btn btn-primary px-6 py-3 text-sm font-medium">
							<PlusIcon className="w-4 h-4 mr-2" />
							Create Jackpot
						</Link>
					</div>
				</div>

				{/* Tabs */}
                <div className="card p-4 mb-6">
					<div className="flex items-center gap-2">
                    <button onClick={() => setTab('ACTIVE')} className={`px-3 py-1.5 rounded-md text-sm ${tab === 'ACTIVE' ? 'bg-primary text-white' : 'text-muted hover:text-app hover:bg-card'}`}>Active ({active.length})</button>
                    <button onClick={() => setTab('COMPLETED')} className={`px-3 py-1.5 rounded-md text-sm ${tab === 'COMPLETED' ? 'bg-primary text-white' : 'text-muted hover:text-app hover:bg-card'}`}>Completed ({completed.length})</button>
						<div className="ml-auto">
							<Link href="/create" className="btn btn-primary px-3 py-1.5 text-sm inline-flex items-center"><PlusIcon className="w-4 h-4 mr-1"/>Create</Link>
						</div>
					</div>
				</div>

				{/* Lists */}
				<div className="space-y-3">
					{(tab === 'ACTIVE' ? active : completed).length === 0 ? (
						<div className="card p-6 text-center text-gray-400">No {tab.toLowerCase()} jackpots yet.</div>
					) : (
                    (tab === 'ACTIVE' ? active : completed).map(j => {
                        const isJActive = isActive(j);
                        const views = j.views || 0;
                        const subs = j.submissions || 0;
                        const usedBudgetRaw = (views / 1000) * getRate(j);
                        const usedBudget = Math.min(usedBudgetRaw, j.jackpotBudget);
                        const usedPct = Math.max(0, Math.min(100, (usedBudget / j.jackpotBudget) * 100));

                        // Mini leaderboard (top 5 by participant views)
                        const participants = (j.participants ?? []).slice();
                        const sortedDesc = participants.sort((a, b) => b.views - a.views);
                        const top5 = sortedDesc.slice(0, 5);
                        const topMax = top5.length > 0 ? top5[0].views : 1;

                        // Dynamic danger zone only for ACTIVE jackpots
                        let bottomPct = DEFAULT_BOTTOM_PERCENTILE;
                        let stripPct = DEFAULT_STRIP_PERCENT;
                        let displayJackpotPool = j.jackpotPool ?? 0;
                        if (isJActive) {
                          const phases = (j as any).dangerZonePhases as undefined | { usagePercent: number; stripPercentile: number; stripPercentage: number }[];
                          if (phases && phases.length > 0) {
                            // compute used budget percent
                            const usedBudgetRaw = (views / 1000) * getRate(j);
                            const usedBudget = Math.min(usedBudgetRaw, j.jackpotBudget);
                            const usedPctBudget = j.jackpotBudget > 0 ? (usedBudget / j.jackpotBudget) * 100 : 0;
                            // find last phase whose threshold is met
                            const eligible = phases
                              .filter(p => usedPctBudget >= p.usagePercent)
                              .sort((a, b) => a.usagePercent - b.usagePercent);
                            const activePhase = eligible.length > 0 ? eligible[eligible.length - 1] : undefined;
                            if (activePhase) {
                              bottomPct = activePhase.stripPercentile;
                              stripPct = activePhase.stripPercentage;
                            }
                          }
                          const bottomCreatorsActive = subs > 0 ? Math.max(1, Math.ceil((bottomPct / 100) * subs)) : 0;
                          const sortedAsc = participants.slice().sort((a, b) => a.views - b.views);
                          const bottomList = bottomCreatorsActive > 0 ? sortedAsc.slice(0, bottomCreatorsActive) : [];
                          const bottomEarnings = bottomList.reduce((s, p) => s + (p.views / 1000) * getRate(j), 0);
                          displayJackpotPool = (stripPct / 100) * bottomEarnings;
                        }

                        return (
                            <div key={j.id} className="card p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="text-white font-medium text-sm md:text-base">{j.campaignName}</div>
                                        <div className="text-[11px] md:text-xs text-gray-500">{new Date(j.startDate).toLocaleString()} → {new Date(j.endDate).toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        {isJActive ? (
                                          <div className="text-right">
                                            <div className="text-[11px] text-gray-400">Time Left</div>
                                            <div className="text-white font-semibold text-sm">{formatTimeLeft(j.endDate)}</div>
                                          </div>
                                        ) : (
                                          <div className="text-right">
                                            <div className="text-[11px] text-gray-400">Budget</div>
                                            <div className="text-white font-semibold text-sm">{formatCurrency(j.jackpotBudget, j.currency)}</div>
                                          </div>
                                        )}
                                    </div>
                                </div>

                                {/* Budget usage bar */}
                                <div className="w-full bg-card border border-subtle rounded-md h-3 overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${usedPct}%` }} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  <div className="bg-card border border-subtle rounded-md p-3">
                                    <div className="text-[11px] text-muted">Budget Used</div>
                                    <div className="text-app font-bold text-sm">{formatCurrency(Number(usedBudget.toFixed(2)), j.currency)} <span className="text-muted font-medium">({usedPct.toFixed(0)}%)</span></div>
                                  </div>
                                  <div className="bg-card border border-subtle rounded-md p-3">
                                    <div className="text-[11px] text-muted">Jackpot Pool</div>
                                    <div className="text-app font-bold text-sm">{j.currency === 'EUR' ? '€' : j.currency === 'GBP' ? '£' : '$'}{displayJackpotPool.toFixed(2)}</div>
                                  </div>
                                </div>

                                {/* Compact stats row */}
                                <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                                    <div className="bg-card border border-subtle rounded-md p-2">
                                        <div className="text-muted">Views</div>
                                        <div className="text-app font-semibold text-sm">{views.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-card border border-subtle rounded-md p-2">
                                        <div className="text-muted">Submissions</div>
                                        <div className="text-app font-semibold text-sm">{subs}</div>
                                    </div>
                                    <div className="bg-card border border-subtle rounded-md p-2">
                                        <div className="text-muted">Status</div>
                                        <div className="text-app font-semibold text-sm">{isActive(j) ? 'Active' : 'Completed'}</div>
                                    </div>
                                </div>

                                {/* Bottom percentile + stripping (active only) */}
                                {isJActive ? (
                                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                                    <span className="px-2 py-1 rounded bg-card border border-subtle text-muted">
                                      Bottom {bottomPct}% {subs ? `(~${Math.max(1, Math.ceil((bottomPct / 100) * subs))} creators)` : ''}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-card border border-subtle text-muted">
                                      Strip {stripPct}%
                                    </span>
                                    <span className="px-2 py-1 rounded bg-primary/10 border border-subtle text-primary font-semibold">
                                      Jackpot Pool: {j.currency === 'EUR' ? '€' : j.currency === 'GBP' ? '£' : '$'}{displayJackpotPool.toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                                    <span className="px-2 py-1 rounded bg-primary/10 border border-subtle text-primary font-semibold">
                                      Jackpot Pool (Final): {j.currency === 'EUR' ? '€' : j.currency === 'GBP' ? '£' : '$'}{displayJackpotPool.toFixed(2)}
                                    </span>
                                  </div>
                                )}

                                {/* Mini Leaderboard as bar chart */}
                                {top5.length > 0 && (
                                  <div className="mt-4">
                                      <div className="text-xs text-app mb-2 font-semibold">Top 5 by Views</div>
                                    <div className="space-y-2">
                                      {top5.map((p, idx) => {
                                        const width = topMax > 0 ? Math.max(4, Math.round((p.views / topMax) * 100)) : 0;
                                        return (
                                          <div key={p.id} className="">
                                            <div className="flex justify-between text-[11px] text-muted mb-1">
                                              <span className="truncate mr-2">#{idx + 1} {p.name}</span>
                                              <span className="text-muted">{p.views.toLocaleString()}</span>
                                            </div>
                                            <div className="h-3 bg-card border border-subtle rounded overflow-hidden">
                                              <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--orange-focus)]" style={{ width: `${width}%` }} />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Reveal winners and exact split only for completed */}
                                {!isJActive && j.winners && j.prizeSplit && (
                                  <div className="mt-4">
                                    <div className="text-xs text-gray-200 mb-2 font-semibold">Winners</div>
                                    <div className="space-y-2">
                                      {j.winners.map(w => (
                                        <div key={w.id} className="flex items-center justify-between text-xs bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-2">
                                          <div className="text-gray-200">#{w.rank} {w.name}</div>
                                          <div className="text-gray-400">{w.views.toLocaleString()} views</div>
                                          <div className="text-white font-semibold">
                                            {(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-2 text-[11px] text-gray-400">Split: 1st {j.prizeSplit.first}% • 2nd {j.prizeSplit.second}% • 3rd {j.prizeSplit.third}% {j.status === 'PAID' ? ' (paid 🔒)' : j.status === 'SETTLED' ? ' (payout queued)' : ''}</div>
                                  </div>
                                )}
                            </div>
                        );
                    })
					)}
				</div>

				{/* How It Works */}
				<div className="card p-6 mb-8">
					<h2 className="text-xl font-semibold text-white text-center mb-6">
						How It Works
					</h2>
					<div className="grid md:grid-cols-3 gap-4">
						<div className="text-center">
							<div className="w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center text-white text-sm font-medium mx-auto mb-3">
								1
							</div>
							<h3 className="text-white font-medium mb-1 text-sm">Connect Campaign</h3>
							<p className="text-gray-500 text-xs">Link Content Rewards URL</p>
					</div>
						<div className="text-center">
							<div className="w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center text-white text-sm font-medium mx-auto mb-3">
								2
							</div>
							<h3 className="text-white font-medium mb-1 text-sm">Set Prize Pool</h3>
							<p className="text-gray-500 text-xs">Define jackpot budget</p>
					</div>
						<div className="text-center">
							<div className="w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center text-white text-sm font-medium mx-auto mb-3">
								3
							</div>
							<h3 className="text-white font-medium mb-1 text-sm">Creators Compete</h3>
							<p className="text-gray-500 text-xs">Winners earn more</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}