# Agents Guidelines

## Project Overview

This is a React Quiz Application built with Next.js 14 (App Directory), TypeScript, and shadcn/ui. The application allows users to register, log in, configure and take timed quizzes from the Open Trivia Database API, and view results. The app uses server-side authentication with NextAuth, JWT, and bcrypt.

---

## Development Guidelines

### Code Standard

#### ESLint Configuration

- Use ESLint as the code standard
- Configuration: `eslint-config-airbnb` or custom rules
- Purpose: Maintain consistent code style and enforce best practices

```json
// .eslintrc.json
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
```

#### Prettier Configuration

- Use Prettier for code formatting
- Configuration: `.prettierrc`
- Purpose: Consistent code formatting across the project

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "auto"
}
```

#### ESLint + Prettier Integration

- Install `eslint-config-prettier` to disable ESLint rules that conflict with Prettier
- This approach: Use Prettier for formatting only, ESLint for code quality

```bash
npm add -D eslint-config-prettier
```

#### Husky + lint-staged

- Husky: Git hooks manager
- lint-staged: Run linters on staged git files

```bash
npm add -D husky lint-staged

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
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

### Naming Convention

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `quizState` |
| Functions | camelCase | `fetchQuestions`, `handleAnswer` |
| Components | PascalCase | `QuizCard`, `LoginForm` |
| Constants | CONST_VALUE | `API_BASE_URL`, `MAX_QUESTIONS` |
| Private variables | _camelCase | `_localVariable`, `_timerId` |
| Types/Interfaces | PascalCase | `Question`, `QuizState` |
| Files (components) | kebab-case | `quiz-card.tsx`, `login-form.tsx` |
| Files (hooks) | kebab-case with prefix | `use-quiz.ts`, `use-auth.ts` |
| Files (utils) | kebab-case | `decode-html.ts`, `localStorage.ts` |
| Files (types) | kebab-case | `quiz.ts`, `response.ts` |

---

### Folder Structure

```
├── app/
│   ├── _components/              # Shared components (global)
│   │   ├── guard.tsx             # Permission guard component
│   │   ├── loading-spinner.tsx   # Global loading component
│   │   └── navbar.tsx            # Navigation bar
│   ├── (authenticated)/          # Protected routes
│   │   ├── quiz/
│   │   │   ├── _components/      # Module-specific components
│   │   │   ├── _hooks/           # Module-specific hooks
│   │   │   ├── _types/           # Module-specific types
│   │   │   ├── _const/           # Module-specific constants
│   │   │   └── page.tsx          # Page component
│   │   └── results/
│   │       ├── _components/
│   │       ├── _hooks/
│   │       └── page.tsx
│   ├── (public)/                 # Public routes
│   │   ├── _components/          # Shared public components
│   │   ├── login/
│   │   │   ├── _components/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── _components/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts
│   │       └── register/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── api/                          # API layer
│   └── quiz/
│       ├── index.ts
│       └── type.ts
├── common/
│   ├── constants/
│   │   ├── trivia-categories.ts
│   │   └── quiz-config.ts
│   ├── enums/
│   │   └── quiz-status.ts
│   └── types/
│       ├── quiz.ts
│       └── response.ts
├── components/
│   └── ui/                       # shadcn/ui components
├── hooks/
│   └── use-auth.ts
├── libs/
│   ├── auth.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── providers/
│   └── auth-provider.tsx
├── types/
│   └── next-auth.d.ts
└── utils/
    ├── decode-html.ts
    └── localStorage.ts
```

---

### Module Structure

Each module follows this structure:

```
module-name/
├── _components/                  # Components within the module
├── _hooks/                       # Hooks within the module
├── _const/                       # Constants within the module
├── _utils/                       # Utilities within the module
├── _types/                       # Types within the module
└── page.tsx                      # Page component
```

---

### Naming Convention for Module Paths

| Action | Path | Example |
|--------|------|---------|
| Create | `/create` | `/quiz/create` |
| Update | `/[id]/update` | `/quiz/1/update` |
| List | `/` | `/quiz` |
| Detail | `/[id]` | `/quiz/1` |

---

### File Naming Convention

```typescript
// Hooks: [nama-hooks].ts (context-aware)
use-quiz.ts
use-auth.ts
use-quiz-timer.ts

// Page Components: page.tsx
page.tsx

// Global Components: [nama-component].tsx
navbar.tsx
footer.tsx
loading-spinner.tsx

// Utils: [nama-utils].ts
date-formatter.ts
api-client.ts
decode-html.ts

// Constants: [nama-constants].ts
api-endpoints.ts
form-config.ts
quiz-config.ts

// Types: [nama-type].ts
quiz.ts
response.ts
```

---

