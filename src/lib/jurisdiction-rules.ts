/**
 * Jurisdiction-Sensitive Rules Engine (ADR 0005)
 *
 * State-law effects on contract clause enforceability:
 *   - Non-compete clauses: CA law disfavors/voids non-competes entirely;
 *     FL, TX, and most other states enforce them if reasonable in scope and time.
 *   - Arbitration clauses: CA law disfavors arbitration (consumer protection doctrine);
 *     most other states favor arbitration.
 *   - Liquidated damages: CA law scrutinizes heavily; most other states permit them
 *     if they represent a reasonable estimate of losses.
 *
 * When governing law is unknown:
 *   Mark jurisdiction-sensitive clauses with confidenceMarker = 'unclear-get-help'
 *   so the user understands the flag's severity depends on their jurisdiction.
 *
 * When governing law is non-US:
 *   Mark all jurisdiction-sensitive clauses as unclear (unknown enforceability).
 *
 * Sources:
 *   - California Business and Professions Code § 16600 (non-competes)
 *   - Federal Arbitration Act § 1 et seq. (arbitration favoring rule)
 *   - Various state law restatements on liquidated damages
 */

export type JurisdictionState = string | 'unknown' | 'non-us';

/**
 * Clauses whose enforceability depends on governing law.
 */
const JURISDICTION_SENSITIVE_CLAUSES = new Set([
  'non-compete',
  'arbitration',
  'liquidated-damages',
  'choice-of-law',
  'forum-selection',
]);

/**
 * Check if a clause type is jurisdiction-sensitive.
 */
export function isJurisdictionSensitive(clauseType: string): boolean {
  return JURISDICTION_SENSITIVE_CLAUSES.has(clauseType.toLowerCase());
}

/**
 * Get the severity adjustment for a clause in a given jurisdiction.
 *
 * Returns 'clear' if the clause's enforceability is predictable under that state's law.
 * Returns 'depends' if the clause's enforceability is uncertain or unpredictable.
 *
 * Examples:
 *   - non-compete + California = 'depends' (CA voids most non-competes)
 *   - non-compete + Florida = 'clear' (FL enforces reasonable non-competes)
 *   - arbitration + California = 'depends' (CA scrutinizes arbitration heavily)
 *   - arbitration + Texas = 'clear' (TX favors arbitration)
 *   - liquidated-damages + unknown = 'depends' (enforceability varies)
 */
export function getJurisdictionSensitivityAdjustment(
  clauseType: string,
  governingLawState: JurisdictionState
): 'clear' | 'depends' {
  const clause = clauseType.toLowerCase();

  // Non-US law: all jurisdiction-sensitive clauses become unclear
  if (governingLawState === 'non-us') {
    if (isJurisdictionSensitive(clause)) {
      return 'depends';
    }
    return 'clear';
  }

  // Unknown jurisdiction: all jurisdiction-sensitive clauses become unclear
  if (governingLawState === 'unknown') {
    if (isJurisdictionSensitive(clause)) {
      return 'depends';
    }
    return 'clear';
  }

  // Known US state: apply state-specific rules
  const state = governingLawState.toUpperCase();

  // Non-compete rules
  if (clause === 'non-compete') {
    // California voids most non-competes (Business & Professions Code § 16600)
    if (state === 'CA') {
      return 'depends'; // severity may be overstated if contract is governed by CA law
    }
    // Florida, Texas, and most states enforce reasonable non-competes
    if (['FL', 'TX', 'NY', 'IL', 'PA', 'OH', 'MI', 'NC', 'GA', 'VA'].includes(state)) {
      return 'clear'; // enforceability is predictable
    }
    // For other states, assume enforceability is likely but not guaranteed
    return 'depends';
  }

  // Arbitration rules
  if (clause === 'arbitration') {
    // California disfavors arbitration (consumer protection)
    if (state === 'CA') {
      return 'depends'; // CA law may invalidate or narrow arbitration clause
    }
    // Federal Arbitration Act favors arbitration in most states
    if ([
      'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'MA', 'AZ', 'CO', 'MN', 'MO', 'IN', 'TN', 'WI',
    ].includes(state)) {
      return 'clear'; // state law favors arbitration
    }
    return 'depends'; // uncertain for less-common states
  }

  // Liquidated damages rules
  if (clause === 'liquidated-damages') {
    // California scrutinizes liquidated damages more strictly
    if (state === 'CA') {
      return 'depends'; // may be found unenforceable as penalty
    }
    // Most other states enforce liquidated damages if reasonable
    if (['TX', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA'].includes(state)) {
      return 'clear';
    }
    return 'depends';
  }

  // Choice of law and forum selection
  if (clause === 'choice-of-law' || clause === 'forum-selection') {
    // Generally enforceable in all US states (but can affect enforceability of other clauses)
    if (state === 'CA') {
      return 'depends'; // CA may override with public policy
    }
    return 'clear';
  }

  // Default: if jurisdiction is known but clause type is not in our rules, assume clear
  return 'clear';
}

/**
 * Generate a jurisdiction notice for display in the UI/output.
 * Used when governing law is non-US or unknown.
 */
export function getJurisdictionNotice(governingLawState: JurisdictionState): string | null {
  if (governingLawState === 'non-us') {
    return 'This contract is governed by non-US law. Flagged clauses may have different enforceability under foreign law. Consult local legal counsel.';
  }
  if (governingLawState === 'unknown') {
    return 'Governing law is unknown. Some flags may have different severity depending on the jurisdiction. Select your state for more accurate guidance.';
  }
  return null;
}

/**
 * List all clause types that are jurisdiction-sensitive.
 * Useful for UI/testing to know which clauses to watch.
 */
export function getJurisdictionSensitiveClauses(): string[] {
  return Array.from(JURISDICTION_SENSITIVE_CLAUSES);
}
