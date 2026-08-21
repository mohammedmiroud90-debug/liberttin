'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import {
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Video,
  Users,
  FileText,
  Pill,
  FlaskConical,
  Settings,
  Home,
  LogOut,
  Stethoscope,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { getUser, logout, fetchCurrentUser } from '@/lib/api/auth';
import { AvatarWithFallback } from '@/components/ui/avatar-with-fallback';
import { PlatformPolicyGate } from '@/components/dashboard/PlatformPolicyGate';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { CleanMenuPanel } from '@/components/ui/CleanMenuPanel';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'patient' | 'doctor' | 'admin';
}

type NavItem = { label: string; href: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const SIDEBAR_COLLAPSE_KEY = 'billiant_dash_nav_collapsed';

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData) setUser(userData);
    fetchCurrentUser()
      .then((fresh) => {
        if (fresh) setUser(fresh);
      })
      .catch(() => undefined);

    try {
      if (localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === '1') setNavCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, navCollapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [navCollapsed]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const handleLogout = () => logout();

  const navGroups: NavGroup[] = useMemo(() => {
    if (role === 'patient') {
      return [
        {
          label: 'Care',
          items: [
            { label: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
            { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
            { label: 'Consultations', href: '/patient/consultations', icon: Video },
            { label: 'My Doctors', href: '/patient/doctors', icon: Users },
          ],
        },
        {
          label: 'Records',
          items: [
            { label: 'Medical Records', href: '/patient/medical-records', icon: FileText },
            { label: 'Prescriptions', href: '/patient/prescriptions', icon: Pill },
            { label: 'Lab Results', href: '/patient/lab-results', icon: FlaskConical },
            { label: 'Settings', href: '/patient/settings', icon: Settings },
          ],
        },
      ];
    }
    if (role === 'doctor') {
      return [
        {
          label: 'Practice',
          items: [
            { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
            { label: 'My Patients', href: '/doctor/patients', icon: Users },
            { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
            { label: 'Consultations', href: '/doctor/consultations', icon: MessageSquare },
            { label: 'Diagnose', href: '/doctor/diagnose', icon: Stethoscope },
          ],
        },
        {
          label: 'Account',
          items: [{ label: 'Settings', href: '/doctor/settings', icon: Settings }],
        },
      ];
    }
    return [
      {
        label: 'Admin',
        items: [
          { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Users', href: '/admin/users', icon: Users },
          { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
        ],
      },
    ];
  }, [role]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const firstName = user?.firstName?.trim() || user?.email || 'Account';
  const profileHref = role === 'patient' ? '/patient/profile' : `/${role}/settings`;
  const sidebarWidth = navCollapsed ? 'lg:w-[76px]' : 'lg:w-[272px]';
  const mainPad = navCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[272px]';

  const renderNavItem = (item: NavItem, collapsed: boolean) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    if (collapsed) {
      return (
        <li key={item.href}>
          <Link
            href={item.href}
            title={item.label}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center justify-center h-9 w-9 mx-auto transition-colors ${
              active
                ? 'bg-white text-[#0066cc] shadow-sm'
                : 'text-gray-600 hover:bg-white/70 hover:text-[#0066cc]'
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 1.75} />
          </Link>
        </li>
      );
    }

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={`flex items-center gap-2.5 min-h-[36px] px-2 py-1.5 text-[13px] leading-snug transition-colors ${
            active
              ? 'bg-white text-[#0066cc] font-semibold shadow-sm'
              : 'text-gray-900 hover:bg-white/60 hover:text-[#0066cc]'
          }`}
        >
          <Icon
            className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-[#0066cc]' : 'text-gray-500'}`}
            strokeWidth={active ? 2.25 : 1.75}
          />
          <span
            className={
              active
                ? 'underline underline-offset-2 decoration-[#0066cc]'
                : 'underline underline-offset-2 decoration-gray-900 hover:decoration-[#0066cc]'
            }
          >
            {item.label}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformPolicyGate role={role} />

      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 safe-top">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="relative z-50 inline-flex items-center justify-center h-11 w-11 lg:hidden flex-shrink-0 text-gray-800 rounded-lg hover:bg-gray-100"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() => setNavCollapsed((v) => !v)}
              className="hidden lg:inline-flex items-center justify-center h-10 w-10 text-gray-700 hover:text-[#0066cc] rounded-lg hover:bg-gray-50"
              aria-label={navCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              {navCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            <BrandLogo href={`/${role}/dashboard`} variant="light" priority className="min-w-0" />
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search records, doctors..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 bg-[#f2f2f2] focus:outline-none focus:ring-1 focus:ring-[#0066cc] focus:border-[#0066cc]"
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex items-center justify-center h-11 w-11 md:hidden text-gray-700 rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageSwitcher variant="light" />
            <NotificationBell />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((v) => !v)}
                className="block p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/40 rounded-full"
                aria-label="Account menu"
                aria-expanded={profileDropdownOpen}
              >
                <AvatarWithFallback
                  src={user?.avatarUrl || user?.profilePicture}
                  alt={firstName}
                  size={34}
                  className="ring-0 shadow-none"
                />
              </button>

              {profileDropdownOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default bg-transparent"
                    aria-label="Close account menu"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-1.5rem))] z-50 shadow-sm">
                    <CleanMenuPanel
                      title="Account"
                      titleHref={profileHref}
                      items={[
                        { name: 'My Profile', href: profileHref },
                        { name: 'Settings', href: `/${role}/settings` },
                        { name: 'Home', href: '/' },
                        { name: 'Logout', danger: true, onClick: handleLogout },
                      ]}
                      onNavigate={() => setProfileDropdownOpen(false)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden px-3 pb-3 border-t border-gray-100">
            <div className="relative flex items-center gap-2 pt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 mt-1.5" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 pr-10 py-3 text-base border border-gray-200 bg-[#f2f2f2] focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
                autoFocus
              />
              <button
                type="button"
                className="absolute right-2 p-2 text-gray-500 hover:text-gray-900"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <aside
        className={`fixed top-14 sm:top-16 left-0 bottom-0 w-[min(288px,86vw)] ${sidebarWidth} bg-[#f2f2f2] text-gray-900 z-30 transition-all duration-300 ease-in-out border-r border-gray-200 overflow-y-auto lg:overflow-hidden ${
          sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        } lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex flex-col h-full min-h-0 pb-[env(safe-area-inset-bottom)]">
          {/* Mobile-only identity; desktop uses header avatar for profile */}
          <div className="lg:hidden px-4 pt-3 pb-2.5 border-b border-gray-200/80 flex items-center gap-3">
            <AvatarWithFallback
              src={user?.avatarUrl || user?.profilePicture}
              alt={firstName}
              size={36}
              className="ring-0 shadow-none"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0066cc] truncate">{firstName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{role}</p>
            </div>
            <button
              type="button"
              className="p-2 text-gray-500"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className={`flex-1 min-h-0 ${navCollapsed ? 'p-2 pt-3' : 'px-3 py-3'} space-y-3`}>
            {navGroups.map((group) => (
              <div key={group.label}>
                <p
                  className={`mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#0066cc] ${
                    navCollapsed ? 'lg:hidden' : ''
                  }`}
                >
                  {group.label}
                </p>

                <ul className={`space-y-0.5 ${navCollapsed ? 'lg:hidden' : ''}`}>
                  {group.items.map((item) => renderNavItem(item, false))}
                </ul>

                {navCollapsed && (
                  <ul className="hidden lg:block space-y-1">
                    {group.items.map((item) => renderNavItem(item, true))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          <div
            className={`mt-auto border-t border-gray-200/80 shrink-0 ${
              navCollapsed ? 'p-2 hidden lg:block' : 'px-3 py-2.5'
            }`}
          >
            {navCollapsed ? (
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    title="Home"
                    aria-label="Home"
                    className="flex items-center justify-center h-9 w-9 mx-auto text-gray-600 hover:bg-white/70 hover:text-[#0066cc]"
                  >
                    <Home className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    title="Logout"
                    aria-label="Logout"
                    onClick={handleLogout}
                    className="flex items-center justify-center h-9 w-9 mx-auto text-red-600 hover:bg-white/70"
                  >
                    <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 min-h-[36px] px-2 py-1.5 text-[13px] text-gray-900 hover:bg-white/60 hover:text-[#0066cc]"
                  >
                    <Home className="h-[18px] w-[18px] text-gray-500" strokeWidth={1.75} />
                    <span className="underline underline-offset-2 decoration-gray-900">Home</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 min-h-[36px] px-2 py-1.5 text-[13px] text-red-600 hover:bg-white/60"
                  >
                    <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    <span className="underline underline-offset-2 decoration-red-600">Logout</span>
                  </button>
                </li>
              </ul>
            )}
          </div>

          {navCollapsed && (
            <div className="lg:hidden px-3 py-2.5 mt-auto border-t border-gray-200/80">
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 min-h-[36px] px-2 py-1.5 text-[13px]"
                  >
                    <Home className="h-[18px] w-[18px] text-gray-500" />
                    <span className="underline underline-offset-2">Home</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 min-h-[36px] px-2 py-1.5 text-[13px] text-red-600"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    <span className="underline underline-offset-2 decoration-red-600">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-20 lg:hidden top-14 sm:top-16 cursor-default"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        className={`pt-14 sm:pt-16 ${mainPad} min-h-screen min-h-[100dvh] transition-[padding] duration-300`}
      >
        <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </main>
    </div>
  );
}
