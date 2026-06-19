'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/common/types/quiz';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
}

export const QuestionCard = React.memo(({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
}: QuestionCardProps) => {
  const handleValueChange = (value: string) => {
    onAnswer(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>{question.category}</span>
        </div>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={handleValueChange}
          className="space-y-3"
        >
          {question.allAnswers.map((answer) => (
            <div
              key={answer}
              className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent"
            >
              <RadioGroupItem value={answer} id={`answer-${answer}`} />
              <Label
                htmlFor={`answer-${answer}`}
                className="cursor-pointer font-normal flex-1"
              >
                {answer}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';
