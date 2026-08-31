# Redline v1 — Specification

Status: ready-for-agent
Created: 2026-08-31
Sources: `PRD.md`, `docs/adr/0001`–`0005`, `CONTEXT.md`
Blocked on: package manager, OpenRouter model slug, and Supabase project are all
undecided (`CLAUDE.md`). Implementation cannot scaffold, install, call the model,
or touch Supabase until the human supplies each. The spec is complete without
them; only build ordering waits.

## Problem Statement

A small-business owner or founder is sent a contract to sign — an MSA, SOW, NDA,
vendor or SaaS terms — and has to decide whether to sign it and what to push back
on, without a lawyer. They know roughly what an indemnity clause or a liability
cap is, but they cannot tell whether *this* one is standard or predatory, they do
not know which clauses can actually hurt them versus which are merely unusual, and
paying $400+ for a lawyer to read a routine contract is not worth it. So they
either sign blind or lose hours they do not have. When they have been burned
before, the anxiety is worse and the guesswork is the same.

## Solution

The signer pastes the contract text into Redline, answers two short questions
about governing law, and gets back, in one screen:

- a plain-English summary of what the contract is and what they are agreeing to;
- the clauses that work against them, each shown with the exact sentence it comes
  from, ranked by what to do about it — **Blocker** (do not sign as-is), **Push**
  (ask for a change), **Note** (be aware);
- drafted counter-offer language for each flagged clause;
- a question box that answers only from the contract text, and says so when the
  text does not cover the question.

