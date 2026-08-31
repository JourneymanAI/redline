# Redline — CONTEXT.md

Domain vocabulary for Redline. When output names one of these concepts — in
code, an issue, a prompt, a test name, or UI copy — use the term as defined here
and not a synonym. Terms are added as decisions resolve them; an entry marked
_(open)_ has a definition still being worked out.

## Terms

**Signer** — the Redline user. In v1, a small-business owner or founder reviewing
an inbound contract they have been asked to sign. Not a lawyer, not a corporate
legal team. Avoid: "customer" (collides with the signer's own customers),
"reviewer", "user" in domain contexts.

**Pre-signature review** — the one use case Redline supports: analysing a
contract the signer has not yet signed, to decide whether to sign and what to
negotiate. Contrast with post-signature review ("what am I already bound by") —
out of scope for v1.

**Flag** — a single clause Redline marks as working against the signer, carrying
a severity and the exact source sentence it is drawn from. A flag with no
showable source sentence is a bug (ADR 0001). Avoid: "issue", "finding",
"warning".

**Flagging rule** — a clause becomes a flag only if it either (1) creates serious
downside the signer cannot cap or easily exit (large or uncapped financial
exposure, loss of core IP, inescapable lock-in) or (2) crosses one of the
signer's red lines. Being unusual, aggressive, or non-standard is never on its
own enough to promote a clause to a flag — it can only be added as commentary on
a flag that already qualifies (ADR 0003).

**Also seen** — a clause outside the v1 clause set that the model noticed and
surfaces at visibly lower confidence, never as a top-line flag.

**v1 clause set** — the clause types Redline actively looks for, taken from the
discovery research's ranking: IP assignment, auto-renewal, vague scope /
unlimited revisions, unilateral termination without a kill fee, uncapped
indemnification, one-sided liability cap, forced arbitration, non-compete /
non-solicit, fee escalator, personal guarantee, unilateral amendment,
confidentiality overreach, joint-and-several liability, restrictive cancellation
method.

**Source sentence** — the verbatim sentence from the uploaded document that a
flag cites. Verbatim means character-for-character; it must exist as a substring
of the stored text.

**Severity** — how badly a flagged clause cuts against the signer, expressed as
the action the signer should take. Three levels: **Blocker** (do not sign
as-is), **Push** (ask for a change; signable-on-refusal depends on leverage),
**Note** (worth knowing, not worth a fight). Not a number, and not comparable
within a level (ADR 0003).

**Red line** — a term the signer has declared they will not accept (e.g. "no
personal guarantee", "net-30 payment or better"). The signer's red lines are an
editable list that feeds the analysis: a clause that crosses a red line is
flagged regardless of how common it is. Avoid using "red line" as a verb.

**Counter-offer** — drafted replacement language Redline proposes for a flagged
clause: the specific words the signer could ask for instead, grounded in the
clause being replaced. Avoid: "redline" (verb), "suggestion", "edit".

**Library** — the signer's retained collection of past documents and their
analyses. Text only; the original file is never stored (ADR 0001, `CLAUDE.md`).

**Two-register output** — Redline's results come in two voices: statements of
what a clause *says*, quoted from the source sentence and never hedged; and
Redline's *judgment* about it (severity, "broader than typical"), each carrying a
confidence marker. Keep the two visually and grammatically distinct (ADR 0004).

**Confidence marker** — the explicit signal attached to a judgment: roughly
"clear", "our read", or "unclear — get help". The third state is a real output,
not decoration (ADR 0004).

**Clean verdict** — the result Redline returns when no clause reaches Blocker or
Push: a direct statement that the document was read and nothing serious was
found, shown as a first-class result. Redline never invents Push/Blocker flags to
avoid one (ADR 0004).

**Jurisdiction-sensitive flag** — a flag whose severity depends on governing law:
non-compete / non-solicit, mandatory arbitration, liquidated damages, and the
enforceability of some liability limits. Adjusted by the governing-law prompt
answers; marked "depends on governing law" when either answer is unknown
(ADR 0005).

**Governing-law prompt** — the two questions Redline asks before analysis: the
state whose law governs the contract, and the state the signer's business
operates in.
