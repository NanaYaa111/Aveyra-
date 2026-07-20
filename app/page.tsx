'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * The entry route sends people to Today — the daily ritual and home of the app.
 * (Client redirect so it works in a static export, which has no server.)
 */
export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/today');
  }, [router]);

  return (
    <p className="text-text-soft">
      Taking you to <Link href="/today">Today</Link>…
    </p>
  );
}
