# 10: Governing-law prompt & jurisdiction adjustment

**What to build:** Before analysis, prompt the signer for
`governingLawState` and `operatingState` (either may be `unknown`,
`governingLawState` may be `non-us`). Maintain a `(clauseType x state) →
adjustment` table with a last-reviewed date for the jurisdiction-sensitive
clause types (non-compete/non-solicit, mandatory arbitration, liquidated
damages, some liability-limit enforceability). When either state is unknown
or governing law is non-US, jurisdiction-sensitive flags get a "depends on
governing law" marker instead of a severity. Governing law itself is emitted
as its own Note naming the applicable state.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] The same jurisdiction-sensitive clause fixture run under two different
      `governingLawState` values produces different severities per the table
      (e.g. a California non-compete is not Blocker)
- [ ] Running with `governingLawState` or `operatingState` as `unknown`
      produces the "depends on governing law" marker instead of a severity
- [ ] A `non-us` `governingLawState` marks all jurisdiction-sensitive flags
      uncertain and tells the signer Redline cannot assess it
- [ ] "Governing law" itself appears as a Note naming the state whose rules
      apply
- [ ] The adjustment table carries a last-reviewed date
