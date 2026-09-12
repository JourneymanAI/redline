# 01: Design the New Review intake surface

**Status:** open

**What:** Build the New Review intake screen — the second surface requested
from `/impeccable "Design two surfaces for Redline and build one of them."`
(the first, the Result screen, is done: `design-comps/result-screen.html`,
shipped via a full direction round + two finish-review cycles, disposition
ship). DESIGN.md and `.impeccable/design.json` now exist, so per Impeccable's
`new-work.md` this is an already-established world: no new concept-tournament
or dice-roll round is needed. Derive composition from the existing Gate Board
world (boarding-pass motif, near-black ground, one reserved alert color, the
board/row vocabulary) and write a new surface brief at
`.impeccable/surfaces/new-review-intake.md` scoped to this specific surface
(visitor mode, audience, job/action, and its own Direction Contract).

**Context:** the Result screen's surface brief
(`.impeccable/surfaces/result-screen.md`, "Unresolved decisions") names this
directly: "how the New Review intake screen (the boarding-pass 'check-in'
moment) extends this same world — not yet built." The Result screen's STORY
block also anticipates it: "The signer pastes a contract and watches it
'check in' — a segmented summary strip appears like a boarding pass..." — that
check-in moment is the New Review intake screen's job.

**Blocked by:** None (DESIGN.md has landed; can start immediately).

- [ ] Surface brief written at `.impeccable/surfaces/new-review-intake.md`
      with a full Direction Contract
- [ ] Standalone static HTML/CSS comp built (same constraint as Result
      screen: not wired into the Next.js app, scaffolding still blocked on
      the package-manager decision)
- [ ] `impeccable detect --json` clean
- [ ] Finish-reviewer pass returns disposition: ship
- [ ] DESIGN.md / `.impeccable/design.json` updated (documenter re-run) to
      fold in any new tokens or components this surface introduces
