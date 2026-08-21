'use client';

import { useEffect, useState } from 'react';

/**
 * Reading progress indicator that shows at the top of the page
 * as the user scrolls through the article content.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Get the article content element or fallback to document
      const article = document.querySelector('article') || document.documentElement;
      const scrollTop = window.scrollY;
      const docHeight = article.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });
    // Update on resize
    window.addEventListener('resize', updateProgress, { passive: true });
    // Initial update
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div
        className="h-full bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}

/**
 * Alternative circular reading progress indicator that appears
 * in the bottom-right corner with scroll-to-top functionality.
 */
export function ReadingProgressCircle() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article') || document.documentElement;
      const scrollTop = window.scrollY;
      const docHeight = article.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  const circumference = 2 * Math.PI * 18; // radius = 18
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-white shadow-lg hover:shadow-xl transition-shadow rounded-full flex items-center justify-center group"
      aria-label="Scroll to top"
    >
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Up arrow icon */}
      <svg
        className="absolute w-5 h-5 text-gray-700 group-hover:text-teal-600 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
