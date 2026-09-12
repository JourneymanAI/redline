# 14: Production model boundary (real OpenRouter call)

**What to build:** Cannot start until the OpenRouter model slug is supplied
(spec's "Blocked on"). Wire the production model-boundary implementation:
calls OpenRouter server-side with the configured model slug (from
`.env.local`), used by both `analyzeContract()` and `answerFromDocument()`.
The app fails loudly at call time if the slug is missing rather than
defaulting to one. One model call per analysis (or a small fixed number), one
call per Q&A question — no background or proactive calls.

**Blocked by:** 03, 12

**Status:** ready-for-agent

- [ ] With the model slug unset, the app fails loudly rather than silently
      defaulting
- [ ] A production analysis and a production Q&A call each result in exactly
      one OpenRouter call (or the documented small fixed number)
- [ ] A manually-run check against the real configured model succeeds against
      a couple of fixtures (not part of CI)
- [ ] A thin contract test confirms the production implementation shapes
      requests and parses responses correctly, without hitting the live API
      in CI
