'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useRouter } from '@/i18n/routing';
import {
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  Settings,
  BarChart3,
  Stethoscope,
  Loader2,
} from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchAdminDashboard } from '@/lib/api/dashboard';

const statStyles = [
  { bg: 'bg-teal-50', icon: 'text-teal-600' },
  { bg: 'bg-blue-50', icon: 'text-blue-600' },
  { bg: 'bg-green-50', icon: 'text-green-600' },
  { bg: 'bg-purple-50', icon: 'text-purple-600' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchAdminDashboard()
      .then(setData)
      .catch((e) => setError(e.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [router]);

  const stats = [
    { label: 'Total Users', value: data?.stats?.totalUsers ?? '—', icon: Users },
    { label: 'Active Doctors', value: data?.stats?.activeDoctors ?? '—', icon: Stethoscope },
    {
      label: 'Monthly Revenue',
      value:
        data?.stats?.monthlyRevenue != null
          ? `$${Number(data.stats.monthlyRevenue).toLocaleString()}`
          : '—',
      icon: DollarSign,
    },
    { label: 'Consultations', value: data?.stats?.consultations ?? '—', icon: Activity },
  ];

  const quickActions = [
    { title: 'Manage Users', icon: Users, href: '/admin/users', color: 'bg-teal-600' },
    { title: 'Manage Doctors', icon: Stethoscope, href: '/admin/doctors', color: 'bg-blue-600' },
    { title: 'Analytics', icon: BarChart3, href: '/admin/dashboard', color: 'bg-purple-600' },
    { title: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-gray-700' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live metrics from BILLIANT backend</p>
        </div>
        <Link href="/admin/settings">
          <Button size="sm" className="bg-black hover:bg-gray-800 text-xs sm:text-sm">
            <Settings className="h-4 w-4 mr-1.5" />
            Settings
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center text-red-600">{error}</CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const style = statStyles[index];
              return (
                <Card key={stat.label} className="border-gray-100 shadow-sm">
                  <CardContent className="p-4 sm:pt-5">
                    <div className={`p-2 ${style.bg} rounded-xl w-fit mb-2`}>
                      <Icon className={`h-5 w-5 ${style.icon}`} />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href + action.title} href={action.href}>
                    <Card className="hover:shadow-md transition-all cursor-pointer border-gray-100">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className={`p-3 ${action.color} rounded-xl mb-2`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{action.title}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-teal-600" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data?.pendingActions || []).map((item: any) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.count} item(s)</p>
                    </div>
                    <Badge className={item.priority === 'high' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}>
                      {item.priority}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data?.recentActivities || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No recent activity.</p>
                ) : (
                  data.recentActivities.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.user}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(item.time).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
