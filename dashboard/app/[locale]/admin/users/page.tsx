'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/i18n/routing';
import { Loader2, Search, User } from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchAdminUsers, setUserActive } from '@/lib/api/dashboard';

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminUsers(role || undefined)
      .then((data) => setUsers(data.users || []))
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
  }, [router, role]);

  const filtered = users.filter((u) => {
    const hay = `${u.firstName} ${u.lastName} ${u.email} ${u.role}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  const toggleActive = async (id: string, isActive: boolean) => {
    await setUserActive(id, !isActive);
    load();
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-1">Patients, doctors, and admins from the live database</p>
      </div>

      <Card className="mb-6 border-gray-100">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All roles</option>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
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
          {filtered.map((u) => (
            <Card key={u.id} className="border-gray-100">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <User className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">{u.role}</Badge>
                  <Badge className={u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => toggleActive(u.id, u.isActive)}>
                    {u.isActive ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-500">No users found.</p>}
        </div>
      )}
    </DashboardLayout>
  );
}
