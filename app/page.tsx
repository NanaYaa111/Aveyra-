'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


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
