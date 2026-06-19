'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizTimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  timeRemaining,
  totalTime,
  onTimeUp,
}) => {
  const progress = (timeRemaining / totalTime) * 100;
  const isLow = timeRemaining <= 10;

  React.useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Time Remaining</span>
        <span className={isLow ? 'text-red-500 font-bold' : ''}>
          {timeRemaining}s
        </span>
      </div>
      <Progress value={progress} className={isLow ? '[&>div]:bg-red-500' : ''} />
    </div>
  );
};
