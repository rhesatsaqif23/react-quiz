# Product Requirements Document (PRD)

## React Quiz Application

### Overview

A single-page quiz application built with Next.js (React) that allows users to log in, take timed quizzes from the Open Trivia Database API, and view results. The app supports session resumption via localStorage.

---

## 1. Objectives

- Build a functional quiz application meeting all technical test requirements
- Implement clean, maintainable code following frontend engineering best practices
- Use modern React patterns (hooks, context, react-query)
- Ensure code quality with ESLint, Prettier, Husky, and lint-staged

---

## 2. Target Users

- Users who want to test their trivia knowledge
- Users who need a timed quiz experience with progress tracking

---

## 3. Functional Requirements

### 3.1 Authentication (Login)

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | User can log in with username | High |
| AUTH-02 | Login state persisted in localStorage | High |
| AUTH-03 | Redirect to login page if not authenticated | High |
| AUTH-04 | Logout functionality | Medium |

### 3.2 Quiz Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| QC-01 | Fetch questions from https://opentdb.com/api.php | High |
| QC-02 | Default 10 questions per quiz | Medium |
| QC-03 | Support multiple question types (boolean, multiple choice) | High |
| QC-04 | Decode HTML entities in questions and answers | High |

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
| SR-04 | Resume quiz on page reload | High |
| SR-05 | Clear saved state on quiz completion | Medium |

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
| Forms | React Hook Form + Yup validation |
| State Management | React Context + useState |
| Code Quality | ESLint + Prettier |
| Git Hooks | Husky + lint-staged |
| Package Manager | pnpm |

### 5.2 Folder Structure

```
src/
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
│   │   │   └── page.tsx
│   │   └── results/
│   │       ├── _components/
│   │       │   └── result-card.tsx
│   │       ├── _hooks/
│   │       │   └── use-results.ts
│   │       └── page.tsx
│   ├── (public)/
│   │   └── login/
│   │       ├── _components/
│   │       │   └── login-form.tsx
│   │       ├── _hooks/
│   │       │   └── use-login.ts
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── api/
│   ├── quiz/
│   │   ├── index.ts
│   │   └── type.ts
│   └── client.ts
├── common/
│   ├── constants/
│   │   ├── permissions.ts
│   │   └── quiz-config.ts
│   ├── enums/
│   │   └── quiz-status.ts
│   └── types/
│       └── response.ts
├── components/
│   └── ui/ (shadcn/ui)
├── hooks/
│   ├── use-auth.ts
│   └── request/
│       └── use-query.ts
├── libs/
│   └── utils.ts
├── providers/
│   └── query-provider.tsx
└── utils/
    ├── decode-html.ts
    └── localStorage.ts
```

### 5.3 API Integration

#### Open Trivia Database

```typescript
// GET https://opentdb.com/api.php?amount=10
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

---

## 6. User Flows

### 6.1 Login Flow

```
User opens app
  → Redirected to /login (if not authenticated)
  → Enters username
  → Clicks "Start Quiz"
  → Redirected to /quiz
```

### 6.2 Quiz Flow

```
User on /quiz
  → Question displayed with timer
  → User selects answer
  → Auto-advance to next question
  → Timer resets for new question
  → After last question or timer expiry
  → Redirected to /results
```

### 6.3 Resume Flow

```
User refreshes page during quiz
  → App checks localStorage for saved state
  → If saved state exists:
    → Resume from saved question
    → Restore answers
    → Resume timer
  → If no saved state:
    → Start new quiz
```

### 6.4 Results Flow

```
User on /results
  → Sees score summary (correct/incorrect/total)
  → Option to restart quiz
  → Clears localStorage state
  → Redirected to /quiz
```

---

## 7. Data Models

### 7.1 Question

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

### 7.2 Quiz State

```typescript
interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>;
  timeRemaining: number;
  status: "idle" | "active" | "completed" | "timeout";
}
```

### 7.3 Quiz Results

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

### 7.4 User

```typescript
interface User {
  username: string;
  isAuthenticated: boolean;
}
```

---

## 8. Validation Schema (Yup)

```typescript
const loginSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
});
```

---

## 9. Error Handling Strategy

### Infrastructure Level

- Network errors → Toast notification with generic message
- API errors → Log to console, show user-friendly message

### Business Level

- Quiz fetch failure → "Failed to load questions. Please try again."
- Timer expiry → Auto-submit and show results
- Invalid answer → Prevent submission, show validation message

---

## 10. Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-01 | User can log in with username | Pending |
| AC-02 | Questions fetched from Open Trivia DB | Pending |
| AC-03 | One question displayed per page | Pending |
| AC-04 | Auto-advance on answer selection | Pending |
| AC-05 | Timer counts down and auto-submits | Pending |
| AC-06 | Results page shows correct/incorrect/total | Pending |
| AC-07 | Quiz resumes after page refresh | Pending |
| AC-08 | ESLint and Prettier configured | Pending |
| AC-09 | Husky and lint-staged configured | Pending |
| AC-10 | Code follows folder structure convention | Pending |

---

## 11. Out of Scope

- User registration (only login with username)
- Backend authentication (client-side only)
- Multiple quiz categories selection
- Leaderboard functionality
- Social sharing

---

## 12. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Setup | Day 1 | Project init, ESLint, Prettier, Husky, shadcn/ui |
| Auth | Day 1 | Login page, useAuth hook |
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
- Parameters:
  - `amount` (int): Number of questions (default: 10)
  - `category` (int): Category ID (optional)
  - `difficulty` (string): easy, medium, hard (optional)
  - `type` (string): boolean, multiple (optional)
