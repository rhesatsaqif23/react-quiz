# Skills Documentation

## Project Setup Skill

### Initial Project Setup

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest react-quiz --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"

# Navigate to project
cd react-quiz

# Install dependencies
pnpm add @tanstack/react-query react-hook-form @hookform/resolvers yup axios

# Install shadcn/ui
npx shadcn@latest init

# Add required shadcn/ui components
npx shadcn@latest add button card input label progress toast toaster
```

### ESLint Setup

```bash
# Install ESLint dependencies
pnpm add -D eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
EOF
```

### Prettier Setup

```bash
# Install Prettier
pnpm add -D prettier

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "auto"
}
EOF

# Create .prettierignore
cat > .prettierignore << 'EOF'
node_modules
.next
out
dist
build
EOF
```

### Husky + lint-staged Setup

```bash
# Install Husky and lint-staged
pnpm add -D husky lint-staged

# Initialize Husky
pnpm exec husky install

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
pnpm exec lint-staged
EOF

# Make hook executable (Unix/Mac)
chmod +x .husky/pre-commit
```

Add to package.json:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Quiz Module Skill

### Creating Quiz Components

#### Question Card Component

```typescript
// src/app/(authenticated)/quiz/_components/question-card.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '../_types/quiz';

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
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            {question.category}
          </span>
        </div>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.allAnswers.map((answer) => (
          <Button
            key={answer}
            variant={selectedAnswer === answer ? 'default' : 'outline'}
            className="w-full justify-start text-left"
            onClick={() => onAnswer(answer)}
          >
            {answer}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';
```

#### Quiz Timer Component

```typescript
// src/app/(authenticated)/quiz/_components/quiz-timer.tsx
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizTimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  timeRemaining,
  totalTime,
  onTimeUp,
}) => {
  const progress = (timeRemaining / totalTime) * 100;
  const isLow = timeRemaining <= 10;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Time Remaining</span>
        <span className={isLow ? 'text-red-500 font-bold' : ''}>
          {timeRemaining}s
        </span>
      </div>
      <Progress value={progress} className={isLow ? 'bg-red-200' : ''} />
    </div>
  );
};
```

#### Quiz Progress Component

```typescript
// src/app/(authenticated)/quiz/_components/quiz-progress.tsx
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
```

### Creating Quiz Hooks

#### useQuiz Hook

```typescript
// src/app/(authenticated)/quiz/_hooks/use-quiz.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, QuizState } from '../_types/quiz';
import { fetchQuestions } from '@/api/quiz';
import { saveQuizState, loadQuizState, clearQuizState } from '@/utils/localStorage';

const TIME_PER_QUESTION = 60;
const TOTAL_QUESTIONS = 10;

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  timeRemaining: TIME_PER_QUESTION,
  status: 'idle',
};

export const useQuiz = () => {
  const router = useRouter();
  const [state, setState] = useState<QuizState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadQuizState();
    if (savedState && savedState.status === 'active') {
      setState(savedState);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (state.status === 'active') {
      saveQuizState(state);
    }
  }, [state]);

  const startQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const questions = await fetchQuestions(TOTAL_QUESTIONS);
      setState({
        ...initialState,
        questions,
        status: 'active',
      });
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setState((prev) => {
      const newAnswers = {
        ...prev.answers,
        [prev.currentIndex]: answer,
      };
      
      // Auto-advance to next question
      const nextIndex = prev.currentIndex + 1;
      const isLastQuestion = nextIndex >= prev.questions.length;
      
      if (isLastQuestion) {
        // Quiz completed
        clearQuizState();
        return {
          ...prev,
          answers: newAnswers,
          status: 'completed',
        };
      }
      
      return {
        ...prev,
        answers: newAnswers,
        currentIndex: nextIndex,
        timeRemaining: TIME_PER_QUESTION,
      };
    });
  }, []);

  const handleTimeUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'timeout',
    }));
    clearQuizState();
  }, []);

  const calculateResults = useCallback(() => {
    const { questions, answers } = state;
    let correct = 0;
    let answered = 0;

    Object.entries(answers).forEach(([index, answer]) => {
      answered++;
      if (answer === questions[parseInt(index)].correctAnswer) {
        correct++;
      }
    });

    return {
      totalQuestions: questions.length,
      answeredQuestions: answered,
      correctAnswers: correct,
      incorrectAnswers: answered - correct,
      score: Math.round((correct / questions.length) * 100),
    };
  }, [state]);

  const resetQuiz = useCallback(() => {
    clearQuizState();
    setState(initialState);
  }, []);

  return {
    state,
    isLoading,
    error,
    startQuiz,
    selectAnswer,
    handleTimeUp,
    calculateResults,
    resetQuiz,
  };
};
```

#### useQuizTimer Hook

```typescript
// src/app/(authenticated)/quiz/_hooks/use-quiz-timer.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseQuizTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const useQuizTimer = ({
  initialTime,
  onTimeUp,
  isActive,
}: UseQuizTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onTimeUp]);

  const resetTimer = useCallback((newTime?: number) => {
    setTimeRemaining(newTime ?? initialTime);
  }, [initialTime]);

  return {
    timeRemaining,
    resetTimer,
  };
};
```

### Creating Quiz Types

```typescript
// src/app/(authenticated)/quiz/_types/quiz.ts
export interface Question {
  id: number;
  category: string;
  type: 'boolean' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>;
  timeRemaining: number;
  status: 'idle' | 'active' | 'completed' | 'timeout';
}

