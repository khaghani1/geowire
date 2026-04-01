'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';

/**
 * LanguageSwitcher
 *
 * Shows the current locale as a badge when only one locale is configured.
 * Renders a <select> dropdown when multiple locales are available.
 * Switching locale replaces the /[locale] segment in the current URL.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('languageSwitcher');

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    // Replace the leading /[locale] segment — e.g. /en/dashboard → /fr/dashboard
    const newPath = pathname.replace(/^\/[^/]+/, `/${newLocale}`);
    router.push(newPath);
  }

  const currentLabel = t(locale as 'en');

  // Only one locale configured — show a static badge (no interactivity needed)
  if (locales.length === 1) {
    return (
      <span className="gw-lang-badge" aria-label={currentLabel}>
        {currentLabel}
      </span>
    );
  }

  // Multiple locales — show a dropdown
  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label="Select language"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        color: 'var(--text-primary)',
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        padding: '4px 8px',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {t(l as 'en')}
        </option>
      ))}
    </select>
  );
}
