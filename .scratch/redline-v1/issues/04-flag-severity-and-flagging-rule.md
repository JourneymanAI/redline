# 04: Flag severity & the flagging rule

**What to build:** Implement the flagging rule and severity assignment inside
`analyzeContract()`: a clause becomes a flag only if it creates serious
uncapped/large financial downside, loss of core IP, or inescapable lock-in, or
crosses a red line (treat the red-line trigger as a stub input for now — real
wiring lands in ticket 11). Being merely unusual is never on its own enough to
promote a clause to a flag; it can only ride as commentary on a flag that
already qualifies. Severity is `Blocker` | `Push` | `Note`, each tied to the
action the signer should take, not a score. Update the result screen to order
flags Blocker-then-Push-then-Note, show a count at each severity, and name
each flag's clause type.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Fixtures with planted Blocker-tier clauses are returned at `Blocker`
      (blocker-recall)
- [ ] Fixtures that are genuinely standard produce no `Blocker`/`Push` flags
- [ ] A clause that is merely unusual (and doesn't otherwise qualify) never
      appears as its own flag
- [ ] The result screen shows flags ordered Blocker, Push, Note with a count
      at each level and each flag's clause-type name
