'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Contrast,
  Loader2,
  RotateCcw,
  RotateCw,
  Sun,
  Upload,
  ZoomIn,
} from 'lucide-react';
import { getDefaultAvatar } from '@/lib/avatar';
import {
  DEFAULT_IMAGE_EFFECTS,
  buildImageFilter,
  exportEditedAvatar,
  loadImageSource,
  type ImageEffects,
} from '@/lib/image-editor';
import { uploadImage } from '@/lib/blog/upload';

type Props = {
  name: string;
  currentUrl?: string;
  sessionToken?: string;
  onUploaded: (url: string) => void;
};

export function ProfileAvatarEditor({
  name,
  currentUrl,
  sessionToken,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [effects, setEffects] = useState<ImageEffects>(DEFAULT_IMAGE_EFFECTS);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const previewUrl = useMemo(
    () => currentUrl || getDefaultAvatar(name || 'user', 256),
    [currentUrl, name]
  );

  useEffect(() => {
    setSource(null);
    setEffects(DEFAULT_IMAGE_EFFECTS);
  }, [currentUrl]);

  const pickFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    setError('');
    try {
      setSource(await loadImageSource(file));
      setEffects(DEFAULT_IMAGE_EFFECTS);
    } catch (pickError) {
      setError(pickError instanceof Error ? pickError.message : 'Could not open image.');
    }
  };

  const patchEffects = (patch: Partial<ImageEffects>) => {
    setEffects((current) => ({ ...current, ...patch }));
  };

  const resetEditor = () => {
    setSource(null);
    setEffects(DEFAULT_IMAGE_EFFECTS);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const applyPhoto = async () => {
    if (!source) {
      inputRef.current?.click();
      return;
    }

    setUploading(true);
    setError('');
    try {
      const blob = await exportEditedAvatar(source, effects);
      const file = new File([blob], 'profile-avatar.png', { type: 'image/png' });
      const url = await uploadImage(file, sessionToken);
      onUploaded(url);
      resetEditor();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const previewFilter = source ? buildImageFilter(effects) : undefined;
  const previewTransform = source
    ? `rotate(${effects.rotation}deg) scale(${effects.scale})`
    : undefined;

  return (
    <div className="admin-profile-avatar">
      <div className="admin-profile-avatar__preview-wrap">
        <div className="admin-profile-avatar__preview">
          {source ? (
            <img
              src={source.src}
              alt=""
              className="admin-profile-avatar__image"
              style={{ filter: previewFilter, transform: previewTransform }}
            />
          ) : (
            <img src={previewUrl} alt="" className="admin-profile-avatar__image" />
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => pickFile(event.target.files?.[0])}
      />

      <div className="admin-profile-avatar__actions">
        <button
          type="button"
          className="admin-btn admin-btn-outline admin-profile-btn"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Choose photo
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-profile-btn"
          disabled={uploading}
          onClick={applyPhoto}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {source ? 'Apply photo' : 'Upload photo'}
        </button>
      </div>

      {source ? (
        <div className="admin-profile-avatar__controls">
          <label className="admin-profile-control">
            <span>
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
              Brightness
            </span>
            <input
              type="range"
              min={50}
              max={150}
              value={effects.brightness}
              onChange={(event) => patchEffects({ brightness: Number(event.target.value) })}
            />
          </label>

          <label className="admin-profile-control">
            <span>
              <Contrast className="h-3.5 w-3.5" aria-hidden="true" />
              Contrast
            </span>
            <input
              type="range"
              min={50}
              max={150}
              value={effects.contrast}
              onChange={(event) => patchEffects({ contrast: Number(event.target.value) })}
            />
          </label>

          <label className="admin-profile-control">
            <span>
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              Zoom
            </span>
            <input
              type="range"
              min={100}
              max={200}
              value={Math.round(effects.scale * 100)}
              onChange={(event) => patchEffects({ scale: Number(event.target.value) / 100 })}
            />
          </label>

          <label className="admin-profile-control">
            <span>Saturation</span>
            <input
              type="range"
              min={0}
              max={200}
              value={effects.saturation}
              onChange={(event) => patchEffects({ saturation: Number(event.target.value) })}
            />
          </label>

          <div className="admin-profile-avatar__toolbar">
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-profile-btn"
              onClick={() => patchEffects({ rotation: effects.rotation - 90 })}
            >
              <RotateCcw className="h-4 w-4" />
              Rotate
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-profile-btn"
              onClick={() => patchEffects({ rotation: effects.rotation + 90 })}
            >
              <RotateCw className="h-4 w-4" />
              Rotate
            </button>
            <button
              type="button"
              className={`admin-btn admin-profile-btn ${effects.grayscale ? 'admin-btn-primary' : 'admin-btn-outline'}`}
              onClick={() => patchEffects({ grayscale: !effects.grayscale })}
            >
              B&amp;W
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-profile-btn"
              onClick={resetEditor}
            >
              Reset
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="admin-profile-message admin-profile-message--error">{error}</p> : null}
    </div>
  );
}
