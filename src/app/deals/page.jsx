'use client';

import { Suspense } from 'react';
import Products from '@/Components/Product/Products';

export default function DealsPage() {
  return (
    <Suspense fallback={null}>
      <Products />
    </Suspense>
  );
}
