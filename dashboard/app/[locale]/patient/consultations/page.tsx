'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link } from '@/i18n/routing';
import { Calendar, Clock, User, FileText, Plus, Loader2, ArrowRight, Video, MessageSquare } from 'lucide-react';
import { fetchPatientConsultations } from '@/lib/api/consultation';
import { getToken } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-900 border-amber-200',
  ACCEPTED: 'bg-blue-50 text-blue-900 border-blue-200',
  IN_REVIEW: 'bg-violet-50 text-violet-900 border-violet-200',
  AWAITING_PAYMENT: 'bg-orange-50 text-orange-900 border-orange-200',
  PAID: 'bg-teal-50 text-teal-900 border-teal-200',
  REPORT_READY: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  REJECTED: 'bg-red-50 text-red-900 border-red-200',
};

export default function ConsultationsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    fetchPatientConsultations()
      .then(setConsultations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <DashboardLayout role="patient">
      <div className="dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">My Consultations</h1>
            <p className="mt-1.5 text-sm font-medium text-gray-500">Track your remote diagnostic requests</p>
          </div>
          <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 shrink-0">
            <Plus className="w-4 h-4" /> New Request
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-700" /></div>
        ) : consultations.length === 0 ? (
          <div className="dash-form-panel py-14 text-center px-6">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-medium text-gray-500 mb-5">No consultation requests yet</p>
            <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex">
              Start Remote Consultation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.map((c) => (
              <div key={c.id} className="dash-form-panel p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold px-2 py-1 border ${STATUS_COLORS[c.status] || 'bg-gray-50 text-gray-800 border-gray-200'}`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-medium text-gray-500">{c.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-teal-700" />
                      <h3 className="font-bold text-gray-950">{c.doctor?.name || 'Manual Review'}</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-600 line-clamp-2">{c.reason?.replace(/<[^>]*>/g, ' ')}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(c.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.consultationType}</span>
                      {c.quotedPrice && <span className="font-bold text-teal-700">${c.quotedPrice.toFixed(2)}</span>}
                    </div>
                    {c.doctorResponse && (
                      <p className="mt-2 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-1.5 line-clamp-2 flex gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {c.doctorResponse}
                      </p>
                    )}
                    {c.meetingUrl && (
                      <a
                        href={c.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Video className="w-3.5 h-3.5" /> Join meeting
                      </a>
                    )}
                  </div>
                  <Link
                    href={`/patient/consultations/${c.id}`}
                    className="dash-form-btn dash-form-btn-ghost px-4 py-2 text-xs inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
                  >
                    {c.status === 'ACCEPTED' || c.status === 'IN_REVIEW'
                      ? 'Upload Records'
                      : c.status === 'AWAITING_PAYMENT'
                        ? 'Pay Now'
                        : c.status === 'REPORT_READY'
                          ? 'View Report'
                          : 'View status'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
