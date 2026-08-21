'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useRouter } from '@/i18n/routing';
import { Calendar, Loader2, User } from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchDoctorDashboard } from '@/lib/api/dashboard';

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchDoctorDashboard()
      .then((data) => {
        const schedule = data.todaySchedule || [];
        const pending = (data.pendingConsultations || []).map((c: any) => ({
          id: c.id,
          patient: c.patient,
          time: c.submitted,
          type: 'CONSULTATION',
          condition: c.specialization,
          status: c.status,
        }));
        setItems([...schedule, ...pending]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <DashboardLayout role="doctor">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Today&apos;s schedule and open consultation work</p>
        </div>
        <Link href="/doctor/consultations" className="text-sm font-semibold text-teal-700 underline">
          Open consultations inbox
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-gray-500">
            <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            No appointments yet. New consultation requests will appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((appt) => (
            <Card key={appt.id} className="border-gray-100">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg"><User className="h-5 w-5 text-teal-600" /></div>
                  <div>
                    <p className="font-semibold text-sm">{appt.patient}</p>
                    <p className="text-xs text-gray-500">
                      {appt.time ? new Date(appt.time).toLocaleString() : '—'} · {appt.type}
                    </p>
                    <p className="text-xs text-gray-500">{appt.condition}</p>
                  </div>
                </div>
                <Badge className="text-xs">{String(appt.status).replace(/_/g, ' ')}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
