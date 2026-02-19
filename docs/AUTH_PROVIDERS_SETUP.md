# Auth Providers Setup

Portalo supports two authentication methods: **Google OAuth** and **Magic Link** (passwordless email). The application code is fully wired — this guide covers the external configuration needed to make each provider work.

---

## 1. Magic Link (Email OTP)

Magic link works out of the box for local development with no external setup.

### Local Development

Supabase local dev uses **Inbucket**, a built-in email testing server. Magic link emails are captured there instead of being sent to real inboxes.

1. Start Supabase locally:
   ```bash
   npx supabase start
   ```
2. Open Inbucket at **http://127.0.0.1:54324**
3. Go to `http://localhost:3000/login`, enter any email, click "Send magic link"
4. Switch to Inbucket, find the email, click the confirmation link
5. You'll be redirected to `/dashboard`

No env vars or external services required for local magic link.

### Production

For production, configure an SMTP provider so emails reach real inboxes.

**Option A: Supabase Dashboard (hosted project)**

1. Go to your Supabase project → **Settings** → **Authentication** → **SMTP Settings**
2. Enable custom SMTP
3. Enter your SMTP credentials (e.g., Resend, SendGrid, Postmark)

**Option B: `config.toml` (self-hosted / CI)**

Uncomment and fill in the SMTP block in `supabase/config.toml`:

```toml
[auth.email.smtp]
enabled = true
host = "smtp.resend.com"
port = 465
user = "resend"
pass = "env(RESEND_API_KEY)"
admin_email = "noreply@portalo.so"
sender_name = "Portalo"
```

Add `RESEND_API_KEY` to your `.env` or deployment secrets.

**Email settings reference** (`config.toml`):

| Setting | Current Value | Notes |
|---------|--------------|-------|
| `enable_confirmations` | `false` | Users don't need to confirm email before signing in |
| `double_confirm_changes` | `true` | Email changes require confirmation on both old and new |
| `max_frequency` | `1s` | Min time between emails (increase in production) |
| `otp_length` | `6` | Characters in the OTP code |
| `otp_expiry` | `3600` | OTP valid for 1 hour |

---

## 2. Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Set the app name (e.g., "Portalo")
7. Add **Authorized redirect URIs**:

   | Environment | Redirect URI |
   |-------------|-------------|
   | Local (Supabase) | `http://127.0.0.1:54321/auth/v1/callback` |
   | Production | `https://<your-project-ref>.supabase.co/auth/v1/callback` |

8. Click **Create** and note your **Client ID** and **Client Secret**

> The redirect URI points to Supabase's auth server, not your app directly. Supabase handles the OAuth exchange and then redirects to your app's `/auth/callback` route.

### Step 2: Configure the OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: `Portalo`
   - User support email: your email
   - Authorized domains: `portalo.so` (production) or leave blank for testing
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. For testing, add your email under **Test users** (required while app is in "Testing" status)
6. Submit

> While in "Testing" status, only emails listed as test users can sign in. Move to "Production" status (and complete Google's verification if needed) to allow any Google account.

### Step 3a: Configure Supabase — Local Development

Add the Google provider to `supabase/config.toml`. Place this block after the existing `[auth.external.apple]` section:

```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
skip_nonce_check = true
```

Then add the credentials to your `.env` file (in the project root, used by `supabase start`):

```bash
GOOGLE_CLIENT_ID=123456789-xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
```

Restart Supabase to pick up the changes:

```bash
npx supabase stop && npx supabase start
```

> `skip_nonce_check = true` is required for local development with Google OAuth.

### Step 3b: Configure Supabase — Production (Hosted)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers** → **Google**
3. Toggle **Enable Google provider**
4. Paste your **Client ID** and **Client Secret**
5. Copy the **Callback URL** shown in the Supabase dashboard
6. Go back to Google Cloud Console and verify this URL is in your **Authorized redirect URIs**
7. Save

No code changes needed — the app reads the provider config from Supabase at runtime.

---

## Auth Flow Summary

The application code handles both providers through the same flow:

```
User clicks "Sign in with Google" or "Send magic link"
  ↓
Google: supabase.auth.signInWithOAuth({ provider: "google" })
  → Redirects to Google → Google redirects to Supabase callback
  → Supabase redirects to /auth/callback?code=...

Magic Link: supabase.auth.signInWithOtp({ email })
  → Email sent → User clicks link → Redirected to /auth/callback?code=...

/auth/callback route (app/(auth)/auth/callback/route.ts):
  → Exchanges code for session via supabase.auth.exchangeCodeForSession()
  → Redirects to /dashboard

Middleware (middleware.ts):
  → Protects /dashboard/* routes — redirects to /login if unauthenticated
  → Redirects /login, /signup to /dashboard if already authenticated
```

### Relevant Files

| File | Purpose |
|------|---------|
| `apps/web/app/(auth)/login/page.tsx` | Login page — Google button + magic link form |
| `apps/web/app/(auth)/signup/page.tsx` | Signup page — same providers, different copy |
| `apps/web/app/(auth)/auth/callback/route.ts` | Exchanges auth code for session |
| `apps/web/middleware.ts` | Route protection + auth redirects |
| `apps/web/lib/supabase/client.ts` | Browser Supabase client |
| `apps/web/lib/supabase/server.ts` | Server Supabase client (cookies) |
| `supabase/config.toml` | Local Supabase config (providers, email settings) |

---

## Troubleshooting

**Google OAuth redirects but nothing happens / error page**
- Verify the redirect URI in Google Cloud Console matches exactly: `http://127.0.0.1:54321/auth/v1/callback` (local) or `https://<ref>.supabase.co/auth/v1/callback` (production)
- Check that `skip_nonce_check = true` is set for local dev in `config.toml`
- Ensure you've restarted Supabase after changing `config.toml`

**Magic link email never arrives (production)**
- Verify SMTP is configured in Supabase dashboard or `config.toml`
- Check your SMTP provider's logs for delivery failures
- Ensure `auth.email.enable_signup = true` in config

**Magic link email not in Inbucket (local)**
- Confirm Supabase is running: `npx supabase status`
- Open `http://127.0.0.1:54324` — emails appear under the recipient address
- Check that `auth.email.max_frequency` isn't throttling (default: `1s`)

**"Email rate limit exceeded"**
- Local: `auth.rate_limit.email_sent = 2` per hour by default — increase in `config.toml` for testing
- Production: increase in Supabase dashboard under Auth settings

**User signs in but profile is missing**
- The `on_auth_user_created` trigger in `001_create_profiles.sql` auto-creates a profile row when a new user signs up via Supabase Auth
- If the trigger didn't fire, check `supabase/migrations/001_create_profiles.sql` is applied
- For seeded users, `supabase/seed.sql` inserts both `auth.users` and `profiles` rows
