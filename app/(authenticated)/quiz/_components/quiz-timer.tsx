'use client';

import React from 'react';

interface QuizTimerProps {
  startedAt: number;
  totalQuestions: number;
  onTimeout: () => void;
}

function formatTime(totalSeconds: number): { mins: string; secs: string } {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    mins: mins.toString().padStart(2, '0'),
    secs: secs.toString().padStart(2, '0'),
  };
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ startedAt, totalQuestions, onTimeout }) => {
  const totalDuration = totalQuestions * 60;
  const [remaining, setRemaining] = React.useState(totalDuration);
  const hasTimedOut = React.useRef(false);

  React.useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, totalDuration - elapsed);
      setRemaining(left);

      if (left <= 0 && !hasTimedOut.current) {
        hasTimedOut.current = true;
        onTimeout();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, totalDuration, onTimeout]);

  const { mins, secs } = formatTime(remaining);
  const isLow = remaining <= 30;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className={`text-5xl font-bold tabular-nums tracking-widest sm:text-6xl md:text-7xl ${isLow ? 'text-destructive' : 'text-foreground'}`}>
            {mins}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Minutes
          </span>
        </div>
        <span className={`text-5xl font-bold sm:text-6xl md:text-7xl ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>:</span>
        <div className="flex flex-col items-center">
          <span className={`text-5xl font-bold tabular-nums tracking-widest sm:text-6xl md:text-7xl ${isLow ? 'text-destructive' : 'text-foreground'}`}>
            {secs}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
};