export interface QuizResults {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
}
```

### Creating Quiz Constants

```typescript
// src/app/(authenticated)/quiz/_const/quiz-config.ts
export const QUIZ_CONFIG = {
  TIME_PER_QUESTION: 60,
  TOTAL_QUESTIONS: 10,
  API_BASE_URL: 'https://opentdb.com/api.php',
} as const;

export const DIFFICULTY_COLORS = {
  easy: 'text-green-500',
  medium: 'text-yellow-500',
  hard: 'text-red-500',
} as const;
```

---

## Auth Module Skill

### Creating Login Components

#### Login Form Component

```typescript
// src/app/(public)/login/_components/login-form.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const loginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quiz Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Starting...' : 'Start Quiz'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

### Creating Auth Hook

```typescript
// src/hooks/use-auth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'user';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string) => {
    const newUser: User = { username, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    router.push('/quiz');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('quizState');
    router.push('/login');
  }, [router]);

  const isAuthenticated = user?.isAuthenticated ?? false;

  return { user, isAuthenticated, isLoading, login, logout };
};
```

---

## Utility Functions Skill

### HTML Entity Decoder

```typescript
// src/utils/decode-html.ts
export const decodeHtml = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const decodeQuizQuestion = <T extends { question: string; correct_answer: string; incorrect_answers: string[] }>(
  question: T
): T & { allAnswers: string[] } => {
  const decodedQuestion = decodeHtml(question.question);
  const decodedCorrect = decodeHtml(question.correct_answer);
  const decodedIncorrect = question.incorrect_answers.map(decodeHtml);
  const allAnswers = [...decodedIncorrect, decodedCorrect].sort(() => Math.random() - 0.5);

  return {
    ...question,
    question: decodedQuestion,
    correctAnswer: decodedCorrect,
    incorrectAnswers: decodedIncorrect,
    allAnswers,
  };
};
```

### localStorage Helpers

```typescript
// src/utils/localStorage.ts
import { QuizState } from '@/app/(authenticated)/quiz/_types/quiz';

const QUIZ_STATE_KEY = 'quizState';

export const saveQuizState = (state: QuizState): void => {
  try {
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save quiz state:', error);
  }
};

export const loadQuizState = (): QuizState | null => {
  try {
    const saved = localStorage.getItem(QUIZ_STATE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load quiz state:', error);
  }
  return null;
};

export const clearQuizState = (): void => {
  try {
    localStorage.removeItem(QUIZ_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear quiz state:', error);
  }
};
```

---

## API Integration Skill

### Quiz API Client

```typescript
// src/api/client.ts
import axios from 'axios';
import { decodeQuizQuestion } from '@/utils/decode-html';

const httpClient = axios.create({
  baseURL: 'https://opentdb.com/api.php',
  timeout: 10000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Infrastructure level error handling
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default httpClient;
```

### Quiz API Functions

```typescript
// src/api/quiz/index.ts
import httpClient from '../client';
import { decodeQuizQuestion } from '@/utils/decode-html';
import { Question } from '@/app/(authenticated)/quiz/_types/quiz';

interface TriviaDBResponse {
  response_code: number;
  results: Array<{
    category: string;
    type: 'boolean' | 'multiple';
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }>;
}

export const fetchQuestions = async (amount: number = 10): Promise<Question[]> => {
  const response = await httpClient.get<TriviaDBResponse>('', {
    params: { amount },
  });

  if (response.data.response_code !== 0) {
    throw new Error('Failed to fetch questions from API');
  }

  return response.data.results.map((q, index) => ({
    ...decodeQuizQuestion(q),
    id: index,
  }));
};
```

