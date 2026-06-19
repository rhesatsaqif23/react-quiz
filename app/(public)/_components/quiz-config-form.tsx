'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">Quiz Configuration</CardTitle>
        <CardDescription className="text-base">
          Customize your quiz experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="amount" className="text-base">
              Number of Questions
            </Label>
            <span className="text-lg font-semibold">{config.amount}</span>
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
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{QUIZ_AMOUNTS[0]}</span>
            <span>{QUIZ_AMOUNTS[QUIZ_AMOUNTS.length - 1]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-base">
            Select Category
          </Label>
          <Select
            value={config.category === 0 ? '' : config.category.toString()}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Any Category">
                {TRIVIA_CATEGORIES.find((c) => c.id === config.category)?.name ?? 'Any Category'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
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
          <Label className="text-base">Select Difficulty</Label>
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
                className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-accent"
              >
                <RadioGroupItem value={item.value} id={`difficulty-${item.value}`} />
                <Label
                  htmlFor={`difficulty-${item.value}`}
                  className="cursor-pointer font-normal"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Select Type</Label>
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
                className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-accent"
              >
                <RadioGroupItem value={item.value} id={`type-${item.value}`} />
                <Label
                  htmlFor={`type-${item.value}`}
                  className="cursor-pointer font-normal"
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
      </CardContent>
    </Card>
  );
};
