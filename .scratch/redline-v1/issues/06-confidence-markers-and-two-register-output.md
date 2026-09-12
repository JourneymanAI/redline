# 06: Confidence markers & two-register output

**What to build:** Attach a `confidenceMarker` (`clear` | `our-read` |
`unclear-get-help`) to every judgment `analyzeContract()` makes, rendered
visually and grammatically distinct from the plain factual source-sentence
quote. Apply the tiered error preference: for the Blocker set (personal
guarantee, uncapped indemnification, uncapped or one-sided liability cap,
inescapable auto-renewal), an uncertain model signal still gets flagged; for
Push and Note, an uncertain flag is downgraded or dropped.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Every flag carries a `confidenceMarker` of `clear`, `our-read`, or
      `unclear-get-help`
- [ ] The result screen visually distinguishes a judgment (with its marker)
      from the factual `sourceSentence` quote
- [ ] A fixture with model-signaled uncertainty on a Blocker-tier clause still
      produces a Blocker flag
- [ ] The same uncertainty on a Push/Note-tier clause is downgraded or dropped
