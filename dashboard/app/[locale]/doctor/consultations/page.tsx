'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar, User, Check, X, Loader2, DollarSign, FileText, Lock, Video, Download,
  Sparkles, AlertTriangle, ChevronDown, ChevronUp, Plus, Trash2,
} from 'lucide-react';
import { getToken } from '@/lib/api/auth';
import {
  downloadConsultationFile, fetchAiCaseSummary, fetchAiReportDraft,
  submitConsultationReport, type StructuredReport,
} from '@/lib/api/consultation';

interface Prescription {
  medication: string;
  dose: string;
  duration: string;
  instructions: string;
}

interface ConsultationRequest {
  id: string;
  specialization: string;
  consultationType?: string;
  preferredDate?: string;
  reason: string;
  descriptionHtml?: string;
  status: string;
  paymentStatus?: string;
  quotedPrice?: number;
  createdAt?: string;
  patient?: { name: string };
  files?: { id: string; fileName: string }[];
  requestType?: string;
  meetingUrl?: string;
  doctorResponse?: string;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  IN_REVIEW: 'bg-purple-100 text-purple-800',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-800',
  PAID: 'bg-teal-100 text-teal-800',
  REPORT_READY: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const URGENCY_COLOR: Record<string, string> = {
  LOW: 'bg-green-50 text-green-700 border-green-200',
  MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  EMERGENCY: 'bg-red-50 text-red-700 border-red-200',
};

export default function DoctorConsultationsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [quoteModal, setQuoteModal] = useState<string | null>(null);
  const [reportModal, setReportModal] = useState<ConsultationRequest | null>(null);
  const [acceptModal, setAcceptModal] = useState<string | null>(null);
  const [aiSummaryModal, setAiSummaryModal] = useState<string | null>(null);

