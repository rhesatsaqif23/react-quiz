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
    if (status === 'authenticated' && !results) {
      router.push('/');
    }
  }, [results, router, status]);

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <div className="text-6xl font-bold">{results.score}%</div>
            <p className="text-muted-foreground mt-3 text-lg">
              {getScoreMessage(results.score)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-3xl font-bold">{results.totalQuestions}</div>
              <p className="text-muted-foreground mt-1">Total Questions</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-3xl font-bold">{results.answeredQuestions}</div>
              <p className="text-muted-foreground mt-1">Answered</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-3xl font-bold text-green-500">
                {results.correctAnswers}
              </div>
              <p className="text-muted-foreground mt-1">Correct</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-3xl font-bold text-red-500">
                {results.incorrectAnswers}
              </div>
              <p className="text-muted-foreground mt-1">Incorrect</p>
            </div>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground">
              Time taken: <span className="font-medium text-foreground">{formatTime(results.timeTaken)}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleRestart} className="flex-1 py-6 text-lg">
              Restart Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
