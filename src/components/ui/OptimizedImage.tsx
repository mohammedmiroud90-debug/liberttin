'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string;
  showPlaceholder?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/placeholder-image.jpg',
  showPlaceholder = true,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={error ? fallback : src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
    </div>
  );
}
