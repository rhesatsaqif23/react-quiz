'use client';

import React from 'react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-lg font-bold tracking-wide text-white sm:text-xl">
        Questions: {currentQuestion} out of {totalQuestions}
      </span>
      <div className="h-0.5 w-full max-w-[200px] bg-primary/60" />
    </div>
  );
};
