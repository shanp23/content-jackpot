"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import React, { useMemo } from "react";

export interface CreatorStats {
  earnedNow: number;
  percentile: number; // 0-100
  stripRate: number;  // e.g. 0.5
  inDanger: boolean;
  jackpot: number;    // current pot $
  isTopThree: boolean;
}

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());

function useCreatorStats(): CreatorStats {
  const { data } = useSWR<CreatorStats>("/api/creator/stats", fetcher, { refreshInterval: 30000 });
  return (
    data || { earnedNow: 0, percentile: 0, stripRate: 0.5, inDanger: false, jackpot: 0, isTopThree: false }
  );
}

function formatUSD(v: number) {
  return `$${v.toFixed(2)}`;
}

export default function EarningsMeter() {
  const stats = useCreatorStats();

  const values = useMemo(() => {
    const dangerTake = stats.earnedNow * (1 - stats.stripRate);
    const jackpotMin = stats.earnedNow + stats.jackpot * 0.10;
    const jackpotMax = stats.earnedNow + stats.jackpot * 0.80;
    const maxScale = Math.ceil((Math.max(stats.earnedNow, jackpotMax) + 10) / 10) * 10; // nearest $10 up
    const clamp = (v: number) => Math.max(0, Math.min(maxScale, v));
    const toPct = (v: number) => (clamp(v) / maxScale) * 100;
    return {
      dangerTake, jackpotMin, jackpotMax, maxScale,
      pDanger: toPct(dangerTake), pNow: toPct(stats.earnedNow), pMax: toPct(jackpotMax)
    };
  }, [stats]);

  const ticks = useMemo(() => {
    const arr: number[] = [];
    for (let t = 0; t <= values.maxScale; t += 10) arr.push(t);
    return arr;
  }, [values.maxScale]);

  return (
    <div className="w-full max-w-md">
      <div className="text-sm text-gray-200 font-semibold mb-2">Earnings Meter</div>
      <div className="relative h-6 bg-[#111111] border border-[#262626] rounded">
        {/* ticks */}
        <div aria-hidden className="absolute inset-0 flex">
          {ticks.map((v) => (
            <div key={v} className="flex-1 border-r border-[#2a2a2a]" />
          ))}
        </div>

        {/* markers */}
        <motion.div
          aria-label={`Danger-zone take ${formatUSD(values.dangerTake)}`}
          className="absolute top-0 -mt-2 text-xs"
          style={{ left: `calc(${values.pDanger}% - 8px)` }}
          animate={{ left: `calc(${values.pDanger}% - 8px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <span className="text-amber-500">🔴</span>
        </motion.div>

        <motion.div
          aria-label={`Current ${formatUSD(stats.earnedNow)}`}
          className="absolute top-0 -mt-2 text-xs"
          style={{ left: `calc(${values.pNow}% - 8px)` }}
          animate={{ left: `calc(${values.pNow}% - 8px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <span className="text-emerald-500">🟢</span>
        </motion.div>

        <motion.div
          aria-label={`Top-3 max ${formatUSD(values.jackpotMax)}`}
          className="absolute top-0 -mt-2 text-xs"
          style={{ left: `calc(${values.pMax}% - 8px)` }}
          animate={{ left: `calc(${values.pMax}% - 8px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <span className={stats.isTopThree ? 'text-emerald-500' : 'text-gray-400'}>🏆</span>
        </motion.div>
      </div>

      <div className="mt-2 grid grid-cols-3 text-[11px] text-gray-300">
        <div className="text-left">Danger-zone take</div>
        <div className="text-center">Current</div>
        <div className="text-right">Top-3 max</div>
      </div>

      <div className="mt-1 grid grid-cols-3 text-xs text-gray-400">
        <div className="text-left">{formatUSD(values.dangerTake)}</div>
        <div className="text-center">{formatUSD(stats.earnedNow)}</div>
        <div className="text-right">{formatUSD(values.jackpotMax)}</div>
      </div>
    </div>
  );
}