  // Form values
  const [quotePrice, setQuotePrice] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [doctorFeedback, setDoctorFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // AI state
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Structured report fields
  const [reportDiagnosis, setReportDiagnosis] = useState('');
  const [reportFindings, setReportFindings] = useState('');
  const [reportRecommendations, setReportRecommendations] = useState('');
  const [reportFollowUp, setReportFollowUp] = useState('');
  const [reportPrescriptions, setReportPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const token = getToken();
      const response = await fetch('/api/consultation-requests?role=doctor', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      setRequests(data.requests || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const authHeaders = () => {
    const token = getToken();
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const handleRespond = async (
    id: string,
    status: 'ACCEPTED' | 'REJECTED',
    extras?: { response?: string; meetingUrl?: string },
  ) => {
    setSubmitting(true);
    await fetch(`/api/consultation-requests/${id}/respond`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ status, ...extras }),
    });
    setSubmitting(false);
    setAcceptModal(null);
    setMeetingUrl('');
    setDoctorFeedback('');
    fetchRequests();
  };

  const handleQuote = async () => {
    if (!quoteModal || !quotePrice) return;
    setSubmitting(true);
    await fetch(`/api/consultation-requests/${quoteModal}/quote`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ quotedPrice: parseFloat(quotePrice) }),
    });
    setSubmitting(false);
    setQuoteModal(null);
    setQuotePrice('');
    fetchRequests();
  };

  const handleReport = async () => {
    if (!reportModal) return;
    if (!reportDiagnosis.trim()) { alert('Please enter a diagnosis / impression.'); return; }
    if (!reportFindings.trim()) { alert('Please enter clinical findings.'); return; }
    if (!reportRecommendations.trim()) { alert('Please enter recommendations.'); return; }

    const body: StructuredReport = {
      diagnosisReport: reportDiagnosis,
      reportFindings,
      reportRecommendations,
      reportPrescriptions: reportPrescriptions.length > 0 ? reportPrescriptions : undefined,
      reportFollowUp: reportFollowUp || undefined,
      meetingUrl: meetingUrl.trim() || undefined,
    };

    try {
      setSubmitting(true);
      await submitConsultationReport(reportModal.id, body);
      setReportModal(null);
      resetReportForm();
      fetchRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const resetReportForm = () => {
    setReportDiagnosis('');
    setReportFindings('');
    setReportRecommendations('');
    setReportFollowUp('');
    setReportPrescriptions([]);
    setMeetingUrl('');
    setDoctorNotes('');
    setShowAiPanel(false);
  };

  const openReportModal = (req: ConsultationRequest) => {
    setReportModal(req);
    setMeetingUrl(req.meetingUrl || '');
    resetReportForm();
  };

  const handleLoadAiSummary = async (id: string) => {
    setAiSummaryLoading(true);
    try {
      const summary = await fetchAiCaseSummary(id);
      setAiSummary(summary);
      setAiSummaryModal(id);
    } catch (err) {
      console.error(err);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleAiDraft = async () => {
    if (!reportModal) return;
    setAiDraftLoading(true);
    try {
      const draft = await fetchAiReportDraft(reportModal.id, doctorNotes);
      // Pre-fill fields — doctor reviews and edits before submitting
      if (draft.diagnosisDraft && !reportDiagnosis) setReportDiagnosis(draft.diagnosisDraft);
      if (draft.findingsDraft && !reportFindings) setReportFindings(draft.findingsDraft);
      if (draft.recommendationsDraft && !reportRecommendations) setReportRecommendations(draft.recommendationsDraft);
      if (draft.followUpDraft && !reportFollowUp) setReportFollowUp(draft.followUpDraft);
    } catch (err) {
      console.error(err);
    } finally {
      setAiDraftLoading(false);
    }
  };

  const addPrescription = () =>
    setReportPrescriptions([...reportPrescriptions, { medication: '', dose: '', duration: '', instructions: '' }]);

  const updatePrescription = (i: number, field: keyof Prescription, value: string) => {
    const updated = [...reportPrescriptions];
    updated[i] = { ...updated[i], [field]: value };
    setReportPrescriptions(updated);
  };

  const removePrescription = (i: number) =>
    setReportPrescriptions(reportPrescriptions.filter((_, idx) => idx !== i));

  return (
    <DashboardLayout role="doctor">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Consultation Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Remote encrypted cases — accept, review AI case brief, quote, and deliver structured reports
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500">No consultation requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className={STATUS_COLOR[req.status] || 'bg-gray-100'}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                    {req.requestType === 'MANUAL_REVIEW' && <Badge variant="outline">Manual Review</Badge>}
                    <span className="text-sm text-gray-500">{req.specialization}</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">{req.reason}</p>
                  {req.patient && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="w-4 h-4" /> {req.patient.name}
                    </p>
                  )}
                  {req.meetingUrl && (
                    <p className="text-xs text-teal-700 mt-2 flex items-center gap-1 break-all">
                      <Video className="w-3.5 h-3.5" /> {req.meetingUrl}
                    </p>
                  )}
                  {req.files && req.files.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {req.files.length} encrypted file(s)
                      </p>
                      {req.files.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className="text-xs text-teal-700 hover:underline flex items-center gap-1"
                          onClick={() => downloadConsultationFile(f.id, f.fileName).catch(console.error)}
                        >
                          <Download className="w-3 h-3" /> {f.fileName}
                        </button>
                      ))}
                    </div>
                  )}
                  {req.doctorResponse && (
                    <p className="text-xs text-teal-800 mt-2 bg-teal-50 rounded-lg px-2 py-1.5">
                      {req.doctorResponse}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(req.createdAt || '').toLocaleDateString()}
                    </span>
                    <span>{req.consultationType}</span>
                    {req.quotedPrice && (
                      <span className="text-teal-700 font-semibold">${req.quotedPrice.toFixed(2)} quoted</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  {/* AI Case Brief button — available once a case is accepted */}
                  {['ACCEPTED', 'IN_REVIEW', 'AWAITING_PAYMENT', 'PAID'].includes(req.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      disabled={aiSummaryLoading && aiSummaryModal === req.id}
                      onClick={() => handleLoadAiSummary(req.id)}
                    >
                      {aiSummaryLoading && aiSummaryModal === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><Sparkles className="w-4 h-4 mr-1" /> AI Brief</>
                      )}
                    </Button>
                  )}

                  {req.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          setAcceptModal(req.id);
                          setMeetingUrl('');
                          setDoctorFeedback('Request accepted. Please upload encrypted medical media for remote review.');
                        }}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(req.id, 'REJECTED', { response: 'Unable to take this case at this time.' })}
                      >
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                    </>
                  )}

                  {req.status === 'IN_REVIEW' && (
                    <Button
                      size="sm"
                      onClick={() => { setQuoteModal(req.id); setQuotePrice(''); }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <DollarSign className="w-4 h-4 mr-1" /> Send Price Quote
                    </Button>
                  )}

                  {req.status === 'PAID' && (
                    <Button
                      size="sm"
                      onClick={() => openReportModal(req)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="w-4 h-4 mr-1" /> Submit Report
                    </Button>
                  )}

                  {req.status === 'REPORT_READY' && (
                    <Badge className="bg-green-100 text-green-800">Report Delivered</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Accept modal ────────────────────────────── */}
      {acceptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg">Accept remote case</h3>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Feedback for patient</label>
              <textarea
                value={doctorFeedback}
                onChange={(e) => setDoctorFeedback(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Secure meeting URL (optional)</label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.example.com/..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAcceptModal(null)}>Cancel</Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                disabled={submitting}
                onClick={() => handleRespond(acceptModal, 'ACCEPTED', {
                  response: doctorFeedback,
                  meetingUrl: meetingUrl.trim() || undefined,
                })}
              >
                {submitting ? 'Saving...' : 'Accept & notify patient'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Case Brief modal ──────────────────────── */}
      {aiSummaryModal && aiSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-lg">AI Clinical Case Brief</h3>
              {aiSummary.urgency && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${URGENCY_COLOR[aiSummary.urgency] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {aiSummary.urgency}
                </span>
              )}
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
              <p className="text-sm text-purple-900">{aiSummary.caseSummary}</p>
            </div>

            {aiSummary.keyFindings?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Findings</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {aiSummary.keyFindings.map((f: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.suggestedDifferentials?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Suggested Differentials</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {aiSummary.suggestedDifferentials.map((d: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiSummary.missingInformation?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Missing Information</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {aiSummary.missingInformation.map((m: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{m}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-400 italic border-t pt-3">
              {aiSummary.disclaimer}
            </p>
            <Button variant="outline" className="w-full" onClick={() => { setAiSummaryModal(null); setAiSummary(null); }}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* ── Quote modal ──────────────────────────────── */}
      {quoteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Send Price Approval</h3>
            <input
              type="number"
              min="1"
              step="0.01"
              value={quotePrice}
              onChange={(e) => setQuotePrice(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-4"
              placeholder="e.g. 75.00"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setQuoteModal(null)}>Cancel</Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={handleQuote} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Quote'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Structured report modal ──────────────────── */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Submit Clinical Report</h3>
              <p className="text-xs text-gray-400">All fields are reviewed and approved by you before delivery</p>
            </div>

            <div className="p-6 space-y-5">
              {/* AI Draft Assistance */}
              <div className="border border-purple-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 text-sm font-medium text-purple-800 hover:bg-purple-100 transition-colors"
                  onClick={() => setShowAiPanel(!showAiPanel)}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Clinical Assistant — get a draft to review &amp; edit
                  </span>
                  {showAiPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showAiPanel && (
                  <div className="p-4 space-y-3 bg-purple-50/40">
                    <p className="text-xs text-gray-500">
                      Enter your clinical notes below. The AI will draft a report for you to <strong>review, edit, and approve</strong>. The draft will never be submitted without your explicit action.
                    </p>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px] bg-white"
                      placeholder="Your clinical observations, findings from uploaded documents, notes from the patient history..."
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      onClick={handleAiDraft}
                      disabled={aiDraftLoading || !doctorNotes.trim()}
                    >
                      {aiDraftLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating draft...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate draft</>}
                    </Button>
                    <p className="text-xs text-orange-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      AI-generated content is a starting point only. You must review and edit before submitting.
                    </p>
                  </div>
                )}
              </div>

              {/* Diagnosis / Impression */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Diagnosis / Clinical Impression <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportDiagnosis}
                  onChange={(e) => setReportDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px]"
                  placeholder="Your primary diagnosis or clinical impression..."
                />
              </div>

              {/* Findings */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Clinical Findings <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportFindings}
                  onChange={(e) => setReportFindings(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px]"
                  placeholder="Findings from the documents reviewed, symptoms analysis, relevant history..."
                />
              </div>

              {/* Recommendations */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Recommendations <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportRecommendations}
                  onChange={(e) => setReportRecommendations(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px]"
                  placeholder="Treatment recommendations, lifestyle advice, further investigations needed..."
                />
              </div>

              {/* Prescriptions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Prescriptions (optional)</label>
                  <Button size="sm" variant="outline" type="button" onClick={addPrescription}>
                    <Plus className="w-3 h-3 mr-1" /> Add medication
                  </Button>
                </div>
                {reportPrescriptions.map((rx, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2 p-3 bg-gray-50 rounded-lg relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => removePrescription(i)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      className="px-2 py-1.5 border rounded text-sm"
                      placeholder="Medication name"
                      value={rx.medication}
                      onChange={(e) => updatePrescription(i, 'medication', e.target.value)}
                    />
                    <input
                      className="px-2 py-1.5 border rounded text-sm"
                      placeholder="Dose (e.g. 500mg twice daily)"
                      value={rx.dose}
                      onChange={(e) => updatePrescription(i, 'dose', e.target.value)}
                    />
                    <input
                      className="px-2 py-1.5 border rounded text-sm"
                      placeholder="Duration (e.g. 7 days)"
                      value={rx.duration}
                      onChange={(e) => updatePrescription(i, 'duration', e.target.value)}
                    />
                    <input
                      className="px-2 py-1.5 border rounded text-sm"
                      placeholder="Special instructions"
                      value={rx.instructions}
                      onChange={(e) => updatePrescription(i, 'instructions', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Follow-up */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Follow-up Plan (optional)
                </label>
                <textarea
                  value={reportFollowUp}
                  onChange={(e) => setReportFollowUp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[60px]"
                  placeholder="When to follow up, red flag symptoms to watch for, referrals..."
                />
              </div>

              {/* Meeting URL */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Meeting URL (optional)</label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="https://meet.example.com/..."
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setReportModal(null); resetReportForm(); }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleReport}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Deliver Report to Patient'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
