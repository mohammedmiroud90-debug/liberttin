const HISTORY_KEY = 'libertta.visitHistory';

export type VisitRecord = {
  href: string;
  title: string;
  at: string;
};

export function readVisitHistory(): VisitRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordVisit(href: string, title: string) {
  if (typeof window === 'undefined') return;
  if (!href || href.includes('/admin') || href.includes('/space') || href.includes('/login')) return;

  const next: VisitRecord[] = [
    { href, title: title.replace(/\s*·\s*Libertta.*$/i, '').trim() || title, at: new Date().toISOString() },
    ...readVisitHistory().filter((row) => row.href !== href),
  ].slice(0, 40);

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function clearVisitHistory() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(HISTORY_KEY);
}
