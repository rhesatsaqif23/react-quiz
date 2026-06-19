/**
 * @file prisma.ts
 * @description Prisma client singleton configuration
 *
 * Creates and exports a singleton PrismaClient instance to prevent
 * multiple instances during development hot-reloads.
 *
 * In development, stores the Prisma client on globalThis to persist
 * across module reloads. In production, creates a new instance each time.
 *
 * Key exports:
 * - db: PrismaClient singleton instance
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