### Quiz API Types

```typescript
// src/api/quiz/type.ts
export interface TriviaDBQuestion {
  category: string;
  type: 'boolean' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaDBResponse {
  response_code: number;
  results: TriviaDBQuestion[];
}
```

---

## Results Module Skill

### Creating Results Components

#### Result Card Component

```typescript
// src/app/(authenticated)/results/_components/result-card.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizResults } from '@/app/(authenticated)/quiz/_types/quiz';

interface ResultCardProps {
  results: QuizResults;
  onRestart: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ results, onRestart }) => {
  const getScoreMessage = (score: number): string => {
    if (score >= 80) return 'Excellent! Great job!';
    if (score >= 60) return 'Good work! Keep it up!';
    if (score >= 40) return 'Not bad! Try again!';
    return 'Keep practicing!';
  };

  return (
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
            <span className="font-medium text-green-500">{results.correctAnswers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Incorrect</span>
            <span className="font-medium text-red-500">{results.incorrectAnswers}</span>
          </div>
        </div>
        
        <Button onClick={onRestart} className="w-full">
          Restart Quiz
        </Button>
      </CardContent>
    </Card>
  );
};
```

---

## Guard Component Skill

### Permission Guard

```typescript
// src/app/_components/guard.tsx
'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

interface GuardProps {
  permissions: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Guard: React.FC<GuardProps> = ({
  permissions,
  fallback = null,
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // For this quiz app, we don't have role-based permissions
  // Just check if user is authenticated
  return <>{children}</>;
};
```

---

## Testing Checklist Skill

### Pre-Commit Checklist

- [ ] ESLint passes without errors
- [ ] Prettier formatting applied
- [ ] TypeScript compilation successful
- [ ] All components render correctly
- [ ] Quiz flow works end-to-end
- [ ] Timer functionality works
- [ ] localStorage persistence works
- [ ] Error states handled properly
- [ ] Loading states displayed correctly

### Manual Testing Steps

1. **Login Flow**
   - [ ] Open app → Redirects to /login
   - [ ] Enter valid username → Redirects to /quiz
   - [ ] Enter invalid username → Shows validation error

2. **Quiz Flow**
   - [ ] Questions load from API
   - [ ] One question displayed at a time
   - [ ] Answer selection works
   - [ ] Auto-advance to next question
   - [ ] Progress indicator updates
   - [ ] Timer counts down

3. **Timer Flow**
   - [ ] Timer displays correctly
   - [ ] Timer counts down each second
   - [ ] Timer reaches zero → Shows results
   - [ ] Timer resets on new question

4. **Resume Flow**
   - [ ] Refresh page during quiz
   - [ ] Quiz resumes from saved state
   - [ ] Answers are preserved
   - [ ] Timer resumes correctly

5. **Results Flow**
   - [ ] Results page displays after completion
   - [ ] Score calculated correctly
   - [ ] Correct/incorrect counts accurate
   - [ ] Restart button works
   - [ ] localStorage cleared after completion

---

## Deployment Skill

### GitHub Deployment

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial quiz application setup"

# Create main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/username/react-quiz.git

# Push to remote
git push -u origin main
```

### Vercel Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to Vercel
vercel

# Follow prompts to link to GitHub repository
```

---

## Common Patterns Skill

### Custom Hook Pattern

```typescript
// Pattern for custom hooks
export const useModuleName = (props) => {
  // State
  const [state, setState] = useState(initialState);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Callbacks
  const handleAction = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // Computed values
  const computedValue = useMemo(() => {
    // Computation
  }, [dependencies]);

  return {
    state,
    handleAction,
    computedValue,
  };
};
```

### Component Pattern

```typescript
// Pattern for components
interface ComponentNameProps {
  // Props definition
}

export const ComponentName = React.memo(({ prop1, prop2 }: ComponentNameProps) => {
  // Hooks
  // State
  // Effects
  // Callbacks
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';
```

### API Pattern

```typescript
// Pattern for API functions
export const apiFunction = async (params: ParamsType): Promise<ReturnType> => {
  try {
    const response = await httpClient.get<ReturnType>('/endpoint', { params });
    return response.data;
  } catch (error) {
    // Infrastructure error handling
    throw error;
  }
};
```
