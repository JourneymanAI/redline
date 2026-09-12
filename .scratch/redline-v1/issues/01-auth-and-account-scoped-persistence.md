# 01: Auth & account-scoped persistence

**Renumbered 2026-09-11 from 14 to 01**, per this course's ticket-one-is-auth
convention (Session 3). Nothing in the ticket graph blocks it — ticket 00
(scaffold) is already done.

**What to build:** Cannot start until the Supabase project is supplied
(spec's "Blocked on") — this is an external blocker on a human decision, not
a blocking ticket. Set up Supabase auth and the base schema for a signer's
data (reviews, red lines), with every row scoped to the authenticated signer.
A signer can create an account and log in.

**Blocked by:** None (externally blocked on the Supabase project decision —
see PRODUCT.md's "Undecided" list)

**Status:** ready-for-agent

- [ ] A signer can create an account and log in
- [ ] A minimal access test confirms a signer cannot read another signer's
      rows
- [ ] Session persists across a reload
