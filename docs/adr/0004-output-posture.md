# 4. Output posture: error preference, voice, and the clean verdict

Status: Accepted — 2026-08-31

## Decision

**Error preference is set per severity tier, not globally.**

- For the Blocker set — personal guarantee, uncapped indemnification, uncapped or
  one-sided limitation of liability, auto-renewal the signer cannot realistically
  exit — Redline misses nothing. If the model is unsure whether a clause reaches
  this bar, it flags it anyway. The cost of silence here is ruinous and rare.
- For Push and Note, Redline prefers silence to a shaky flag. The cost of a wrong
  flag at these tiers is believability, and it compounds on every run.

**The output separates fact from judgment and marks only the judgment.**

- What the clause *says* is quoted from the source sentence and stated plainly.
  This is never hedged.
- The severity call and any "this is broader than a typical version" reading are
  Redline's interpretation. Each carries an explicit confidence signal, with a
  real third state — "unclear, have someone look at this one" — that is used, not
  reserved for show.

**A document with nothing serious in it gets an honest clean verdict.**

- When no clause reaches Blocker or Push, Redline says so directly ("read all N
  pages; nothing reaches Blocker or Push; M Notes for awareness") and presents it
  as a first-class result, not an empty state or an error.
- Redline never manufactures Push or Blocker flags to make a review feel
  worthwhile.

## Alternatives

- **One global error preference.** Simpler to state and build, but any single
  choice is wrong for half the cases: prefer-recall floods the lower tiers with
  noise; prefer-precision stays quiet about clauses that can bankrupt the signer.
- **One confidence voice throughout.** Either always plain (confident, sometimes
  wrong) or always hedged (safe, useless). Splitting fact from judgment is more
  work to design and read, but it is the only way to be trustworthy on the quote
  and honest about the uncertainty at once.
- **Always return a ranked list.** Padding every review with weak flags trains
  the user to ignore all of them, the real ones included.

## Why

The user acts on this output with real money and a signing deadline. A missed
personal guarantee ends the business; a false alarm on a standard NDA clause
costs a negotiation ask and, repeated, costs the product its credibility. Those
are different failures with different fixes, so they get different rules. The
believability of the Blocker flags depends entirely on the clean verdicts being
real — a tool that always finds five problems is not reading the contract, and
the user learns that fast.

## Consequences

- The eval suite needs a labelled set of clean contracts, not just bad ones, to
  measure the false-Blocker rate and confirm the clean verdict fires.
- The UI needs three distinct treatments: a plain quoted fact, a marked
  judgment, and an explicit "get help" punt.
- "Over-flag when unsure" on the Blocker set will produce some false Blockers on
  genuinely fine contracts; that is the accepted cost, and the clean-set eval is
  how we keep it near zero in practice.
- Marketing copy cannot promise that Redline always finds a hidden trap.
