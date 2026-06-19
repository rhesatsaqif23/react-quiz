/**
 * @file quiz-progress.tsx
 * @description Progress indicator component for the quiz
 *
 * Displays the current question number out of total questions.
 * Shows a simple text indicator and a progress bar.
 *
 * Key exports:
 * - QuizProgress: Component showing quiz progress
 */

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
      <span className="text-lg font-bold tracking-wide text-foreground sm:text-xl">
        Questions: {currentQuestion} out of {totalQuestions}
      </span>
      <div className="h-1 w-full max-w-[200px] bg-primary/60" />
    </div>
  );
};
