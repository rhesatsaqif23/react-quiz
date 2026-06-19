# Product Requirements Document (PRD)

## React Quiz Application

### Overview

A single-page quiz application built with Next.js (React) that allows users to register, log in, configure and take timed quizzes from the Open Trivia Database API, and view results. The app supports session resumption via localStorage and uses server-side authentication with NextAuth, JWT, and bcrypt.

---

## 1. Objectives

- Build a functional quiz application meeting all technical test requirements
- Implement clean, maintainable code following frontend engineering best practices
- Use modern React patterns (hooks, context, react-query)
- Ensure code quality with ESLint, Prettier, Husky, and lint-staged
- Implement server-side authentication with NextAuth, JWT, and bcrypt

---

## 2. Target Users

- Users who want to test their trivia knowledge
- Users who need a timed quiz experience with progress tracking
- Users who want to customize their quiz experience (category, difficulty, type)

---

## 3. Functional Requirements

### 3.1 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | User can register with name, email, and password | High |
| AUTH-02 | User can log in with email and password | High |
| AUTH-03 | Passwords are hashed with bcrypt | High |
| AUTH-04 | JWT-based session management with NextAuth | High |
| AUTH-05 | Redirect to login page if not authenticated | High |
| AUTH-06 | Logout functionality | High |
| AUTH-07 | Server-side authentication middleware | High |

### 3.2 Quiz Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| QC-01 | User can select number of questions (5, 10, 15, 20) | High |
| QC-02 | User can select category from Open Trivia DB categories | High |
| QC-03 | User can select difficulty (Any, Easy, Medium, Hard) | High |
| QC-04 | User can select question type (Any, Multiple, True/False) | High |
| QC-05 | Fetch questions from https://opentdb.com/api.php | High |
| QC-06 | Decode HTML entities in questions and answers | High |
| QC-07 | Support session tokens for unique questions | Medium |

### 3.3 Quiz Timer

| ID | Requirement | Priority |
|----|-------------|----------|
| TMR-01 | Display countdown timer (default: 60 seconds per question) | High |
| TMR-02 | Timer pauses on page blur (optional) | Low |
| TMR-03 | Auto-submit when timer reaches zero | High |
| TMR-04 | Timer state persisted for resume functionality | High |

### 3.4 Quiz Flow

| ID | Requirement | Priority |
|----|-------------|----------|
| QF-01 | Display one question per page | High |
| QF-02 | Auto-advance to next question on answer selection | High |
| QF-03 | Show total questions and current question number | High |
| QF-04 | Disable question navigation (linear flow only) | Medium |

### 3.5 Quiz Results

| ID | Requirement | Priority |
|----|-------------|----------|
| RES-01 | Display number of correct answers | High |
| RES-02 | Display number of incorrect answers | High |
| RES-03 | Display number of answered questions | High |
| RES-04 | Display total questions | High |
| RES-05 | Show percentage score | Medium |
| RES-06 | Option to restart quiz | High |

### 3.6 Session Resume (localStorage)

| ID | Requirement | Priority |
|----|-------------|----------|
| SR-01 | Save current question index to localStorage | High |
| SR-02 | Save answers to localStorage | High |
| SR-03 | Save remaining time to localStorage | High |
| SR-04 | Save quiz configuration to localStorage | High |
| SR-05 | Resume quiz on page reload | High |
| SR-06 | Clear saved state on quiz completion | Medium |

---

## 4. Non-Functional Requirements

### 4.1 Code Quality

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-01 | ESLint configuration (airbnb or standard) | High |
| NFR-02 | Prettier for code formatting | High |
| NFR-03 | Husky pre-commit hooks | High |
| NFR-04 | lint-staged for staged file validation | High |
| NFR-05 | End-of-line auto configuration for cross-platform | Medium |

### 4.2 Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| PERF-01 | Code splitting with dynamic imports | Medium |
| PERF-02 | React.memo for unnecessary re-renders | Medium |
| PERF-03 | Minimize useEffect usage | Medium |

### 4.3 Error Handling

| ID | Requirement | Priority |
|----|-------------|----------|
| ERR-01 | Infrastructure-level error handling (network errors) | High |
| ERR-02 | Business-level error handling (quiz logic) | High |
| ERR-03 | Loading states for async operations | High |
| ERR-04 | Empty state handling | Medium |

