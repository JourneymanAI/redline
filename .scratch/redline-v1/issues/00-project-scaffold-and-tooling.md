# 00: Project scaffold & tooling

**Renumbered 2026-09-11:** moved from 01 to 00 and out of the numbered
backlog. This is real, already-complete infrastructure setup, not a pickable
ticket — renumbering the rest of the backlog so ticket 01 is Auth (nothing
blocking it) and ticket 02 is document parsing matches this course's
prescribed check: "ticket one should be auth, with nothing blocking it;
every ticket that analyses a document should be blocked by the ticket that
parses one." Every ticket from 01 on treats this one as already done.

**What to build:** Set up the Next.js (App Router) + TypeScript project skeleton
and the tooling the rest of the build depends on: typecheck, lint, a test
runner, and a production build, wired into one documented sequence that must
pass before any ticket is called done (per `CLAUDE.md`'s "unattended run"
rule). Define the model-boundary interface — the single injectable seam every
model call goes through — with only a test implementation backed by recorded
responses; no real OpenRouter call yet.

Package manager decided: npm.

**Blocked by:** None

**Status:** in-progress

- [x] `typecheck` (`next typegen && tsc --noEmit`), `lint` (`eslint`), and a
      production `build` (`next build`) all pass on the empty scaffold, run
      as a documented `npm run` sequence. No test runner wired in yet — that
      needs its own dependency decision (Vitest vs. Jest vs. Playwright)
      before it can be added, per "ask before adding any dependency."
- [ ] The model-boundary interface is defined and the only implementation
      wired in is the test double (recorded responses keyed by input)
- [ ] No OpenRouter or Supabase dependency is installed or called
