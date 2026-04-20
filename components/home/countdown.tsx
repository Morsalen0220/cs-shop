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
      <div className="grid grid-cols-4 gap-3">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="rounded-3xl border border-black/10 bg-white/85 px-4 py-3 text-center"
          >
            <div className="text-2xl font-semibold text-[#111111]">--</div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.done) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/80 px-5 py-4 text-sm font-semibold text-[#111111]">
        Offer window is live right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="rounded-3xl border border-black/10 bg-white/85 px-4 py-3 text-center"
        >
          <div className="text-2xl font-semibold text-[#111111]">
            {String(segment.value).padStart(2, "0")}
          </div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">
            {segment.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
