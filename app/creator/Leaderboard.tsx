"use client";

import React from "react";

export type Participant = { id: string; name: string; views: number };

type LeaderboardProps = {
  participants: Participant[];
  maxRows?: number;
};

export default function Leaderboard({ participants, maxRows = 10 }: LeaderboardProps) {
  const sorted = [...participants].sort((a, b) => b.views - a.views).slice(0, maxRows);
  const max = sorted.length > 0 ? sorted[0].views : 1;

  return (
    <div className="card p-4">
      <div className="text-sm text-gray-200 font-semibold mb-3">Leaderboard</div>
      {sorted.length === 0 ? (
        <div className="text-gray-400 text-sm">No participants yet.</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((p, idx) => {
            const width = max > 0 ? Math.max(4, Math.round((p.views / max) * 100)) : 0;
            return (
              <div key={p.id}>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span className="truncate mr-2">#{idx + 1} {p.name}</span>
                  <span className="text-gray-400">{p.views.toLocaleString()} views</span>
                </div>
                <div className="h-3 bg-[#111111] border border-[#262626] rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ef4444] to-[#f97316]" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


