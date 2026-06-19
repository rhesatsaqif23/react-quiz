# QuizTime - React Quiz Application

A modern, feature-rich quiz application built with Next.js 16, TypeScript, and Tailwind CSS. Test your knowledge with questions from the Open Trivia Database API, complete with timers, progress tracking, and a sleek neon-green themed UI.

**Live Demo:** [quiztime-dot.vercel.app](https://quiztime-dot.vercel.app/)

---

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="screenshots/screenshot-1.png" alt="Home Page" width="400">
    </td>
    <td align="center">
      <img src="screenshots/screenshot-2.png" alt="Quiz Config" width="400">
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/screenshot-3.png" alt="Quiz Timer" width="400">
    </td>
    <td align="center">
      <img src="screenshots/screenshot-4.png" alt="Results" width="400">
    </td>
  </tr>
</table>

---

## Features

- **User Authentication** - Register and log in with secure NextAuth v5 credentials-based auth (JWT + bcrypt password hashing)
- **Quiz Configuration** - Customize your quiz with:
  - 5 to 30 questions
  - 24 trivia categories (General Knowledge, Science, Music, etc.)
  - Difficulty levels (Easy, Medium, Hard)
  - Question types (Multiple Choice, True/False)
- **Per-Question Countdown Timer** - 30-second timer per question; auto-skips on timeout
- **Global Countdown Timer** - Tracks total quiz duration with automatic submission when time expires
- **Auto-Advance** - Select an answer and the quiz automatically advances after a 1-second visual feedback delay
- **Quiz Resume** - Quiz state is persisted to localStorage; resume an interrupted quiz from the homepage
- **Results & Review** - Detailed results page with:
  - Overall score percentage
  - Stats grid (total, answered, correct, incorrect)
  - Time taken
  - Per-question review with correct/incorrect indicators
- **Dark/Light Theme Toggle** - Switch between dark and light modes via the navbar
- **Animated 3D Background** - Floating geometric shapes with light beam and glow effects
- **Responsive Design** - Optimized for mobile, tablet, and desktop with a neon green (#b3ff00) accent color
- **HTML Entity Decoding** - Properly decodes special characters from the Open Trivia Database API responses
- **Vercel Deployment** - Fully deployed and configured for serverless environment

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16 | App Directory framework, server/client components |
| **React** | 19 | UI library |
| **TypeScript** | 5 | Static type checking |
| **Tailwind CSS** | 4 | Utility-first CSS styling |
| **shadcn/ui** | - | Pre-built UI components (Dialog, Select, RadioGroup, Slider, etc.) |
| **Base UI** | 1.6 | Headless component primitives (via shadcn) |
| **NextAuth** | v5 (beta) | Authentication (Credentials provider) |
| **Prisma** | 5.22 | ORM for PostgreSQL database |
| **Neon PostgreSQL** | - | Serverless PostgreSQL database (free tier) |
| **bcryptjs** | 3.0 | Password hashing |
| **React Hook Form** | 7.79 | Form state management |
| **Zod** | 4.4 | Schema validation |
| **next-themes** | 0.4 | Dark/light theme management |
| **Sonner** | 2.0 | Toast notifications |
| **Lucide React** | 1.21 | Icon library |
| **Open Trivia Database** | - | Free quiz questions API |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn** or **pnpm**
- **Neon account** (free) for PostgreSQL database - [neon.tech](https://neon.tech)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rhesatsaqif23/react-quiz.git
   cd react-quiz
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local`:

   ```env
   # Database (Neon PostgreSQL) - Get from https://neon.tech
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

   Generate a secret key:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. **Initialize the database**

   ```bash
   npx prisma db push
   ```

   This creates the database tables in your Neon PostgreSQL database.

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (includes prisma generate + db push) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Vercel Deployment

### Setup

1. **Push to GitHub**

2. **Import project in Vercel** - [vercel.com/new](https://vercel.com/new)

3. **Set Environment Variables** in Vercel Dashboard → Settings → Environment Variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon PostgreSQL connection string |
   | `NEXTAUTH_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |

4. **Deploy** - Vercel automatically runs `prisma generate` and `prisma db push` during build

### Important Notes

- SQLite does **not** work on Vercel (ephemeral filesystem). This project uses **Neon PostgreSQL** (free tier).
- The build script automatically runs `prisma generate` and `prisma db push` to set up the database.
- `.env.local` is only for local development. Vercel uses the dashboard environment variables.

---

## Project Structure

```
react-quiz-dot/
├── app/
│   ├── (authenticated)/            # Protected routes (require login)
│   │   ├── quiz/
│   │   │   ├── _components/        # Quiz-specific components
│   │   │   │   ├── question-card.tsx    # Answer options with A/B/C/D letters
│   │   │   │   ├── quiz-timer.tsx       # Dual timer (question + global)
│   │   │   │   └── quiz-progress.tsx    # Question counter display
│   │   │   └── page.tsx            # Main quiz page with auto-advance logic
│   │   └── results/
│   │       └── page.tsx            # Results with per-question review
│   ├── (public)/                   # Public routes
│   │   ├── _components/            # Shared public components
│   │   │   ├── quiz-config-dialog.tsx   # Dialog wrapper for quiz config
│   │   │   └── quiz-config-form.tsx     # Category/difficulty/type selectors
│   │   ├── login/
│   │   │   ├── _components/
│   │   │   │   └── login-form.tsx       # Email/password login form
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── _components/
│   │       │   └── register-form.tsx    # Registration form with validation
│   │       └── page.tsx
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts  # NextAuth API handlers
│   │   └── register/route.ts       # User registration endpoint
│   ├── globals.css                 # Theme variables + animations
│   ├── layout.tsx                  # Root layout with providers
│   └── page.tsx                    # Homepage with start/resume buttons
├── components/
│   ├── navbar.tsx                  # Glassmorphism navbar with auth buttons
│   ├── theme-toggle.tsx            # Dark/light mode toggle
│   └── ui/                         # shadcn/ui components
├── common/
│   ├── constants/
│   │   └── trivia-categories.ts    # 24 categories, difficulties, types
│   └── types/
│       └── quiz.ts                 # TypeScript interfaces (QuizState, Question, etc.)
├── hooks/
│   └── use-auth.ts                 # Client-side auth hook
├── libs/
│   ├── auth.ts                     # NextAuth v5 configuration
│   └── prisma.ts                   # Prisma client singleton
├── prisma/
│   └── schema.prisma               # PostgreSQL database schema
├── providers/
│   ├── auth-provider.tsx           # NextAuth SessionProvider
│   └── theme-provider.tsx          # next-themes ThemeProvider
├── utils/
│   └── decode-html.ts              # HTML entity decoder for API responses
├── types/
│   └── next-auth.d.ts              # NextAuth type extensions
├── middleware.ts                    # Route protection middleware
├── .env.example                    # Environment variable template
└── screenshots/                    # App screenshots
```

---

## How It Works

### Quiz Flow

1. **Landing Page** - User sees the homepage with "Start Quiz" and optionally "Resume Quiz" buttons (if a quiz was interrupted). An animated 3D background with floating shapes is displayed.

2. **Authentication** - Unauthenticated users are redirected to `/login`. New users can register at `/register`. Credentials are verified with bcrypt and stored in PostgreSQL via Prisma.

3. **Quiz Configuration** - A dialog opens where the user selects:
   - Number of questions (5-30)
   - Trivia category (24 options)
   - Difficulty (Easy/Medium/Hard)
   - Question type (Multiple Choice/True/False)

4. **Fetching Questions** - Questions are fetched from the Open Trivia Database API (`https://opentdb.com/api.php`) with the chosen parameters. HTML entities in questions/answers are decoded.

5. **Taking the Quiz** - For each question:
   - A **30-second per-question timer** counts down. If it reaches zero, the question is skipped.
   - A **global countdown timer** shows the remaining total time for the entire quiz.
   - The user selects an answer. After selection, there is a **1-second feedback delay** before auto-advancing to the next question.
   - Quiz state is saved to **localStorage** after every state change, enabling resume functionality.

6. **Quiz Completion** - When all questions are answered or the global timer expires:
   - Results are calculated (score, correct/incorrect counts, time taken).
   - Quiz state is cleared from localStorage.
   - Results are saved to localStorage and the user is redirected to the results page.

7. **Results Page** - Displays:
   - Score percentage with a motivational message
   - Statistics grid (total, answered, correct, incorrect)
   - Time taken
   - Per-question review cards showing the question, your answer, the correct answer, category, and difficulty

### Authentication System

- **NextAuth v5** with the Credentials provider
- Passwords hashed with **bcryptjs**
- Session strategy: **JWT** (no database session storage)
- Auth middleware protects `/quiz` and `/results` routes
- Custom `useAuth` hook provides `user`, `isAuthenticated`, `isLoading`, and `logout` to client components

### State Management

- **React useState** for local component state (quiz state, timer, form inputs)
- **localStorage** for persistence across page reloads (quiz resume, results)
- **next-themes** for dark/light theme state
- **NextAuth session** for authentication state

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'feat: add your feature'`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(quiz): add timer functionality
fix(auth): handle expired JWT tokens
docs: update README
```

### Code Standards

- ESLint with recommended rules
- TypeScript strict mode
- PascalCase for components, camelCase for functions/variables
- kebab-case for file names
- Inline documentation for all essential code

---

## License

This project is licensed under the **MIT License**.

---

> Built with Next.js 16, TypeScript, Tailwind CSS, and Open Trivia Database API
