import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SignInModal } from '@/components/auth/SignInModal';
import { SpaceShell } from '@/components/space/SpaceShell';

export function SpaceApp({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SpaceShell>{children}</SpaceShell>
      <SignInModal side="right" />
    </AuthProvider>
  );
}
