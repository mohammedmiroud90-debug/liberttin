'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Link, useRouter } from '@/i18n/routing';
import { fetchCurrentUser, getToken, updateProfile } from '@/lib/api/auth';
import { fetchPatientDashboard } from '@/lib/api/dashboard';
import {
  User, Mail, Phone, MapPin, Calendar, Loader2, Stethoscope, Star, AlertCircle, CheckCircle, Camera, Upload, X,
} from 'lucide-react';

export default function PatientProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myDoctors, setMyDoctors] = useState<any[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    medications: '',
  });

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    Promise.all([fetchCurrentUser(), fetchPatientDashboard().catch(() => null)])
      .then(([user, dash]) => {
        if (!user) {
          router.push('/login');
          return;
        }
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          country: user.country || '',
          postalCode: user.postalCode || '',
          dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
          gender: user.gender || '',
          emergencyContact: user.emergencyContact || '',
          emergencyPhone: user.emergencyPhone || '',
          bloodType: user.bloodType || '',
          allergies: user.allergies || '',
          medications: user.medications || '',
        });
        setProfilePicture(user.profilePicture || user.avatarUrl || '');
        setMyDoctors(dash?.myDoctors || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeProfilePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // If there's a profile picture file, upload it first
      if (profilePictureFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', profilePictureFile);
        
        const uploadResponse = await fetch('/api/upload/profile-picture', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formDataUpload,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload profile picture');
        }

        const uploadData = await uploadResponse.json();
        // Update with the new profile picture URL
        await updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          emergencyContact: formData.emergencyContact || undefined,
          emergencyPhone: formData.emergencyPhone || undefined,
          bloodType: formData.bloodType || undefined,
          allergies: formData.allergies || undefined,
          medications: formData.medications || undefined,
          profilePicture: uploadData.url,
        });
        setProfilePicture(uploadData.url);
        setProfilePictureFile(null);
        setProfilePicturePreview('');
      } else {
        await updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          emergencyContact: formData.emergencyContact || undefined,
          emergencyPhone: formData.emergencyPhone || undefined,
          bloodType: formData.bloodType || undefined,
          allergies: formData.allergies || undefined,
          medications: formData.medications || undefined,
        });
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSaving(false);
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

  const fields = [
    { id: 'firstName', label: 'First Name', icon: User, section: 'basic' },
    { id: 'lastName', label: 'Last Name', icon: User, section: 'basic' },
    { id: 'phone', label: 'Phone', icon: Phone, section: 'basic' },
    { id: 'dateOfBirth', label: 'Date of Birth', icon: Calendar, type: 'date', section: 'basic' },
    { id: 'gender', label: 'Gender', icon: User, type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'], section: 'basic' },
    { id: 'address', label: 'Address', icon: MapPin, section: 'address' },
    { id: 'city', label: 'City', icon: MapPin, section: 'address' },
    { id: 'country', label: 'Country', icon: MapPin, section: 'address' },
    { id: 'postalCode', label: 'Postal Code', icon: MapPin, section: 'address' },
    { id: 'emergencyContact', label: 'Emergency Contact Name', icon: User, section: 'emergency' },
    { id: 'emergencyPhone', label: 'Emergency Contact Phone', icon: Phone, section: 'emergency' },
    { id: 'bloodType', label: 'Blood Type', icon: User, type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], section: 'medical' },
    { id: 'allergies', label: 'Allergies', icon: AlertCircle, type: 'textarea', section: 'medical' },
    { id: 'medications', label: 'Current Medications', icon: AlertCircle, type: 'textarea', section: 'medical' },
  ] as const;

  return (
    <DashboardLayout role="patient">
      <div className="max-w-4xl mx-auto space-y-6 dash-form-shell">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-950 tracking-tight">
            My Profile
          </h1>
          <p className="mt-1.5 text-sm font-medium text-gray-500">
            Personal details and doctors from your remote consultations
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-sm font-medium flex items-start gap-2.5">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <section className="dash-form-panel">
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-950">Personal Information</h2>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Saved to your BILLIANT account</p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="dash-form-btn dash-form-btn-ghost px-4 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="dash-form-btn dash-form-btn-primary px-5 py-2.5 text-sm"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 py-7">
            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-7 border-b border-gray-100">
              <div className="relative">
                {profilePicturePreview || profilePicture ? (
                  <img
                    src={profilePicturePreview || profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-teal-800 text-white flex items-center justify-center text-2xl font-bold shrink-0">
                    {(formData.firstName?.[0] || 'P').toUpperCase()}
                    {(formData.lastName?.[0] || '').toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg transition-colors"
                    aria-label="Upload profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-gray-950 truncate">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{formData.email}</span>
                </p>
                {isEditing && (
                  <>
                    <p className="text-xs font-semibold text-teal-700 mt-2 uppercase tracking-wide">
                      Editing mode
                    </p>
                    {profilePicturePreview && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-600">New photo selected</span>
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {fields.filter(f => f.section === 'basic').map((field) => {
                  const Icon = field.icon;
                  const key = field.id as keyof typeof formData;
                  return (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-[13px] font-semibold text-gray-900 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                        {field.type === 'select' ? (
                          <select
                            id={field.id}
                            value={formData[key]}
                            disabled={!isEditing}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="dash-form-input pl-10 appearance-none"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.id}
                            type={field.type || 'text'}
                            value={formData[key]}
                            disabled={!isEditing}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="dash-form-input pl-10"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Address</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {fields.filter(f => f.section === 'address').map((field) => {
                  const Icon = field.icon;
                  const key = field.id as keyof typeof formData;
                  return (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-[13px] font-semibold text-gray-900 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                          id={field.id}
                          type="text"
                          value={formData[key]}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="dash-form-input pl-10"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {fields.filter(f => f.section === 'emergency').map((field) => {
                  const Icon = field.icon;
                  const key = field.id as keyof typeof formData;
                  return (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-[13px] font-semibold text-gray-900 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                          id={field.id}
                          type="text"
                          value={formData[key]}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="dash-form-input pl-10"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Medical Information</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {fields.filter(f => f.section === 'medical').map((field) => {
                  const Icon = field.icon;
                  const key = field.id as keyof typeof formData;
                  return (
                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label htmlFor={field.id} className="block text-[13px] font-semibold text-gray-900 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        {field.type === 'textarea' ? (
                          <>
                            <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            <textarea
                              id={field.id}
                              value={formData[key]}
                              disabled={!isEditing}
                              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                              rows={3}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="dash-form-input pl-10 resize-none"
                            />
                          </>
                        ) : field.type === 'select' ? (
                          <>
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                            <select
                              id={field.id}
                              value={formData[key]}
                              disabled={!isEditing}
                              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                              className="dash-form-input pl-10 appearance-none"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <input
                              id={field.id}
                              type="text"
                              value={formData[key]}
                              disabled={!isEditing}
                              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                              className="dash-form-input pl-10"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="dash-form-panel">
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-700" />
              My Doctors
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              Clinicians linked to your remote diagnostic requests
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6 space-y-3">
            {myDoctors.length === 0 ? (
              <div className="py-6 text-sm font-medium text-gray-500 border border-dashed border-gray-200 px-4">
                No doctors yet.{' '}
                <Link href="/patient/consultation/new" className="text-teal-700 underline font-bold underline-offset-2">
                  Start a consultation
                </Link>
              </div>
            ) : (
              myDoctors.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 bg-gray-50/80"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-950">{d.name}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{d.specialty}</p>
                    {d.bio && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{d.bio}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {typeof d.rating === 'number' && d.rating > 0 && (
                        <span className="inline-flex items-center text-[11px] font-bold px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200">
                          <Star className="h-3 w-3 mr-1" /> {d.rating.toFixed(1)}
                        </span>
                      )}
                      {d.cases ? (
                        <span className="text-[11px] font-bold px-2 py-1 bg-white text-gray-700 border border-gray-200">
                          {d.cases} case(s)
                        </span>
                      ) : null}
                      {d.availableForOnline && (
                        <span className="text-[11px] font-bold px-2 py-1 bg-teal-50 text-teal-800 border border-teal-200">
                          Online care
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/patient/consultation/new?doctorId=${d.id}`}
                    className="dash-form-btn dash-form-btn-ghost px-4 py-2 text-xs shrink-0 text-center"
                  >
                    Request again
                  </Link>
                </div>
              ))
            )}

            <Link
              href="/patient/doctors"
              className="dash-form-btn dash-form-btn-ghost w-full mt-2 py-3 text-sm text-center block"
            >
              View all my doctors
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
