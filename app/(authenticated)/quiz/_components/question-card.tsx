/**
 * @file question-card.tsx
 * @description Question display component for the quiz interface
 *
 * Renders a quiz question with its answer options in a card layout.
 * Each answer option is displayed as a button with a letter label (A, B, C, D).
 *
 * Features:
 * - Displays question text in a styled card
 * - Shows answer options in a 2-column grid layout
 * - Highlights selected answer with primary color styling
 * - Uses React.memo for performance optimization
 * - Responsive design for different screen sizes
 *
 * Key exports:
 * - QuestionCard: Memoized component for displaying quiz questions
 */

'use client';

import React from 'react';
import { Question } from '@/common/types/quiz';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuestionCard = React.memo(({
  question,
  onAnswer,
  selectedAnswer,
}: QuestionCardProps) => {
  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-border bg-card/50 px-6 py-6 backdrop-blur-sm">
        <p className="text-center text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          {question.question}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {question.allAnswers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          const letter = OPTION_LETTERS[index] ?? String(index + 1);

          return (
            <button
              key={answer}
              onClick={() => onAnswer(answer)}
              className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border px-6 py-5 text-left transition-all sm:px-7 sm:py-6 ${
                isSelected
                  ? 'border-primary bg-primary/15 shadow-[0_0_20px_rgba(179,255,0,0.15)]'
                  : 'border-foreground/20 bg-white dark:bg-black hover:border-foreground/40 hover:bg-foreground/5'
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-bold sm:h-13 sm:w-13 sm:text-lg ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-black dark:bg-white text-white dark:text-black border border-foreground/20'
                }`}
              >
                {letter}
              </span>
              <span
                className={`text-lg font-medium sm:text-xl ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}
              >
                {answer}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';
