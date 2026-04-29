"use client";

import { Product } from "@/types";
import { Activity, ArrowUpRight, Dot, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface SalesChartPoint {
  label: string;
  revenue: number;
  units: number;
  conversion: number;
}

interface SalesChartProps {
  initialProducts: Product[];
}

const formatCurrency = (value: number) =>
  `$${Math.round(value).toLocaleString()}`;

const buildLiveSeries = (products: Product[], timestamp: number): SalesChartPoint[] => {
  const totalRevenue = products.reduce(
    (total, product) => total + Number(product.price || 0),
    0
  );
  const activeProducts = products.filter((product) => !product.isArchived);
  const featuredProducts = products.filter((product) => product.isFeatured).length;
  const baseRevenue = Math.max(totalRevenue, 2400);
  const baseUnits = Math.max(activeProducts.length * 3, 18);
  const now = new Date(timestamp);
  const minuteSeed = now.getMinutes();
  const secondSeed = now.getSeconds();

  return Array.from({ length: 8 }, (_, index) => {
    const age = 7 - index;
    const pulse = minuteSeed * 11 + secondSeed * 3 + age * 7;
    const marketSwing = ((pulse % 13) - 6) / 10;
    const featuredLift = ((featuredProducts + index * 5 + secondSeed) % 10) / 16;
    const revenue = Math.max(
      Math.round(
        baseRevenue *
          (0.2 + index * 0.065 + featuredLift * 0.22 + marketSwing * 0.045)
      ),
      1200
    );
    const units = Math.max(
      Math.round(baseUnits * (0.72 + index * 0.04 + featuredLift + marketSwing * 0.12)),
      10
    );
    const conversion = Number(
      Math.max(2.2, 3.1 + featuredLift * 2.4 + marketSwing * 0.45).toFixed(1)
    );

    return {
      label: `${age * 5}m`,
      revenue,
      units,
      conversion,
    };
  });
};

const refreshIntervalInMs = 15 * 60 * 1000;

const SalesChart: React.FC<SalesChartProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    let active = true;

    const refreshProducts = async () => {
      try {
        const response = await fetch("/api/demo-store/products?includeArchived=true", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (active) {
            setTimestamp(Date.now());
          }
          return;
        }

        const nextProducts = (await response.json()) as Product[];

        if (active) {
          setProducts(nextProducts);
          setTimestamp(Date.now());
        }
      } catch {
        if (active) {
          setTimestamp(Date.now());
        }
      }
    };

    refreshProducts();

    const interval = window.setInterval(() => {
      void refreshProducts();
    }, refreshIntervalInMs);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const points = useMemo(
    () => buildLiveSeries(products, timestamp),
    [products, timestamp]
  );

  const totalRevenue = points.reduce((sum, point) => sum + point.revenue, 0);
  const totalUnits = points.reduce((sum, point) => sum + point.units, 0);
  const averageConversion =
    points.reduce((sum, point) => sum + point.conversion, 0) / points.length;
  const latestRevenue = points[points.length - 1]?.revenue ?? 0;
  const previousRevenue = points[points.length - 2]?.revenue ?? latestRevenue;
  const revenueDelta =
    previousRevenue === 0
      ? 0
      : ((latestRevenue - previousRevenue) / previousRevenue) * 100;

  const chartHeight = 280;
  const chartWidth = 920;
  const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
  const minRevenue = Math.min(...points.map((point) => point.revenue), maxRevenue);
  const revenueRange = Math.max(maxRevenue - minRevenue, 1);

  const coordinates = points.map((point, index) => {
    const x = (chartWidth / Math.max(points.length - 1, 1)) * index;
    const y =
      chartHeight -
      24 -
      ((point.revenue - minRevenue) / revenueRange) * (chartHeight - 70);

    return { ...point, x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1]?.x ?? 0} ${chartHeight} L ${
    coordinates[0]?.x ?? 0
  } ${chartHeight} Z`;

  const timelineMarkers = coordinates.slice(-3).reverse();

  return (
    <div className="mt-5 overflow-hidden rounded-[24px] border border-[#ede5dd] bg-[radial-gradient(circle_at_top_right,_rgba(92,129,255,0.14),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f3ee_100%)] p-4 shadow-[0_20px_60px_rgba(17,17,17,0.06)] sm:mt-8 sm:rounded-[30px] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px] sm:tracking-[0.22em]">
            <Clock3 className="h-3.5 w-3.5 text-[#ffb17a]" />
            15 min refresh
          </div>
          <h3 className="mt-3 text-xl font-semibold text-[#111111] sm:mt-4 sm:text-[28px]">
            Revenue momentum
          </h3>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            Premium overview combining rolling revenue, unit activity, and
            conversion movement from the latest refresh cycle.
          </p>
        </div>

        <div className="w-full rounded-[18px] border border-black/8 bg-white/90 px-3 py-2.5 shadow-[0_12px_32px_rgba(17,17,17,0.05)] sm:w-auto sm:rounded-[22px] sm:px-4 sm:py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 sm:tracking-[0.22em]">
            Last sync
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[#111111] sm:mt-2">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p className="mt-1 text-xs text-emerald-600">Auto-refreshing every 15 min</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[22px] border border-black/8 bg-[#0f1117] p-4 text-white shadow-[0_18px_50px_rgba(17,17,17,0.16)] sm:rounded-[28px] sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Revenue run-rate
              </p>
              <p className="mt-3 min-w-0 break-words text-[clamp(1.35rem,2vw,2rem)] font-semibold leading-none">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Units moving
              </p>
              <p className="mt-3 min-w-0 text-[clamp(1.35rem,2vw,2rem)] font-semibold leading-none">
                {totalUnits}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Avg conversion
              </p>
              <p className="mt-3 min-w-0 text-[clamp(1.35rem,2vw,2rem)] font-semibold leading-none">
                {averageConversion.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0.02)_100%)] p-3 sm:mt-5 sm:rounded-[24px] sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Revenue curve
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xl font-semibold text-white">
                    {formatCurrency(latestRevenue)}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      revenueDelta >= 0
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    <ArrowUpRight
                      className={`h-3.5 w-3.5 ${revenueDelta < 0 ? "rotate-90" : ""}`}
                    />
                    {Math.abs(revenueDelta).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-white/50">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7c9cff]" />
                  Revenue
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#69f0c6]" />
                  Conversion
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,_rgba(255,255,255,0.02)_0%,_rgba(255,255,255,0.00)_100%)] p-2 sm:mt-5 sm:rounded-[22px] sm:p-3">
              <div className="relative h-[220px] sm:h-[280px]">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div key={line} className="border-t border-dashed border-white/10" />
                  ))}
                </div>

                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                >
                  <defs>
                    <linearGradient id="sales-area-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#7c9cff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#7c9cff" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="sales-line-gradient-premium" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#98b0ff" />
                      <stop offset="100%" stopColor="#4f7df3" />
                    </linearGradient>
                  </defs>

                  <path d={areaPath} fill="url(#sales-area-gradient)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#sales-line-gradient-premium)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                  />

                  {coordinates.map((point) => (
                    <g key={point.label}>
                      <circle cx={point.x} cy={point.y} fill="#0f1117" r="9" stroke="#7c9cff" strokeWidth="4" />
                      <circle cx={point.x} cy={point.y} fill="#ffffff" r="3.2" />
                    </g>
                  ))}
                </svg>

                <div className="absolute inset-x-0 bottom-0 grid grid-cols-8 gap-1 sm:gap-2">
                  {points.map((point) => (
                    <div key={point.label} className="text-center">
                      <p className="text-[9px] font-semibold text-white/80 sm:text-[11px]">
                        {point.label}
                      </p>
                      <p className="mt-0.5 text-[8px] text-white/45 sm:mt-1 sm:text-[10px]">
                        {formatCurrency(point.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[22px] border border-black/8 bg-white p-4 shadow-[0_16px_40px_rgba(17,17,17,0.05)] sm:rounded-[28px] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Live indicators
                </p>
                <h4 className="mt-2 text-lg font-semibold text-[#111111]">
                  Performance pulse
                </h4>
              </div>
              <Activity className="h-5 w-5 text-[#4f7df3]" />
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Revenue trend",
                  value: `${revenueDelta >= 0 ? "+" : "-"}${Math.abs(revenueDelta).toFixed(1)}%`,
                  tone:
                    revenueDelta >= 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600",
                },
                {
                  label: "Current conversion",
                  value: `${points[points.length - 1]?.conversion.toFixed(1) ?? "0.0"}%`,
                  tone: "bg-[#eef3ff] text-[#4f7df3]",
                },
                {
                  label: "Active catalog",
                  value: `${products.filter((product) => !product.isArchived).length} live`,
                  tone: "bg-[#fff3ed] text-[#ff5a1f]",
                },
              ].map((item) => (
                <div
                  className="flex items-center justify-between rounded-[20px] border border-black/6 bg-[#faf8f5] px-4 py-3"
                  key={item.label}
                >
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-black/8 bg-white p-4 shadow-[0_16px_40px_rgba(17,17,17,0.05)] sm:rounded-[28px] sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">
              Activity stream
            </p>
            <h4 className="mt-2 text-lg font-semibold text-[#111111]">
              Recent movement
            </h4>

            <div className="mt-5 space-y-3">
              {timelineMarkers.map((point) => (
                <div
                  className="flex items-start gap-3 rounded-[20px] border border-black/6 bg-[#fcfaf7] px-4 py-3"
                  key={point.label}
                >
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-white">
                    <Dot className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">
                        {formatCurrency(point.revenue)} generated
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                        {point.label} ago
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {point.units} units moved with {point.conversion.toFixed(1)}%
                      conversion.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
