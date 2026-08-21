'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ReviewSubmissionForm } from '@/components/consultation/ReviewSubmissionForm';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft, Upload, Lock, FileText, X, CreditCard, CheckCircle2,
  Clock, AlertCircle, Loader2, Shield, Download, Video, MessageSquare, ExternalLink,
} from 'lucide-react';
import {
  fetchConsultationById, submitDocuments, uploadConsultationFiles,
  payForConsultation, fetchReport, downloadConsultationFile,
} from '@/lib/api/consultation';
import { getToken } from '@/lib/api/auth';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Awaiting Doctor', color: 'bg-yellow-100 text-yellow-800' },
  ACCEPTED: { label: 'Upload Documents', color: 'bg-blue-100 text-blue-800' },
  IN_REVIEW: { label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
  AWAITING_PAYMENT: { label: 'Payment Required', color: 'bg-orange-100 text-orange-800' },
  PAID: { label: 'Paid — Report Pending', color: 'bg-teal-100 text-teal-800' },
  REPORT_READY: { label: 'Report Ready', color: 'bg-green-100 text-green-800' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Declined', color: 'bg-red-100 text-red-800' },
};

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [consultation, setConsultation] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    load();
  }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchConsultationById(id);
      setConsultation(data);
      setDescriptionHtml(data.descriptionHtml || '');
      if (data.status === 'REPORT_READY' || data.status === 'COMPLETED') {
        try {
          const r = await fetchReport(id);
          setReport(r);
        } catch { /* not ready */ }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleSubmitDocuments = async () => {
    if (!descriptionHtml.trim() || descriptionHtml === '<br>') {
      setError('Please provide a detailed description');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      if (files.length > 0) await uploadConsultationFiles(id, files);
      await submitDocuments(id, descriptionHtml);
      await load();
      setFiles([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    try {
      setSubmitting(true);
      await payForConsultation(id);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!consultation) {
    return (
      <DashboardLayout role="patient">
        <p className="text-center text-gray-500 py-12">Consultation not found</p>
      </DashboardLayout>
    );
  }

  const statusInfo = STATUS_LABELS[consultation.status] || { label: consultation.status, color: 'bg-gray-100 text-gray-800' };

  return (
    <DashboardLayout role="patient">
      <div className="max-w-3xl mx-auto">
        <Link href="/patient/consultations" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> My Consultations
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{consultation.specialization} Consultation</h1>
            <p className="text-sm text-gray-500 mt-1">
              {consultation.doctor?.name || 'Manual review — awaiting specialist'}
            </p>
          </div>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Workflow steps indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {['Request', 'Accepted', 'Review & Pay', 'Report'].map((label, i) => {
            const active = ['PENDING', 'ACCEPTED', 'IN_REVIEW', 'AWAITING_PAYMENT', 'PAID', 'REPORT_READY', 'COMPLETED'].indexOf(consultation.status) >= i;
            return (
              <div key={label} className={`p-2 sm:p-3 rounded-lg text-center text-xs font-medium border ${
                active ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}>
                {active ? <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-teal-600" /> : <Clock className="w-4 h-4 mx-auto mb-1" />}
                {label}
              </div>
            );
          })}
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-xl border p-5 mb-6 text-sm space-y-2">
          <p><span className="text-gray-500">Type:</span> <span className="font-medium">{consultation.consultationType}</span></p>
          <p><span className="text-gray-500">Summary:</span> {consultation.reason}</p>
          {consultation.quotedPrice && (
            <p><span className="text-gray-500">Quoted price:</span> <span className="font-bold text-teal-700">${consultation.quotedPrice.toFixed(2)}</span></p>
          )}
          {consultation.files?.length > 0 && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <p className="flex items-center gap-1 text-gray-600">
                <Lock className="w-3.5 h-3.5" /> {consultation.files.length} encrypted file(s) on this case
              </p>
              <ul className="space-y-1.5">
                {consultation.files.map((f: { id: string; fileName: string; fileType?: string }) => (
                  <li key={f.id} className="flex items-center justify-between gap-2 text-xs bg-gray-50 rounded-lg px-2.5 py-2">
                    <span className="truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 shrink-0" /> {f.fileName}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={async () => {
                        try {
                          await downloadConsultationFile(f.id, f.fileName);
                        } catch (err: unknown) {
                          setError(err instanceof Error ? err.message : 'Download failed');
                        }
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" /> Secure download
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Doctor feedback + meeting link — always visible when present */}
        {(consultation.doctorResponse || consultation.meetingUrl) && (
          <div className="bg-white rounded-xl border border-teal-100 p-5 mb-6 space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Doctor feedback & access
            </h2>
            {consultation.doctorResponse && (
              <div className="p-4 rounded-lg bg-teal-50 text-sm text-teal-900 leading-relaxed">
                {consultation.doctorResponse}
                {consultation.doctorRespondedAt && (
                  <p className="text-xs text-teal-700/80 mt-2">
                    Updated {new Date(consultation.doctorRespondedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
            {consultation.meetingUrl && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Secure meeting link</p>
                    <p className="text-xs text-gray-500 break-all mt-1">{consultation.meetingUrl}</p>
                  </div>
                </div>
                <a href={consultation.meetingUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    Join meeting <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}

        {/* ACCEPTED / IN_REVIEW: Upload step */}
        {(consultation.status === 'ACCEPTED' || consultation.status === 'IN_REVIEW') && (
          <div className="bg-white rounded-xl border p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              <h2 className="font-bold text-gray-900">Upload Encrypted Records</h2>
            </div>
            <p className="text-sm text-gray-500">
              {consultation.status === 'IN_REVIEW'
                ? 'Case is under review — you can still add encrypted medical media or update your clinical description.'
                : 'Your doctor accepted your request. Upload medical media and provide a detailed clinical description.'}
            </p>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Clinical Description (Rich Editor)</label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} placeholder="Describe symptoms, history, medications, allergies..." />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Medical Files (AES-256 Encrypted)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-3">PDF, DOCX, JPG, PNG — max 10MB each</p>
                <input type="file" multiple accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={handleFileAdd} className="hidden" id="file-up" />
                <label htmlFor="file-up" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
                  Choose Files
                </label>
              </div>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {f.name}</span>
                      <button onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="w-4 h-4 text-red-500" /></button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Files encrypted end-to-end — no unauthorized access</p>
            </div>

            <Button onClick={handleSubmitDocuments} disabled={submitting} className="w-full bg-teal-600 hover:bg-teal-700">
              {submitting ? 'Uploading...' : 'Submit for Doctor Review'}
            </Button>
          </div>
        )}

        {/* PENDING */}
        {consultation.status === 'PENDING' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
            Your request is pending. You will receive a notification when a doctor accepts.
          </div>
        )}

        {/* AWAITING_PAYMENT */}
        {consultation.status === 'AWAITING_PAYMENT' && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-600" /> Price Approval</h2>
            <p className="text-sm text-gray-600">Your doctor has reviewed your case and quoted the following fee for the complete diagnostic report:</p>
            <p className="text-3xl font-bold text-gray-900">${consultation.quotedPrice?.toFixed(2)}</p>
            <Button onClick={handlePay} disabled={submitting} className="w-full bg-teal-600 hover:bg-teal-700">
              {submitting ? 'Processing...' : 'Pay & Unlock Report'}
            </Button>
          </div>
        )}

        {/* PAID - waiting */}
        {consultation.status === 'PAID' && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-sm text-teal-800">
            Payment received. Your doctor is preparing your complete diagnostic report in PDF format.
          </div>
        )}

        {(consultation.status === 'REPORT_READY' || consultation.status === 'COMPLETED') && report?.diagnosisReport && (
          <div className="bg-white rounded-xl border overflow-hidden mb-6 print:shadow-none" id="report-section">
            {/* Report header */}
            <div className="bg-teal-600 text-white px-5 py-4 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Clinical Diagnostic Report
              </h2>
              <Button
                size="sm"
                variant="secondary"
                className="text-teal-900"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-1" /> Export / Print
              </Button>
            </div>

            <div className="divide-y">
              {/* Issued by */}
              {report.doctor && (
                <div className="px-5 py-3 bg-gray-50 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                  <span>Physician: <strong className="text-gray-800">{report.doctor.name}</strong></span>
                  {report.doctor.specialization?.length > 0 && (
                    <span>Specialty: <strong className="text-gray-800">{report.doctor.specialization.join(', ')}</strong></span>
                  )}
                  {report.reportIssuedAt && (
                    <span>Issued: <strong className="text-gray-800">{new Date(report.reportIssuedAt).toLocaleString()}</strong></span>
                  )}
                </div>
              )}

              {/* Diagnosis */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase text-teal-700 mb-1.5 tracking-wide">Diagnosis / Clinical Impression</p>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{report.diagnosisReport}</p>
              </div>

              {/* Findings */}
              {report.reportFindings && (
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase text-teal-700 mb-1.5 tracking-wide">Clinical Findings</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{report.reportFindings}</p>
                </div>
              )}

              {/* Recommendations */}
              {report.reportRecommendations && (
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase text-teal-700 mb-1.5 tracking-wide">Recommendations</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{report.reportRecommendations}</p>
                </div>
              )}

              {/* Prescriptions */}
              {report.reportPrescriptions && Array.isArray(report.reportPrescriptions) && report.reportPrescriptions.length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase text-teal-700 mb-2 tracking-wide">Prescriptions</p>
                  <div className="space-y-2">
                    {report.reportPrescriptions.map((rx: { medication: string; dose: string; duration: string; instructions: string }, i: number) => (
                      <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm">
                        <p className="font-semibold text-gray-900">{rx.medication}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{rx.dose} · {rx.duration}</p>
                        {rx.instructions && <p className="text-gray-500 text-xs mt-0.5 italic">{rx.instructions}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up */}
              {report.reportFollowUp && (
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase text-teal-700 mb-1.5 tracking-wide">Follow-up Plan</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{report.reportFollowUp}</p>
                </div>
              )}

              {/* Meeting link */}
              {report.meetingUrl && (
                <div className="px-5 py-4">
                  <a
                    href={report.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline"
                  >
                    <Video className="w-4 h-4" /> Follow-up meeting link
                  </a>
                </div>
              )}

              {/* Disclaimer */}
              <div className="px-5 py-3 bg-gray-50">
                <p className="text-xs text-gray-400 italic">
                  This report was prepared by a verified physician on the Billiant platform. It is intended for the named patient only.
                  Keep this report secure and share it only with healthcare providers involved in your care.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Review Section - Show after report is ready */}
        {(consultation.status === 'REPORT_READY' || consultation.status === 'COMPLETED') && !reviewSubmitted && (
          <ReviewSubmissionForm
            consultationRequestId={id}
            doctorName={consultation.doctor?.name || 'Your Doctor'}
            onSuccess={() => {
              setReviewSubmitted(true);
              load(); // Refresh to update consultation status if needed
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
