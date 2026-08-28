# Redline — CLAUDE.md

Redline is a web app. Someone uploads a contract, lease, freelance agreement, or
terms of service and gets back: a plain-English summary; the clauses that could hurt
them, ranked by severity, each shown with its exact source sentence; a drafted
counter-offer per flagged clause; a question box answered only from the document; an
editable list of the user's own "red lines" that drives the analysis; and a library
of their past documents. Build those six things and nothing else.

## Settled — not open for reinterpretation

- Next.js (App Router), Supabase for auth + database, deployed on Vercel.
- The uploaded file is parsed to text in the browser. The file itself is never sent
  to the server or stored. Only the extracted text is persisted.
- All model calls go through OpenRouter, server-side, key from `.env.local`.
- Every risk flag shows the verbatim sentence it came from. A flag that cannot show
  its source sentence is a bug, not a weaker result.
- State only what the document says — summaries, flags, and counter-offers alike. If
  the text does not support a claim, do not make it.

## Scope

- If something looks like the obvious next step and is not one of the six
  capabilities above, ask before building it.
- Excluded on purpose — do not build and do not quietly add: payments, billing, OCR
  for scanned documents, sharing a document between users. OCR is not a "later"
  feature: a citation is worthless when the text it points at was misread.

## Standing rules — do this

- This repo is public. Secrets live only in `.env.local` (gitignored). Never commit
  a secret; a pushed key is public the moment it lands and has to be rotated.
- Ask before adding any dependency.
- Package manager, OpenRouter model slug, and Supabase project are all undecided.
  Do not scaffold, install, call the model, or run any step that needs Supabase
  credentials until the human supplies each one.
- Unattended run: before calling any task done, run typecheck, lint, tests, and a
  production build, and show the output. Not green is not done.

## Repo note

This folder is its own git repo (remote: `JourneymanAI/redline`) nested inside the
`job-search-os` tree. Never stage or commit Redline files into the parent repo.

## Open only when they matter

- `research/summary.md` — the user research; read before deciding what to build.
- `PRD.md` — the brief; does not exist yet; read before building once it does.
