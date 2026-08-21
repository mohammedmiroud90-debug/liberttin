'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Pill, Calendar, User, Download, RefreshCw } from 'lucide-react';

export default function PrescriptionsPage() {
  const prescriptions = [
    {
      id: '1',
      medication: 'Lisinopril 10mg',
      dosage: 'Once daily',
      duration: '30 days',
      prescribedBy: 'Dr. Sarah Johnson',
      date: '2026-08-05',
      refills: 2,
      status: 'active',
      instructions: 'Take in the morning with or without food',
    },
    {
      id: '2',
      medication: 'Metformin 500mg',
      dosage: 'Twice daily',
      duration: '90 days',
      prescribedBy: 'Dr. Emily Rodriguez',
      date: '2026-07-20',
      refills: 3,
      status: 'active',
      instructions: 'Take with meals to reduce stomach upset',
    },
    {
      id: '3',
      medication: 'Amoxicillin 500mg',
      dosage: 'Three times daily',
      duration: '7 days',
      prescribedBy: 'Dr. Michael Chen',
      date: '2026-07-10',
      refills: 0,
      status: 'completed',
      instructions: 'Complete full course even if symptoms improve',
    },
  ];

  const statusStyle: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200',
    cancelled: 'bg-red-50 text-red-900 border-red-200',
  };

  const activeCount = prescriptions.filter((p) => p.status === 'active').length;
  const refillCount = prescriptions.reduce((sum, p) => sum + p.refills, 0);

  return (
    <DashboardLayout role="patient">
      <div className="dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">My Prescriptions</h1>
          <p className="mt-1.5 text-sm font-medium text-gray-500">View and manage your prescribed medications</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Active Prescriptions', value: activeCount, icon: Pill },
            { label: 'Refills Available', value: refillCount, icon: RefreshCw },
            { label: 'Total Prescriptions', value: prescriptions.length, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="dash-form-panel p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">{label}</p>
                  <p className="text-3xl font-bold text-gray-950 tabular-nums">{value}</p>
                </div>
                <div className="p-2.5 bg-teal-50 border border-teal-100">
                  <Icon className="h-5 w-5 text-teal-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="dash-form-panel p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="p-2 bg-teal-50 border border-teal-100">
                      <Pill className="h-5 w-5 text-teal-700" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-950 text-lg leading-tight">{prescription.medication}</h3>
                      <p className="text-sm font-medium text-gray-500">
                        {prescription.dosage} for {prescription.duration}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-1 border capitalize ${statusStyle[prescription.status]}`}>
                      {prescription.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Prescribed by: {prescription.prescribedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Date: {prescription.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                        <span>Refills remaining: {prescription.refills}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-950 mb-1">Instructions</p>
                      <p className="text-sm font-medium text-gray-500">{prescription.instructions}</p>
                    </div>
                  </div>

                  {prescription.status === 'active' && prescription.refills === 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-3">
                      <p className="text-sm font-medium text-amber-900">
                        No refills remaining. Contact your doctor if you need to continue this medication.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:min-w-[140px]">
                  <button type="button" className="dash-form-btn dash-form-btn-ghost px-3 py-2 text-xs inline-flex items-center justify-center gap-1.5">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  {prescription.status === 'active' && prescription.refills > 0 && (
                    <button type="button" className="dash-form-btn dash-form-btn-primary px-3 py-2 text-xs">
                      Request Refill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
