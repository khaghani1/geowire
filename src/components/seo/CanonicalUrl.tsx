'use client';

import { usePathname } from 'next/navigation';

/**
 * Injects a <link rel="canonical"> into the document head
 * based on the current pathname. Ensures all pages use the
 * www.geowire.org canonical domain consistently.
 */
export function CanonicalUrl() {
  const pathname = usePathname();
  const canonical = `https://www.geowire.org${pathname}`;

  return <link rel="canonical" href={canonical} />;
}
