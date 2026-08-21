'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link, useRouter } from '@/i18n/routing';
import {
  Heart, Shield, Phone, AlertTriangle, Save, Loader2, AlertCircle, CheckCircle, User,
} from 'lucide-react';
import { fetchCurrentUser, getToken, updateProfile } from '@/lib/api/auth';

export default function PatientSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [patientData, setPatientData] = useState({
    bloodType: '',
    emergencyContact: '',
    allergies: [] as string[],
    insuranceProvider: '',
    insuranceNumber: '',
    insuranceGroupNumber: '',
  });

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchCurrentUser()
      .then((user) => {
        if (!user) {
          router.push('/login');
          return;
        }
        const insurance = (user.insuranceInfo || {}) as Record<string, string>;
        setPatientData({
          bloodType: user.bloodType || '',
          emergencyContact: user.emergencyContact || '',
          allergies: Array.isArray(user.allergies) ? user.allergies : [],
          insuranceProvider: insurance.provider || '',
          insuranceNumber: insurance.number || '',
          insuranceGroupNumber: insurance.groupNumber || '',
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setPatientData({
      ...patientData,
      allergies: [...patientData.allergies, newAllergy.trim()],
    });
    setNewAllergy('');
  };

  const handleRemoveAllergy = (index: number) => {
    setPatientData({
      ...patientData,
      allergies: patientData.allergies.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      await updateProfile({
        bloodType: patientData.bloodType || undefined,
        allergies: patientData.allergies,
        emergencyContact: patientData.emergencyContact || undefined,
        insuranceInfo: {
          provider: patientData.insuranceProvider,
          number: patientData.insuranceNumber,
          groupNumber: patientData.insuranceGroupNumber,
        },
      });
      setSuccess('Clinical settings saved');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="max-w-3xl mx-auto dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">Settings</h1>
            <p className="mt-1.5 text-sm font-medium text-gray-500">
              Clinical details shared securely with doctors on remote diagnostic requests
            </p>
          </div>
          <button
            type="button"
            className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 shrink-0"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        <Link
          href="/patient/profile"
          className="dash-form-panel p-4 flex items-center gap-3 hover:border-teal-300 transition-colors border border-transparent"
        >
          <div className="p-2.5 bg-teal-50 border border-teal-100">
            <User className="h-5 w-5 text-teal-700" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-950">Personal profile</p>
            <p className="text-xs font-medium text-gray-500">Name, phone, address — open profile page</p>
          </div>
          <span className="text-xs font-bold text-teal-700">Open →</span>
        </Link>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-sm font-medium flex gap-2.5">
            <CheckCircle className="w-5 h-5 shrink-0" /> {success}
          </div>
        )}

        <section className="dash-form-panel">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
              <Heart className="h-5 w-5 text-teal-700" /> Clinical profile
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Used for distance diagnostics</p>
          </div>
          <div className="px-5 sm:px-6 py-5 grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="bloodType" className="block text-[13px] font-semibold text-gray-900 mb-2">Blood type</label>
              <input
                id="bloodType"
                className="dash-form-input"
                value={patientData.bloodType}
                onChange={(e) => setPatientData({ ...patientData, bloodType: e.target.value })}
                placeholder="e.g. O+"
              />
            </div>
            <div>
              <label htmlFor="emergencyContact" className="block text-[13px] font-semibold text-gray-900 mb-2">Emergency contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="emergencyContact"
                  className="dash-form-input pl-10"
                  value={patientData.emergencyContact}
                  onChange={(e) => setPatientData({ ...patientData, emergencyContact: e.target.value })}
                  placeholder="Name and phone"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="dash-form-panel">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Allergies
            </h2>
          </div>
          <div className="px-5 sm:px-6 py-5 space-y-3">
            <div className="flex gap-2">
              <input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                className="dash-form-input"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
              />
              <button type="button" onClick={handleAddAllergy} className="dash-form-btn dash-form-btn-ghost px-4 py-2 text-sm shrink-0">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {patientData.allergies.length === 0 ? (
                <p className="text-sm font-medium text-gray-500">No allergies recorded</p>
              ) : (
                patientData.allergies.map((a, i) => (
                  <button
                    key={`${a}-${i}`}
                    type="button"
                    onClick={() => handleRemoveAllergy(i)}
                    className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200"
                  >
                    {a} ×
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="dash-form-panel">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-700" /> Insurance
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Optional — coverage context for clinicians</p>
          </div>
          <div className="px-5 sm:px-6 py-5 grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="insuranceProvider" className="block text-[13px] font-semibold text-gray-900 mb-2">Provider</label>
              <input
                id="insuranceProvider"
                className="dash-form-input"
                value={patientData.insuranceProvider}
                onChange={(e) => setPatientData({ ...patientData, insuranceProvider: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="insuranceNumber" className="block text-[13px] font-semibold text-gray-900 mb-2">Member ID</label>
              <input
                id="insuranceNumber"
                className="dash-form-input"
                value={patientData.insuranceNumber}
                onChange={(e) => setPatientData({ ...patientData, insuranceNumber: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="insuranceGroupNumber" className="block text-[13px] font-semibold text-gray-900 mb-2">Group number</label>
              <input
                id="insuranceGroupNumber"
                className="dash-form-input"
                value={patientData.insuranceGroupNumber}
                onChange={(e) => setPatientData({ ...patientData, insuranceGroupNumber: e.target.value })}
              />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
