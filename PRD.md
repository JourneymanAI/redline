# Redline — Product Brief (v1)

Written 2026-08-31 against the discovery research in `research/` rather than from
assumption. Decisions someone could reasonably disagree with are called out;
their reasoning lives in `docs/adr/`.

## What Redline is

A pre-signature contract review tool for people who run small businesses. The
signer pastes in an inbound contract — an MSA, SOW, NDA, vendor or SaaS terms —
and gets back a plain-English summary, the clauses that work against them ranked
by what to do about them, drafted counter-offer language for each, and a question
box that answers only from the document. The signer keeps an editable list of
their own red lines that drives the analysis, and a library of past reviews.

The product's job is to be trusted without a lawyer in the room. Every claim it
makes is anchored to a sentence the signer can read for themselves.

## Who it's for

**Primary user:** a small-business owner or founder who reviews contracts as a
recurring part of the job and has been bitten at least once. They know what an
indemnity clause or a liability cap is; they want a fast, specific read on
whether *this* one is bad and what to say back. (ADR 0002)

**Not served in v1, on purpose:**

- **Freelancers.** The pain is real and loud, but at $10–$50 willingness to pay
  the segment cannot support the product without a different business model we
  are not building. Deliberate non-goal.
- **Renters and consumer terms-of-service.** Near-zero willingness to pay.
- **Post-signature review** ("what did I agree to, how do I get out"). A
  different product; most of the pain in the research is here and we are still
  leaving it for later.
- **First-time signers who need the vocabulary explained.** They can use Redline;
  the copy will not be written for them.

## Why it can win

From `research/summary.md`:

- The tools that do this well (Spellbook, LegalOn, LawGeex) are built for
  corporate legal teams, priced at $5K–$100K/year, and unusable without a
  configured playbook the small-business user does not have.
- The consumer-facing options are thin. Detangle.ai gives a summary and a "favor
  score" but no ranked flags with sources, no counter-offers, no
  document-grounded Q&A. DoNotPay drew an FTC penalty for overclaiming.
- No tool bundles Redline's four pillars — summary, sourced flags, counter-offer,
  grounded Q&A — for a non-lawyer at a price this user will pay.
- The one complaint common to every incumbent's users is accuracy. Exact-source-
  sentence citation and a Q&A box that answers only from the document attack that
  directly. It is the wedge, not a feature.

## What it does

1. **Plain-English summary** — what this contract is and what the signer is
   agreeing to, in a few sentences.
2. **Ranked flags with source sentence.** Each flagged clause shows the verbatim
   sentence it came from. A flag that cannot show its source is a bug — withheld,
   never shown unquoted. (ADR 0001)
3. **Counter-offer per flag** — specific replacement language for the flagged
   clause, grounded in what the clause actually says.
4. **Document-grounded Q&A** — answers drawn only from the contract text; when
   the document does not address the question, it says so. Stays inside the
   pre-signature framing.
5. **Editable red lines** — the signer's declared non-negotiables (e.g. "no
   personal guarantee"). A clause that crosses a red line is flagged regardless
   of how standard it is.
6. **Library** — past documents and their analyses, text only; the original file
   is never stored.
7. **Governing-law prompt** — before analysis, Redline asks which state's law
   governs the contract and which state the business operates in, and uses the
   answers to set severity on jurisdiction-sensitive clauses. (ADR 0005)

## The flagging model (ADR 0003)

**Clause set:** IP assignment, auto-renewal, vague scope / unlimited revisions,
unilateral termination without a kill fee, uncapped indemnification, one-sided
liability cap, forced arbitration, non-compete, fee escalator, personal
guarantee, unilateral amendment, confidentiality overreach, joint-and-several
liability, restrictive cancellation method, governing law. Anything else the
model notices is surfaced as lower-confidence "also seen".

**A clause is flagged** only if it creates serious downside the signer cannot cap
or exit, or it crosses a red line. Being unusual is not, by itself, enough.

