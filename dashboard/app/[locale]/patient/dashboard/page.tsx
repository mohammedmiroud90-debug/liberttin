'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link, useRouter } from '@/i18n/routing';
import {
  Calendar, Video, FileText, Clock, Pill, User, CheckCircle2, ArrowRight, Plus, Loader2, AlertCircle,
} from 'lucide-react';
import { getToken, getUser } from '@/lib/api/auth';
import { fetchPatientDashboard } from '@/lib/api/dashboard';

export default function PatientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');

  const loadDashboard = () => {
    setLoading(true);
    setError('');
    fetchPatientDashboard()
      .then((dash) => {
        setData(dash);
        if (dash?.profile?.firstName) setFirstName(dash.profile.firstName);
      })
      .catch((e) => setError(e.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    const stored = getUser();
    if (stored?.firstName) setFirstName(stored.firstName);
    loadDashboard();
  }, [router]);

  const stats = [
    { label: 'Upcoming Appointments', value: data?.stats?.upcomingAppointments ?? '—', icon: Calendar },
    { label: 'Active Prescriptions', value: data?.stats?.activePrescriptions ?? '—', icon: Pill },
    { label: 'Consultations', value: data?.stats?.recentConsultations ?? '—', icon: Video },
    { label: 'Health Records', value: data?.stats?.healthRecords ?? '—', icon: FileText },
  ];

  return (
    <DashboardLayout role="patient">
      <div className="dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">
            Welcome back{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-gray-500">Your health overview</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
          </div>
        ) : error ? (
          <div className="dash-form-panel p-6 sm:p-8 text-center space-y-4">
            <div className="inline-flex p-3 bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-red-700">Dashboard data unavailable</p>
            <p className="text-sm font-medium text-gray-600 max-w-xl mx-auto">{error}</p>
            <button type="button" onClick={loadDashboard} className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="dash-form-panel p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5 leading-tight line-clamp-2">
                          {stat.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-950 tabular-nums">{stat.value}</p>
                      </div>
                      <div className="p-2 bg-teal-50 border border-teal-100 shrink-0">
                        <Icon className="h-5 w-5 text-teal-700" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:hidden">
              <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary py-3 text-sm text-center inline-flex items-center justify-center gap-1.5">
                <Plus className="h-4 w-4" /> New request
              </Link>
              <Link href="/patient/consultations" className="dash-form-btn dash-form-btn-ghost py-3 text-sm text-center inline-flex items-center justify-center gap-1.5">
                <Video className="h-4 w-4" /> My cases
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <section className="dash-form-panel">
                  <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-teal-700" /> Upcoming
                    </h2>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Scheduled visits and consultations</p>
                  </div>
                  <div className="px-5 sm:px-6 py-5">
                    {(data?.upcomingAppointments || []).length === 0 ? (
                      <p className="text-sm font-medium text-gray-500 py-3">No upcoming appointments. Start a consultation to get care.</p>
                    ) : (
                      <div className="space-y-3">
                        {data.upcomingAppointments.map((appointment: any) => (
                          <div
                            key={`${appointment.source}-${appointment.id}`}
                            className="flex flex-col gap-3 p-4 border border-gray-200 bg-gray-50/80 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex gap-3 min-w-0">
                              <div className="p-2.5 bg-teal-50 border border-teal-100 shrink-0">
                                <User className="h-5 w-5 text-teal-700" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-gray-950 truncate">{appointment.doctor}</h4>
                                <p className="text-xs font-medium text-gray-500">{appointment.specialty}</p>
                                <p className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(appointment.date).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                  })}
                                </p>
                                <span className="inline-block mt-2 text-[11px] font-bold px-2 py-1 bg-white border border-gray-200 text-gray-700">
                                  {appointment.type}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={appointment.href || '/patient/consultations'}
                              className="dash-form-btn dash-form-btn-ghost px-4 py-2 text-xs text-center shrink-0"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="hidden sm:grid grid-cols-2 gap-2 mt-5">
                      <Link href="/patient/appointments" className="dash-form-btn dash-form-btn-primary py-2.5 text-sm text-center inline-flex items-center justify-center gap-1">
                        View Appointments <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-ghost py-2.5 text-sm text-center inline-flex items-center justify-center gap-1">
                        <Plus className="h-4 w-4" /> New Consultation
                      </Link>
                    </div>
                  </div>
                </section>

                <section className="dash-form-panel">
                  <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-950">Recent Consultations</h2>
                  </div>
                  <div className="px-5 sm:px-6 py-5 space-y-3">
                    {(data?.recentConsultations || []).length === 0 ? (
                      <p className="text-sm font-medium text-gray-500">No consultations yet.</p>
                    ) : (
                      data.recentConsultations.map((c: any) => (
                        <Link
                          key={c.id}
                          href={c.href}
                          className="block p-4 border border-gray-200 bg-gray-50/80 hover:border-teal-300 transition-colors space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-gray-950 truncate">{c.doctor}</p>
                              <p className="text-xs font-medium text-gray-500">{c.specialty}</p>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-1 bg-white border border-gray-200 text-gray-700 shrink-0">
                              {String(c.status).replace(/_/g, ' ')}
                            </span>
                          </div>
                          {c.doctorResponse && (
                            <p className="text-[11px] font-medium text-teal-800 line-clamp-2">{c.doctorResponse}</p>
                          )}
                          {c.meetingUrl && (
                            <p className="text-[11px] font-bold text-teal-700">Meeting link ready</p>
                          )}
                        </Link>
                      ))
                    )}
                    <Link href="/patient/consultations" className="dash-form-btn dash-form-btn-ghost w-full py-2.5 text-sm text-center block mt-1">
                      All Consultations
                    </Link>
                  </div>
                </section>
              </div>

              <div className="space-y-5">
                <section className="dash-form-panel">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-950">Quick Actions</h2>
                  </div>
                  <div className="p-4 space-y-2">
                    <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary w-full py-2.5 text-sm inline-flex items-center justify-start gap-2 px-3">
                      <Plus className="h-4 w-4" /> New Consultation
                    </Link>
                    <Link href="/patient/doctors" className="dash-form-btn dash-form-btn-ghost w-full py-2.5 text-sm inline-flex items-center justify-start gap-2 px-3">
                      <User className="h-4 w-4" /> My Doctors
                    </Link>
                    <Link href="/patient/medical-records" className="dash-form-btn dash-form-btn-ghost w-full py-2.5 text-sm inline-flex items-center justify-start gap-2 px-3">
                      <FileText className="h-4 w-4" /> Medical Records
                    </Link>
                    <Link href="/patient/settings" className="dash-form-btn dash-form-btn-ghost w-full py-2.5 text-sm inline-flex items-center justify-start gap-2 px-3">
                      <Clock className="h-4 w-4" /> Settings
                    </Link>
                  </div>
                </section>

                <section className="dash-form-panel">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-950">My Doctors</h2>
                  </div>
                  <div className="p-4 space-y-2">
                    {(data?.myDoctors || []).length === 0 ? (
                      <p className="text-sm font-medium text-gray-500">Doctors will appear after you request care.</p>
                    ) : (
                      data.myDoctors.map((d: any) => (
                        <div key={d.id} className="flex items-center gap-3 p-3 border border-gray-200 bg-gray-50/80">
                          <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-950 truncate">{d.name}</p>
                            <p className="text-xs font-medium text-gray-500 truncate">{d.specialty}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
