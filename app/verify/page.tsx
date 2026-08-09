'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { VerifyScreenAdapter } from '@/components/figma-ui/VerifyScreenAdapter';

export default function VerifyPage() {
  const router = useRouter();
  const { pending } = useAuth();

  useEffect(() => {
    if (!pending) router.replace('/sign-in');
  }, [pending, router]);

  if (!pending) return null;

  return <VerifyScreenAdapter />;
}
