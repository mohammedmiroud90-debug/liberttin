'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DoctorReviewsDisplay } from '@/components/doctor/DoctorReviewsDisplay';
import { DoctorRatingStats } from '@/components/doctor/DoctorRatingStats';
import { Loader2, AlertCircle } from 'lucide-react';
import { getToken, getUser } from '@/lib/api/auth';
import { fetchDoctorDashboard } from '@/lib/api/dashboard';

export default function DoctorReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    loadDoctorId();
  }, []);

  const loadDoctorId = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (user?.doctorId) {
        setDoctorId(user.doctorId);
      } else {
        setError('Doctor profile not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !doctorId) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patient Reviews & Feedback</h1>
          <p className="text-sm text-gray-600 mt-2">
            Read what your patients think about your consultations and respond to their feedback
          </p>
        </div>

        {/* Rating Statistics */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Rating Summary</h2>
          <DoctorRatingStats doctorId={doctorId} />
        </div>

        {/* Reviews List with integrated reply modal */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Reviews</h2>
          <DoctorReviewsDisplay
            doctorId={doctorId}
            isOwnProfile={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
