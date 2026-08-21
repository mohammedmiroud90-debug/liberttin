'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft, ArrowRight, Check, AlertCircle, Shield, Lock,
  Video, MessageSquare, UserSearch, Stethoscope,
} from 'lucide-react';
import { createConsultationRequest } from '@/lib/api/consultation';
import { getToken } from '@/lib/api/auth';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface Doctor {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  consultationFee: number;
  experienceYears: number;
}

const STEPS = ['Request Type', 'Specialist', 'Details', 'Consent'];

function plainTextFromHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function NewConsultationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');
  const [step, setStep] = useState(1);
  const [requestType, setRequestType] = useState<'DOCTOR_SELECT' | 'MANUAL_REVIEW'>('DOCTOR_SELECT');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    specialization: '',
    consultationType: 'VIDEO',
    preferredDate: '',
    reason: '',
    consentAccepted: false,
    privacyPolicyAccepted: false,
    fileSharingConsent: false,
  });

  useEffect(() => {
    if (!getToken()) router.push('/login');
  }, [router]);

  useEffect(() => {
    if (!preselectedDoctorId) return;
    (async () => {
      try {
        const res = await fetch(`/api/doctors/${preselectedDoctorId}`);
        if (!res.ok) return;
        const data = await res.json();
        const d = data.doctor || data;
        if (!d?.id) return;
        setRequestType('DOCTOR_SELECT');
        setSelectedDoctor({
          id: d.id,
          name: d.name || `Dr. ${d.firstName || ''} ${d.lastName || ''}`.trim(),
          specialization: d.specialization || [],
          rating: d.rating || 0,
          consultationFee: d.consultationFee || 0,
          experienceYears: d.experienceYears || 0,
        });
        if (d.specialization?.[0]) {
          setForm((prev) => ({ ...prev, specialization: d.specialization[0] }));
        }
        setStep(2);
      } catch {
        /* optional preselect */
      }
    })();
  }, [preselectedDoctorId]);

  useEffect(() => {
    if (form.specialization && requestType === 'DOCTOR_SELECT') fetchDoctors();
  }, [form.specialization, requestType]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/doctors?specialization=${encodeURIComponent(form.specialization)}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) {
      if (!form.specialization) return false;
      if (requestType === 'DOCTOR_SELECT' && !selectedDoctor) return false;
      return true;
    }
    if (step === 3) return plainTextFromHtml(form.reason).length >= 10;
    if (step === 4) return form.consentAccepted && form.privacyPolicyAccepted && form.fileSharingConsent;
    return false;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await createConsultationRequest({
        requestType,
        doctorId: requestType === 'DOCTOR_SELECT' ? selectedDoctor?.id : undefined,
        specialization: form.specialization,
        consultationType: form.consultationType,
        preferredDate: form.preferredDate || undefined,
        reason: form.reason,
        consentAccepted: form.consentAccepted,
        privacyPolicyAccepted: form.privacyPolicyAccepted,
        fileSharingConsent: form.fileSharingConsent,
      });
      router.push(`/patient/consultations/${data.consultationRequestId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics',
    'Neurology', 'Psychiatry', 'Gynecology', 'Ophthalmology', 'General Medicine',
  ];

  const types = [
    { value: 'VIDEO', label: 'Video', icon: Video },
    { value: 'VOICE', label: 'Voice', icon: MessageSquare },
    { value: 'CHAT', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <DashboardLayout role="patient">
      <div className="max-w-3xl mx-auto dash-form-shell">
        <Link
          href="/patient/consultations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-teal-800 mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to consultations
        </Link>

        <div className="border-b border-gray-200 pb-5 mb-7">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">
            Remote Consultation Request
          </h1>
          <p className="mt-1.5 text-sm font-medium text-gray-500">
            Select a specialist or request manual review — upload encrypted records after acceptance
          </p>
        </div>

        {/* Progress — square steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold border-2 ${
                      done || active
                        ? 'bg-teal-700 border-teal-700 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    title={label}
                  >
                    {done ? <Check className="w-4 h-4" /> : n}
                  </div>
                  {n < STEPS.length && (
                    <div className={`flex-1 h-0.5 mx-1.5 sm:mx-2 ${step > n ? 'bg-teal-700' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="hidden sm:flex justify-between mt-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            {STEPS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        <div className="dash-form-panel p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-950 mb-1">How would you like to proceed?</h2>
              <p className="text-sm font-medium text-gray-500 mb-4">Choose one path to start your request</p>

              <button
                type="button"
                onClick={() => setRequestType('DOCTOR_SELECT')}
                className={`dash-choice p-5 ${requestType === 'DOCTOR_SELECT' ? 'is-active' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-6 h-6 text-teal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-950">Choose a Doctor</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      Browse verified specialists by specialty and send a direct request
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setRequestType('MANUAL_REVIEW'); setSelectedDoctor(null); }}
                className={`dash-choice p-5 ${requestType === 'MANUAL_REVIEW' ? 'is-active' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <UserSearch className="w-6 h-6 text-teal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-950">Manual Review</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                      Submit for specialist assignment — best available doctor will accept your case
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  {requestType === 'MANUAL_REVIEW' ? 'Select Specialty' : 'Choose Your Specialist'}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {requestType === 'MANUAL_REVIEW'
                    ? 'We will match you with an available clinician'
                    : 'Pick a specialty, then select a doctor'}
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-900 mb-2">Specialization</label>
                <select
                  value={form.specialization}
                  onChange={(e) => { setForm({ ...form, specialization: e.target.value }); setSelectedDoctor(null); }}
                  className="dash-form-input dash-form-select"
                >
                  <option value="">Select specialization</option>
                  {specializations.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {requestType === 'DOCTOR_SELECT' && form.specialization && (
                <div className="space-y-3">
                  {loading && <p className="text-sm font-medium text-gray-500">Loading doctors...</p>}
                  {!loading && doctors.length === 0 && (
                    <p className="text-sm font-medium text-gray-500 p-4 bg-gray-50 border border-gray-200">
                      No doctors found. Try manual review instead.
                    </p>
                  )}
                  {doctors.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDoctor(doc)}
                      className={`dash-choice p-4 ${selectedDoctor?.id === doc.id ? 'is-active' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-bold text-gray-950">{doc.name}</p>
                          <p className="text-xs font-medium text-gray-500 mt-1">
                            {doc.specialization?.join(', ')} · {doc.experienceYears}y exp · ★ {doc.rating}
                          </p>
                        </div>
                        <p className="text-teal-700 font-bold text-sm shrink-0">${doc.consultationFee}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-950">Consultation Details</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Tell us how and why you need care</p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-900 mb-2">Preferred format</label>
                <div className="grid grid-cols-3 gap-2">
                  {types.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, consultationType: value })}
                      className={`p-3.5 border-2 flex flex-col items-center gap-1.5 text-xs sm:text-sm font-bold ${
                        form.consultationType === value
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-gray-200 text-gray-700 hover:border-teal-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-teal-700" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-900 mb-2">
                  Preferred date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className="dash-form-input"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-900 mb-2">
                  Brief summary of your concern *
                </label>
                <RichTextEditor
                  compact
                  minHeight="120px"
                  value={form.reason}
                  onChange={(html) => setForm({ ...form, reason: html })}
                  placeholder="Describe symptoms, history, or reason for consultation (min. 10 characters)..."
                />
                <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                  Bold, lists, and short notes — full document upload comes after acceptance
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-950">Consent & Privacy</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Required before we submit your request</p>
              </div>

              {([
                { key: 'consentAccepted' as const, icon: Shield, title: 'Medical Consent', text: 'I consent to remote diagnostic review of my health information.' },
                { key: 'privacyPolicyAccepted' as const, icon: Lock, title: 'Privacy Policy', text: 'I have read and agree to the privacy policy and terms of service.' },
                { key: 'fileSharingConsent' as const, icon: Lock, title: 'Encrypted File Sharing', text: 'I consent to upload AES-256 encrypted medical records after doctor acceptance.' },
              ]).map(({ key, icon: Icon, title, text }) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    form[key] ? 'border-teal-700 bg-teal-50/60' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-teal-700 rounded-none"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-950">
                      <Icon className="w-4 h-4 text-teal-700" /> {title}
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">{text}</p>
                  </div>
                </label>
              ))}

              <div className="p-3.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed">
                After your doctor accepts, you will upload encrypted media and a detailed description using our rich editor.
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="dash-form-btn dash-form-btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-1 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-1"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canNext()}
                className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-1"
              >
                {loading ? 'Submitting...' : 'Submit Request'} <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
