'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Pill,
  Send,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function DiagnosePage() {
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');

  const consultation = {
    id: '1',
    patient: {
      name: 'Emily Rodriguez',
      age: 34,
      gender: 'Female',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      chronicConditions: ['Hypertension']
    },
    submittedAt: '2026-08-11 08:30 AM',
    priority: 'high',
    symptoms: 'Severe headache and dizziness for the past 2 days. Pain is constant and worsens with bright light.',
    duration: '2 days',
    severity: 'severe',
    medicalHistory: 'History of migraines, currently on blood pressure medication',
    currentMedications: ['Lisinopril 10mg - once daily'],
    vitalSigns: {
      bloodPressure: '145/92',
      heartRate: '88 bpm',
      temperature: '37.2°C',
      oxygenLevel: '98%'
    },
    attachments: [
      { id: '1', name: 'Previous_MRI_Report.pdf', type: 'document' },
      { id: '2', name: 'Blood_Test_Results.pdf', type: 'document' }
    ]
  };

  const handleSubmitDiagnosis = () => {
    // Handle diagnosis submission
    console.log({ diagnosis, prescription, notes });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Remote Diagnosis</h1>
            <p className="text-muted-foreground">Review patient information and provide diagnosis</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Patient Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Patient Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{consultation.patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {consultation.patient.age} years • {consultation.patient.gender}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blood Type:</span>
                      <span className="font-medium">{consultation.patient.bloodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium">{consultation.submittedAt}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Allergies:</p>
                    <div className="flex flex-wrap gap-2">
                      {consultation.patient.allergies.map((allergy, i) => (
                        <Badge key={i} className="bg-red-100 text-red-800">{allergy}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Chronic Conditions:</p>
                    <div className="flex flex-wrap gap-2">
                      {consultation.patient.chronicConditions.map((condition, i) => (
                        <Badge key={i} className="bg-amber-100 text-amber-800">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blood Pressure:</span>
                    <span className="font-semibold">{consultation.vitalSigns.bloodPressure}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Heart Rate:</span>
                    <span className="font-semibold">{consultation.vitalSigns.heartRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span className="font-semibold">{consultation.vitalSigns.temperature}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Oxygen Level:</span>
                    <span className="font-semibold">{consultation.vitalSigns.oxygenLevel}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {consultation.attachments.map((attachment) => (
                    <Button
                      key={attachment.id}
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {attachment.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Diagnosis Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Symptoms & History */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Complaint</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                    <Badge className="bg-amber-100 text-amber-800">Severe</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Symptoms:</p>
                    <p className="text-sm">{consultation.symptoms}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Duration:</p>
                      <p className="text-sm text-muted-foreground">{consultation.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Severity:</p>
                      <p className="text-sm text-muted-foreground capitalize">{consultation.severity}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Medical History:</p>
                    <p className="text-sm text-muted-foreground">{consultation.medicalHistory}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Current Medications:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {consultation.currentMedications.map((med, i) => (
                        <li key={i}>{med}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Diagnosis</CardTitle>
                  <CardDescription>Provide your professional assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Diagnosis *</label>
                    <textarea
                      className="w-full p-3 border rounded-lg min-h-32"
                      placeholder="Enter your diagnosis..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Prescription</label>
                    <textarea
                      className="w-full p-3 border rounded-lg min-h-24"
                      placeholder="Medication name, dosage, frequency, duration..."
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes & Recommendations</label>
                    <textarea
                      className="w-full p-3 border rounded-lg min-h-24"
                      placeholder="Follow-up instructions, lifestyle recommendations, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Recommendation:</p>
                        <p>Consider ordering a CT scan to rule out intracranial issues. Monitor blood pressure closely.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button 
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                      onClick={handleSubmitDiagnosis}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Diagnosis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
