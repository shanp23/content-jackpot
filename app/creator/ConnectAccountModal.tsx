"use client";

import { useEffect, useMemo, useState } from "react";

type Platform = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE';

type LinkedAccount = { platform: Platform; profileUrl: string; code: string; expiresAt: number };

function getUserId() {
  if (typeof window === 'undefined') return 'local-demo-user';
  const k = 'demoUserId';
  let v = localStorage.getItem(k);
  if (!v) {
    v = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(k, v);
  }
  return v;
}

export default function ConnectAccountModal({ open, onClose, onLinked }: { open: boolean; onClose: () => void; onLinked: (acc: LinkedAccount) => void }) {
  const [platform, setPlatform] = useState<Platform>('INSTAGRAM');
  const [profileUrl, setProfileUrl] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [step, setStep] = useState<'ISSUE' | 'SHOW'>('ISSUE');
  const [linked, setLinked] = useState<LinkedAccount[]>([]);

  useEffect(() => {
    if (!open) {
      setProfileUrl(''); setCode(null); setStep('ISSUE');
      return;
    }
    try {
      const raw = localStorage.getItem('linkedAccounts');
      setLinked(raw ? JSON.parse(raw) : []);
    } catch {
      setLinked([]);
    }
  }, [open]);

  const countForPlatform = linked.filter(a => a.platform === platform).length;
  const disabled = !profileUrl || countForPlatform >= 3;

  async function issue() {
    // Enforce max 3 per platform and prevent duplicates
    const dup = linked.some(a => a.platform === platform && a.profileUrl.trim().toLowerCase() === profileUrl.trim().toLowerCase());
    if (dup) {
      alert('This profile is already linked.');
      return;
    }
    if (countForPlatform >= 3) {
      alert('You have reached the limit of 3 accounts for this platform.');
      return;
    }

    const res = await fetch('/api/verify/issue', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId(), platform, profileUrl })
    });
    const data = await res.json();
    if (data.success) {
      setCode(data.code);
      setExpiresAt(data.expiresAt);
      // Persist this code under linked account so user can retrieve later
      try {
        const raw = localStorage.getItem('linkedAccounts');
        const arr: LinkedAccount[] = raw ? JSON.parse(raw) : [];
        arr.push({ platform, profileUrl, code: data.code, expiresAt: data.expiresAt });
        localStorage.setItem('linkedAccounts', JSON.stringify(arr));
      } catch {}
      // refresh cached list
      try {
        const raw2 = localStorage.getItem('linkedAccounts');
        setLinked(raw2 ? JSON.parse(raw2) : []);
      } catch {}
      setStep('SHOW');
    } else {
      alert(data.error || 'Failed to issue code');
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-semibold">Connect Social Account</div>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>✕</button>
        </div>

        <div className="mb-3">
          <label className="text-[11px] text-gray-400">Platform</label>
          <select className="dropdown w-full" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            <option value="INSTAGRAM">Instagram</option>
            <option value="TIKTOK">TikTok</option>
            <option value="YOUTUBE">YouTube</option>
          </select>
          <div className="text-[11px] text-gray-500 mt-1">Linked on {platform.toLowerCase()}: {countForPlatform}/3</div>
        </div>

        <div>
          <label className="text-[11px] text-gray-400">Profile URL</label>
          <input className="input w-full" placeholder="https://instagram.com/yourname" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} />
          <div className="text-[11px] text-gray-500 mt-1">Paste the link to your profile on the selected platform. Max 3 accounts per platform.</div>
        </div>

        {step === 'ISSUE' && (
          <div className="mt-4 flex justify-end">
            <button className="continue-button" disabled={disabled} onClick={issue}>Get Verification Code</button>
          </div>
        )}

        {step === 'SHOW' && (
          <div className="mt-4 space-y-3">
            <div className="text-sm text-gray-200">Paste this 7-letter code in your profile bio for authenticity and ownership verification:</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-mono text-white bg-[#0f0f0f] border border-[#2a2a2a] rounded px-3 py-2">{code}</div>
              <button
                className="btn btn-primary px-3 py-2 text-xs"
                onClick={() => { if (code) navigator.clipboard.writeText(code); }}
              >Copy</button>
            </div>
            <div className="text-[12px] text-gray-400">Code expires {expiresAt ? new Date(expiresAt).toLocaleString() : ''}. You can return to this modal to view it again.</div>
            <div className="text-[12px] text-gray-500">After adding the code to your bio, you can start exploring jackpots and submit content.</div>
            <div className="flex justify-end">
              <button className="continue-button" onClick={() => { onLinked({ platform, profileUrl, code: code || '', expiresAt: expiresAt || Date.now() }); onClose(); }}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


