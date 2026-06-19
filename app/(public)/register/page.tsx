'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RegisterForm } from './_components/register-form';

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/quiz');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <RegisterForm />
    </div>
  );
}
