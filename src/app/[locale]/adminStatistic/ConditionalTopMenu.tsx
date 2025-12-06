'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TopMenu from '@/Components/Navigation/TopMenu';

export default function ConditionalTopMenu() {
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Ocultar TopMenu en rutas de adminStatistic
    if (!pathname) {
      setShouldShow(true);
      return;
    }

    const normalizedPath = pathname.toLowerCase();
    // Detectar rutas de adminStatistic (con o sin locale)
    const isAdminStatisticRoute =
      normalizedPath.includes('/adminstatistic') ||
      normalizedPath.endsWith('/adminstatistic') ||
      /\/[a-z]{2}\/adminstatistic(\/)?$/i.test(normalizedPath);

    setShouldShow(!isAdminStatisticRoute);
  }, [pathname]);

  if (!shouldShow) {
    return null;
  }

  return <TopMenu />;
}
