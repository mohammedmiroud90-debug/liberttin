'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { getToken } from '@/lib/api/auth';

interface MedicalRecord {
  id: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  notes?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    fetch('/api/records/medical', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load records');
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout role="patient">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-sm text-gray-500 mt-1">
          Records added by your verified physicians during consultations
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      )}

      {error && (
        <div className="flex gap-2 items-center p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {!loading && records.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FileText className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No medical records yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Records will appear here once a verified physician adds them after a consultation.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">{record.diagnosis}</h3>
              <span className="text-xs text-gray-400">
                {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>

            {record.symptoms.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {record.symptoms.map((s, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="text-gray-500 text-xs font-semibold uppercase">Treatment:</span> {record.treatment}</p>
              {record.notes && (
                <p><span className="text-gray-500 text-xs font-semibold uppercase">Notes:</span> {record.notes}</p>
              )}
            </div>

            {record.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500 mb-1">Attachments</p>
                <ul className="space-y-1">
                  {record.attachments.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-700 underline hover:text-teal-900"
                      >
                        Attachment {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
