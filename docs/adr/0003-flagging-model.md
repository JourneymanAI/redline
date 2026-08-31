# 3. The flagging model: absolute exposure plus red lines, severity by action

Status: Accepted — 2026-08-31

## Decision

**Clause set.** v1 looks for the clause types the discovery research ranked for
this user: IP assignment, auto-renewal, vague scope / unlimited revisions,
unilateral termination without a kill fee, uncapped indemnification, one-sided
liability cap, forced arbitration, non-compete / non-solicit, fee escalator,
personal guarantee, unilateral amendment, confidentiality overreach,
joint-and-several liability, and restrictive cancellation method. Anything
outside this set that the model notices is surfaced as a lower-confidence "also
seen", never as a top-line flag.

**What makes a clause a flag.** A clause becomes a flag when either:

1. it creates serious downside the signer cannot cap or easily exit — large or
   uncapped financial exposure, loss of the business's core IP, a lock-in with
   no realistic way out; or
2. it crosses one of the signer's declared red lines.

A clause being unusual, aggressive, or non-standard is **not**, on its own,
enough to promote it to a flag. The model may add "this is also broader than a
typical version of this clause" as commentary on a clause that already qualifies,
but it never asserts a market norm as the reason a flag exists.

**Severity.** Three levels, each anchored to the action the signer should take:

- **Blocker** — do not sign as-is.
- **Push** — ask for a change; whether it stays signable if the counterparty
  refuses depends on the signer's leverage.
- **Note** — worth knowing about, not worth a fight.

## Alternatives

- **Norm-relative flagging** — flag anything worse than standard for this
  contract type. Matches how the user thinks, but puts the model in the business
  of asserting market norms it cannot verify — the failure mode ADR 0001 exists
  to prevent.
- **Hand-authored clause rulebook** with the user's own severity calls as ground
  truth. Higher consistency, but only pays off if the user's ranking would
  differ from the evidence-ranked list, and it is real authoring work.
- **Numeric severity (1–10 / 1–100).** Feels precise; blends real signal with
  guesswork. The research warns against exactly this.
- **Two-level severity** (walk away / negotiate). Too coarse to guide the "is
  this still signable if they say no" decision.

## Why

The user is a been-burned semi-pro who signs contracts repeatedly. What hurts
that user is uncapped downside and lock-in, not unusual phrasing — and "this is
non-standard" is precisely the kind of claim a language model asserts
confidently and wrongly. Anchoring flags to absolute exposure keeps the model on
ground it can defend with a source sentence. Red lines let the user inject their
own judgment without the product having to model market norms. Action-anchored
severity answers the user's real question — "what do I do about this" — rather
than expressing a degree of concern.

## Consequences

- The model needs, per clause type, a definition of "serious uncapped downside"
  concrete enough to check against the source sentence — not a vibe.
- "Unusual but survivable" clauses that are predatory *because* they are
  non-standard will sometimes be missed. Accepted (see the error-preference
  decision from Round 3).
- Red lines are load-bearing input, not a nice-to-have: without them the product
  under-flags for any signer whose concerns are specific.
- Severity is not comparable within a level — two "Push" clauses can differ a lot
  in intensity and the scale will not show it.
- The "also seen" tier needs a visibly lower-confidence treatment in the UI so it
  does not dilute the flags.
