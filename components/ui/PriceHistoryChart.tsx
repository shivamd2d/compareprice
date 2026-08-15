"use client";

import { useState } from "react";
import type { PricePoint } from "@/lib/catalog";
import { formatInr, getPriceStats } from "@/lib/pricing";

type Props = {
  points: PricePoint[];
};

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "All", days: 99999 },
];

export function PriceHistoryChart({ points }: Props) {
  const [range, setRange] = useState(30);

  if (points.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 text-center">
        <div>
          <p className="text-sm font-medium text-slate-500">No price history yet</p>
          <p className="mt-1 text-xs text-slate-400">We're still collecting pricing data for this product.</p>
        </div>
      </div>
    );
  }

  const now = Date.now();
  const filtered = points.filter((p) => now - new Date(p.recordedAt).getTime() < range * 24 * 3600 * 1000);
  const displayPoints = filtered.length > 1 ? filtered : points;

  const prices = displayPoints.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = Math.max(max - min, max * 0.01, 1);
  const pad = span * 0.1;

  const stats = getPriceStats(points);
  const current = prices[prices.length - 1];

  const w = 400;
  const h = 120;

  const toX = (i: number) => (i / Math.max(displayPoints.length - 1, 1)) * w;
  const toY = (price: number) => h - ((price - (min - pad)) / (span + 2 * pad)) * h;

  const pathD = displayPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(p.price).toFixed(1)}`)
    .join(" ");

  // Area fill
  const areaD =
    pathD +
    ` L ${toX(displayPoints.length - 1).toFixed(1)} ${h} L 0 ${h} Z`;

  // Average line
  const avgY = stats ? toY(stats.avg30) : null;

  return (
    <div>
      {/* Range selector */}
      <div className="mb-3 flex gap-1" role="group" aria-label="Price history range">
        {RANGES.map(({ label, days }) => (
          <button
            key={days}
            onClick={() => setRange(days)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              range === days
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            aria-pressed={range === days}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-40 w-full rounded-lg overflow-hidden"
        role="img"
        aria-label={`Price trend chart over ${range} days`}
      >
        {/* Background */}
        <rect width={w} height={h} fill="#f8fafc" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={0} y1={h * frac} x2={w} y2={h * frac}
            stroke="#e2e8f0" strokeWidth={1}
          />
        ))}

        {/* Area */}
        <path d={areaD} fill="rgba(99,102,241,0.08)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Average line */}
        {avgY !== null && (
          <line x1={0} y1={avgY} x2={w} y2={avgY} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
        )}

        {/* Current price dot */}
        <circle
          cx={toX(displayPoints.length - 1)}
          cy={toY(current)}
          r={4}
          fill="#4f46e5"
          stroke="white"
          strokeWidth={2}
        />
      </svg>

      {/* Stats */}
      {stats && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Current", value: stats.current, highlight: true },
            { label: "30d Avg", value: Math.round(stats.avg30) },
            { label: "All-time Low", value: stats.low },
            { label: "All-time High", value: stats.high },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`rounded-lg p-2.5 text-center ${highlight ? "bg-indigo-50" : "bg-slate-50"}`}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`mt-0.5 text-sm font-bold ${highlight ? "text-indigo-700" : "text-slate-700"}`}>
                {formatInr(value)}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-slate-400">
        Yellow dashed line = 30-day average. Development seed data shown.
      </p>
    </div>
  );
}
