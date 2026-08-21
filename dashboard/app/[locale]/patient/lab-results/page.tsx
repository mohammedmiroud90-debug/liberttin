'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FlaskConical, Download, Calendar, FileText } from 'lucide-react';

export default function PatientLabResults() {
  const labResults = [
    {
      id: '1',
      testName: 'Complete Blood Count (CBC)',
      date: '2026-08-05',
      orderedBy: 'Dr. Sarah Johnson',
      status: 'completed',
      results: 'Normal',
    },
    {
      id: '2',
      testName: 'Lipid Panel',
      date: '2026-07-28',
      orderedBy: 'Dr. Sarah Johnson',
      status: 'completed',
      results: 'Normal',
    },
    {
      id: '3',
      testName: 'Thyroid Function Test',
      date: '2026-08-10',
      orderedBy: 'Dr. Emily Rodriguez',
      status: 'pending',
      results: 'Pending',
    },
    {
      id: '4',
      testName: 'Vitamin D Level',
      date: '2026-07-15',
      orderedBy: 'Dr. Sarah Johnson',
      status: 'completed',
      results: 'Low',
    },
  ];

  const resultStyle = (result: string) => {
    if (result === 'Normal') return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (result === 'Low') return 'bg-amber-50 text-amber-900 border-amber-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <DashboardLayout role="patient">
      <div className="dash-form-shell space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">Lab Results</h1>
          <p className="mt-1.5 text-sm font-medium text-gray-500">View and download your laboratory test results</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Completed', value: labResults.filter((r) => r.status === 'completed').length },
            { label: 'Pending', value: labResults.filter((r) => r.status === 'pending').length },
            { label: 'Normal Results', value: labResults.filter((r) => r.results === 'Normal').length },
          ].map((s) => (
            <div key={s.label} className="dash-form-panel p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-950 tabular-nums">{s.value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {labResults.map((result) => (
            <div key={result.id} className="dash-form-panel p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="p-3 bg-teal-50 border border-teal-100 h-fit shrink-0">
                    <FlaskConical className="h-6 w-6 text-teal-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-950 mb-1">{result.testName}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">Ordered by {result.orderedBy}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {result.date}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-1 border capitalize ${
                        result.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {result.status}
                      </span>
                      {result.status === 'completed' && (
                        <span className={`text-[11px] font-bold px-2 py-1 border ${resultStyle(result.results)}`}>
                          {result.results}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {result.status === 'completed' ? (
                    <>
                      <button type="button" className="dash-form-btn dash-form-btn-ghost px-3 py-2 text-xs inline-flex items-center justify-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" /> View Report
                      </button>
                      <button type="button" className="dash-form-btn dash-form-btn-ghost px-3 py-2 text-xs inline-flex items-center justify-center gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-1 border bg-amber-50 text-amber-900 border-amber-200 text-center">
                      Awaiting Results
                    </span>
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