### React Best Practices

#### Hooks

```typescript
// Separate business logic into custom hooks
// Example: use-quiz.ts
export const useQuiz = () => {
  // All quiz-related logic here
  const [state, setState] = useState<QuizState>(initialState);
  
  const selectAnswer = useCallback((answer: string) => {
    // Handle answer selection
  }, []);
  
  return { state, selectAnswer };
};
```

#### Hook for Fetching Data

```typescript
// Use React Query for data fetching
import { useQuery } from '@tanstack/react-query';

export const useQuizQuery = (amount: number) => {
  return useQuery({
    queryKey: ['quiz', amount],
    queryFn: () => fetchQuestions(amount),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### Minimize useEffect

```typescript
// Bad: Using useEffect for everything
useEffect(() => {
  setData(processData(rawData));
}, [rawData]);

// Good: Use useMemo for derived state
const processedData = useMemo(() => processData(rawData), [rawData]);
```

#### Code Splitting

```typescript
// Use dynamic imports for code splitting
const QuizResults = dynamic(() => import('./_components/quiz-results'), {
  loading: () => <LoadingSpinner />,
});
```

#### Memoization

```typescript
// Use React.memo for components that receive same props
const QuestionCard = React.memo(({ question, onAnswer }: QuestionCardProps) => {
  // Component logic
});
```

---

### Basic UI State

#### Default State

```typescript
const initialState: QuizState = {
  questions: [],
  config: DEFAULT_QUIZ_CONFIG,
  currentIndex: 0,
  answers: {},
  timeRemaining: 60,
  status: 'idle',
};
```

#### Empty State

```typescript
{questions.length === 0 && !isLoading && (
  <div className="flex flex-col items-center justify-center p-8">
    <h2>No Questions Available</h2>
    <p>Please try again later.</p>
  </div>
)}
```

#### Loading State

```typescript
if (isLoading) {
  return <LoadingSpinner />;
}
```

#### Error State

```typescript
if (error) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2>Error Loading Questions</h2>
      <p>{error.message}</p>
      <Button onClick={refetch}>Try Again</Button>
    </div>
  );
}
```

#### Validation

```typescript
// Use Zod for validation schemas
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

---

### Authentication

#### Server-Side Authentication with NextAuth

```typescript
// libs/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/libs/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate and authenticate user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
```

#### Client-Side Authentication Hook

```typescript
// hooks/use-auth.ts
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    logout,
  };
};
```

---

### Error Handling

#### Infrastructure Level

```typescript
// libs/auth.ts
// Network errors and HTTP status codes are handled at this level
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);
```

#### Business Level

```typescript
// app/api/auth/register/route.ts
// Business logic errors are handled at this level
if (existingUser) {
  return NextResponse.json(
    { error: 'User with this email already exists' },
    { status: 409 }
  );
}
```

---

### State Management

#### useState

- Use for local component state
- Example: Form inputs, UI toggles

#### useContext

- Use for global data that rarely changes
- Example: User data, theme

#### React Query

- Use for data fetching and caching
- Example: Quiz questions API

---

### Error Handling Strategy

| Level | Responsibility | Example |
|-------|----------------|---------|
| Infrastructure | Network errors, HTTP status codes | 500 error → "Server error" |
| Domain | Business logic errors | Email already registered → "Email taken" |
| UI | User-facing messages | Form validation → "Email required" |

---

### UI Components

#### shadcn/ui

- Use Select component for options with more than 4 choices
- Use RadioGroup component for options with 4 or fewer choices
- Follow shadcn/ui documentation for component usage

```tsx
// Select component example (>4 options)
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>

// RadioGroup component example (≤4 options)
<RadioGroup value={value} onValueChange={onChange}>
  {items.map((item) => (
    <div key={item.value} className="flex items-center space-x-2">
      <RadioGroupItem value={item.value} id={item.value} />
      <Label htmlFor={item.value}>{item.label}</Label>
    </div>
  ))}
</RadioGroup>
```

---

### How to Run

#### Development

```bash
# Install dependencies
npm install

# Initialize Prisma
npx prisma migrate dev

# Run development server
npm run dev

# Open browser at http://localhost:3000
```

#### Production

```bash
# Build production
npm run build

# Start production server
npm start
```

---

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Run Prettier |
| `npm run format:check` | Check Prettier formatting |

---

### Git Workflow

1. Create feature branch from `main`
2. Make changes following coding standards
3. Run `npm run lint` and `npm run format`
4. Commit changes (Husky will run pre-commit hooks)
5. Push to remote
6. Create pull request

---

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(quiz): add timer functionality

- Implement countdown timer
- Auto-submit when timer reaches zero
- Save timer state to localStorage

Closes #12
```