### 4.4 UI/UX

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-01 | Responsive design | High |
| UI-02 | Loading spinner during data fetch | Medium |
| UI-03 | Error messages for failed operations | High |
| UI-04 | shadcn/ui components for consistent design | High |
| UI-05 | Select component for options with >4 choices | High |
| UI-06 | RadioGroup component for options with ≤4 choices | High |

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Directory) |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Data Fetching | React Query |
| Forms | React Hook Form + Zod validation |
| Authentication | NextAuth.js with JWT strategy |
| Password Hashing | bcryptjs |
| Database | Prisma with SQLite |
| State Management | React Context + useState |
| Code Quality | ESLint + Prettier |
| Git Hooks | Husky + lint-staged |
| Package Manager | npm |

### 5.2 Folder Structure

```
├── app/
│   ├── _components/
│   │   ├── guard.tsx
│   │   ├── loading-spinner.tsx
│   │   └── navbar.tsx
│   ├── (authenticated)/
│   │   ├── quiz/
│   │   │   ├── _components/
│   │   │   │   ├── question-card.tsx
│   │   │   │   ├── quiz-timer.tsx
│   │   │   │   └── quiz-progress.tsx
│   │   │   ├── _hooks/
│   │   │   │   ├── use-quiz.ts
│   │   │   │   └── use-quiz-timer.ts
│   │   │   ├── _types/
│   │   │   │   └── quiz.ts
│   │   │   ├── _const/
│   │   │   │   └── quiz-config.ts
│   │   │   └── page.tsx
│   │   └── results/
│   │       ├── _components/
│   │       │   └── result-card.tsx
│   │       ├── _hooks/
│   │       │   └── use-results.ts
│   │       └── page.tsx
│   ├── (public)/
│   │   ├── login/
│   │   │   ├── _components/
│   │   │   │   └── login-form.tsx
│   │   │   ├── _hooks/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── _components/
│   │       │   └── register-form.tsx
│   │       ├── _hooks/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts
│   │       └── register/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── api/
│   └── quiz/
│       ├── index.ts
│       └── type.ts
├── common/
│   ├── constants/
│   │   ├── quiz-config.ts
│   │   └── trivia-categories.ts
│   ├── enums/
│   │   └── quiz-status.ts
│   └── types/
│       └── response.ts
├── components/
│   └── ui/ (shadcn/ui)
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

### 5.3 API Integration

#### Open Trivia Database

```typescript
// GET https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
Response format:
{
  response_code: number,
  results: Array<{
    category: string,
    type: "boolean" | "multiple",
    difficulty: "easy" | "medium" | "hard",
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
  }>
}
```

#### API Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| amount | int | Number of questions (1-50) |
| category | int | Category ID (see categories below) |
| difficulty | string | easy, medium, hard |
| type | string | boolean, multiple |
| encode | string | urlLegacy, url3986, base64 |
| token | string | Session token for unique questions |

#### Categories

| ID | Category |
|----|----------|
| 9 | General Knowledge |
| 10 | Entertainment: Books |
| 11 | Entertainment: Film |
| 12 | Entertainment: Music |
| 13 | Entertainment: Musicals & Theatres |
| 14 | Entertainment: Television |
| 15 | Entertainment: Video Games |
| 16 | Entertainment: Board Games |
| 17 | Science & Nature |
| 18 | Science: Computers |
| 19 | Science: Mathematics |
| 20 | Mythology |
| 21 | Sports |
| 22 | Geography |
| 23 | History |
| 24 | Politics |
| 25 | Art |
| 26 | Celebrities |
| 27 | Animals |
| 28 | Vehicles |
| 29 | Entertainment: Comics |
| 30 | Science: Gadgets |
| 31 | Entertainment: Japanese Anime & Manga |
| 32 | Entertainment: Cartoon & Animations |

---

## 6. User Flows

### 6.1 Registration Flow

```
User opens app
  → Redirected to /login (if not authenticated)
  → Clicks "Register" link
  → Fills in name, email, password, confirm password
  → Submits form
  → Account created with hashed password
  → Auto sign-in and redirect to /quiz
```

### 6.2 Login Flow

```
User opens app
  → Redirected to /login (if not authenticated)
  → Enters email and password
  → Clicks "Sign In"
  → JWT token created
  → Redirected to /
```

### 6.3 Quiz Configuration Flow

```
User on /
  → Sees quiz configuration form
  → Selects number of questions (5, 10, 15, 20)
  → Selects category (Any or specific category)
  → Selects difficulty (Any, Easy, Medium, Hard)
  → Selects type (Any, Multiple, True/False)
  → Clicks "Start Quiz"
  → Redirected to /quiz with configuration
```

### 6.4 Quiz Flow

```
User on /quiz
  → Questions fetched from API with configuration
  → Question displayed with timer
  → User selects answer
  → Auto-advance to next question
  → Timer resets for new question
  → After last question or timer expiry
  → Redirected to /results
