'use client';

import React from 'react';

interface QuizTimerProps {
  startedAt: number;
}

function formatElapsed(totalSeconds: number): { mins: string; secs: string } {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    mins: mins.toString().padStart(2, '0'),
    secs: secs.toString().padStart(2, '0'),
  };
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ startedAt }) => {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    const tick = () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const { mins, secs } = formatElapsed(elapsed);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums tracking-widest text-white sm:text-6xl md:text-7xl">
            {mins}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-white/60">
            Minutes
          </span>
        </div>
        <span className="text-5xl font-bold text-white/30 sm:text-6xl md:text-7xl">:</span>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums tracking-widest text-white sm:text-6xl md:text-7xl">
            {secs}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-white/60">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
};
