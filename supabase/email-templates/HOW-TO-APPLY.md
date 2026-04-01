# Applying the GeoWire Email Templates in Supabase

## Magic Link email (the only one you need right now)

1. Go to **Supabase Dashboard** → your project → **Authentication** → **Email Templates**
2. Click **"Magic Link"** in the left sidebar
3. Set **Subject** to:
   ```
   Sign in to GeoWire
   ```
4. Paste the entire contents of `magic-link.html` into the **Body (HTML)** editor
5. Click **Save**
6. (Optional) In **Authentication → SMTP Settings**, set:
   - **Sender name**: `GeoWire`
   - **Sender email**: `noreply@geowire.org` (or any verified sending address)

## What `{{ .ConfirmationURL }}` means

Supabase replaces `{{ .ConfirmationURL }}` with the actual magic link URL at send time.
Do not change it — it must appear exactly as written.

## Sending domain

For emails to not land in spam, make sure you either:
- Use Supabase's default sending (fine for testing / low volume)
- Or configure a custom SMTP provider (Resend, Postmark, SendGrid) under
  **Authentication → SMTP Settings** and verify your domain's SPF/DKIM records

## Google OAuth (future step)

The Google "Continue with Google" button has been removed from the login page until
OAuth credentials are ready. To add it back:

1. Get Google OAuth credentials from **Google Cloud Console → APIs & Services → Credentials**
   - Authorized redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
2. In Supabase: **Authentication → Providers → Google** → enable + paste Client ID + Secret
3. Uncomment the Google button in `src/app/[locale]/auth/login/page.tsx`
