'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from '@/i18n/routing';
import { fetchCurrentUser, getToken, updateProfile } from '@/lib/api/auth';
import { Loader2 } from 'lucide-react';

export default function DoctorSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    licenseNumber: '',
    specialization: '',
    languages: '',
    consultationFee: '',
    experienceYears: '',
    availableForOnline: true,
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
        setForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          address: user.address || '',
          bio: user.bio || '',
          licenseNumber: user.licenseNumber || '',
          specialization: (user.specialization || []).join(', '),
          languages: (user.languages || []).join(', '),
          consultationFee: user.consultationFee != null ? String(user.consultationFee) : '',
          experienceYears: user.experienceYears != null ? String(user.experienceYears) : '',
          availableForOnline: user.availableForOnline ?? true,
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const save = async () => {
    try {
      setSaving(true);
      setMessage('');
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        bio: form.bio,
        licenseNumber: form.licenseNumber || undefined,
        specialization: form.specialization
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        languages: form.languages
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        availableForOnline: form.availableForOnline,
      });
      setMessage('Doctor profile updated');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Doctor Profile & Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Professional details shown in remote diagnostics</p>
        </div>

        {message && <p className="text-sm text-teal-700">{message}</p>}

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle>Personal</CardTitle>
            <CardDescription>Contact details for your clinician account</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>First name</Label>
              <Input className="mt-1" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input className="mt-1" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Address</Label>
              <Input className="mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle>Clinical profile</CardTitle>
            <CardDescription>Specialties, fees, and remote availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>License number</Label>
              <Input className="mt-1" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
            </div>
            <div>
              <Label>Specializations (comma-separated)</Label>
              <Input className="mt-1" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Cardiology, Internal Medicine" />
            </div>
            <div>
              <Label>Languages (comma-separated)</Label>
              <Input className="mt-1" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Consultation fee (USD)</Label>
                <Input className="mt-1" type="number" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
              </div>
              <div>
                <Label>Years of experience</Label>
                <Input className="mt-1" type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <textarea
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.availableForOnline}
                onChange={(e) => setForm({ ...form, availableForOnline: e.target.checked })}
              />
              Available for remote / online diagnostics
            </label>
            <Button className="bg-teal-600 hover:bg-teal-700" disabled={saving} onClick={save}>
              {saving ? 'Saving...' : 'Save doctor profile'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