The signer keeps an editable list of their own red lines (e.g. "no personal
guarantee") that feeds every analysis, and a library of their past reviews. If
the contract is genuinely fine — most are — Redline says so plainly instead of
inventing problems.

Redline is trusted without a lawyer because every claim it makes points at a
sentence the signer can read for themselves.

## User Stories

**Account**

1. As a signer, I want to create an account and log in, so that my red lines and
   library persist across sessions and devices.
2. As a signer, I want my documents and analyses tied to my account only, so that
   no one else can see contracts I have reviewed.
3. As a returning signer, I want to land on my library, so that I can pick up
   where I left off or start a new review.

**Document input**

4. As a signer, I want to paste contract text directly, so that I can get a
   review with no file handling at all.
5. As a signer, I want to upload a PDF or DOCX and have it converted to text in my
   browser, so that I skip copy-paste and the file itself never leaves my machine.
6. As a signer, I want to see the extracted text before analysis runs, so that I
   can confirm it came through cleanly and fix it if not.
7. As a signer, I want to be told plainly that Redline reads only the text I give
   it, so that I understand a clean result does not cover attachments or
   documents referenced but not pasted.
8. As a signer, I want to include several related documents by pasting them
   together as one text, so that the review covers the whole deal I can see —
   knowing Redline will not go and fetch documents I did not provide.

**Governing-law prompt**

9. As a signer, I want to be asked which state's law governs the contract before
   analysis, so that severity on clauses like non-competes reflects whether they
   are even enforceable.
10. As a signer, I want to be asked which state my business operates in, so that
    jurisdiction-sensitive flags account for where I actually am.
11. As a signer, I want to answer "I don't know" for either state, so that I am
    not forced to guess — understanding jurisdiction-sensitive flags will then be
    marked "depends on governing law" instead of given a severity.
12. As a signer, I want Redline to tell me if the contract is governed by non-US
    law, so that I know Redline cannot assess it and the jurisdiction-sensitive
    flags are all marked uncertain.
13. As a signer, I want the governing-law clause itself surfaced as a Note, so
    that I know which state's rules I am accepting for everything else.

**Red lines**

14. As a signer, I want to write my own list of terms I will not accept, so that
    the analysis reflects my priorities and not only generic risk.
15. As a signer, I want to edit or remove red lines at any time, so that the list
    stays current as my situation changes.
16. As a signer, I want a clause that crosses one of my red lines flagged even if
    it is completely standard, so that my non-negotiables are enforced regardless
    of market norms.
17. As a signer, I want a flag that exists because of a red line to say so, so
    that I can tell "this is objectively dangerous" from "this violates a rule I
    set".
18. As a new signer with no red lines yet, I want the analysis to still work, so
    that I am not blocked from a first review — with a light prompt to add some.

**Summary**

19. As a signer, I want a few-sentence plain-English summary of the contract, so
    that I understand the shape of the deal before diving into clauses.
20. As a signer, I want the summary to name the parties, the term, and what I am
    on the hook to do, so that the basics are established.

**Flags — list**

21. As a signer, I want the clauses that work against me collected in one ranked
    list, so that I know where to focus.
22. As a signer, I want flags ordered Blocker, then Push, then Note, so that the
    most urgent items are at the top.
23. As a signer, I want each flag to name the clause type (e.g. "uncapped
    indemnification"), so that I can learn the pattern over time.
24. As a signer, I want the count of flags at each severity at a glance, so that
    I get the overall picture immediately.

**Flags — source sentence**

25. As a signer, I want every flag to show the exact sentence from my contract it
    is based on, word for word, so that I can verify Redline's reading myself.
26. As a signer, I want to expand a flag and see that sentence in the context of
    the surrounding text, so that I can check nothing was taken out of context.
27. As a signer, I want to trust that if a flag is shown, its source sentence is
    real and unaltered, so that I never have to wonder whether Redline made it up.

**Flags — severity**

28. As a signer, I want three levels — Blocker, Push, Note — anchored to the
    action I should take, so that I know what to do rather than only how worried
    to be.
29. As a signer, I want Blocker to mean "do not sign this as-is", so that there
    is no ambiguity about the ones that matter most.
30. As a signer, I want Push to mean "ask for a change; whether it is still
    signable if they refuse depends on your leverage", so that I know it is
    negotiable, not fatal.
31. As a signer, I want Note to mean "worth knowing, not worth a fight", so that
    low-stakes items do not crowd out real ones.

**Flags — what qualifies**

32. As a signer, I want a clause flagged only if it can seriously hurt me — large
    or uncapped cost, losing my core IP, a lock-in I cannot get out of — or it
    crosses a red line, so that I am not drowned in flags for things that are
    merely unusual.
33. As a signer, I want "this is also broader than a typical version of this
    clause" shown as a note on a flag that already qualifies, not as a flag on
    its own, so that Redline is not guessing at market norms.

**Counter-offers**

34. As a signer, I want drafted replacement language for each flagged clause, so
    that I have something concrete to send back rather than writing it myself.
35. As a signer, I want the counter-offer to address the specific clause in my
    contract, not generic boilerplate, so that it is actually usable.
36. As a signer, I want to copy a counter-offer in one action, so that I can
    paste it into my reply or a redline.
37. As a signer, I want to understand that counter-offer language may be
    recognisable to the other side's lawyers, so that I can decide whether to
    reword it in my own voice.

**Confidence and two-register output**

38. As a signer, I want what a clause *says* stated plainly and never hedged, so
    that I can rely on the factual part.
39. As a signer, I want Redline's judgment about a clause (how bad, whether it is
    unusual) marked as a judgment with a confidence signal, so that I know what
    is fact and what is interpretation.
40. As a signer, I want a real "unclear — have someone look at this" state on
    individual clauses, so that Redline admits when it genuinely cannot tell
    rather than bluffing.

**Clean verdict**

41. As a signer, I want Redline to tell me directly when nothing in the contract
    reaches Blocker or Push, so that a clean contract produces a clear "you are
    probably fine" rather than a padded list.
42. As a signer, I want the clean result to still show any Notes and let me ask
    questions, so that "clean" does not mean "nothing to see".
43. As a signer, I want to trust that Redline will not manufacture problems to
    seem useful, so that the flags it does raise carry weight.

**Also seen**

44. As a signer, I want clauses outside Redline's core set that it still noticed
    surfaced separately at lower confidence, so that I get the benefit of a wider
    read without diluting the main flags.

**Q&A**

45. As a signer, I want to ask free-text questions about the contract, so that I
    can check specifics the summary and flags did not cover.
46. As a signer, I want answers drawn only from the contract text, so that I am
    not getting the model's general opinions mixed in.
47. As a signer, I want Redline to say "the document does not address that" when
    it does not, so that silence is not filled with a guess.
48. As a signer, I want answers to point at the relevant part of the text where
    possible, so that I can verify them the way I verify flags.
49. As a signer, I want the Q&A to stay within "should I sign this / what do I
    push back on", so that it does not drift into "how do I get out of a contract
    I already signed".

**Library**

50. As a signer, I want each review saved to a library automatically, so that I
    can come back to it.
51. As a signer, I want the library to store only the text and the analysis,
    never the original file, so that I am not accumulating copies of sensitive
    documents.
52. As a signer, I want to search or filter my past reviews, so that I can find a
    specific contract later.
53. As a signer, I want to reopen a past review and see the same flags, source
    sentences, and counter-offers, so that it is a durable record.
54. As a signer, I want to delete a review, so that I control what is retained.
55. As a signer, I want to re-run a past document against my current red lines, so
    that I can see whether my updated priorities change the picture.

**Trust**

56. As a signer, I want a clear statement that Redline is not legal advice and
    not a lawyer, so that I understand its limits.
57. As a signer, I want to be reminded that Redline read only what I pasted, at
    the point where a clean verdict is shown, so that I do not over-trust it on a
    multi-document deal.

**Edge cases**

58. As a signer, I want a clear error if my pasted text is too short or clearly
    not a contract, so that I do not wait for an analysis that cannot be
    meaningful.
59. As a signer, I want a clear message if analysis fails partway (e.g. the model
    call errors), so that I know to retry rather than seeing a blank or partial
    result.
60. As a signer, I want a very long contract either analysed fully or told
    plainly what could not be covered, so that I am not silently getting a
    partial review.
61. As a signer whose contract has no flags and no notes at all, I want that
    stated as its own clear outcome, so that I am not left wondering if it worked.

## Implementation Decisions

**Modules**

- **Analysis module** — the primary seam. Entry point
  `analyzeContract({ documentText, redLines, governingLawState, operatingState })
  → { summary, flags[], alsoSeen[], verdict }`. Owns: prompt construction, the
  model call (through the injected model boundary), parsing the model output into
  the structured result, the citation-integrity verification pass, severity
  assignment, jurisdiction adjustment, red-line matching, and clean-verdict
  determination.
  - `flag` shape: `{ clauseType, sourceSentence, severity, counterOffer,
    confidenceMarker, reason, isRedLineTrigger, jurisdictionSensitive }`.
  - `verdict`: `{ kind: "flags" }` or `{ kind: "clean", notesCount }`.
  - `confidenceMarker`: `clear` | `our-read` | `unclear-get-help`.
- **Q&A module** — the second seam. `answerFromDocument({ documentText, question })
  → { answer, groundedIn?, addressed }`. Same injected model boundary.
  `addressed` is `false` when the document does not cover the question, and
  `answer` then states exactly that.
- **Model boundary** — a single injectable interface wrapping the OpenRouter
  call. Production implementation calls OpenRouter with the configured model
  slug, server-side, key from `.env.local`. Test implementation returns recorded
  responses keyed by input. No other module calls OpenRouter directly.
- **Document parsing (browser)** — converts an uploaded PDF or DOCX to text in
  the browser; the file is never uploaded or stored (`CLAUDE.md`, ADR 0001).
  Produces the `documentText` string. Pasted text bypasses this entirely.
- **Persistence (Supabase)** — auth, the signer's red-lines list, and the
  library. Stored: document text, the structured analysis, the governing-law
  answers, timestamps. Not stored: the original file. Row access is scoped to
  the authenticated signer.
- **Review UI (Next.js App Router)** — screens: library (landing); new review
  (paste/upload, extracted-text confirmation, governing-law prompt); result
  (summary, flags with expandable source-sentence-in-context, counter-offer
  copy, also-seen section, clean verdict, Q&A box); red-lines editor.

**Citation integrity (ADR 0001)**

- After the model returns flags, the analysis module checks each flag's
  `sourceSentence` is a verbatim substring of `documentText`. A flag that fails
  is dropped — not repaired, not shown with an approximate reference. Dropped
  flags are counted internally for observability.
- The text stored for the library is the exact `documentText` the flags were
  checked against, so a reopened review re-verifies against the same string.

**Flagging model (ADR 0003)**

- The v1 clause set is fixed: the fifteen types named in `CONTEXT.md`. The model
  is asked for these specifically; anything else it returns goes to `alsoSeen`,
  never `flags`.
- A clause enters `flags` only if its `reason` establishes serious uncapped or
  large downside, loss of core IP, or inescapable lock-in — or `isRedLineTrigger`
  is true. "Unusual" alone becomes a note on a qualifying flag, or is dropped.
- Severity is `Blocker` | `Push` | `Note`, assigned by the action definitions.
  Not numeric, not ordered within a level.

**Output posture (ADR 0004)**

- Error preference is applied per tier, in the prompt and in a post-check: for
  the Blocker set (personal guarantee, uncapped indemnification, uncapped or
  one-sided limitation of liability, inescapable auto-renewal), the module errs
  toward flagging when the model signals uncertainty; for Push and Note, an
  uncertain flag is downgraded or dropped.
- `confidenceMarker` rides on every flag and is rendered distinctly from the
  `sourceSentence` quote. `unclear-get-help` is a permitted, expected value.
- `verdict.kind === "clean"` is produced when no flag reaches Blocker or Push.
  The UI renders it as a primary result, not an empty state.

**Jurisdiction (ADR 0005)**

- The governing-law prompt collects `governingLawState` and `operatingState`;
  either may be `unknown`; `governingLawState` may be `non-us`.
- Jurisdiction-sensitive flags — non-compete / non-solicit, mandatory
  arbitration, liquidated damages, and the enforceability aspect of some
  liability limits — have severity adjusted by a maintained
  `(clauseType x state) → adjustment` table that carries a "last reviewed" date.
- When either state is `unknown`, or `governingLawState` is `non-us`,
  jurisdiction-sensitive flags are emitted with severity replaced by a "depends
  on governing law" marker.
- "Governing law" is in the clause set, emitted as a `Note` naming the state
  whose rules apply.

**Model access and cost**

- All model calls go through OpenRouter via the model boundary, server-side. The
  model slug is configuration, unset until the human provides it; the app fails
  loudly if it is missing rather than defaulting to one.
- One analysis is one model call (or a small fixed number); Q&A is one call per
  question. No background or proactive calls.

## Testing Decisions

A good test here exercises a seam through its real input/output contract and
asserts on externally observable results — the structured `Analysis`, the
`Answer` — never on prompt strings, internal helper calls, or output-parsing
internals. A test that would break under a reasonable refactor that keeps the
contract is a bad test.

**Analysis module (`analyzeContract`)** — the primary target. Run against the
**test model boundary** with recorded responses, so results are deterministic and
cost nothing. Fixture contracts are text files with an expectations sheet.

- **Citation integrity**: for every flag in the output, assert `sourceSentence`
  is a verbatim substring of the fixture's `documentText`. Separately, feed a
  recorded response containing a fabricated sentence and assert that flag is
  absent from the output.
- **Blocker recall**: fixtures with planted Blocker-tier clauses; assert each is
  present at `Blocker`.
- **Clean-set false-Blocker**: fixtures that are genuinely standard; assert
  `verdict.kind === "clean"` and no `Blocker` or `Push` flags.
- **Jurisdiction correctness**: the same clause fixture run with two
  `governingLawState` values; assert severity differs as the rules table
  dictates (e.g. a non-compete under California is not `Blocker`); with
  `unknown`, assert the "depends on governing law" marker.
- **Red-lines effect**: one fixture run with and without a red line that a
  standard clause crosses; assert the clause is absent from `flags` in the first
  run and present with `isRedLineTrigger` in the second.
- **Push/Note precision** and **counter-offer specificity** are **human-rated**,
  not asserted: a periodic review pass over a fixed fixture set with a rubric,
  recorded as a score, kept out of the CI gate.

**Q&A module (`answerFromDocument`)** — against the test model boundary.

- **Groundedness**: questions whose answers are not in the fixture; assert
  `addressed === false`, the answer says so, and no fabricated specifics appear.
- **In-document questions**: assert `groundedIn` points at real fixture text.

**Model boundary** — a thin contract test that the production implementation
shapes an OpenRouter request correctly and parses a well-formed response; not run
in CI against the live API. A separate, manually-run check hits the real
configured model with a couple of fixtures to catch model drift.

**Below the seams** — one happy-path integration test that a pasted contract
flows through to a rendered result; one that a saved review reopens with
identical flags; a minimal access test that a signer cannot read another signer's
library row; a couple of unit tests on browser PDF/DOCX parsing with known
inputs. Correctness smoke checks, not the eval effort.

**Prior art**: none — this is the first code in the repo. The patterns above
(injected model boundary, labelled fixtures with an expectations sheet,
human-rated criteria kept out of the CI gate) are established by this spec.

## Out of Scope

- Payments, billing, subscriptions (`CLAUDE.md`).
- OCR or any handling of scanned / image-only documents (`CLAUDE.md`, ADR 0001 —
  a citation to mis-OCR'd text is worthless).
- Sharing a document or a review between users (`CLAUDE.md`).
- Post-signature review — "what am I already bound by", "how do I get out"
  (ADR 0002). The Q&A stays inside the pre-signature framing.
- A novice-explainer mode that teaches legal vocabulary from scratch (ADR 0002).
- Assembling a contract from documents it incorporates by reference — v1
  analyses only the text the signer pastes, and tells them so.
- Non-US governing law beyond a single "cannot assess this" notice (ADR 0005).
- Serving freelancers, renters, consumer terms-of-service, or employee
  severance / offer-letter review as designed-for segments (ADR 0002).
- A full multi-state legal rules engine — v1 has a small maintained table for the
  jurisdiction-sensitive clause types only (ADR 0005).
- Pricing, packaging, and go-to-market.

## Further Notes

- Retention, not single-session success, is the product metric (ADR 0002): the
  red-lines list and library only pay off with repeat use, so onboarding should
  get a signer to a first real review fast.
- The counter-offer feature is load-bearing — it is the pre-signature user's main
  reason to act (ADR 0002).
- Unauthorised-practice-of-law exposure is real and grows with
  jurisdiction-contingent statements plus "do not sign" verdicts plus drafted
  language (`PRD.md` risks, ADR 0005). A disclaimer posture and a counsel review
  belong before any launch, not in this build, but the copy written during the
  build must not overclaim.
- The `(clauseType x state)` rules table needs an owner and a review cadence;
  treat a stale "last reviewed" date as a bug.
- `PRD.md`'s "what good looks like" table is the source of truth for the eval
  suite; the Testing Decisions above implement it. Criteria 4 and 7 (Push/Note
  precision, counter-offer specificity) are deliberately human-rated and outside
  the CI gate.
- Model spend is real per analysis; keep calls to one per analysis and one per
  question, and keep the suite on the recorded-response boundary so CI costs
  nothing.
