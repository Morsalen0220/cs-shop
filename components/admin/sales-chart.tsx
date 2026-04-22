"use client";

import { Product } from "@/types";
import { useEffect, useMemo, useState } from "react";

interface SalesChartPoint {
  label: string;
  revenue: number;
  units: number;
}

interface SalesChartProps {
  initialProducts: Product[];
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const buildLiveSeries = (products: Product[], timestamp: number): SalesChartPoint[] => {
  const totalRevenue = products.reduce(
    (total, product) => total + Number(product.price || 0),
    0
  );
  const activeProducts = products.filter((product) => !product.isArchived);
  const featuredProducts = products.filter((product) => product.isFeatured).length;
  const baseCount = Math.max(activeProducts.length, 1);
  const baseRevenue = Math.max(totalRevenue, 1200);
  const now = new Date(timestamp);
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  return Array.from({ length: 6 }, (_, index) => {
    const bucketOffset = 5 - index;
    const activitySeed = currentMinute * 7 + currentSecond + bucketOffset * 9;
    const swing = ((activitySeed % 11) - 5) / 10;
    const spotlight = ((featuredProducts + index * 3 + currentSecond) % 9) / 14;
    const units = Math.max(
      Math.round(baseCount * (0.95 + spotlight + swing * 0.25)),
      8
    );
    const revenue = Math.max(
      Math.round(baseRevenue * (0.22 + index * 0.08 + spotlight * 0.18 + swing * 0.06)),
      900
    );

    return {
      label: `${bucketOffset * 10}s`,
      revenue,
      units,
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
  const chartHeight = 260;
  const chartWidth = 760;
  const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
  const maxUnits = Math.max(...points.map((point) => point.units), 1);
  const linePoints = points
    .map((point, index) => {
      const x = (chartWidth / Math.max(points.length - 1, 1)) * index;
      const y = chartHeight - (point.revenue / maxRevenue) * (chartHeight - 24);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-8 rounded-[28px] border border-[#f0e7df] bg-[linear-gradient(180deg,_#fcfaf7_0%,_#f8f4ee_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
            Sales snapshot
          </p>
          <p className="mt-2 text-lg font-semibold text-[#111111]">
            Auto-refresh every 15 minutes
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 text-gray-500">
            <span className="h-3 w-3 rounded-full bg-[#4f7df3]" />
            Units sold
          </span>
          <span className="inline-flex items-center gap-2 text-gray-500">
            <span className="h-[3px] w-5 rounded-full bg-[#ff7a45]" />
            Estimated revenue
          </span>
          <span className="rounded-full bg-[#fff3ed] px-3 py-1.5 text-[#ff5a1f]">
            Updated {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[56px_minmax(0,1fr)_72px] gap-3">
        <div className="flex h-[260px] flex-col justify-between pb-8 text-xs font-semibold text-gray-400">
          {[maxUnits, Math.round(maxUnits * 0.75), Math.round(maxUnits * 0.5), Math.round(maxUnits * 0.25), 0].map(
            (value, index) => (
              <span key={`${value}-${index}`}>{value}</span>
            )
          )}
        </div>

        <div>
          <div className="relative h-[260px] overflow-hidden rounded-[22px] bg-white/80 px-4 pt-4">
            <div className="pointer-events-none absolute inset-x-4 top-4 bottom-8 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((line) => (
                <div key={line} className="border-t border-dashed border-black/8" />
              ))}
            </div>

            <div className="relative z-10 flex h-full items-end gap-4 pb-8">
              {points.map((point) => (
                <div key={point.label} className="flex flex-1 items-end justify-center">
                  <div className="group flex w-full max-w-[52px] flex-col items-center justify-end gap-2">
                    <span className="text-[11px] font-semibold text-[#4f7df3] opacity-80 transition">
                      {point.units}
                    </span>
                    <div
                      className="w-full rounded-t-[16px] bg-[linear-gradient(180deg,_#7ea2ff_0%,_#4f7df3_100%)] shadow-[0_14px_30px_rgba(79,125,243,0.22)] transition-all duration-700"
                      style={{
                        height: `${Math.max((point.units / maxUnits) * 168, 28)}px`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <svg
                className="pointer-events-none absolute inset-x-4 top-4 bottom-8 h-[228px] w-[calc(100%-2rem)]"
                preserveAspectRatio="none"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              >
                <defs>
                  <linearGradient id="sales-line-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#ff9b68" />
                    <stop offset="100%" stopColor="#ff5a1f" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  points={linePoints}
                  stroke="url(#sales-line-gradient)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
                {points.map((point, index) => {
                  const x = (chartWidth / Math.max(points.length - 1, 1)) * index;
                  const y =
                    chartHeight - (point.revenue / maxRevenue) * (chartHeight - 24);

                  return (
                    <g key={point.label}>
                      <circle cx={x} cy={y} fill="#ffffff" r="8" stroke="#ff7a45" strokeWidth="4" />
                      <text
                        fill="#ff5a1f"
                        fontSize="22"
                        fontWeight="700"
                        textAnchor="middle"
                        x={x}
                        y={Math.max(y - 18, 18)}
                      >
                        {point.revenue >= 1000 ? `${Math.round(point.revenue / 1000)}k` : point.revenue}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div
            className="mt-3 grid gap-4 px-3"
            style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
          >
            {points.map((point) => (
              <div key={point.label} className="text-center">
                <p className="text-xs font-semibold text-gray-500">{point.label} ago</p>
                <p className="mt-1 text-[11px] text-gray-400">{formatCurrency(point.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-[260px] flex-col justify-between pb-8 text-right text-xs font-semibold text-gray-400">
          {[maxRevenue, maxRevenue * 0.75, maxRevenue * 0.5, maxRevenue * 0.25, 0].map(
            (value, index) => (
              <span key={`${value}-${index}`}>{formatCurrency(Math.round(value))}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
