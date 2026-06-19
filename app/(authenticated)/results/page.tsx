'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizResults } from '@/common/types/quiz';

function getInitialResults(): QuizResults | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const saved = localStorage.getItem('quizResults');
  if (saved) {
    try {
      return JSON.parse(saved) as QuizResults;
    } catch {
      localStorage.removeItem('quizResults');
    }
  }

  return null;
}

export default function ResultsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [results] = React.useState<QuizResults | null>(getInitialResults);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  React.useEffect(() => {
    if (!results) {
      router.push('/');
    }
  }, [results, router]);

  const handleRestart = () => {
    localStorage.removeItem('quizResults');
    router.push('/');
  };

  if (status === 'loading' || !results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return 'Excellent! Great job!';
    if (score >= 60) return 'Good work! Keep it up!';
    if (score >= 40) return 'Not bad! Try again!';
    return 'Keep practicing!';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{results.score}%</div>
            <p className="text-muted-foreground mt-2">
              {getScoreMessage(results.score)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions</span>
              <span className="font-medium">{results.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Answered</span>
              <span className="font-medium">{results.answeredQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct</span>
              <span className="font-medium text-green-500">
                {results.correctAnswers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Incorrect</span>
              <span className="font-medium text-red-500">
                {results.incorrectAnswers}
              </span>
            </div>
          </div>

          <Button onClick={handleRestart} className="w-full">
            Restart Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
