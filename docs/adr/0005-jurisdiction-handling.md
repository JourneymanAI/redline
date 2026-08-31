# 5. Jurisdiction handling in v1

Status: Accepted — 2026-08-31

## Decision

Redline asks the signer two questions before analysis:

1. Which state's law governs the contract (from the governing-law clause, or the
   signer's best knowledge).
2. Which state the signer's business operates in.

These answers adjust the **jurisdiction-sensitive flags** — non-compete /
non-solicit, mandatory arbitration, liquidated damages, and the enforceability
side of some liability limits — whose severity depends on governing law. A
non-compete governed by California law is not a Blocker; the same clause under
Florida law may be.

"Governing law" is added to the v1 clause set as a Note-tier flag that states,
plainly, which state's rules the signer is accepting for everything else in the
contract.

If either state is unknown, the jurisdiction-sensitive flags are marked "depends
on governing law" and given no fixed severity, rather than Redline asserting one.

Scope limit: v1 handles US state law only. A contract governed by non-US law gets
a single up-front notice that Redline cannot assess it, and analysis proceeds
with the jurisdiction-sensitive flags all marked "depends on governing law".

## Alternatives

- **Ignore jurisdiction, flag on the clause text alone.** Simpler, but wrong for
  a predictable slice of users in both directions: false Blockers for California
  signers, correct-looking silence that misses real risk elsewhere.
- **Infer jurisdiction from the document without asking.** The governing-law
  clause is usually present, but the signer's own operating state is not, and
  both matter. Asking is two fields; guessing is a confident error.
- **Full multi-state rules engine.** Out of proportion to a first version and a
  maintenance burden as law changes.

## Why

The governing-law clause decides which rules apply to every other clause, and
several of the highest-impact clause types in the set (non-compete, arbitration)
swing from unenforceable to serious depending on the answer. Getting severity
right for those users is not possible from the clause text alone. Two fields at
the top of the flow is a small price for not being confidently wrong.

## Consequences

- Onboarding gains two required fields before a result is shown.
- Redline is now making state-law-contingent statements, which sharpens the
  unauthorised-practice-of-law exposure that the "we only explain what you're
  signing" framing was meant to limit. The brief's risk section owns this.
- The eval suite needs jurisdiction-labelled fixtures: the same clause under two
  governing-law states, with different expected severities.
- A rules table mapping (clause type x state) to severity adjustment has to be
  maintained, and dated, as law changes (e.g. FTC non-compete developments).
