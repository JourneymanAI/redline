# 03: Walking skeleton: analysis → result screen

**Renumbered 2026-09-11 from 02.** Its own paste-handling moved out to
ticket 02 (document intake) so this ticket is purely "prove the analysis
seam," blocked by the ticket that gets text ready to analyze — matching this
course's check that every document-analysis ticket is blocked by the parsing
ticket.

**What to build:** The end-to-end path: given `documentText` from ticket 02,
run it through `analyzeContract()` against the test model boundary and a
fixture, and render a result screen with a plain-English summary — naming the
parties, the term, and what the signer is on the hook to do — plus a bare
(unranked, unstyled) list of flags and a rough clean/not-clean signal. No
auth, no persistence, a single in-memory session. This proves the core seam
works before any analysis-fidelity or output-polish work lands on top of it.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Given pasted text, a signer reaches a result screen with no file
      handling of their own in this ticket
- [ ] The summary names the parties, the term, and the signer's core
      obligation
- [ ] Flags render from `analyzeContract()`'s output against a recorded
      fixture response
- [ ] One happy-path integration test exercises paste-to-rendered-result
