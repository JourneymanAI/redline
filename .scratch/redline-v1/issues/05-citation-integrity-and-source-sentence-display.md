# 05: Citation integrity & source-sentence display

**What to build:** After the model returns flags, verify each flag's
`sourceSentence` is a verbatim substring of the input `documentText`; drop —
not repair, not approximate — any flag that fails, and count dropped flags
internally for observability. On the result screen, let a signer expand a flag
to see its source sentence in the surrounding context.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Every flag in `analyzeContract()`'s output has a `sourceSentence` that
      is a verbatim substring of `documentText`
- [ ] A recorded model response containing a fabricated sentence produces no
      flag for that sentence
- [ ] A signer can expand any flag and see the source sentence in its
      surrounding context
