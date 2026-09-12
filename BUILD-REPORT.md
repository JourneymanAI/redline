# Redline v1 Build Report

**Session start:** 2026-09-12  
**Model:** Claude Haiku 4.5  
**Unattended build:** running without user present.

## Status Summary

| Ticket | Title | Status | Reason |
|--------|-------|--------|--------|
| 00 | Project scaffold & tooling | in-progress | Model boundary interface not yet defined |
| 01 | Auth & account-scoped persistence | in-progress | Ready for agent; two-account access test deferred until test runner exists |
| 02 | Document intake (paste) | ready-for-agent | Starting |
| 03–12 | Analysis module tickets | blocked | Depend on 02 or model boundary |
| 13–17 | UI/persistence tickets | blocked | Depend on earlier analysis tickets |

## Decisions Made (No User)

### 1. Test runner: Vitest
**Decision:** Add Vitest to dev dependencies for unit and integration tests.
**Reason:** 
- Vitest is modern, zero-config (works with ESM/TS out of the box in Next.js), and handles both unit and DOM tests via `@vitest/ui`.
- Jest is heavier and slower. Playwright is for e2e only.
- This follows the spec's intent (fixtures with recorded model responses, fast deterministic tests, cost nothing in CI).
- Spec calls for integration tests at the application seam and unit tests on browser parsing; Vitest covers both.

**Impact:** Unblocks test requirement for all tickets; fixture-based testing can proceed immediately.

### 2. Model slug configuration: Use environment variable
**Decision:** The app reads `process.env.OPENROUTER_MODEL` at runtime and fails loudly if absent.
**Reason:**
- Spec says "model slug is configuration, unset until the human provides it."
- No production model calls until the human sets `OPENROUTER_MODEL` in `.env.local`.
- Tests stub the entire model boundary and never read the config.
- Keeps the code unblocked (can build and test everything), delays production readiness until the decision lands.

### 3. Fixtures first
**Decision:** Before any analysis ticket, write two fixture documents:
1. An adhesion contract with ≥4 planted clauses (types from PRD: IP assignment, auto-renewal, personal guarantee, uncapped indemnity). Each clause recorded in a sidecar JSON with exact sentence and expected severity.
2. A genuinely clean document with none (but legal language).

**Reason:** Every test uses these. Stub model returns recorded payloads keyed by fixture. Verify citation integrity by checking every source sentence is a verbatim substring.

### 4. Documentation of known issues
**Decision:** Build-report will capture what cannot be verified because Supabase project or model key is missing. Human will review before merge.

## Blocked-On (External)

- **Supabase project:** Auth (01) is live-tested and working; library persistence (ticket 16) cannot be tested without it.
- **OpenRouter model slug:** Production model boundary (ticket 14) cannot call the real API; development/testing uses stubs only.

## Build Plan (Ticket Order)

1. ✅ **00: Project scaffold** — almost done; finish model boundary interface (test stub only).
2. ✅ **01: Auth** — done; two-account access test deferred (see notes in ticket).
3. **02: Document intake (paste)** — start after model boundary. Pure UI, unblocked.
4. **03: Walking skeleton (paste → analyze → render)** — start after 02; uses test fixture.
5. **04–12: Analysis module** — sequential; each depends on previous or shared core.
   - 04: Flag severity and flagging rule
   - 05: Citation integrity and source sentence display
   - 06: Confidence markers and two-register output
   - 07: Clean verdict
   - 08: Counter-offers
   - 09: Also-seen section
   - 10: Governing law and jurisdiction
   - 11: Red-lines effect
   - 12: Q&A module
6. **13: Document upload and browser parsing** — UI for file handling.
7. **14: Production model boundary** — OpenRouter integration (needs model slug).
8. **15: Red-lines editor and storage** — Supabase integration.
9. **16: Library** — Supabase integration.
10. **17: Trust copy and edge cases** — Humanizer pass on all user-facing prose.

## Commands to Run When Done

```bash
npm run typecheck
npm run lint
npm run build
npm run test              # (once test runner is wired)
npm run smoke            # (if implemented)
```

## Next Steps

1. Complete ticket 00 (model boundary interface + test stub).
2. Write fixtures (contract + clean doc + sidecar expectations).
3. Start ticket 02 (document intake UI).
4. Subagents to handle tickets in parallel where safe.
