"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useIframeSdk } from "@whop/react";
import Leaderboard, { type Participant } from "./Leaderboard";
import ConnectAccountModal from "./ConnectAccountModal";
import LinkedAccountsModal from "./LinkedAccountsModal";
import EarningsMeter from "../components/EarningsMeter";

type CreatorJackpot = {
  id: string;
  campaignName: string;
  jackpotBudget: number;
  currency: 'USD' | 'EUR' | 'GBP';
  startDate: string;
  endDate: string;
  contentRequirements: string;
  perPiecePayout?: number;
  payoutMode?: 'INSTANT' | 'BATCH';
  participants?: Participant[];
  submissions?: Array<{
    id: string;
    creatorName: string;
    platform: string;
    handle: string;
    url: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewerNote?: string;
    approvedAt?: string;
    payoutAmount?: number;
    paidAt?: string;
  }>;
};

function formatCurrency(value: number, currency: CreatorJackpot['currency']) {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return symbol + value.toLocaleString();
}

const BASE_RATE_PER_1K = 2.5;

function computeDangerAndPool(j: CreatorJackpot) {
  const participants = (j.participants || []) as Participant[];
  const totalViews = participants.reduce((s, p) => s + (p.views || 0), 0);
  const usedBudgetRaw = (totalViews / 1000) * BASE_RATE_PER_1K;
  const usedBudget = Math.min(usedBudgetRaw, j.jackpotBudget);
  const usedPctBudget = j.jackpotBudget > 0 ? (usedBudget / j.jackpotBudget) * 100 : 0;
  let bottomPct = 25;
  let stripPct = 50;
  const anyJ: any = j as any;
  const phases = anyJ.dangerZonePhases as undefined | { usagePercent: number; stripPercentile: number; stripPercentage: number }[];
  if (phases && phases.length > 0) {
    const eligible = phases.filter(p => usedPctBudget >= p.usagePercent).sort((a, b) => a.usagePercent - b.usagePercent);
    const activePhase = eligible.length > 0 ? eligible[eligible.length - 1] : undefined;
    if (activePhase) {
      bottomPct = activePhase.stripPercentile;
      stripPct = activePhase.stripPercentage;
    }
  }
  const subs = participants.length;
  const bottomCreatorsActive = subs > 0 ? Math.max(1, Math.ceil((bottomPct / 100) * subs)) : 0;
  const sortedAsc = participants.slice().sort((a, b) => (a.views || 0) - (b.views || 0));
  const bottomList = bottomCreatorsActive > 0 ? sortedAsc.slice(0, bottomCreatorsActive) : [];
  const bottomEarnings = bottomList.reduce((s, p) => s + ((p.views || 0) / 1000) * BASE_RATE_PER_1K, 0);
  const pool = (stripPct / 100) * bottomEarnings;
  return { bottomPct, stripPct, pool };
}

function getCommentsSummary(campaignId: string) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(`comments_${campaignId}`) : null;
    const arr: any[] = raw ? JSON.parse(raw) : [];
    const count = arr.length;
    const avg = count > 0 ? arr.reduce((s, c) => s + (Number(c.rating) || 0), 0) / count : 0;
    return { count, avg };
  } catch {
    return { count: 0, avg: 0 };
  }
}

function useLocalJackpots(): [CreatorJackpot[], () => void] {
  const [data, setData] = useState<CreatorJackpot[]>([]);
  const refresh = () => {
    try {
      const raw = localStorage.getItem('jackpots');
      setData(raw ? JSON.parse(raw) : []);
    } catch { setData([] as any); }
  };
  useEffect(() => { refresh(); }, []);
  return [data as any, refresh];
}

function getUserId() {
  if (typeof window === 'undefined') return 'local-demo-user';
  const k = 'demoUserId';
  let v = localStorage.getItem(k);
  if (!v) { v = 'user_' + Math.random().toString(36).slice(2, 10); localStorage.setItem(k, v); }
  return v;
}

