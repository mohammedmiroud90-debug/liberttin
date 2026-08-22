'use client';

import { RefreshCw } from 'lucide-react';

type Props = {
  onRefresh: () => void | Promise<void>;
  refreshing?: boolean;
  label?: string;
};

export function AdminRefreshButton({ onRefresh, refreshing = false, label = 'Refresh' }: Props) {
  return (
    <button
      type="button"
      onClick={() => onRefresh()}
      disabled={refreshing}
      className="admin-refresh-btn"
      aria-label={label}
      title={label}
    >
      <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
    </button>
  );
}

type HeaderProps = {
  children: React.ReactNode;
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
};

export function AdminPanelHeader({ children, onRefresh, refreshing }: HeaderProps) {
  return (
    <div className="admin-panel-header admin-panel-header--actions">
      <span>{children}</span>
      {onRefresh ? <AdminRefreshButton onRefresh={onRefresh} refreshing={refreshing} /> : null}
    </div>
  );
}
