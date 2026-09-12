# Non-Compete Clause: Jurisdiction Sensitivity Expectations

This document describes how the non-compete clause in `contract-with-non-compete.txt` should be analyzed under different governing law states, demonstrating ADR 0005 (Jurisdiction and State Law Effects).

## Fixture Overview

The contract contains a non-compete clause (Section 3) that:
- Applies during employment and for 2 years after termination
- Restricts work within 50 miles
- Covers "any business that competes with the Company's business"
- Reserves equitable relief (injunctive relief, specific performance)

## Expected Analysis by Governing Law State

### California Governing Law

**Expected Flag:**
- Clause Type: `non-compete`
- Severity: `Push` (normally)
- Confidence Marker: `unclear-get-help` (marked as unclear due to CA law)
- Reason should include: "Enforceability depends on your governing law state"

**Why:**
California Business and Professions Code § 16600 voids most non-compete agreements as against public policy. A non-compete that would be a straightforward "Push" flag in most states becomes unpredictable (and likely unenforceable) under CA law. Users should understand that this clause may not be enforceable at all under CA law.

### Florida Governing Law

**Expected Flag:**
- Clause Type: `non-compete`
- Severity: `Push`
- Confidence Marker: `clear` (predictable enforceability)
- Reason: "Non-compete clause restricts future work" (no jurisdiction note)

**Why:**
Florida law (Fla. Stat. § 542.335) enforces reasonable non-compete agreements. The clause in this fixture (2-year duration, 50-mile radius) is likely reasonable and enforceable under FL law. Users can proceed with confidence that this clause will be upheld.

### Texas Governing Law

**Expected Flag:**
- Clause Type: `non-compete`
- Severity: `Push`
- Confidence Marker: `clear`
- Reason: "Non-compete clause restricts future work"

**Why:**
Texas Business and Commerce Code § 15.50 permits reasonable non-competes. This clause meets Texas enforceability standards.

### Unknown / Non-US Governing Law

**Expected Flag:**
- Clause Type: `non-compete`
- Severity: `Push`
- Confidence Marker: `unclear-get-help` (marked as unclear due to unknown jurisdiction)
- Reason should include: "Enforceability depends on your governing law state"

**Why:**
When the governing law is unknown or non-US, the enforceability of the non-compete is unclear. Users should consult local counsel to understand the enforceability in their specific jurisdiction.

## How to Test

Use this fixture in your test environment:

```typescript
// When governing law is California
const result = await analyzeContract(
  {
    documentText: contractWithNonCompete,
    redLines: [],
    governingLawState: "CA",
    operatingState: "CA",
  },
  testBoundary
);

// Find the non-compete flag
const ncFlag = result.flags.find(f => f.clauseType === "non-compete");
expect(ncFlag?.confidenceMarker).toBe("unclear-get-help");

// When governing law is Florida
const resultFL = await analyzeContract(
  {
    documentText: contractWithNonCompete,
    redLines: [],
    governingLawState: "FL",
    operatingState: "FL",
  },
  testBoundary
);

const ncFlagFL = resultFL.flags.find(f => f.clauseType === "non-compete");
expect(ncFlagFL?.confidenceMarker).toBe("clear");
```

## Notes

- This fixture demonstrates that the same contract clause can have very different legal consequences depending on governing law.
- The severity (Push) remains the same across jurisdictions, but the confidence marker changes to reflect enforceability uncertainty.
- Users must select their governing law state for accurate guidance.
