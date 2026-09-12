# 08: Counter-offers

**What to build:** For each flagged clause, `analyzeContract()` drafts
replacement language specific to that clause — never generic boilerplate. The
result screen shows the counter-offer per flag with a one-action copy control,
and a note that the language may be recognisable to the other side's lawyers.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Every flag in the output carries a `counterOffer` string addressing that
      clause specifically
- [ ] A signer can copy a single counter-offer in one action
- [ ] The UI states that counter-offer language may be recognisable and the
      signer may want to reword it
