export type Split = [number, number, number];

// Generate a split [p1,p2,p3] with constraints:
// p1 ≥ 0.50, p3 ≥ 0.10, p2 > p3, p1+p2+p3 = 1.00
// Returns values rounded to 2 decimals that sum to 1.00
export function randomSplit(maxRetries = 1000): Split {
  for (let i = 0; i < maxRetries; i++) {
    // p1 between 0.50 and 0.70
    const p1 = 0.5 + Math.random() * 0.2; // [0.50, 0.70)
    // p3 between 0.10 and min(0.30, 1 - p1 - 0.10)
    const p3Max = Math.min(0.3, 1 - p1 - 0.1);
    if (p3Max <= 0.1) continue;
    const p3 = 0.1 + Math.random() * (p3Max - 0.1);
    let p2 = 1 - p1 - p3;
    if (p2 <= p3) continue; // must be strictly greater

    // Round to 2 decimals, then fix sum by adjusting p3
    const rp1 = Math.round(p1 * 100) / 100;
    const rp2 = Math.round(p2 * 100) / 100;
    let rp3 = Math.round((1 - rp1 - rp2) * 100) / 100;

    // Validate after rounding
    if (rp1 < 0.5) continue;
    if (rp3 < 0.1) continue;
    if (rp2 <= rp3) continue;
    const sum = Math.round((rp1 + rp2 + rp3) * 100) / 100;
    if (sum !== 1) continue;
    return [rp1, rp2, rp3];
  }
  // Fallback deterministic split
  return [0.6, 0.25, 0.15];
}


