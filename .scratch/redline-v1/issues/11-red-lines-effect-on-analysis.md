# 11: Red-lines effect on analysis

**What to build:** `analyzeContract()` accepts the signer's red lines and
flags any clause that crosses one, regardless of how standard it otherwise is,
marking that flag `isRedLineTrigger` so the signer can distinguish
"objectively dangerous" from "you said no to this." Works correctly — and
doesn't block analysis — when the red-lines list is empty.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] The same standard-clause fixture run with and without a matching red
      line differs: absent from `flags` without it, present with
      `isRedLineTrigger: true` with it
- [ ] An empty red-lines list still produces a normal, complete analysis
- [ ] A flag with `isRedLineTrigger` reads distinctly from a flag that
      qualified on its own merits
