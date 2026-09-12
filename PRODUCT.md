# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), Supabase (auth + database), deployed on Vercel; all
model calls go through OpenRouter, server-side. Package manager: npm. The
OpenRouter model slug and the Supabase project are still undecided —
implementation cannot call the model or touch Supabase until the human
supplies each (see the v1 spec's "Blocked on").

## Users

**Primary: the Signer** — a small-business owner or founder who reviews
inbound vendor, customer, and contractor contracts (MSAs, SOWs, NDAs, SaaS
terms) as a recurring part of running the business, and has been burned by a
bad clause at least once. They know roughly what an indemnity clause or a
liability cap is; they are not a lawyer and not a corporate legal team. They
want a fast, specific read on whether *this* contract is bad and what to say
back — not a vocabulary lesson.

Explicitly not served in v1 (ADR 0002): freelancers (real pain, but $10–$50
willingness to pay can't cover model cost), renters/consumer ToS (near-zero
willingness to pay), first-time signers needing legal vocabulary taught from
scratch, and — despite having the highest per-document willingness to pay
found in research ($350–$1,000) — employees reviewing a one-off severance or
offer letter, because that's a once-in-years event with no repeat use, and the
product's core bet (red lines + library) is a repeat-use bet.

## Product Purpose

Redline reads an inbound contract before the signer signs it and answers
"should I sign this, and what do I push back on?" It returns, on one screen: a
plain-English summary; the clauses that work against the signer, ranked
Blocker/Push/Note, each anchored to the exact source sentence; drafted
counter-offer language per flagged clause; and a question box that answers
only from the contract text. Success is a signer who can decide and negotiate
without paying $400+ for a lawyer on a routine contract — and who, on a
genuinely clean contract, is told so plainly instead of getting a padded list
of manufactured problems.

## Positioning

Every incumbent in this space — enterprise tools (Spellbook, LegalOn,
LawGeex) and consumer tools alike (Detangle.ai, DoNotPay, raw ChatGPT/Claude)
— shares the same unsolved failure: accuracy. Nobody has solved "trust the
output without a lawyer checking it," and DoNotPay drew an FTC penalty for
overclaiming. Redline's wedge is that every claim it makes points at a
verbatim sentence the signer can read themselves, and its Q&A refuses to
answer anything the document doesn't cover. That is the one thing the free
default (ChatGPT/Claude) and the cheap incumbent (Detangle.ai) both get wrong,
and no competitor bundles it with ranked flags, counter-offers, and grounded
Q&A for a non-lawyer at a price this user will pay. A neighboring product
could copy the feature list; it could not truthfully copy the
citation-integrity guarantee without rebuilding around it.

## Operating Context

The signer receives a contract by email or similar and has to decide, on
their own, whether to sign it and what to push back on. They paste the
contract text directly, or upload a PDF/DOCX that's converted to text in the
browser (the file itself never leaves the browser or reaches the server).
Before analysis runs, they answer two quick questions — which state's law
governs the contract, and which state their business operates in. They can
decline to answer either ("I don't know"). The result is a single screen; if
something's still open after reading it, they can ask a follow-up in the Q&A
box. Each analysis is tied to their account, so their own red lines and past
reviews carry forward.

## Capabilities and Constraints

- Fixed v1 clause set (15 types): IP assignment, auto-renewal, vague
  scope/unlimited revisions, unilateral termination without a kill fee,
  uncapped indemnification, one-sided liability cap, forced arbitration,
  non-compete/non-solicit, fee escalator, personal guarantee, unilateral
  amendment, confidentiality overreach, joint-and-several liability,
  restrictive cancellation method, and governing law itself (always a Note).
  Anything else the model notices surfaces separately, at lower confidence,
  as "also seen" — never as a flag.
- Citation integrity is a hard gate, not a target: a flag whose source
  sentence isn't a verbatim substring of the pasted text is dropped, never
  shown approximated or repaired.
- A clause becomes a flag only if it creates serious uncapped/large downside,
  loss of core IP, or inescapable lock-in, or it crosses one of the signer's
  own red lines. Being merely unusual is never enough on its own.
- Severity (Blocker/Push/Note) is the action to take, not a score, and is not
  comparable within a level.
- The (clause type × governing-law state) severity-adjustment table is
  maintained with a last-reviewed date; a stale date is a bug, not a later
  cleanup.
- v1 analyses only the text the signer pastes or uploads — it never fetches
  or assembles documents incorporated by reference, and says so plainly.
- Model calls are server-side only, through a single injectable OpenRouter
  boundary; one call per analysis, one per Q&A question; the app fails loudly
  if the model slug is missing rather than defaulting to one.
- Out of scope for v1: payments/billing/pricing, OCR or any scanned/
  image-only document handling (a citation to mis-OCR'd text is worthless),
  sharing a document or review between users, post-signature review ("what am
  I bound by / how do I get out"), a novice-explainer mode, non-US governing
  law beyond a "cannot assess this" notice, and a full multi-state legal
  rules engine.
- Undecided, not yet blocking the product definition: pricing and packaging;
  OpenRouter model slug; Supabase project.

## Brand Commitments

Name: **Redline**. Domain vocabulary is binding (`CONTEXT.md`): say "signer,"
"flag," "red line," "counter-offer" — avoid "customer," "reviewer," "issue,"
"finding," "warning," and never use "redline" or "red line" as a verb. No
logo, tagline, or other visual assets exist yet.

## Evidence on Hand

Four-agent discovery research lives in `research/` (`summary.md` plus
per-agent files) with sourced, dated citations: real pain testimony (Hacker
News, Blind) on IP-assignment, forced-arbitration, and non-compete clauses; a
documented competitive landscape (Spellbook, LegalOn, LawGeex, Robin AI,
Detangle.ai, DoNotPay, ToS;DR) with pricing and their accuracy complaints; and
a willingness-to-pay table by segment. No customer testimonials, case
studies, or usage data exist yet — this is pre-launch; future work must not
fabricate them. No fixture contracts or eval results exist yet either
(`spec.md`: "Prior art: none — this is the first code in the repo").

## Product Principles

1. **A claim without a verbatim source sentence doesn't ship.** Citation
   integrity is the product's entire trust mechanism, not a feature among
   features — a flag that fails verification is dropped, not shown weaker.
2. **Never manufacture a problem to look useful.** A clause is flagged on its
   actual, specific downside or a red line it crosses — not because "unusual"
   alone is easier to justify than silence. A clean contract gets a clean,
   first-class verdict.
3. **The signer's own red lines outrank market norms.** Something the signer
   has declared a non-negotiable is flagged even when it's completely
   standard, and the product says which reason applied.
4. **Redline is a repeat-use product, not a one-off report.** The red-lines
   list and library only pay off with return visits (ADR 0002) — onboarding
   exists to get a signer to one real, useful review fast, not to a one-time
   analysis.
5. **State what the clause says; label what Redline thinks.** The factual
   quote is never hedged; every judgment — severity, "broader than typical" —
   carries an explicit confidence marker, including a real "unclear, get a
   human to look" state.

## Accessibility & Inclusion

No product-specific requirement established yet.
