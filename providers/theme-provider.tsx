/**
 * @file theme-provider.tsx
 * @description Theme provider wrapper component
 *
 * Wraps the application with next-themes ThemeProvider to support
 * dark/light mode theme switching throughout the application.
 *
 * Key exports:
 * - ThemeProvider: Component that provides theme context to children
 */

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Wrap app with next-themes ThemeProvider for dark/light mode
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
