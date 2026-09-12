# 01: Auth & account-scoped persistence

**Renumbered 2026-09-11 from 14 to 01**, per this course's ticket-one-is-auth
convention (Session 3). Nothing in the ticket graph blocks it — ticket 00
(scaffold) is already done.

**What to build:** Cannot start until the Supabase project is supplied
(spec's "Blocked on") — this is an external blocker on a human decision, not
a blocking ticket. Set up Supabase auth and the base schema for a signer's
data (reviews, red lines), with every row scoped to the authenticated signer.
A signer can create an account and log in.

**Blocked by:** None. Supabase project decided and connected; `.env.local`
holds `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

**Status:** in-progress

- [x] A signer can create an account and log in — `/login` (sign up / sign
      in toggle), `/auth/confirm` (email confirmation), `/account`
      (protected). Verified live against the real Supabase project: signup,
      email confirmation, and login all confirmed working by the human.
- [x] Session persists across a reload — confirmed by the human on
      `/account`.
- [ ] A minimal access test confirms a signer cannot read another signer's
      rows — schema + RLS policies are written and applied
      (`supabase/migrations/0001_auth_schema.sql`: `reviews` and
      `red_lines`, both `auth.uid() = user_id` on every operation), but not
      yet exercised by an actual two-account test. Needs either a second
      confirmed test account or a decision to defer formal verification
      until a test runner exists (ticket 00 flagged this as its own open
      dependency decision).

**Status:** ready-for-agent

- [ ] A signer can create an account and log in
- [ ] A minimal access test confirms a signer cannot read another signer's
      rows
- [ ] Session persists across a reload
