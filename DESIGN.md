---
name: Redline
description: A boarding pass paired with a live airport departure board — contract flags rerank by urgency, not by decoration.
colors:
  terminal-night: "#0f1115"
  terminal-night-raised: "#171a1f"
  split-flap-cream: "#f5f2ea"
  split-flap-cream-dimmed: "#f5f2ea99"
  worn-card-stock: "#b0aa98"
  housing-seam: "#2b2f36"
  gate-change-red: "#d94f30"
  alert-ink: "#2a0d06"
  delayed-amber: "#c8862b"
  focus-gold: "#e8c14d"
  hover-wash: "#ffffff10"
typography:
  headline:
    fontFamily: "-apple-system, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
  body:
    fontFamily: "-apple-system, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  caption:
    fontFamily: "-apple-system, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
    textTransform: "uppercase"
  data:
    fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  sharp: "2px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "22px"
  xl: "28px"
  xxl: "44px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.split-flap-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "0 18px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.split-flap-cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.split-flap-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "8px 14px"
  button-ghost-hover:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.split-flap-cream}"
  button-ghost-active:
    backgroundColor: "transparent"
    textColor: "{colors.delayed-amber}"
  tab-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.worn-card-stock}"
    typography: "{typography.body}"
    padding: "10px 4px"
  tab-toggle-active:
    backgroundColor: "transparent"
    textColor: "{colors.split-flap-cream}"
  input-field:
    backgroundColor: "{colors.terminal-night-raised}"
    textColor: "{colors.split-flap-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "12px 14px"
---

# Design System: Redline

## Overview

**Creative North Star: "The Gate Board"**

Redline's result screen is a boarding pass paired with a live airport departure board. It does not read as a SaaS dashboard reviewing a document — it reads as an operations surface tracking risk the way a terminal tracks flights: ranked, positional, and willing to interrupt its own calm only when something actually changes state. The system explicitly refuses the "friendly legal-AI SaaS dashboard" canon it was built against: no soft neutral ground, no brand-blue accent, no chat-bubble Q&A, no rounded card grid. Instead: a near-black ground, warm cream ink, mechanical monospace for anything that is data, and a single reserved alert color that only exists as a flash, never as a resting badge.

Density is high but legible — a fixed-column board with tight row rhythm, tabular figures, and uppercase micro-labels doing the organizing work that color-coded pills or icon badges would do in the declined world. The one authored motion moment (rows scrambling into severity order on load, then settling) is the system's single indulgence; everything else is instant or near-instant state change.

**Key Characteristics:**
- Near-black terminal ground with warm cream ink — never a light theme, never a blue accent
- Two-voice type system: mechanical monospace for data/board content, plain system-UI sans for prose
- Flat by default — zero shadows; depth comes from background-color steps and 1px rule dividers
- One reserved alert color that fires only on state change, never as a static severity badge
- Near-square corners (2px) everywhere; bordered rectangles instead of soft app chrome

## Colors

The palette is a near-black terminal ground against warm cream ink, with two severity accents that are used sparingly and by strict rule, not decoratively.

### Primary
- **Terminal Night** (`#0f1115`): the page ground. Everything sits on this; there is no lighter "canvas" color anywhere in the system.
- **Split-Flap Cream** (`#f5f2ea`): primary ink — headlines, active tab labels, quoted source sentences, board data.

### Secondary
- **Gate Change Red** (`#d94f30`): the Blocker severity label color and the row-hold flash background. Fires only on a state-change flash (a newly-triggered or red-line-crossed row going from calm to `.held`), never as a static severity chip or resting badge — this is load-bearing, not a styling preference.
- **Delayed Amber** (`#c8862b`): reserved for the Push severity label and the "sample"/live-indicator dot. Do not reuse Delayed Amber for anything outside Push severity or its dot; it would blur the one-color-per-severity-level rule.

