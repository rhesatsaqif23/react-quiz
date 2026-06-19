/**
 * @file quiz-timer.tsx
 * @description Timer components for the quiz interface
 *
 * Provides two timer components:
 * - QuestionTimer: Per-question countdown timer (30 seconds default)
 *   - Turns red when time is running low (≤10 seconds)
 *   - Calls onTimeout callback when time expires
 *   - Resets when questionStartedAt changes
 *
 * - GlobalTimer: Overall quiz timer showing total remaining time
 *   - Calculates total time based on number of questions × 30 seconds
 *   - Displays formatted MM:SS time remaining
 *   - Turns red when time is running low (≤60 seconds)
 *
 * Key exports:
 * - QuestionTimer: Per-question timer component
 * - GlobalTimer: Overall quiz timer component
 */

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

  const isLow = remaining <= 10;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center">
        <span className={`text-6xl font-bold tabular-nums tracking-widest sm:text-7xl md:text-8xl ${isLow ? 'text-destructive' : 'text-foreground'}`}>
          {remaining}
        </span>
        <span className={`text-xl font-medium sm:text-2xl ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
          sec
        </span>
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

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isLow = remaining <= 60;

  return (
    <div className="flex items-center gap-2 text-lg sm:text-xl text-white/70">
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
      <span className={`tabular-nums font-semibold ${isLow ? 'text-destructive' : 'text-white/90'}`}>
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
      <span className="text-white/50">remaining</span>
    </div>
  );
};
