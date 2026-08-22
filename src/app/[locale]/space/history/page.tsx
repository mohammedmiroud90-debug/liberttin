'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { clearVisitHistory, readVisitHistory, type VisitRecord } from '@/lib/blog/visit-history';

export default function SpaceHistoryPage() {
  const [rows, setRows] = useState<VisitRecord[]>([]);

  useEffect(() => {
    setRows(readVisitHistory());
  }, []);

  return (
    <main className="admin-main">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">History</h1>
          <p className="mt-1 text-sm text-gray-600">Pages you recently opened on Libertta.</p>
        </div>
        {rows.length > 0 ? (
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => {
              clearVisitHistory();
              setRows([]);
            }}
          >
            Clear history
          </button>
        ) : null}
      </div>

      <div className="admin-panel mt-8 overflow-hidden">
        <div className="admin-panel-header">{rows.length} visit{rows.length === 1 ? '' : 's'}</div>
        {rows.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">No browsing history yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {rows.map((row) => (
              <li key={`${row.href}-${row.at}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
                <Link href={row.href} className="text-sm font-medium text-black hover:text-[#2563eb]">
                  {row.title}
                </Link>
                <span className="text-xs text-gray-500">{new Date(row.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