### Neutral
- **Terminal Night, Raised** (`#171a1f`): the one elevated surface tone — the boarding-pass ticket panel, blockquote source-sentence panel, and Q&A input field background. Never combined with a shadow.
- **Split-Flap Cream, Dimmed** (`#f5f2ea99`, 60% alpha of Split-Flap Cream): secondary prose ink — sub-headlines, disclaimer emphasis, Q&A answer text. Used specifically where legibility can tolerate a step down from full-strength cream.
- **Worn Card Stock** (`#b0aa98`): tertiary ink for field labels, "why" microcopy, quote previews, and placeholder text. This is a solid warm-tinted gray, not an alpha blend — it was deliberately fixed from an earlier low-contrast alpha value specifically to clear 4.5:1+ contrast against Terminal Night. Never substitute an alpha-blended cream here; the solid value is the accessibility fix.
- **Housing Seam** (`#2b2f36`): the only border/divider color in the system — ticket dividers, row bottom-borders, board-head rule, input borders, dashed "also seen" border.
- **Alert Ink** (`#2a0d06`): text color used only inside a `.held` row, where it sits directly on Gate Change Red.
- **Hover Wash** (`#ffffff10`, a flat 10%-alpha white wash): the hover-state background for bordered interactive rows and buttons. Backs the ghost "Copy counter-offer" button and, as of the landing page, the flag row itself (`.row:hover`) — a second, independent component converging on the same value, which is why it is now a named token rather than a bare hex repeated in prose.

### Named Rules
**The One Flash Rule.** Gate Change Red never appears as a resting UI color — not a badge, not a persistent label, not a border. It exists only as the `.held` state fired on a row that just crossed a red line or resolved to Blocker, and it clears itself (the comp holds for 1.8s). Any new component that wants "danger" as a permanent color is wrong for this system; permanent Blocker identity is carried by the Blocker label's own color and position, not by red.

**The One Color Per Severity Rule.** Each severity level (Blocker, Push, Note) owns exactly one label color and weight, applied only to the severity label text — never blended into row backgrounds, borders, or icons at rest.

## Typography

