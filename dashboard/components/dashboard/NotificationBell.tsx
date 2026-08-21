'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
  AppNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/api/notifications';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications(20);
      setItems(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 45000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const onOpenToggle = () => setOpen((v) => !v);

  const onItemClick = async (n: AppNotification) => {
    if (!n.isRead) {
      try {
        await markNotificationRead(n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
  };

  const onMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpenToggle}
        className="relative p-2 rounded-lg hover:bg-gray-100"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-[min(100vw-1.5rem,22rem)] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
                <p className="text-xs text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'You are up to date'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAll}
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                items.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href || '#'}
                    onClick={() => onItemClick(n)}
                    className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      !n.isRead ? 'bg-teal-50/60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                      )}
                      <div className={!n.isRead ? '' : 'pl-4'}>
                        <p className="text-sm font-medium text-gray-900 leading-snug">{n.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
