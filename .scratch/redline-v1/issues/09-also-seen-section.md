# 09: Also-seen section

**What to build:** Clauses the model notices outside the fixed v1 clause set
go to a separate `alsoSeen` array, never into `flags`, and render in their own
lower-confidence section on the result screen — distinct from the main flags
list.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] A model response naming a non-core clause type produces an `alsoSeen`
      entry, not a flag
- [ ] The result screen renders also-seen items in a visually separate,
      lower-confidence section
