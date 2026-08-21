'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/i18n/routing';
import { Loader2, Search, CheckCircle, XCircle, Star } from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchAdminDoctors, verifyDoctor } from '@/lib/api/dashboard';

export default function AdminDoctorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminDoctors(status)
      .then((data) => setDoctors(data.doctors || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, status]);

  const filtered = doctors.filter((d) =>
    `${d.name} ${d.email} ${d.specialty}`.toLowerCase().includes(query.toLowerCase()),
  );

  const toggleVerify = async (id: string, verified: boolean) => {
    await verifyDoctor(id, !verified);
    load();
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Doctors</h1>
        <p className="text-sm text-gray-500 mt-1">Verify providers and review consultation volume</p>
      </div>

      <Card className="mb-6 border-gray-100">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <Card key={d.id} className="border-gray-100">
              <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="text-xs">{d.specialty}</Badge>
                    <Badge className={d.verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-800'}>
                      {d.verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Star className="h-3 w-3" /> {d.rating || 0}
                    </span>
                    <span className="text-xs text-gray-500">{d.consultations} consultations</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={d.verified ? 'outline' : 'default'}
                  className={!d.verified ? 'bg-teal-600 hover:bg-teal-700' : ''}
                  onClick={() => toggleVerify(d.id, d.verified)}
                >
                  {d.verified ? (
                    <>
                      <XCircle className="h-4 w-4 mr-1" /> Unverify
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" /> Verify
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-500">No doctors found.</p>}
        </div>
      )}
    </DashboardLayout>
  );
}
