---
version: 1
slug: "result-screen"
primary_target: "result-screen"
related_targets: []
---

# Surface: Result screen

**Scope:** Redline's Result screen (`class-projects/Redline_App`) — built for now
as a standalone static HTML/CSS comp, not yet wired into the Next.js app
(scaffolding is blocked on the package-manager decision per `CLAUDE.md`).

**Visitor mode:** Operate.

**Audience / job:** the Signer — a small-business owner or founder reviewing
an inbound contract, not a lawyer — deciding whether to sign and what to push
back on, in one screen.

**Action / task:** read a ranked, reordering list of flags; expand any flag to
its exact source sentence; copy a counter-offer; ask a document-grounded
question.

**Proof / content:** a fixture contract and fixture flags, labeled synthetic
(no real fixtures or eval data exist yet — `PRODUCT.md`, Evidence on Hand). No
invented pricing, testimonials, or commercial claims.

**Constraints:** citation integrity is non-negotiable — the displayed source
sentence must read as a real verbatim quote, never fabricated for the comp.
Severity uses exactly one color and weight per level, never blended. No
chat-bubble Q&A widget (declined via the canon card). No gamified state
signaling (declined via the arcade-glow challenger).

**Chosen direction and memorable moment:** The Gate Board. The memorable
moment is the flag board visibly reranking, as if flags were departures
reordering by urgency, with a held alert color on anything newly triggered
(a red-line hit, a just-surfaced Blocker).

**Unresolved decisions:** exact type family (no comp exists to measure
against on this code-led round — pick during build and note the choice in
DESIGN.md); whether reranking is a live re-sort or a one-time settle-on-load
(decide during build, no comp to test against); how the New Review intake
screen (the boarding-pass "check-in" moment) extends this same world — not
yet built.

## Direction contract

**THESIS:** Flags rerank live by urgency exactly like an airport board
reranks departures by time — severity is legible as motion and position, not
only color — refusing the static card-list every "AI reviews your contract"
competitor ships.

**OWN-WORLD:** Near-black ground (`#0f1115`), warm paper-white panels and text
(`#f5f2ea`), one reserved alert color (`#d94f30`) fired only on a state change
— a newly-Blocker'd or red-line-triggered flag. A boarding-pass-style
segmented header carries the contract summary (scannable-block motif, tabular
figures). Flag rows live in a fixed-column board, Blocker rows pinned to the
top, reranking in place as severity resolves — a row moves, it never
disappears and reappears elsewhere.

**STORY:** The signer pastes a contract and watches it "check in" — a
segmented summary strip appears like a boarding pass, then the board fills
and sorts itself by urgency in front of them. They read top to bottom
trusting the order completely, expand any row for its verbatim source
sentence, and the one thing that interrupts the calm surface is a held alert
color — never decorative, always meaning "this changed."

**FIRST VIEWPORT:** A full-width segmented summary strip at top (the
contract's "flight": parties, term, obligation). Below it, the full-bleed
reranking board: each row a flag, with columns for clause name, severity, and
a persistent alert-color hold when newly triggered. No sidebar, no card
shadows — the board owns the full width, exactly as a departure board does.
The primary action (expand a row to its source sentence) lives inside the row
itself, not a separate panel.

**FORM:** The Gate Board — a boarding pass paired with a live airport
departure board (catalog id
`vernacular-ephemera-boarding-pass-and-gate-board`), dealt as a competitive
challenger against the assigned lab-report direction (`The Flagged Panel`)
and locked by the user over both that assignment and the auditor's-workpaper
pick card. Seed key `92336293`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with
the finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.
