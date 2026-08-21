'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyLoad({
  children,
  placeholder = <div className="min-h-[200px] bg-gray-100 animate-pulse" />,
  rootMargin = '50px',
  threshold = 0.01,
  className,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
}
