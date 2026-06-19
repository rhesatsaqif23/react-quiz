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
      <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-sm">
        <p className="text-center text-lg font-medium text-white sm:text-xl md:text-2xl">
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
              className={`group flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all sm:px-6 sm:py-5 ${
                isSelected
                  ? 'border-primary bg-primary/15 shadow-[0_0_20px_rgba(179,255,0,0.15)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold sm:h-12 sm:w-12 sm:text-lg ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                }`}
              >
                {letter}
              </span>
              <span
                className={`text-base font-medium sm:text-lg ${
                  isSelected ? 'text-primary' : 'text-white'
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
