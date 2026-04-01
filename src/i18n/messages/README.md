# GeoWire — Adding a New Language

All user-facing strings live in `src/i18n/messages/`. Each file is named after its
[BCP 47 locale tag](https://www.iana.org/assignments/language-subtag-registry) (e.g.
`en.json`, `es.json`, `fr.json`).

---

## Step 1 — Copy the English file

```bash
cp src/i18n/messages/en.json src/i18n/messages/fr.json
```

Translate every string value in the new file. Keep all JSON **keys** in English — only
the **values** change. Preserve ICU interpolation placeholders (`{name}`, `{count}`)
and rich-text tags (`<b>`, `<highlight>`) exactly as they appear.

---

## Step 2 — Register the locale in config

Open `src/i18n/config.ts` and add the new locale to the `locales` array:

```ts
// Before
export const locales = ['en'] as const;

// After
export const locales = ['en', 'fr'] as const;
```

Also add a display label in `en.json` (and in your new locale file) under the
`languageSwitcher` namespace:

```json
// en.json
"languageSwitcher": {
  "en": "🇺🇸 English",
  "fr": "🇫🇷 Français"
}

// fr.json
"languageSwitcher": {
  "en": "🇺🇸 English",
  "fr": "🇫🇷 Français"
}
```

---

## Step 3 — Verify the build

```bash
npm run build
npm run start
```

Navigate to `http://localhost:3000/fr` (or whichever locale you added). The
`LanguageSwitcher` in the navbar will automatically show a dropdown now that more than
one locale is registered. Clicking a locale replaces the `/en` segment in the URL.

---

## Notes

- **Namespaces** map 1-to-1 with UI sections (e.g. `nav`, `dashboard`, `login`).
  Pass the namespace to `useTranslations('namespace')` in the component.
- **ICU parameters** like `{count}` are passed as the second argument to `t()`:
  `t('callsRemaining', { count: 42 })`.
- **Rich text** like `<b>{email}</b>` requires `t.rich()` with a component factory:
  `t.rich('checkInboxDetail', { email, b: (c) => <strong>{c}</strong> })`.
- The `LanguageSwitcher` component reads `locales` from config at build time — no
  code change is needed there once you've updated the config.