```

### 6.5 Resume Flow

```
User refreshes page during quiz
  → App checks localStorage for saved state
  → If saved state exists:
    → Resume from saved question
    → Restore answers
    → Resume timer
  → If no saved state:
    → Redirect to / for new quiz
```

### 6.6 Results Flow

```
User on /results
  → Sees score summary (correct/incorrect/total)
  → Option to restart quiz
  → Clears localStorage state
  → Redirected to /
```

---

## 7. Data Models

### 7.1 User (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 7.2 Question

```typescript
interface Question {
  id: number;
  category: string;
  type: "boolean" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[]; // shuffled
}
```

### 7.3 Quiz Configuration

```typescript
interface QuizConfig {
  amount: number; // 5, 10, 15, 20
  category: number; // 0 for any, or category ID
  difficulty: string; // "any", "easy", "medium", "hard"
  type: string; // "any", "multiple", "boolean"
}
```

### 7.4 Quiz State

```typescript
interface QuizState {
  questions: Question[];
  config: QuizConfig;
  currentIndex: number;
  answers: Record<number, string>;
  timeRemaining: number;
  status: "idle" | "active" | "completed" | "timeout";
}
```

### 7.5 Quiz Results

```typescript
interface QuizResults {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; // percentage
  timeTaken: number;
}
```

### 7.6 User (Session)

```typescript
interface User {
  id: string;
  name: string | null;
  email: string;
}
```

---

## 8. Validation Schema (Zod)

```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const quizConfigSchema = z.object({
  amount: z.number().min(1).max(50),
  category: z.number().min(0).max(32),
  difficulty: z.enum(["any", "easy", "medium", "hard"]),
  type: z.enum(["any", "multiple", "boolean"]),
});
```

---

## 9. Error Handling Strategy

### Infrastructure Level

- Network errors → Toast notification with generic message
- API errors → Log to console, show user-friendly message
- Auth errors → Redirect to login with error message

### Business Level

- Quiz fetch failure → "Failed to load questions. Please try again."
- Timer expiry → Auto-submit and show results
- Invalid answer → Prevent submission, show validation message
- Registration errors → "Email already exists" or "Invalid input"

---

## 10. Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-01 | User can register with name, email, password | Pending |
| AC-02 | User can log in with email and password | Pending |
| AC-03 | Passwords are hashed with bcrypt | Pending |
| AC-04 | JWT session management works | Pending |
| AC-05 | User can configure quiz (amount, category, difficulty, type) | Pending |
| AC-06 | Questions fetched from Open Trivia DB with config | Pending |
| AC-07 | One question displayed per page | Pending |
| AC-08 | Auto-advance on answer selection | Pending |
| AC-09 | Timer counts down and auto-submits | Pending |
| AC-10 | Results page shows correct/incorrect/total | Pending |
| AC-11 | Quiz resumes after page refresh | Pending |
| AC-12 | ESLint and Prettier configured | Pending |
| AC-13 | Husky and lint-staged configured | Pending |
| AC-14 | Code follows folder structure convention | Pending |

---

## 11. Out of Scope

- Leaderboard functionality
- Social sharing
- Multiple quiz categories per request
- Quiz time limit configuration (fixed at 60s per question)

---

## 12. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Setup | Day 1 | Project init, ESLint, Prettier, Husky, shadcn/ui |
| Auth | Day 1 | Register, Login, NextAuth, Prisma, JWT |
| Quiz Config | Day 1 | Home page with quiz configuration form |
| Quiz Core | Day 2 | Quiz page, question display, answer selection |
| Timer | Day 2 | Quiz timer, auto-submit |
| Resume | Day 2 | localStorage integration |
| Results | Day 3 | Results page, score calculation |
| Polish | Day 3 | Error handling, loading states, UI refinement |
| Testing | Day 3 | Manual testing, code review |

---

## Appendix

### Open Trivia DB API Reference

- Base URL: `https://opentdb.com/api.php`
- Category URL: `https://opentdb.com/api_category.php`
- Session Token: `https://opentdb.com/api_token.php?command=request`
- Parameters:
  - `amount` (int): Number of questions (1-50)
  - `category` (int): Category ID (9-32)
  - `difficulty` (string): easy, medium, hard
  - `type` (string): boolean, multiple
  - `encode` (string): urlLegacy, url3986, base64
  - `token` (string): Session token for unique questions

### Response Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | No Results |
| 2 | Invalid Parameter |
| 3 | Token Not Found |
| 4 | Token Empty |
| 5 | Rate Limit |