**Body Font:** system-UI sans stack (`-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)
**Label/Mono Font:** JetBrains Mono (loaded via Google Fonts CDN), with `ui-monospace, "SF Mono", Menlo, Consolas, monospace` fallback

**Character:** A deliberate two-voice split, confirmed during the fix-review round: JetBrains Mono carries anything that reads as board/data — severity labels, clause names, board-head columns, the route field, the barcode reference code — while the system sans stack carries prose the signer actually reads for meaning (why-text, disclaimer, blockquote quotes, counter-offer text, Q&A transcript). This follows the "Operate surfaces are well served by workhorse UI faces" guidance directly: the sans layer is a confirmed choice, not a placeholder waiting for a display face.

### Hierarchy
- **Headline** (600, 28px, line-height 1.2): the clean-verdict headline ("You're probably fine.") — the one moment the system allows a larger, confident prose statement.
- **Title** (500, 22px, mono, line-height 1.3): the boarding-pass route field (`CA → DE`) — the single largest use of mono type on the page.
- **Data** (500, 15px, mono, line-height 1.3): board row clause names.
- **Body** (400, 14px, sans, line-height 1.6): counter-offer text, blockquote source sentences, Q&A answers, clean-verdict sub-line.
- **Caption** (400, 13px, sans, line-height 1.5): secondary/dimmed supporting prose — a flag row's "why" explanation text and the page footnote/disclosure line. This value existed informally at 13px in the Result screen's `.why` and `.quote-preview` classes before it had a name; the landing page reused the identical value on its own flag row and footnote, which is the two-independent-surfaces signal that promotes it to a real step between Label (11px) and Body (14px) rather than leaving it as an undocumented one-off repeated in two places.
- **Label** (600, 11px, mono, uppercase, letter-spacing 0.08em): board-head columns, field labels, detail-panel headers ("Exact source sentence," "Counter-offer"). This is the system's workhorse micro-label and appears more than any other type role.

### Named Rules
**The Two-Voice Rule.** Mono is for data the signer scans (labels, severities, clause names, the route, the barcode code); sans is for prose the signer reads (why-text, quotes, answers, disclaimers). Never put a full sentence of prose in mono, and never label a data column in sans.

## Layout

A single-column frame capped at 1180px, centered, with 28px side padding. The boarding-pass summary is a five-column grid (`1.4fr 1fr 1fr 1fr auto`, the last column the scan/barcode block) with 1px internal dividers between fields, at 20-22px padding per cell. Below it, the flag board is a fixed four-column grid (`84px 1fr 300px 40px`: severity / clause+why / quote preview / chevron) shared identically by the board-head row and every data row, so columns stay aligned as rows reorder. At the 860px breakpoint the ticket collapses to two columns (scan block spans full width) and the board drops its quote-preview column entirely (`84px 1fr 0px 32px`) rather than truncating it further.

Row rhythm inside the board is 16px vertical padding per row with a 1px Housing Seam divider between rows and none inside the header. The expand/collapse detail panel, when open, adds a two-column inner grid (`1fr 1fr`, 28px gap) indented to align under the clause column (`padding-left:84px`), collapsing to one column on mobile.

## Elevation & Depth

Flat by default: zero `box-shadow` anywhere in the artifact. Depth is conveyed entirely through two background-color steps (Terminal Night for the page ground, Terminal Night, Raised for the ticket panel, blockquote panel, and Q&A input) and 1px Housing Seam rule dividers between regions. There is no ambient glow, no drop shadow on hover, and no elevated "card" anywhere in the system.

### Named Rules
**The Flat-By-Default Rule.** Surfaces never lift with a shadow, at rest or on interaction. Depth is background-step + rule-divider only. A component that reaches for `box-shadow` is not native to this world.

## Shapes

Near-square corners throughout: a single 2px radius (`--radius`) applied everywhere a radius is used — the ticket panel, tags, buttons, inputs, blockquote panel, the dashed "also seen" note. There are no pill-shaped buttons and no soft rounded cards anywhere. Borders are plain 1px solid Housing Seam lines (dashed for the "also seen" aside); there is no double-border or inset-shadow border treatment. Icons (the chevron, the barcode) are authored inline SVG, never a Unicode glyph or CSS gradient standing in for one.

### Named Rules
**The Bordered Rectangle Rule.** Interactive containers (buttons, the Q&A input, tags) are bordered rectangles at 2px radius, not soft app chrome. If a new component wants a shadow or a larger radius to signal "clickable," use a 1px border and the 2px radius instead.

**The Authored-Mark Rule.** Anything that reads as an icon or a texture (the barcode, the chevron) is hand-authored inline SVG. No icon-font glyphs, no Unicode arrows/dots standing in for icons, and no CSS `repeating-gradient` standing in for authored texture — both were explicitly replaced during the fix round.

## Components

### Buttons
- **Shape:** bordered rectangle, 2px radius (`--radius`), no pill shapes.
- **Primary (Q&A "Ask" send button):** transparent background, 1px Worn Card Stock border, Split-Flap Cream text, `0 18px` padding, no fixed height. Disabled state drops to Housing Seam border at 0.4 opacity.
- **Hover / Focus:** border brightens to Split-Flap Cream on hover; `:focus-visible` gets a 2px Focus Gold (`#e8c14d`) outline with 2px offset, system-wide (not button-specific).
- **Ghost (Copy counter-offer):** transparent background, 1px Housing Seam border, Split-Flap Cream text, 13px, `8px 14px` padding. Hover adds the Hover Wash token (`#ffffff10`, a flat 10%-alpha white) and brightens the border to Worn Card Stock. A successful copy switches border and text color to Delayed Amber with the label swapped to "Copied" for 1.6s — this is the one place Delayed Amber is used outside severity. The same Hover Wash token now also backs the landing page's flag row hover (`.row:hover`), confirming it as a shared interactive-hover treatment rather than a button-only value.

### Tabs (Flagged / Clean toggle)
- **Style:** flat text tabs on a shared 1px Housing Seam bottom rule, no pill or boxed background.
- **State:** inactive tabs are Worn Card Stock text with a transparent 2px bottom border; the active tab is full Split-Flap Cream text with a Split-Flap Cream 2px bottom border. Hover on inactive dims toward Split-Flap Cream, Dimmed.

### Cards / Containers (boarding-pass ticket, blockquote panel)
- **Corner Style:** 2px radius.
- **Background:** Terminal Night, Raised.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** 1px Housing Seam around the ticket only; the blockquote panel is borderless, distinguished purely by its background step.
- **Internal Padding:** 20-22px (ticket cells), 14-16px (blockquote).

### Inputs / Fields
- **Style:** Terminal Night, Raised background, 1px Housing Seam border, 2px radius, Split-Flap Cream text, Worn Card Stock placeholder.
- **Focus:** relies on the system-wide `:focus-visible` Focus Gold outline; no separate glow or border-color focus treatment.
- **Disabled:** 0.6 opacity, no other visual change.

### The Gate Board (signature component)
The severity-ranked, reordering flag board is the system's signature piece. Rows render in DOM/severity order (Blocker pinned to top) and settle into that order via a FLIP animation on load — measuring a randomized scramble start position, then transitioning `transform` back to rest over 0.9s with a per-row 55ms stagger, cubic-bezier(0.16,1,0.3,1). Once settled, any row flagged as newly-triggered or red-line-crossed (`data-hold="true"`) flashes into the `.held` state (Gate Change Red background, Alert Ink text) for 1.8s before clearing. Each row expands in place via `grid-template-rows: 0fr → 1fr` on the `.detail` wrapper (not `max-height`) so the transition animates a layout-safe property instead of triggering reflow on an unbounded content height — this was a deliberate fix, not an incidental choice, and should be the default technique for any future expand/collapse panel in this system.

## Do's and Don'ts

### Do:
- **Do** use JetBrains Mono for anything that is board/data content (severities, clause names, column labels, the route, the barcode code) and the system sans stack for anything that is prose the signer reads for meaning.
- **Do** use the `grid-template-rows: 0fr → 1fr` technique for any new expand/collapse panel, not `max-height`.
- **Do** keep Gate Change Red exclusive to the state-change flash; a severity label's resting color and a state-change flash are two different jobs and use different tokens.
- **Do** author icons and texture as inline SVG.

### Don't:
- **Don't** add a box-shadow anywhere in this system — depth is background-step and rule-divider only.
- **Don't** use a pill-shaped button, a soft-shadow card, or a radius larger than 2px — near-square corners and bordered rectangles are the whole form language.
- **Don't** reuse Gate Change Red as a static severity badge, border, or icon color; it is a flash, not a palette color available for general "danger" use.
- **Don't** use a Unicode glyph or a CSS repeating-gradient as a stand-in icon or texture — both were explicitly replaced with authored inline SVG during the fix round; treat any reappearance as a regression, not a shortcut.
- **Don't** generalize the board's settle-on-load FLIP animation into a repeating or looping effect, and don't soften or remove it — it is the system's one authored motion moment, confirmed as sufficient at ship.
- **Don't** ship the chat-bubble Q&A pattern or a rounded neutral-background card grid — both were explicitly declined directions for this world, not unexplored options.
- **Don't** treat the CDN-loaded JetBrains Mono or the missing split-flap character-flip / perforation ornament as bugs to silently fix in a future pass without flagging them — they are recorded open follow-ups from the finish review (font should be self-hosted if this world carries into the real Next.js app; the flip/perforation texture was judged unnecessary at ship but was never built).
</content>
