'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProfileAvatarEditor } from '@/components/admin/ProfileAvatarEditor';
import { useAuth } from '@/components/auth/AuthProvider';
import { profilePictureUrl, updateUserProfile, userDisplayName } from '@/lib/blog/auth';

export default function AdminProfilePage() {
  const { user, login } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setFirstName(String(user.firstName ?? ''));
    setLastName(String(user.lastName ?? ''));
    setDisplayName(String(user.displayName ?? userDisplayName(user)));
    setBio(String(user.bio ?? ''));
    setAvatarUrl(profilePictureUrl(user));
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const next = await updateUserProfile(user, {
        firstName,
        lastName,
        displayName,
        bio,
        ...(avatarUrl && avatarUrl !== profilePictureUrl(user)
          ? { profilePictureUrl: avatarUrl }
          : {}),
      });
      login(next);
      setAvatarUrl(profilePictureUrl(next));
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUploaded = async (url: string) => {
    setAvatarUrl(url);
    setError('');
    setSaved(false);

    try {
      const next = await updateUserProfile(user, { profilePictureUrl: url });
      login(next);
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save your photo.');
    }
  };

  return (
    <main className="admin-main admin-profile-page">
      <div className="admin-profile-head">
        <div>
          <p className="admin-profile-kicker">Account</p>
          <h1>Profile</h1>
          <p>Update your avatar, name, and bio.</p>
        </div>
      </div>

      <div className="admin-profile-layout">
        <section className="admin-profile-panel">
          <div className="admin-profile-panel__title">Avatar</div>
          <ProfileAvatarEditor
            name={userDisplayName(user)}
            currentUrl={avatarUrl}
            sessionToken={user.sessionToken}
            onUploaded={handleAvatarUploaded}
          />
        </section>

        <form onSubmit={handleSubmit} className="admin-profile-panel admin-profile-form">
          <div className="admin-profile-panel__title">Details</div>

          {error ? <p className="admin-profile-message admin-profile-message--error">{error}</p> : null}
          {saved ? (
            <p className="admin-profile-message admin-profile-message--success">Profile saved.</p>
          ) : null}

          <div className="admin-profile-fields admin-profile-fields--split">
            <label className="admin-profile-field">
              <span>First name</span>
              <input
                className="admin-input admin-profile-input"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>
            <label className="admin-profile-field">
              <span>Last name</span>
              <input
                className="admin-input admin-profile-input"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </label>
          </div>

          <label className="admin-profile-field">
            <span>Display name</span>
            <input
              className="admin-input admin-profile-input"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </label>

          <div className="admin-profile-fields admin-profile-fields--split">
            <label className="admin-profile-field">
              <span>Username</span>
              <input className="admin-input admin-profile-input" value={user.username} disabled />
            </label>
            <label className="admin-profile-field">
              <span>Email</span>
              <input className="admin-input admin-profile-input" value={user.email} disabled />
            </label>
          </div>

          <label className="admin-profile-field">
            <span>Bio</span>
            <textarea
              className="admin-input admin-profile-input admin-profile-textarea"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="A short bio for your author profile."
            />
          </label>

          <div className="admin-profile-form__actions">
            <button type="submit" className="admin-btn admin-btn-primary admin-profile-btn" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
