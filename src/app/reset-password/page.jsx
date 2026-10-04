'use client';

import { Suspense } from 'react';
import ResetPassword from '@/Components/ResetPassword/ResetPassword';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
