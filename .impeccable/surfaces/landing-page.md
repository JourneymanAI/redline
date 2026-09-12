---
version: 1
slug: "landing-page"
primary_target: "landing-page"
related_targets: []
---

# Surface: Landing page

**Scope:** Redline's public landing page (`class-projects/Redline_App`) —
built directly into the real Next.js app at `src/app/page.tsx`, replacing the
`create-next-app` starter homepage. Unlike the Result screen, scaffolding is
no longer blocked (npm decided, ticket 00 done), so this is real production
code from the start, not a standalone comp.

**Visitor mode:** Persuade.

**Audience / job:** the Signer — a small-business owner or founder, not yet
a user — deciding in seconds whether this is worth pasting a real contract
into.

**Action / task:** understand what Redline does and for whom, see the
mechanism actually work on a contract, and take the one action (start a
review).

**Proof / content:** the same fixture contract and fixture flags already
authored for the Result screen comp (labeled synthetic — no real fixtures or
eval data exist yet, per PRODUCT.md's Evidence on Hand). No invented pricing,
testimonials, or commercial claims. Per the course brief (Beat 3.3): the page
"claims nothing the spec excludes, so it never promises a verdict on whether
to sign."

**Constraints:** one action only — no competing CTAs. Citation integrity
still applies to any displayed source sentence. Inherits the established
Gate Board world (DESIGN.md) — no new palette, type, or component language.

**Chosen direction and memorable moment:** Before/After Contrast. The
memorable moment is the same clause shown twice in one glance: flat,
undecorated ordinary contract prose on the left, the identical sentence as a
live, expandable, sourced Gate Board row with severity and a counter-offer
on the right.

**Unresolved decisions:** none — this round's structure is settled; content
(fixture clause choice for the before/after pair) gets picked during build
from the same fixture set as the Result screen for continuity.

## Direction contract

**THESIS:** The wedge isn't described, it's demonstrated: one ordinary
contract sentence, shown twice, refuses the "trust our AI" claim every
competitor makes in prose instead of proof.

**OWN-WORLD:** Inherits the Gate Board world unchanged — near-black Terminal
Night ground, Split-Flap Cream ink, Gate Change Red reserved for a state-change
flash only, JetBrains Mono for data/board content, system sans for prose,
flat bordered rectangles at 2px radius, zero shadows.

**STORY:** A visitor lands and sees, without scrolling, a flat block of
boring contract boilerplate beside the same sentence transformed into a
ranked, sourced flag with a drafted counter-offer. The contrast alone makes
the pitch. A teaser of the fuller board scrolls in below, then one action.

**FIRST VIEWPORT:** Headline top. Below it, a two-panel split: left panel is
deliberately unstyled ordinary contract text; right panel is one live Gate
Board row for the identical sentence, expandable to its verbatim source and
counter-offer, using the same row component the Result screen already
built. One action sits directly beneath both panels, not competing with
either.

**FORM:** Before/After Contrast, dealt lead (kicker THE ROLL) in a
surface-scope concept-seed round against Live Demo Hero and Boarding Pass
First, with a competitive Timetable Rack challenger fused and declined.
Seed key `b0496db4`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with
the finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.
