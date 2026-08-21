'use client';

import Image from 'next/image';

interface AvatarWithFallbackProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYuxj4s7L6KfVLpdpRCT2OwwphbNJAEzLbh3yPOua0RA&s=10';

export function AvatarWithFallback({
  src,
  alt,
  size = 40,
  className = '',
}: AvatarWithFallbackProps) {
  const avatarSrc = src || DEFAULT_AVATAR;

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={avatarSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = DEFAULT_AVATAR;
        }}
      />
    </div>
  );
}
