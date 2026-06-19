# Agents Guidelines

## Project Overview

This is a React Quiz Application built with Next.js 14 (App Directory), TypeScript, and shadcn/ui. The application allows users to take timed quizzes from the Open Trivia Database API.

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
pnpm add -D eslint-config-prettier
```

#### Husky + lint-staged

- Husky: Git hooks manager
- lint-staged: Run linters on staged git files

```bash
pnpm add -D husky lint-staged

# Initialize Husky
pnpm exec husky install

# Add pre-commit hook
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"
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
src/
├── app/                          # Next.js App Directory
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
│   │   │   ├── _utils/           # Module-specific utilities
│   │   │   └── page.tsx          # Page component
│   │   └── results/
│   │       ├── _components/
│   │       ├── _hooks/
│   │       └── page.tsx
│   ├── (public)/                 # Public routes
│   │   └── login/
│   │       ├── _components/
│   │       ├── _hooks/
│   │       └── page.tsx
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root page
├── api/                          # API layer
│   ├── quiz/
│   │   ├── index.ts              # API functions
│   │   └── type.ts               # API types
│   └── client.ts                 # HTTP client configuration
├── common/                       # Shared utilities
│   ├── constants/
│   │   ├── permissions.ts        # Permission definitions
│   │   └── quiz-config.ts        # Quiz configuration
│   ├── enums/
│   │   └── quiz-status.ts        # Status enums
│   └── types/
│       └── response.ts           # Common response types
├── components/                   # Shared UI components
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Shared hooks
│   ├── use-auth.ts               # Authentication hook
│   └── request/
│       └── use-query.ts          # React Query wrapper
├── libs/                         # Libraries and utilities
│   └── utils.ts                  # shadcn/ui utils
├── providers/                    # Context providers
│   └── query-provider.tsx        # React Query provider
└── utils/                        # Utility functions
    ├── decode-html.ts            # HTML entity decoder
    └── localStorage.ts           # localStorage helpers
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
// Use Yup for validation schemas
import * as yup from 'yup';

const loginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
});
```

---

### Authentication

#### Client-Side Authentication Hook

```typescript
// hooks/use-auth.ts
export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string) => {
    const newUser = { username, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    router.push('/quiz');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('quizState');
    router.push('/login');
  };

  const isAuthenticated = user?.isAuthenticated ?? false;

  return { user, isAuthenticated, login, logout };
};
```

---

### Error Handling

#### Infrastructure Level

```typescript
// api/client.ts
import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://opentdb.com/api.php',
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Infrastructure level: Network errors
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);
```

#### Business Level

```typescript
// hooks/use-quiz.ts
const handleAnswer = async (answer: string) => {
  try {
    // Business logic
    selectAnswer(answer);
    moveToNextQuestion();
  } catch (error) {
    // Business level: Quiz-specific errors
    if (error instanceof QuizError) {
      toast.error(error.message);
    }
  }
};
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
| UI | User-facing messages | Form validation → "Username required" |

---

### How to Run

#### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Open browser at http://localhost:3000
```

#### Production

```bash
# Build production
pnpm run build

# Start production server
pnpm start
```

---

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm run lint` | Run ESLint |
| `pnpm run lint:fix` | Run ESLint with auto-fix |
| `pnpm run format` | Run Prettier |
| `pnpm run format:check` | Check Prettier formatting |

---

### Git Workflow

1. Create feature branch from `main`
2. Make changes following coding standards
3. Run `pnpm run lint` and `pnpm run format`
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
