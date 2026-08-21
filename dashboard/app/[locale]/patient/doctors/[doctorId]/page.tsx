'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DoctorReviewsDisplay } from '@/components/doctor/DoctorReviewsDisplay';
import { DoctorRatingStats } from '@/components/doctor/DoctorRatingStats';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, Loader2, AlertCircle, Video, Award } from 'lucide-react';
import { getToken } from '@/lib/api/auth';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  rating: number;
  totalReviews: number;
  consultationFee: number;
  experienceYears: number;
  languages?: string[];
  qualifications?: string[];
  availableForOnline: boolean;
}

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to load doctor profile');
      const data = await response.json();
      setDoctor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !doctor) {
    return (
      <DashboardLayout role="patient">
        <Link href="/patient/doctors" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to My Doctors
        </Link>
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || 'Doctor profile not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/patient/doctors" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> My Doctors
        </Link>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Doctor Details */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
              <p className="text-lg text-teal-600 font-semibold mt-1">{doctor.specialty}</p>

              {doctor.bio && (
                <p className="text-gray-600 mt-3 leading-relaxed">{doctor.bio}</p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-teal-50 rounded-lg p-3">
                  <p className="text-xs text-teal-700 font-medium">Experience</p>
                  <p className="text-lg font-bold text-teal-900 mt-1">{doctor.experienceYears}+ years</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-amber-700 font-medium">Rating</p>
                  <p className="text-lg font-bold text-amber-900 mt-1">{doctor.rating.toFixed(1)} ★</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-2 mt-4">
                {doctor.availableForOnline && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full">
                    <Video className="w-3.5 h-3.5" /> Online Consultations
                  </span>
                )}
                {doctor.consultationFee && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full">
                    <Award className="w-3.5 h-3.5" /> From ${doctor.consultationFee}
                  </span>
                )}
              </div>

              {/* Qualifications */}
              {doctor.qualifications && doctor.qualifications.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Qualifications</p>
                  <ul className="space-y-1">
                    {doctor.qualifications.map((qual, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-teal-600 font-bold mt-0.5">•</span>
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {doctor.languages && doctor.languages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((lang, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Link
                href={`/patient/consultation/new?doctorId=${doctor.id}`}
                className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" /> Request Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Rating Statistics */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Rating & Feedback</h2>
          <DoctorRatingStats doctorId={doctorId} />
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Reviews</h2>
          <DoctorReviewsDisplay doctorId={doctorId} isOwnProfile={false} />
        </div>
      </div>
    </DashboardLayout>
  );
}