export default function CreatorPage() {
  const router = useRouter();
  // Whop gating: if running inside Whop and viewer is staff/merchant, hide creator UI
  const sdk = typeof window !== 'undefined' ? (useIframeSdk() as any) : null;
  const inWhop = !!sdk;
  const isStaff = (sdk?.context?.is_staff as boolean | undefined);
  if (inWhop && isStaff) return null;
  const [jackpots, refreshJackpots] = useLocalJackpots();
  const active = useMemo(
    () => jackpots.filter(j => new Date(j.endDate) > new Date()),
    [jackpots]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => active.find(j => j.id === selectedId) || active[0], [active, selectedId]);
  const userId = useMemo(() => getUserId(), []);
  const joined = useMemo(() => {
    if (!selected) return false;
    const pid = `${selected.id}_u_${userId}`;
    const list = (selected.participants || []) as Participant[];
    return list.some(p => p.id === pid);
  }, [selected, userId]);
  const joinedCampaigns = useMemo(() => {
    return jackpots.filter(j => (j.participants || []).some(p => p.id === `${j.id}_u_${userId}`));
  }, [jackpots, userId]);

  // Submission local state
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [handle, setHandle] = useState("");
  const [handleVerified, setHandleVerified] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");

  // Verification state
  const [linkedAccounts, setLinkedAccounts] = useState<{ platform: string; profileUrl: string; code?: string; expiresAt?: number }[]>([]);
  const [connectOpen, setConnectOpen] = useState(false);
  const [linkedOpen, setLinkedOpen] = useState(false);
  useEffect(() => {
    try {
      // Use the same key as ConnectAccountModal
      const raw = localStorage.getItem('linkedAccounts');
      if (raw) setLinkedAccounts(JSON.parse(raw));
    } catch {}
  }, []);
  const isVerified = linkedAccounts.length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    // Save locally: append participant with 0 views initially
    try {
      const raw = localStorage.getItem('jackpots');
      const arr: any[] = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex(j => j.id === selected.id);
      if (idx >= 0) {
        // Append participant for leaderboard
        if (!joined) {
          const plist: Participant[] = arr[idx].participants || [];
          const participantId = `${selected.id}_u_${userId}`;
          if (!plist.some((p: any) => p.id === participantId)) {
            plist.push({ id: participantId, name: userName || 'You', views: 0 });
            arr[idx].participants = plist;
          }
        }

        // Create a reviewable submission
        const subs = (arr[idx].submissions || []) as CreatorJackpot['submissions'];
        // payout is derived from views later; keep nominal 0 here for placeholder
        const payout = 0;
        subs.push({
          id: `sub_${Date.now()}`,
          creatorName: userName || 'You',
          platform,
          handle,
          url: submissionUrl,
          status: 'PENDING',
          payoutAmount: payout,
        });
        arr[idx].submissions = subs;
        localStorage.setItem('jackpots', JSON.stringify(arr));
        alert('Submitted! Your entry has been recorded.');
        setSubmissionUrl("");
        setUserName("");
        refreshJackpots();
      }
    } catch {
      alert('Failed to save submission locally.');
    }
  };

  function joinCampaign(targetId?: string) {
    const target = targetId ? active.find(j => j.id === targetId) : selected;
    if (!target) return;
    try {
      const raw = localStorage.getItem('jackpots');
      const arr: any[] = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex(j => j.id === target.id);
      if (idx >= 0) {
        const plist: Participant[] = arr[idx].participants || [];
        const participantId = `${arr[idx].id}_u_${userId}`;
        if (!plist.some((p: any) => p.id === participantId)) {
          plist.push({ id: participantId, name: userName || 'You', views: 0 });
          arr[idx].participants = plist;
          localStorage.setItem('jackpots', JSON.stringify(arr));
          refreshJackpots();
        }
        // Navigate to campaign detail for more information
        router.push(`/jackpots/${arr[idx].id}`);
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-app p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Left: leaderboard + joined campaigns */}
        <div className="md:col-span-1 space-y-4">
          {selected && (
            <div className="card p-4">
              <div className="text-sm text-gray-200 font-semibold mb-2">Leaderboard</div>
              <Leaderboard participants={selected.participants || []} maxRows={8} />
            </div>
          )}

          <div className="card p-4">
            <div className="text-sm text-gray-200 font-semibold mb-2">Joined Campaigns</div>
            {joinedCampaigns.length === 0 ? (
              <div className="text-gray-400 text-sm">You haven't joined any campaigns yet.</div>
            ) : (
              <div className="space-y-2">
                {joinedCampaigns.map(j => (
                  <button key={j.id} onClick={() => setSelectedId(j.id)}
                          className={`w-full text-left p-2 rounded border ${selected?.id === j.id ? 'border-[#dc2626] bg-[#1a1a1a]' : 'border-[#2a2a2a] hover:bg-[#151515]'} text-gray-200`}>
                    <div className="font-medium truncate">{j.campaignName}</div>
                    <div className="text-[11px] text-gray-400">Ends {new Date(j.endDate).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: submit content at top, then active campaigns (big), then earnings */}
        <div className="md:col-span-2 space-y-4">
          {/* Submit content */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-200 font-semibold">Submit Your Content</div>
              <div className="flex items-center gap-2">
                {isVerified && (
                  <button type="button" className="text-[11px] text-primary underline" onClick={() => setLinkedOpen(true)}>Linked: {linkedAccounts.length}</button>
                )}
                <button className="btn btn-primary px-3 py-1.5 text-xs" onClick={() => setConnectOpen(true)}>
                  {isVerified ? 'Add account' : 'Connect Account'}
                </button>
              </div>
            </div>
            {!isVerified ? (
              <div className="text-gray-400 text-sm">First connect a profile and place your 7‑letter code in your bio. You can retrieve the code anytime from the Connect modal.</div>
            ) : !selected ? (
              <div className="text-gray-400 text-sm">Pick a campaign on the left.</div>
            ) : !joined ? (
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">Join the selected campaign to participate.</div>
                <button className="btn btn-primary px-3 py-1.5 text-xs" onClick={joinCampaign}>Join Campaign</button>
              </div>
            ) : (
               <form onSubmit={onSubmit} className="grid md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[11px] text-gray-400">Content URL</label>
                  <input className="input w-full" placeholder="https://..." value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} required />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400">Platform</label>
                  <select className="dropdown w-full" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                  </select>
                </div>
                 <div>
                   <label className="text-[11px] text-gray-400">Account Handle</label>
                   <input className="input w-full" placeholder="@yourhandle" value={handle} onChange={(e) => setHandle(e.target.value)} />
                   {handleVerified === false && (
                     <div className="text-[11px] text-red-400 mt-1">Not Verified</div>
                   )}
                   {handleVerified === true && (
                     <div className="text-[11px] text-green-400 mt-1">Verified</div>
                   )}
                 </div>
                <div>
                  <label className="text-[11px] text-gray-400">Display Name</label>
                  <input className="input w-full" placeholder="Your name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="md:col-span-4 flex justify-end">
                   <button className="continue-button" onClick={async (e) => {
                     // quick handle verification: check against linked profiles
                     const raw = localStorage.getItem('linkedAccounts');
                     const arr: { platform: string; profileUrl: string; code?: string }[] = raw ? JSON.parse(raw) : [];
                     const norm = handle.replace(/^@/, '').toLowerCase();
                     const match = arr.some(a => a.platform.toLowerCase() === platform && a.profileUrl.toLowerCase().includes(norm));
                     if (!match) {
                       e.preventDefault();
                       setHandleVerified(false);
                       return;
                     }
                     setHandleVerified(true);
                   }}>Submit</button>
                </div>
              </form>
            )}
          </div>

          {/* Active Campaigns (big) */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-200 font-semibold">Active Campaigns</div>
            </div>
            {active.length === 0 ? (
              <div className="text-gray-400 text-sm">No active campaigns.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {active.map(j => {
                  const alreadyJoined = (j.participants || []).some(p => p.id === `${j.id}_u_${userId}`);
                  const { bottomPct, stripPct, pool } = computeDangerAndPool(j);
                  const { count: reviewCount, avg: reviewAvg } = getCommentsSummary(j.id);
                  return (
                    <div key={j.id} className={`bg-[#0a0a0a] border ${selected?.id === j.id ? 'border-[#dc2626]' : 'border-[#2a2a2a]'} rounded-md p-3`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-white font-medium truncate">{j.campaignName}</div>
                          <div className="text-[11px] text-gray-400">Ends {new Date(j.endDate).toLocaleString()}</div>
                          <div className="text-[11px] text-gray-400 mt-1">Budget {formatCurrency(j.jackpotBudget, j.currency)}</div>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300">Jackpot {formatCurrency(Number(pool.toFixed(2)), j.currency)}</span>
                            <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300">Bottom {bottomPct}%</span>
                            <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300">Strip {stripPct}%</span>
                            <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300">Reviews {reviewAvg.toFixed(1)}★ ({reviewCount})</span>
                          </div>
                        </div>
                        <button
                          className={`text-[11px] px-2 py-1 rounded border ${alreadyJoined ? 'border-[#2a2a2a] text-gray-400' : 'border-[#dc2626] text-white bg-[#dc2626]'}`}
                          onClick={() => { setSelectedId(j.id); if (!alreadyJoined) joinCampaign(j.id); else router.push(`/jackpots/${j.id}`); }}
                        >
                          {alreadyJoined ? 'Joined' : 'Participate'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selected && (
            <div className="card p-4">
              <EarningsMeter />
            </div>
          )}
        </div>
      </div>

      <ConnectAccountModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onLinked={(acc) => {
          setLinkedAccounts(prev => [...prev, acc]);
          setConnectOpen(false);
        }}
      />
      <LinkedAccountsModal open={linkedOpen} onClose={() => setLinkedOpen(false)} accounts={linkedAccounts} />
    </div>
  );
}


