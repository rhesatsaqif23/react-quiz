'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
  TRIVIA_CATEGORIES,
  QUIZ_DIFFICULTIES,
  QUIZ_TYPES,
  QUIZ_AMOUNTS,
  DEFAULT_QUIZ_CONFIG,
} from '@/common/constants/trivia-categories';
import { QuizConfig } from '@/common/types/quiz';

export const QuizConfigForm = () => {
  const router = useRouter();
  const [config, setConfig] = React.useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);

  const handleAmountChange = (value: number | readonly number[]) => {
    const numValue = Array.isArray(value) ? value[0] : value;
    setConfig((prev) => ({ ...prev, amount: QUIZ_AMOUNTS[numValue] }));
  };

  const handleCategoryChange = (value: string | null) => {
    if (value !== null) {
      setConfig((prev) => ({ ...prev, category: parseInt(value) }));
    }
  };

  const handleStartQuiz = () => {
    localStorage.setItem('quizConfig', JSON.stringify(config));
    localStorage.removeItem('quizState');
    localStorage.removeItem('quizResults');
    router.push('/quiz');
  };

  const sliderIndex = QUIZ_AMOUNTS.indexOf(config.amount as (typeof QUIZ_AMOUNTS)[number]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="amount" className="text-base font-semibold">
            Number of Questions
          </Label>
          <span className="text-xl font-bold">{config.amount}</span>
        </div>
        <Slider
          id="amount"
          min={0}
          max={QUIZ_AMOUNTS.length - 1}
          step={1}
          value={[sliderIndex >= 0 ? sliderIndex : 1]}
          onValueChange={handleAmountChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground px-1">
          {QUIZ_AMOUNTS.map((amount) => (
            <span key={amount} className="text-center w-0">
              {amount}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-base font-semibold">
          Select Category
        </Label>
        <Select
          value={config.category === 0 ? '' : config.category.toString()}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category" className="w-full py-6 text-lg">
            <SelectValue placeholder="Any Category">
              {TRIVIA_CATEGORIES.find((c) => c.id === config.category)?.name ?? 'Any Category'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              {TRIVIA_CATEGORIES.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Difficulty</Label>
        <RadioGroup
          value={config.difficulty}
          onValueChange={(val: string | null) => {
            setConfig((prev) => ({ ...prev, difficulty: val ?? 'any' }));
          }}
          className="grid grid-cols-2 gap-3"
        >
          {QUIZ_DIFFICULTIES.map((item) => (
            <div
              key={item.value}
              onClick={() => setConfig((prev) => ({ ...prev, difficulty: item.value }))}
              className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent"
            >
              <RadioGroupItem value={item.value} id={`difficulty-${item.value}`} />
              <Label
                htmlFor={`difficulty-${item.value}`}
                className="cursor-pointer font-normal text-base"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Type</Label>
        <RadioGroup
          value={config.type}
          onValueChange={(val: string | null) => {
            setConfig((prev) => ({ ...prev, type: val ?? 'any' }));
          }}
          className="grid grid-cols-3 gap-3"
        >
          {QUIZ_TYPES.map((item) => (
            <div
              key={item.value}
              onClick={() => setConfig((prev) => ({ ...prev, type: item.value }))}
              className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent"
            >
              <RadioGroupItem value={item.value} id={`type-${item.value}`} />
              <Label
                htmlFor={`type-${item.value}`}
                className="cursor-pointer font-normal text-base"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button onClick={handleStartQuiz} className="w-full py-6 text-lg">
        Start Quiz
      </Button>
    </div>
  );
};
