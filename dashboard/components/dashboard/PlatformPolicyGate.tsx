'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { X, Loader2 } from 'lucide-react';
import { acceptPlatformPolicies, fetchCurrentUser, getToken, getUser, storeUser } from '@/lib/api/auth';

const STORAGE_KEY = 'billiant_platform_policies_v1';

const POLICIES = [
  {
    title: 'Distance diagnostics only',
    text: 'BILLIANT is a remote file-and-media diagnostic platform. Care is delivered through encrypted uploads, clinician review, and secure meeting links — not walk-in clinics.',
  },
  {
    title: 'Encrypted medical media',
    text: 'Medical files (PDF, images, documents) are encrypted in transit and at rest. Only the assigned clinician and you can access case materials for an active request.',
  },
  {
    title: 'Doctor feedback & status tracking',
    text: 'You will see request status, clinician feedback, quoted fees, diagnostic reports, and any secure meeting URL on your consultation page.',
  },
  {
    title: 'Meeting links & privacy',
    text: 'When a doctor shares a meeting URL, join only from your BILLIANT account context. Do not forward links or files outside the platform.',
  },
];

export function PlatformPolicyGate({ role }: { role: 'patient' | 'doctor' | 'admin' }) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(role !== 'admin');
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'admin') return;

    let cancelled = false;
    (async () => {
      try {
        const local = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        const user = await fetchCurrentUser();
        if (cancelled) return;

        if (user?.platformPoliciesAcceptedAt) {
          localStorage.setItem(STORAGE_KEY, String(user.platformPoliciesAcceptedAt));
          setOpen(false);
        } else if (local) {
          // API/DB may be down — keep prior local acceptance so the workspace stays usable
          setOpen(false);
        } else {
          setOpen(true);
        }
      } catch {
        const local = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (!cancelled) setOpen(!local);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role]);

  if (role === 'admin' || checking || !open) return null;

  const allChecked = POLICIES.every((_, i) => checked[i]);

  const accept = async () => {
    if (!allChecked || saving) return;
    setSaving(true);
    setError('');
    try {
      if (!getToken()) {
        setError('Please sign in again to accept policies.');
        return;
      }

      try {
        const data = await acceptPlatformPolicies();
        const acceptedAt = data.platformPoliciesAcceptedAt || new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, acceptedAt);
      } catch (apiError: unknown) {
        // Backend/DB unreachable — still unlock the workspace locally
        const acceptedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, acceptedAt);
        const current = getUser() || {};
        storeUser({ ...current, platformPoliciesAcceptedAt: acceptedAt });
        console.warn('Policy accept saved locally; API sync failed:', apiError);
      }

      setOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save policy acceptance');
    } finally {
      setSaving(false);
    }
  };

  const closeAndLeave = () => {
    setOpen(false);
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#f2f2f2] text-black shadow-sm">
        <button
          type="button"
          onClick={closeAndLeave}
          className="absolute top-3 right-3 z-10 p-2 text-gray-600 hover:text-gray-900"
          aria-label="Close policies"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="p-5 md:p-6 pr-12">
          <p className="text-xs text-gray-500 mb-1">Required before continuing</p>
          <h2 className="text-xl font-bold text-[#0066cc] leading-tight mb-2">
            {role === 'doctor' ? 'Clinician platform policies' : 'Patient platform policies'}
          </h2>
          <p className="text-sm text-gray-700 mb-5 leading-snug">
            Accept these distance-care rules to use consultations, encrypted uploads, and meeting links.
          </p>

          <ul className="space-y-3 max-h-[45vh] overflow-y-auto">
            {POLICIES.map((policy, index) => (
              <li key={policy.title}>
                <label className="flex gap-2.5 cursor-pointer items-start">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#0066cc]"
                    checked={!!checked[index]}
                    onChange={(e) => setChecked({ ...checked, [index]: e.target.checked })}
                  />
                  <span className="min-w-0">
                    <span
                      className={`block text-sm leading-snug ${
                        checked[index]
                          ? 'text-[#0066cc] underline underline-offset-2 decoration-[#0066cc] font-semibold'
                          : 'underline underline-offset-2 decoration-gray-900 text-gray-900'
                      }`}
                    >
                      {policy.title}
                    </span>
                    <span className="block text-xs text-gray-600 mt-1 leading-relaxed">{policy.text}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="button"
              disabled={!allChecked || saving}
              onClick={accept}
              className="w-full py-2.5 text-sm font-semibold underline underline-offset-2 decoration-gray-900 disabled:opacity-40 disabled:no-underline hover:text-[#0066cc] hover:decoration-[#0066cc] transition-colors text-left"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : (
                'I understand and accept — continue'
              )}
            </button>
            <p className="text-[11px] text-gray-500">
              You must accept all policies to use the {role} workspace.{' '}
              <Link href="/" className="underline hover:text-[#0066cc]" onClick={() => setOpen(false)}>
                Return home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
