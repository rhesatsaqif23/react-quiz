'use client';

import React from 'react';

interface QuizTimerProps {
  startedAt: number;
}

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Time Elapsed</span>
        <span className="text-lg font-semibold tabular-nums">
          {formatElapsed(elapsed)}
        </span>
      </div>
    </div>
  );
};
