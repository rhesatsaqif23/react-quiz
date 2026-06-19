/**
 * @file theme-toggle.tsx
 * @description Theme toggle button component
 *
 * A button that toggles between dark and light themes.
 * Uses next-themes for theme management.
 *
 * Features:
 * - Displays sun icon for dark mode (to switch to light)
 * - Displays moon icon for light mode (to switch to dark)
 * - Handles hydration mismatch with mounted state
 * - Accessible with aria-label
 *
 * Key exports:
 * - ThemeToggle: Theme toggle button component
 */

'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

// Theme toggle button with sun/moon icons
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Handle hydration mismatch with mounted state
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Render empty button during SSR
  if (!mounted) {
    return (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground backdrop-blur-sm"
        aria-label="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  // Check if current theme is dark
  const isDark = theme === 'dark';

  return (
    <button
      // Toggle between dark and light themes
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted/80"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
