'use client';

import SpaceProfilePage from '@/app/[locale]/space/page';
import SpaceRepliesPage from '@/app/[locale]/space/replies/page';
import SpaceNotificationsPage from '@/app/[locale]/space/notifications/page';
import SpaceHistoryPage from '@/app/[locale]/space/history/page';
import { SpaceApp } from '@/components/space/SpaceApp';

export function SpaceProfile() {
  return (
    <SpaceApp>
      <SpaceProfilePage />
    </SpaceApp>
  );
}

export function SpaceReplies() {
  return (
    <SpaceApp>
      <SpaceRepliesPage />
    </SpaceApp>
  );
}

export function SpaceNotifications() {
  return (
    <SpaceApp>
      <SpaceNotificationsPage />
    </SpaceApp>
  );
}

export function SpaceHistory() {
  return (
    <SpaceApp>
      <SpaceHistoryPage />
    </SpaceApp>
  );
}
