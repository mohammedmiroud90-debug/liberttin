/**
 * Performance monitoring utilities for Core Web Vitals
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', metric);
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(console.error);
  }
}

/**
 * Get performance rating based on thresholds
 */
export function getPerformanceRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25], // Cumulative Layout Shift
    FID: [100, 300], // First Input Delay (ms)
    LCP: [2500, 4000], // Largest Contentful Paint (ms)
    FCP: [1800, 3000], // First Contentful Paint (ms)
    TTFB: [800, 1800], // Time to First Byte (ms)
    INP: [200, 500], // Interaction to Next Paint (ms)
  };

  const [good, poor] = thresholds[name] || [0, 0];

  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Measure custom performance timing
 */
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now();

  const finish = () => {
    const duration = performance.now() - start;
    console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);
  };

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(finish);
  } else {
    finish();
    return result;
  }
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(element: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;

        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }

        observer.unobserve(img);
      }
    });
  });

  observer.observe(element);
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Check if device supports WebP
 */
export async function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src =
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request Idle Callback polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback) => setTimeout(callback, 1);

/**
 * Cancel Idle Callback polyfill
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

/**
 * Check connection quality
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'medium';
  }

  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType;

  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow';
  }

  if (effectiveType === '3g') {
    return 'medium';
  }

  return 'fast';
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get device memory (if available)
 */
export function getDeviceMemory(): number | undefined {
  if (typeof navigator === 'undefined') return undefined;

  return (navigator as any).deviceMemory;
}

/**
 * Check if device is low-end
 */
export function isLowEndDevice(): boolean {
  const memory = getDeviceMemory();
  const connection = getConnectionQuality();

  return (memory !== undefined && memory <= 4) || connection === 'slow';
}
