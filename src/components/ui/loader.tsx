'use client';

export function Loader() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative flex h-[4.25rem] w-28 items-center justify-center gap-2">
        <span className="loader-bar loader-bar-1" />
        <span className="loader-bar loader-bar-2" />
        <span className="loader-bar loader-bar-3" />
        <span className="loader-bar loader-bar-4" />
      </div>
    </div>
  );
}
