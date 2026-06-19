'use client';

import React from 'react';

interface QuestionTimerProps {
  questionStartedAt: number;
  onTimeout: () => void;
}

interface GlobalTimerProps {
  quizStartedAt: number;
  totalQuestions: number;
}

function formatTime(totalSeconds: number): { mins: string; secs: string } {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    mins: mins.toString().padStart(2, '0'),
    secs: secs.toString().padStart(2, '0'),
  };
}

const QUESTION_DURATION = 30;

function QuestionTimerInner({ questionStartedAt, onTimeout }: QuestionTimerProps) {
  const [remaining, setRemaining] = React.useState(QUESTION_DURATION);
  const hasTimedOut = React.useRef(false);

  React.useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - questionStartedAt) / 1000);
      const left = Math.max(0, QUESTION_DURATION - elapsed);
      setRemaining(left);

      if (left <= 0 && !hasTimedOut.current) {
        hasTimedOut.current = true;
        onTimeout();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [questionStartedAt, onTimeout]);

  const { mins, secs } = formatTime(remaining);
  const isLow = remaining <= 10;

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
}

export const QuestionTimer: React.FC<QuestionTimerProps> = (props) => (
  <QuestionTimerInner key={props.questionStartedAt} {...props} />
);

export const GlobalTimer: React.FC<GlobalTimerProps> = ({ quizStartedAt, totalQuestions }) => {
  const totalDuration = totalQuestions * 30;
  const [remaining, setRemaining] = React.useState(totalDuration);

  React.useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - quizStartedAt) / 1000);
      const left = Math.max(0, totalDuration - elapsed);
      setRemaining(left);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [quizStartedAt, totalDuration]);

  const { mins, secs } = formatTime(remaining);
  const isLow = remaining <= 60;

  return (
    <div className="flex items-center gap-2 text-lg sm:text-xl text-muted-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className={`tabular-nums font-semibold ${isLow ? 'text-destructive' : ''}`}>
        {mins}:{secs}
      </span>
      <span className="text-muted-foreground/80">remaining</span>
    </div>
  );
};
