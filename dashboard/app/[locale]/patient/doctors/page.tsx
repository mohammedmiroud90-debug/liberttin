'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link, useRouter } from '@/i18n/routing';
import { AvatarWithFallback } from '@/components/ui/avatar-with-fallback';
import { Calendar, Loader2, Star, Video, AlertCircle } from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import { fetchPatientDashboard } from '@/lib/api/dashboard';

export default function PatientDoctors() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchPatientDashboard()
      .then((data) => setDoctors(data.myDoctors || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <DashboardLayout role="patient">
      <div className="dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">My Doctors</h1>
            <p className="mt-1.5 text-sm font-medium text-gray-500">Clinicians from your remote diagnostic consultations</p>
          </div>
          <Link href="/doctors" className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm shrink-0 text-center">
            Find New Doctor
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-700" /></div>
        ) : error ? (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        ) : doctors.length === 0 ? (
          <div className="dash-form-panel py-14 text-center px-6">
            <p className="text-sm font-medium text-gray-500 mb-5">
              No doctors linked yet. Start a consultation to build your care team.
            </p>
            <Link href="/patient/consultation/new" className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex">
              New consultation
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="dash-form-panel p-5 flex gap-4">
                <AvatarWithFallback src={doctor.avatarUrl || null} alt={doctor.name} size={72} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-950">{doctor.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-1">{doctor.specialty}</p>
                  {doctor.bio && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{doctor.bio}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {typeof doctor.rating === 'number' && doctor.rating > 0 && (
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200">
                        <Star className="h-3 w-3 mr-1" /> {doctor.rating.toFixed(1)}
                      </span>
                    )}
                    {doctor.cases ? (
                      <span className="text-[11px] font-bold px-2 py-1 bg-white text-gray-700 border border-gray-200">
                        {doctor.cases} case(s)
                      </span>
                    ) : null}
                    {doctor.availableForOnline && (
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-1 bg-teal-50 text-teal-800 border border-teal-200">
                        <Video className="h-3 w-3 mr-1" /> Distance care
                      </span>
                    )}
                    {typeof doctor.consultationFee === 'number' && (
                      <span className="text-[11px] font-bold px-2 py-1 bg-white border border-gray-200 text-gray-700">
                        From ${doctor.consultationFee}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/patient/consultation/new?doctorId=${doctor.id}`}
                      className="dash-form-btn dash-form-btn-primary px-3 py-2 text-xs inline-flex items-center gap-1"
                    >
                      <Calendar className="h-3.5 w-3.5" /> Request care
                    </Link>
                    <Link href={`/patient/doctors/${doctor.id}`} className="dash-form-btn dash-form-btn-ghost px-3 py-2 text-xs">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