**Severity is the action to take:** **Blocker** (do not sign as-is), **Push**
(ask for a change), **Note** (know it is there).

## Output posture (ADR 0004)

- **Error preference is per tier.** On the Blocker set — personal guarantee,
  uncapped indemnity, uncapped or one-sided liability, inescapable auto-renew —
  miss nothing; over-flag when unsure. On Push and Note, prefer silence to a
  shaky flag.
- **Fact vs judgment.** The quote is stated plainly and never hedged; the
  severity and any "broader than typical" read carry an explicit confidence
  marker, including a real "unclear — get help" state.
- **Clean verdict.** When nothing reaches Blocker or Push, Redline says so as a
  first-class result. It never manufactures flags to justify the review.

## Out of scope for v1

Payments and billing, OCR / scanned documents, sharing a document between users
(all per `CLAUDE.md`); post-signature review; a novice-explainer mode; assembling
a contract from its incorporated attachments — v1 analyses one pasted document
(see Risks); non-US governing law beyond a "cannot assess this" notice.

## What good looks like

The eval suite is built to measure these. They are the bar for shipping v1.

| # | Criterion | Measure | Target |
|---|---|---|---|
| 1 | **Citation integrity** | Share of flags whose source sentence is a verbatim substring of the stored text | 100% — hard gate (ADR 0001) |
| 2 | **Blocker recall** | On a labelled set of contracts with planted Blocker-tier clauses, share flagged at Blocker | ~100%; a miss here is the failure that ends the product |
| 3 | **Clean-set false-Blocker rate** | On a labelled set of genuinely standard contracts, share that get a false Blocker or Push flag | ~0; the clean verdict fires instead |
| 4 | **Push/Note precision** | On human-reviewed contracts, share of Push/Note flags a reviewer agrees are real and correctly tiered | High enough that the user keeps reading them; threshold set with reviewers, not guessed |
| 5 | **Jurisdiction correctness** | For non-compete / arbitration / liquidated-damages clauses, does severity match the governing-law state (e.g. a California non-compete is not shown as Blocker) | Correct on every jurisdiction-labelled fixture |
| 6 | **Q&A groundedness** | On questions the document does not answer, share where Redline says so rather than answering anyway | ~100%; no fabricated answers |
| 7 | **Counter-offer specificity** | Human rating: does the counter-offer address the specific flagged clause rather than generic boilerplate | Specific, not generic, on every flag |
| 8 | **Red-lines effect** | Adding a red line that a clause crosses moves that clause from unflagged to flagged | Always |

## Assumptions and risks

- **Unauthorised practice of law.** A paid tool that tells a small-business owner
  "do not sign this", drafts contract language, and makes state-law-contingent
  calls is closer to the UPL line than the "we just explain what you are signing"
  framing. Needs a real disclaimer posture and, likely, counsel review before
  launch.
- **Single-document analysis.** v1 reads one pasted document. If the personal
  guarantee lives in an order form incorporated by reference and only the MSA is
  pasted, Redline can return a confident clean verdict that is wrong on the
  catastrophic tier. The product must tell the signer, plainly, that it only read
  what they gave it.
- **Templated counter-offers.** If the counter-offer language is recognisably the
  same across users, counterparties' legal teams will learn to spot and hard-line
  against "Redline redlines", weakening the signer's position.
- **Model cost vs price.** A full analysis plus a Q&A session through OpenRouter
  carries a real per-review cost; the pricing model (not yet decided) has to
  clear it at the small-business user's willingness to pay.
- **Jurisdiction rules go stale.** The (clause type x state) severity table has
  to be dated and maintained as law changes.

## Deferred (not decided)

Pricing and packaging; package manager, model slug, and Supabase project
(`CLAUDE.md`); post-signature review as a later product; multi-document
assembly; expansion beyond the small-business segment.
