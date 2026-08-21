'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useRouter } from '@/i18n/routing';
import {
  Calendar,
  Video,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Stethoscope,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { getToken, getUser } from '@/lib/api/auth';
import { fetchDoctorDashboard } from '@/lib/api/dashboard';

const statStyles = [
  { bg: 'bg-teal-50', icon: 'text-teal-600' },
  { bg: 'bg-blue-50', icon: 'text-blue-600' },
  { bg: 'bg-green-50', icon: 'text-green-600' },
  { bg: 'bg-purple-50', icon: 'text-purple-600' },
];

export default function DoctorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchDoctorDashboard()
      .then(setData)
      .catch((e) => setError(e.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [router]);

  const user = getUser();
  const name =
    data?.profile?.firstName
      ? `Dr. ${data.profile.firstName} ${data.profile.lastName || ''}`.trim()
      : user?.firstName
        ? `Dr. ${user.firstName}`
        : 'Doctor';

  const stats = [
    { label: "Today's Patients", value: data?.stats?.todaysPatients ?? '—', icon: Users },
    { label: 'Pending Consultations', value: data?.stats?.pendingConsultations ?? '—', icon: Video },
    {
      label: "This Month's Earnings",
      value:
        data?.stats?.monthEarnings != null
          ? `$${Number(data.stats.monthEarnings).toLocaleString()}`
          : '—',
      icon: DollarSign,
    },
    {
      label: 'Patient Satisfaction',
      value: data?.stats?.rating != null ? Number(data.stats.rating).toFixed(1) : '—',
      icon: TrendingUp,
    },
  ];

  const quickActions = [
    { title: 'Consultations', icon: Video, href: '/doctor/consultations', color: 'bg-teal-600' },
    { title: 'Appointments', icon: Calendar, href: '/doctor/appointments', color: 'bg-blue-600' },
    { title: 'Patients', icon: FileText, href: '/doctor/patients', color: 'bg-purple-600' },
    { title: 'Diagnose', icon: Stethoscope, href: '/doctor/diagnose', color: 'bg-green-600' },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.stats?.pendingConsultations
            ? `${data.stats.pendingConsultations} consultation(s) need attention`
            : 'Your clinical workspace'}
        </p>
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
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Card className="hover:shadow-md transition-all cursor-pointer h-full border-gray-100">
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
                <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data?.todaySchedule || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No appointments scheduled for today.</p>
                ) : (
                  data.todaySchedule.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-sm">{item.patient}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {item.type}
                        </p>
                      </div>
                      <Badge className="text-xs">{item.status}</Badge>
                    </div>
                  ))
                )}
                <Link href="/doctor/appointments">
                  <Button variant="outline" className="w-full text-sm">
                    All Appointments <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Pending Consultations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data?.pendingConsultations || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No pending consultation requests.</p>
                ) : (
                  data.pendingConsultations.map((item: any) => (
                    <Link
                      key={item.id}
                      href="/doctor/consultations"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.patient}</p>
                        <p className="text-xs text-gray-500">{item.specialization}</p>
                      </div>
                      <Badge className="text-xs">{String(item.status).replace(/_/g, ' ')}</Badge>
                    </Link>
                  ))
                )}
                <Link href="/doctor/consultations">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-sm">Open Consultations</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  Patient Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
                    <p className="text-xs text-amber-700 font-medium">Overall Rating</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">
                      {data?.stats?.rating != null ? Number(data.stats.rating).toFixed(1) : '—'}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">Total Reviews</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {data?.stats?.totalReviews ?? '—'}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <p className="text-xs text-green-700 font-medium">Patients</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {data?.stats?.totalPatients ?? '—'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Your patients' feedback helps you maintain quality and improve your service. Visit your reviews section to see detailed feedback and respond to patient comments.
                </p>
                <Link href="/doctor/reviews">
                  <Button variant="outline" className="w-full text-sm">
                    View All Reviews <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
