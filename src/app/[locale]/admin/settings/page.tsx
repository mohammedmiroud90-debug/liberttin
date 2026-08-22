'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  DEFAULT_CONTENT_SETTINGS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  cacheContentSettings,
  fetchContentSettings,
  fontFamilyFor,
  saveContentSettings,
  type ContentSettings,
  type FontId,
} from '@/lib/blog/content-settings';
import {
  DEFAULT_SEO_SETTINGS,
  HOME_LAYOUT_OPTIONS,
  LOGO_FONT_OPTIONS,
  absoluteAssetUrl,
  fetchSeoSettings,
  saveSeoSettings,
  type HomeLayoutId,
  type LogoFontFamily,
  type LogoSettings,
  type LogoType,
  type SeoSettings,
} from '@/lib/blog/seo-settings';
import { uploadImage } from '@/lib/blog/upload';
import { Link } from '@/i18n/routing';
import { DynamicLogo } from '@/components/ui/DynamicLogo';

const SAMPLE = `Regular physical activity supports both cardiovascular health and mood
regulation. Studies consistently show that even short, frequent walks can lower resting
heart rate over time — and the effect compounds when paired with consistent sleep.`;

type Tab = 'content' | 'seo' | 'logo' | 'home';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('home');

  const [settings, setSettings] = useState<ContentSettings>(DEFAULT_CONTENT_SETTINGS);
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState<'favicon' | 'apple' | 'og' | 'logo' | null>(null);

  useEffect(() => {
    Promise.all([fetchContentSettings(), fetchSeoSettings()]).then(([content, seoSettings]) => {
      setSettings(content);
      setSeo(seoSettings);
      setLoading(false);
    });
  }, []);

  const updateContent = (patch: Partial<ContentSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
    setSaved(false);
  };

  const updateSeo = (patch: Partial<SeoSettings>) => {
    setSeo((current) => ({ ...current, ...patch }));
    setSaved(false);
  };

  const handleUpload = async (kind: 'favicon' | 'apple' | 'og' | 'logo', file: File | null) => {
    if (!file) return;
    setUploading(kind);
    setError('');

    try {
      const url = await uploadImage(file, user?.sessionToken);
      if (kind === 'favicon') updateSeo({ faviconUrl: url });
      if (kind === 'apple') updateSeo({ appleTouchIconUrl: url });
      if (kind === 'og') updateSeo({ ogImageUrl: url });
      if (kind === 'logo') updateSeo({ logo: { ...seo.logo, imageUrl: url } });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      if (tab === 'content') {
        await saveContentSettings(settings, user?.sessionToken);
      } else {
        // SEO and Home tabs both persist the site-seo record.
        await saveSeoSettings(seo, user?.sessionToken);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (tab === 'content') {
      setSettings(DEFAULT_CONTENT_SETTINGS);
      cacheContentSettings(DEFAULT_CONTENT_SETTINGS);
    } else {
      setSeo(DEFAULT_SEO_SETTINGS);
    }
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <main className="admin-main">
      <div className="border-b border-black pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
          Site setup
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Homepage layout, SEO metadata, favicon, and social share image.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-200">
        {(
          [
            { id: 'home', label: 'Homepage' },
            { id: 'logo', label: 'Header Logo' },
            { id: 'seo', label: 'SEO & brand' },
            { id: 'content', label: 'Content typography' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setSaved(false);
              setError('');
            }}
            className={`border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              tab === item.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'home' ? (
        <div className="mt-8 space-y-6">
          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Active homepage layout
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Chooses which feed style visitors see at <code className="text-gray-800">/</code>.
              You can still preview the other layout on its route.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {HOME_LAYOUT_OPTIONS.map((option) => {
                const selected = seo.homeLayout === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateSeo({ homeLayout: option.id as HomeLayoutId })}
                    className={`border p-4 text-left transition-colors ${
                      selected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-[15px] font-semibold">{option.label}</span>
                    <span
                      className={`mt-1 block text-sm leading-snug ${
                        selected ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {option.description}
                    </span>
                    <span
                      className={`mt-3 inline-block text-xs font-medium ${
                        selected ? 'text-teal-300' : 'text-teal-700'
                      }`}
                    >
                      {selected ? 'Active on /' : `Preview ${option.previewPath}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/" className="admin-btn admin-btn-outline">
                Open /
              </Link>
              <Link href="/home2" className="admin-btn admin-btn-outline">
                Open /home2 (Medium)
              </Link>
            </div>
          </section>

          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              How it works
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>
                <strong>Classic cards</strong> — original grey cards with blue titles.
              </li>
              <li>
                <strong>Medium feed</strong> — simple rows with title, author, excerpt, and
                thumbnail.
              </li>
              <li>
                <code>/home2</code> always shows the Medium feed for comparison, regardless of
                the active setting.
              </li>
            </ul>
          </section>
        </div>
      ) : tab === 'logo' ? (
        <div className="mt-8 space-y-6">
          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Logo Type
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Choose between an image logo or a text logo with custom fonts.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(['image', 'text'] as const).map((type) => {
                const selected = seo.logo.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateSeo({ logo: { ...seo.logo, type } })}
                    className={`border p-4 text-left transition-colors ${
                      selected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-[15px] font-semibold capitalize">{type} Logo</span>
                    <span
                      className={`mt-1 block text-sm leading-snug ${
                        selected ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {type === 'image'
                        ? 'Upload and use an image file as your logo'
                        : 'Use custom text with fonts from Fontlogo folder'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {seo.logo.type === 'image' ? (
            <section className="admin-panel p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
                Image Logo
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Upload your logo image (PNG, SVG, or WebP recommended for transparency).
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-48 items-center justify-center border border-gray-200 bg-gray-50 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seo.logo.imageUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex h-24 w-48 items-center justify-center border border-gray-200 bg-black p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seo.logo.imageUrl}
                      alt="Logo preview on dark"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <input
                  className="admin-field"
                  value={seo.logo.imageUrl}
                  onChange={(event) =>
                    updateSeo({ logo: { ...seo.logo, imageUrl: event.target.value } })
                  }
                  placeholder="/BRAND.png or https://…"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Logo Scale (50% - 300%)
                    </span>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={seo.logo.scale}
                        onChange={(event) =>
                          updateSeo({
                            logo: { ...seo.logo, scale: Number(event.target.value) },
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-center text-xs font-semibold text-gray-600">
                        {(seo.logo.scale * 100).toFixed(0)}%
                      </div>
                    </div>
                  </label>
                </div>

                <label className="admin-btn admin-btn-outline cursor-pointer">
                  {uploading === 'logo' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload logo image
                  <input
                    type="file"
                    accept="image/png,image/svg+xml,image/webp,image/jpeg"
                    className="hidden"
                    onChange={(event) => handleUpload('logo', event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </section>
          ) : (
            <>
              <section className="admin-panel p-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
                  Text Logo
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Customize your text logo with fonts from the Fontlogo folder.
                </p>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Logo Text
                    </span>
                    <input
                      className="admin-field"
                      value={seo.logo.text}
                      onChange={(event) =>
                        updateSeo({ logo: { ...seo.logo, text: event.target.value } })
                      }
                      placeholder="BILLIANT"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Font Family
                    </span>
                    <select
                      className="admin-field"
                      value={seo.logo.fontFamily}
                      onChange={(event) =>
                        updateSeo({
                          logo: { ...seo.logo, fontFamily: event.target.value as LogoFontFamily },
                        })
                      }
                    >
                      <optgroup label="Libertinage (Fontlogo)">
                        {LOGO_FONT_OPTIONS.filter((f) => f.id.startsWith('Libertinage')).map(
                          (font) => (
                            <option key={font.id} value={font.id}>
                              {font.label}
                            </option>
                          )
                        )}
                      </optgroup>
                      <optgroup label="Adora MICRO (NEWFONT)">
                        {LOGO_FONT_OPTIONS.filter((f) => f.id.startsWith('AdoraMICRO')).map(
                          (font) => (
                            <option key={font.id} value={font.id}>
                              {font.label}
                            </option>
                          )
                        )}
                      </optgroup>
                      <optgroup label="Other Fonts">
                        {LOGO_FONT_OPTIONS.filter(
                          (f) => !f.id.startsWith('Libertinage') && !f.id.startsWith('AdoraMICRO')
                        ).map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Font Size (px)
                      </span>
                      <input
                        type="number"
                        className="admin-field"
                        value={seo.logo.fontSize}
                        onChange={(event) =>
                          updateSeo({
                            logo: { ...seo.logo, fontSize: Number(event.target.value) },
                          })
                        }
                        min="12"
                        max="72"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Font Weight
                      </span>
                      <select
                        className="admin-field"
                        value={seo.logo.fontWeight}
                        onChange={(event) =>
                          updateSeo({
                            logo: { ...seo.logo, fontWeight: Number(event.target.value) },
                          })
                        }
                      >
                        <option value="300">Light (300)</option>
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi-Bold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra-Bold (800)</option>
                        <option value="900">Black (900)</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Logo Scale
                      </span>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={seo.logo.scale}
                          onChange={(event) =>
                            updateSeo({
                              logo: { ...seo.logo, scale: Number(event.target.value) },
                            })
                          }
                          className="w-full"
                        />
                        <div className="text-center text-xs font-semibold text-gray-600">
                          {(seo.logo.scale * 100).toFixed(0)}%
                        </div>
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Color (Dark Header)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={seo.logo.colorDark}
                        onChange={(event) =>
                          updateSeo({ logo: { ...seo.logo, colorDark: event.target.value } })
                        }
                        className="h-10 w-12 cursor-pointer border border-gray-300 bg-white p-1"
                      />
                      <input
                        className="admin-field"
                        value={seo.logo.colorDark}
                        onChange={(event) =>
                          updateSeo({ logo: { ...seo.logo, colorDark: event.target.value } })
                        }
                        placeholder="#ffffff"
                      />
                    </div>
                  </label>
                </div>
              </section>
            </>
          )}

          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Live Preview
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              See how your logo looks on light and dark backgrounds.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4 border border-gray-200 bg-white p-6">
                <span className="text-xs font-semibold text-gray-500">Light Header:</span>
                <DynamicLogo variant="light" logoOverride={seo.logo} priority />
              </div>
              <div className="flex items-center gap-4 border border-gray-200 bg-black p-6">
                <span className="text-xs font-semibold text-gray-300">Dark Header:</span>
                <DynamicLogo variant="dark" logoOverride={seo.logo} priority />
              </div>
            </div>
          </section>
        </div>
      ) : tab === 'seo' ? (
        <div className="mt-8 space-y-6">
          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Search & metadata
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Shown in browser tabs, Google results, and social previews.
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Site name
                </span>
                <input
                  className="admin-field"
                  value={seo.siteName}
                  onChange={(event) => updateSeo({ siteName: event.target.value })}
                  placeholder="Billiant"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Default title
                </span>
                <input
                  className="admin-field"
                  value={seo.siteTitle}
                  onChange={(event) => updateSeo({ siteTitle: event.target.value })}
                  placeholder="Billiant — Health, Wellness and Research Reporting"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title template
                </span>
                <input
                  className="admin-field"
                  value={seo.titleTemplate}
                  onChange={(event) => updateSeo({ titleTemplate: event.target.value })}
                  placeholder="%s | Billiant"
                />
                <span className="mt-1 block text-xs text-gray-500">
                  Use <code className="text-gray-700">%s</code> for the page title.
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Meta description
                </span>
                <textarea
                  className="admin-field min-h-[88px] resize-y"
                  value={seo.siteDescription}
                  onChange={(event) => updateSeo({ siteDescription: event.target.value })}
                  rows={3}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Keywords
                </span>
                <textarea
                  className="admin-field min-h-[72px] resize-y"
                  value={seo.keywords}
                  onChange={(event) => updateSeo({ keywords: event.target.value })}
                  rows={2}
                  placeholder="health blog, wellness, nutrition"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Twitter / X handle
                  </span>
                  <input
                    className="admin-field"
                    value={seo.twitterHandle}
                    onChange={(event) => updateSeo({ twitterHandle: event.target.value })}
                    placeholder="@billiant"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Theme color
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={seo.themeColor || '#0D9488'}
                      onChange={(event) => updateSeo({ themeColor: event.target.value })}
                      className="h-10 w-12 cursor-pointer border border-gray-300 bg-white p-1"
                    />
                    <input
                      className="admin-field"
                      value={seo.themeColor}
                      onChange={(event) => updateSeo({ themeColor: event.target.value })}
                      placeholder="#0D9488"
                    />
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Favicon
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Browser tab icon. PNG, ICO, or SVG work best (at least 32×32).
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seo.faviconUrl}
                  alt="Favicon preview"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  className="admin-field"
                  value={seo.faviconUrl}
                  onChange={(event) => updateSeo({ faviconUrl: event.target.value })}
                  placeholder="/favicon.ico or https://…"
                />
                <label className="admin-btn admin-btn-outline cursor-pointer">
                  {uploading === 'favicon' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload favicon
                  <input
                    type="file"
                    accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(event) => handleUpload('favicon', event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
                Apple touch icon
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Home-screen icon on iOS (180×180 PNG recommended).
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={seo.appleTouchIconUrl}
                    alt="Apple touch icon preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    className="admin-field"
                    value={seo.appleTouchIconUrl}
                    onChange={(event) => updateSeo({ appleTouchIconUrl: event.target.value })}
                    placeholder="/apple-touch-icon.png"
                  />
                  <label className="admin-btn admin-btn-outline cursor-pointer">
                    {uploading === 'apple' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload Apple icon
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => handleUpload('apple', event.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Open Graph / social image
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Default share image for Facebook, LinkedIn, X, and Slack (1200×630 recommended).
            </p>

            <div className="mt-5 space-y-4">
              <div className="relative aspect-[1200/630] w-full max-w-xl overflow-hidden border border-gray-200 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seo.ogImageUrl}
                  alt="Open Graph preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <input
                className="admin-field max-w-xl"
                value={seo.ogImageUrl}
                onChange={(event) => updateSeo({ ogImageUrl: event.target.value })}
                placeholder="/og-image.jpg or https://…"
              />
              <label className="admin-btn admin-btn-outline cursor-pointer">
                {uploading === 'og' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload social image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => handleUpload('og', event.target.files?.[0] ?? null)}
                />
              </label>
              <p className="text-xs text-gray-500">
                Absolute preview URL: {absoluteAssetUrl(seo.ogImageUrl)}
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
              Font family
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {FONT_OPTIONS.map((option) => {
                const selected = settings.fontId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateContent({ fontId: option.id as FontId })}
                    style={{ fontFamily: option.fontFamily }}
                    className={`border px-4 py-3 text-left transition-colors ${
                      selected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`block text-[15px] ${selected ? 'text-white' : 'text-black'}`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs ${selected ? 'text-gray-300' : 'text-gray-500'}`}
                    >
                      Aa Bb Cc 123
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="admin-panel p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
                Font size
              </h2>
              <div className="mt-4 space-y-2">
                {FONT_SIZE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2.5 text-sm">
                    <input
                      type="radio"
                      name="fontSize"
                      checked={settings.fontSize === option.value}
                      onChange={() => updateContent({ fontSize: option.value })}
                      className="accent-black"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </section>

            <section className="admin-panel p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">
                Line height
              </h2>
              <div className="mt-4 space-y-2">
                {LINE_HEIGHT_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2.5 text-sm">
                    <input
                      type="radio"
                      name="lineHeight"
                      checked={settings.lineHeight === option.value}
                      onChange={() => updateContent({ lineHeight: option.value })}
                      className="accent-black"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </section>
          </div>

          <section className="admin-panel p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-black">Preview</h2>
            <div
              className={`mt-4 border border-gray-200 bg-gray-50 p-5 text-gray-800 ${settings.fontSize} ${settings.lineHeight}`}
              style={{ fontFamily: fontFamilyFor(settings.fontId) }}
            >
              {SAMPLE}
            </div>
          </section>
        </div>
      )}

      {error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-end gap-3">
        <button type="button" onClick={handleReset} className="admin-btn admin-btn-ghost">
          Reset to default
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || Boolean(uploading)}
          className="admin-btn admin-btn-primary disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saved && <Check className="h-4 w-4" />}
          {saved
            ? 'Saved'
            : tab === 'content'
              ? 'Save typography'
              : tab === 'home'
                ? 'Save homepage layout'
                : tab === 'logo'
                  ? 'Save logo settings'
                  : 'Save SEO settings'}
        </button>
      </div>
    </main>
  );
}
