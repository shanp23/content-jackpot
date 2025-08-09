"use client";

import React from "react";

type Linked = { platform: string; profileUrl: string; code?: string; expiresAt?: number };

export default function LinkedAccountsModal({ open, onClose, accounts }: { open: boolean; onClose: () => void; accounts: Linked[] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-app font-semibold">Linked Accounts</div>
          <button className="text-muted hover:text-app" onClick={onClose}>✕</button>
        </div>
        {accounts.length === 0 ? (
          <div className="text-muted text-sm">No accounts linked yet.</div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {accounts.map((a, i) => (
              <div key={`${a.platform}_${i}`} className="bg-card border border-subtle rounded p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-app font-semibold">{prettyPlatform(a.platform)}</div>
                  {a.expiresAt ? (
                    <div className="text-[11px] text-muted">Expires {new Date(a.expiresAt).toLocaleString()}</div>
                  ) : null}
                </div>
                <div className="text-muted truncate mt-1">{a.profileUrl}</div>
                {a.code && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-app font-mono text-sm bg-card border border-subtle rounded px-2 py-1">{a.code}</div>
                    <button className="btn btn-secondary px-2 py-1 text-xs" onClick={() => navigator.clipboard.writeText(a.code || '')}>Copy</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function prettyPlatform(p: string) {
  const s = p.toLowerCase();
  if (s.includes('instagram')) return 'Instagram';
  if (s.includes('tiktok')) return 'TikTok';
  if (s.includes('youtube')) return 'YouTube';
  return p;
}


