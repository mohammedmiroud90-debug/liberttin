'use client';

import { useState } from 'react';
import { getDefaultAvatar } from '@/lib/avatar';

interface AvatarImageProps {
  src?: string | null;
  alt: string;
  fallbackId?: string;
  size?: number;
  className?: string;
  borderClassName?: string;
}

/**
 * Professional Avatar Image Component
 * Automatically falls back to default avatar if src is null/undefined or fails to load
 * Matches the clean medical professional style from the screenshot
 */
export function AvatarImage({
  src,
  alt,
  fallbackId = 'default',
  size = 200,
  className = 'w-24 h-24',
  borderClassName = 'border-4 border-gray-200 hover:border-teal-400',
}: AvatarImageProps) {
  const [imgSrc, setImgSrc] = useState(src || getDefaultAvatar(fallbackId, size));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getDefaultAvatar(fallbackId, size));
    }
  };

  return (
    <div
      className={`
        ${className}
        rounded-full 
        overflow-hidden 
        bg-gray-100 
        ${borderClassName}
        transition-all 
        duration-300 
        shadow-sm
      `}
    >
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}
