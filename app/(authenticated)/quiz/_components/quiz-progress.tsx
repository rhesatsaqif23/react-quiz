'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}) => {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-muted-foreground">
          {answeredQuestions} answered
        </span>
      </div>
      <Progress value={progress} />
    </div>
  );
};
