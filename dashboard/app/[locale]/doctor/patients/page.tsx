'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/i18n/routing';
import { Loader2, Search, User } from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchDoctorPatients } from '@/lib/api/dashboard';

export default function DoctorPatientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, followUp: 0 });
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchDoctorPatients()
      .then((data) => {
        setPatients(data.patients || []);
        setStats(data.stats || { total: 0, active: 0, followUp: 0 });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = patients.filter((p) =>
    `${p.name} ${p.email} ${p.condition}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DashboardLayout role="doctor">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Patients</h1>
        <p className="text-sm text-gray-500 mt-1">Patients from your consultation requests</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="border-gray-100"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-gray-500">Total</p></CardContent></Card>
        <Card className="border-gray-100"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">{stats.active}</p><p className="text-xs text-gray-500">Active</p></CardContent></Card>
        <Card className="border-gray-100"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">{stats.followUp}</p><p className="text-xs text-gray-500">Follow-up</p></CardContent></Card>
      </div>

      <Card className="mb-6 border-gray-100">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No patients yet. Accept consultation requests to build your list.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} className="border-gray-100">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg"><User className="h-5 w-5 text-teal-600" /></div>
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.condition} · {p.consultations} consult(s)</p>
                  </div>
                </div>
                <Badge className="text-xs">{p.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
