# Supabase setup

This project uses Supabase for auth (trade account sign-in/registration) and data
(catalogue, orders, invoices, addresses). Two things need to be done once, by hand,
in the Supabase dashboard for project `dvpcdcjbwjcuqxbpflnz`.

## 1. Apply the schema

1. Open the Supabase dashboard → your project → **SQL Editor** → **New query**.
2. Paste the contents of `supabase/migrations/0001_init.sql`, click **Run**.
3. Paste the contents of `supabase/migrations/0002_signup_trigger.sql`, click **Run**.

This creates all tables, Row Level Security policies, and seeds the 4 catalogue
products plus the 3 business-type pricing tiers. It also creates a trigger so that
every `supabase.auth.signUp()` call automatically creates a matching `businesses`
row and a starter credit account.

## 2. Turn off email confirmation (for now)

By default Supabase requires a user to click a confirmation link in their email
before they can sign in. To let newly registered accounts sign in immediately:

Dashboard → **Authentication** → **Sign In / Providers** → **Email** → turn off
**Confirm email**.

You can turn this back on later once real email delivery is configured — no code
changes needed either way, `src/lib/auth/auth-context.tsx` already handles both
cases (it shows a "check your inbox" message if no session comes back from signUp).

## Environment variables

`.env` (already present, gitignored) needs:

```
NEXT_PUBLIC_SUPABASE_URL=https://dvpcdcjbwjcuqxbpflnz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/public key from Project Settings > API>
```

Both must be `NEXT_PUBLIC_` prefixed since the Supabase client runs in the browser
throughout this app.
