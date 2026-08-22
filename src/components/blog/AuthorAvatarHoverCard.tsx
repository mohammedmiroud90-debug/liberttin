'use client';

import { Link } from '@/i18n/routing';
import { getDefaultAvatar } from '@/lib/avatar';

type Props = {
  author: string;
  avatar?: string;
  bio?: string;
  aboutHref?: string;
  size?: number;
  className?: string;
};

const SOCIAL = [
  { label: 'X', href: 'https://x.com/liberttin' },
  { label: 'GitHub', href: 'https://github.com/liberttin' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/liberttin' },
  { label: 'Email', href: 'mailto:contact@liberttin.blog' },
];

function AuthorAvatar({
  author,
  avatar,
  size,
  className = '',
}: {
  author: string;
  avatar?: string;
  size: number;
  className?: string;
}) {
  const src = avatar || getDefaultAvatar(author, size * 2);

  return (
    <span
      className={`author-hover__avatar ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={author}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          const img = event.currentTarget;
          if (img.dataset.fallbackApplied) return;
          img.dataset.fallbackApplied = '1';
          img.src = getDefaultAvatar(author, size * 2);
        }}
      />
    </span>
  );
}

export function AuthorAvatarHoverCard({
  author,
  avatar,
  bio,
  aboutHref = '/about/',
  size = 44,
  className = '',
}: Props) {
  return (
    <div className={`author-hover ${className}`.trim()}>
      <button
        type="button"
        className="author-hover__trigger"
        aria-label={`About ${author}`}
        aria-haspopup="dialog"
      >
        <AuthorAvatar author={author} avatar={avatar} size={size} />
      </button>

      <div className="author-hover__card" role="dialog" aria-label={`${author} profile`}>
        <div className="author-hover__card-head">
          <AuthorAvatar author={author} avatar={avatar} size={52} />
          <div>
            <p className="author-hover__name">{author}</p>
            <Link href={aboutHref} className="author-hover__link">
              View author profile
            </Link>
          </div>
        </div>

        {bio ? <p className="author-hover__bio">{bio}</p> : null}

        <div className="author-hover__social">
          {SOCIAL.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="author-hover__social-link"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
