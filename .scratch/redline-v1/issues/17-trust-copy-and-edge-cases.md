# 17: Trust copy & edge cases

**What to build:** Add the standing not-legal-advice disclaimer, and a
reminder at the point a clean verdict is shown that Redline read only what was
pasted (not a full multi-document deal). Handle the edge cases: pasted text
too short or clearly not a contract (clear error, no wasted analysis run), a
mid-analysis model failure (clear retry message, no blank/partial result), and
a very long contract (analysed fully, or told plainly what couldn't be
covered).

**Blocked by:** 03, 07

**Status:** ready-for-agent

- [ ] The not-legal-advice disclaimer is visible on the result screen
- [ ] The "read only what you pasted" reminder appears specifically at a
      clean verdict
- [ ] Pasting text too short/not a contract produces a clear error before any
      analysis call
- [ ] A simulated model-call failure produces a clear retry message, not a
      blank or partial result
- [ ] A very-long-contract fixture is either analysed fully or explicitly told
      what wasn't covered
