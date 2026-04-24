"use client";

import { useEffect, useMemo, useState } from "react";

interface CountdownProps {
  target: string;
}

const getTimeLeft = (target: string) => {
  const end = new Date(target).getTime();
  const difference = Math.max(end - Date.now(), 0);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, done: difference <= 0 };
};

const Countdown: React.FC<CountdownProps> = ({ target }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(getTimeLeft(target));

    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [target]);

  const segments = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Min", value: timeLeft.minutes },
      { label: "Sec", value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  if (!isMounted) {
    return (
      <div className="grid grid-cols-4 gap-2.5">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="flex min-w-0 flex-col items-center justify-center rounded-[24px] border border-[#ead8cb] bg-[#fff8f2] px-1 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          >
            <div className="min-w-0 text-[clamp(1.05rem,1.5vw,1.55rem)] font-semibold leading-none tabular-nums text-[#111111]">
              --
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#6b7280] sm:tracking-[0.22em]">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.done) {
    return (
      <div className="rounded-[28px] border border-[#ead8cb] bg-[#fff8f2] px-5 py-4 text-sm font-semibold text-[#111111]">
        Offer window is live right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="flex min-w-0 flex-col items-center justify-center rounded-[24px] border border-[#ead8cb] bg-[#fff8f2] px-1 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        >
          <div className="min-w-0 text-[clamp(1.05rem,1.5vw,1.55rem)] font-semibold leading-none tabular-nums text-[#111111]">
            {String(segment.value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#6b7280] sm:tracking-[0.22em]">
            {segment.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
