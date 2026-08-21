'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link, useRouter } from '@/i18n/routing';
import { Calendar, User, Plus, Loader2, Video, AlertCircle } from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchPatientDashboard } from '@/lib/api/dashboard';
import { fetchPatientConsultations } from '@/lib/api/consultation';

export default function PatientAppointments() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    Promise.all([fetchPatientDashboard(), fetchPatientConsultations()])
      .then(([dash, consultations]) => {
        const upcoming = dash.upcomingAppointments || [];
        const fromConsults = (consultations || []).map((c: any) => ({
          id: c.id,
          doctor: c.doctor?.name || 'Manual Review',
          specialty: c.specialization,
          date: c.preferredDate || c.createdAt,
          type: c.consultationType,
          status: c.status,
          href: `/patient/consultations/${c.id}`,
        }));
        const merged = [...upcoming];
        for (const c of fromConsults) {
          if (!merged.some((m) => m.id === c.id)) merged.push(c);
        }
        setItems(merged);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <DashboardLayout role="patient">
      <div className="dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">My Appointments</h1>
            <p className="mt-1.5 text-sm font-medium text-gray-500">Scheduled visits and consultation requests</p>
          </div>
          <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Book / Request
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-700" /></div>
        ) : error ? (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        ) : items.length === 0 ? (
          <div className="dash-form-panel py-14 text-center px-6">
            <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500 mb-5">No appointments yet</p>
            <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex">
              Start a consultation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((appointment) => (
              <div key={appointment.id} className="dash-form-panel p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    <div className="p-3 bg-teal-50 border border-teal-100 h-fit shrink-0">
                      <User className="h-6 w-6 text-teal-700" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-950">{appointment.doctor}</h3>
                      <p className="text-sm font-medium text-gray-500">{appointment.specialty}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {appointment.date ? new Date(appointment.date).toLocaleString() : 'TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {appointment.type}
                        </span>
                      </div>
                      <span className="inline-block mt-2.5 text-[11px] font-bold px-2 py-1 bg-gray-50 border border-gray-200 text-gray-700">
                        {String(appointment.status).replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={appointment.href || '/patient/consultations'}
                    className="dash-form-btn dash-form-btn-ghost px-4 py-2 text-xs text-center shrink-0"
                  >
                    Open
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
