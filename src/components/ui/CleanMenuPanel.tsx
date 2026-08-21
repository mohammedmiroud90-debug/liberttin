'use client';

import { Link } from '@/i18n/routing';

export type MenuPanelItem = {
  name: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  danger?: boolean;
};

export type MenuPanelSection = {
  title: string;
  items: MenuPanelItem[];
};

function isExternalHref(href?: string, external?: boolean) {
  if (external) return true;
  if (!href) return false;
  return /^https?:\/\//i.test(href);
}

export function CleanMenuPanel({
  title,
  titleHref,
  titleExternal,
  items,
  sections,
  footer,
  onNavigate,
  className = '',
}: {
  title: string;
  titleHref?: string;
  titleExternal?: boolean;
  items?: MenuPanelItem[];
  /** Optional grouped sections (used by the More menu). */
  sections?: MenuPanelSection[];
  footer?: { name: string; href?: string; external?: boolean; onClick?: () => void };
  onNavigate?: () => void;
  className?: string;
}) {
  const linkClass =
    'underline underline-offset-2 decoration-gray-900 hover:text-[#0066cc] hover:decoration-[#0066cc] transition-colors';
  const dangerClass =
    'underline underline-offset-2 decoration-red-600 text-red-600 hover:text-red-700 hover:decoration-red-700 transition-colors';

  const renderItem = (item: MenuPanelItem) => {
    const className = item.danger ? dangerClass : linkClass;
    const onClick = () => {
      item.onClick?.();
      onNavigate?.();
    };

    if (item.href && isExternalHref(item.href, item.external)) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={className}
        >
          {item.name}
        </a>
      );
    }

    if (item.href) {
      return (
        <Link href={item.href} onClick={onClick} className={className}>
          {item.name}
        </Link>
      );
    }

    return (
      <button type="button" onClick={onClick} className={`text-left ${className}`}>
        {item.name}
      </button>
    );
  };

  const flatItems = items ?? [];
  const hasSections = Boolean(sections && sections.length > 0);

  return (
    <div className={`w-full bg-[#f2f2f2] text-black p-5 text-left ${className}`}>
      <h3 className="text-xl font-bold text-[#0066cc] mb-4 leading-tight">
        {titleHref ? (
          isExternalHref(titleHref, titleExternal) ? (
            <a
              href={titleHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
              className="hover:underline"
            >
              {title}
            </a>
          ) : (
            <Link href={titleHref} onClick={onNavigate} className="hover:underline">
              {title}
            </Link>
          )
        ) : (
          title
        )}
      </h3>

      {hasSections ? (
        <div className="space-y-5">
          {sections!.map((section) => (
            <div key={section.title}>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
                {section.title}
              </p>
              <ul className="space-y-2.5 text-sm text-gray-900 leading-snug">
                {section.items.map((item) => (
                  <li key={`${section.title}-${item.name}`}>{renderItem(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2.5 text-sm text-gray-900 leading-snug">
          {flatItems.map((item) => (
            <li key={item.name}>{renderItem(item)}</li>
          ))}
        </ul>
      )}

      {footer && (
        <div className="mt-4 border-t border-gray-300 pt-3 text-sm">
          {footer.href && isExternalHref(footer.href, footer.external) ? (
            <a
              href={footer.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                footer.onClick?.();
                onNavigate?.();
              }}
              className="text-gray-900 hover:text-[#0066cc] transition-colors"
            >
              {footer.name}
            </a>
          ) : footer.href ? (
            <Link
              href={footer.href}
              onClick={() => {
                footer.onClick?.();
                onNavigate?.();
              }}
              className="text-gray-900 hover:text-[#0066cc] transition-colors"
            >
              {footer.name}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                footer.onClick?.();
                onNavigate?.();
              }}
              className="text-left text-gray-900 hover:text-[#0066cc] transition-colors"
            >
              {footer.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
