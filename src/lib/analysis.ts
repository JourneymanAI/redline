import {
  Analysis,
  Answer,
  ModelBoundary,
  Verdict,
} from './model-boundary';
import {
  isJurisdictionSensitive,
  getJurisdictionSensitivityAdjustment,
} from './jurisdiction-rules';

export type AnalysisInput = {
  documentText: string;
  redLines: string[];
  governingLawState: string | 'unknown' | 'non-us';
  operatingState: string | 'unknown';
};

export async function analyzeContract(
  input: AnalysisInput,
  modelBoundary: ModelBoundary
): Promise<Analysis> {
  const { documentText, redLines, governingLawState, operatingState } = input;

  // Validate input
  if (!documentText || documentText.trim().length === 0) {
    throw new Error('Document text is required');
  }

  // Call model boundary to get analysis
  const analysis = await modelBoundary.analyzeContract({
    documentText,
    redLines,
    governingLawState,
    operatingState,
  });

  // ========== CITATION INTEGRITY CHECK (Criterion 1 from PRD § "What good looks like") ==========
  // This check is a hard gate: citation integrity must be 100%.
  //
  // Every flag returned to the user must have a source sentence that is a VERBATIM substring
  // of the documentText. Flags whose source sentences are not found (e.g., due to:
  //   - OCR errors
  //   - LLM hallucination of clause text
  //   - Malformed sourceSentence fields
  // ) are silently filtered out before being returned to the user.
  //
  // Why it matters: The UI quotes this sentence back to the user (ResultScreen line 106).
  // If the quote is not actually in the document, the user loses trust in the analysis.
  //
  // See also: ADR 0001 "Citation Integrity" (docs/adr/0001-citation-integrity.md)
  const verifiedFlags = analysis.flags.filter((flag) => {
    const isSubstring = documentText.includes(flag.sourceSentence);
    if (!isSubstring) {
      console.warn(
        `Citation integrity check failed for flag: ${flag.clauseType}. Source sentence not found in document.`
      );
    }
    return isSubstring;
  });

  // ========== JURISDICTION SENSITIVITY CHECK (ADR 0005) ==========
  // If governing law is unknown or non-US, mark jurisdiction-sensitive clauses
  // with confidenceMarker = 'unclear-get-help' so users understand the flag's
  // severity depends on their jurisdiction.
  //
  // If governing law is a known US state, check if the clause's enforceability
  // is state-dependent (e.g., CA voids non-competes, CA scrutinizes arbitration).
  // If getJurisdictionSensitivityAdjustment returns 'depends', also mark as unclear.
  //
  // Jurisdiction-sensitive clauses: non-compete, arbitration, liquidated-damages,
  // choice-of-law, forum-selection.
  //
  // See also: ADR 0005 "Jurisdiction and State Law Effects" (docs/adr/0005-jurisdiction.md)
  const adjustedFlags = verifiedFlags.map((flag) => {
    if (!isJurisdictionSensitive(flag.clauseType)) {
      return flag;
    }

    // Check if this jurisdiction-sensitive clause has unpredictable enforceability
    const sensitivityAdjustment = getJurisdictionSensitivityAdjustment(
      flag.clauseType,
      governingLawState
    );

    if (sensitivityAdjustment === 'depends') {
      // Mark as unclear if the clause's severity is unpredictable in this jurisdiction
      return {
        ...flag,
        confidenceMarker: 'unclear-get-help' as const,
        reason:
          flag.reason +
          ' (Enforceability depends on your governing law state; select your state for accurate guidance.)',
      };
    }

    return flag;
  });

  // ========== VERDICT DETERMINATION (Criterion 3 from PRD § "What good looks like") ==========
  // Clean-set false-Blocker rate: on a labelled set of genuinely standard contracts,
  // share of those that get a false Blocker or Push flag. Target ~0; the clean verdict fires instead.
  //
  // Verdict logic (ADR 0003, 0004):
  //   "flags" verdict: one or more Blocker or Push flags exist → signer should take action
  //   "clean" verdict: only Note flags (or no flags) exist → contract is acceptable as-is
  //
  // The verdict.notesCount field is ONLY included when kind = 'clean', counting the
  // number of Note-severity flags that were found. This allows the UI to surface low-priority
  // informational flags (e.g., unusual-but-negotiable clauses) without triggering alarm.
  //
  // Per ADR 0004: "Never manufactures flags to justify the review". A clean verdict on a
  // standard contract never invents Note flags; it reflects the actual flag set returned.
  //
  // Test coverage: tests/clean-verdict.test.ts (verdict logic) + tests/clean-verdict-display.test.tsx (UI)
  const hasBlockerOrPush = adjustedFlags.some(
    (f) => f.severity === 'Blocker' || f.severity === 'Push'
  );

  let verdict: Verdict;
  if (hasBlockerOrPush) {
    verdict = { kind: 'flags' };
  } else {
    const notesCount = adjustedFlags.filter((f) => f.severity === 'Note').length;
    verdict = { kind: 'clean', notesCount };
  }

  return {
    summary: analysis.summary,
    flags: adjustedFlags,
    alsoSeen: analysis.alsoSeen,
    verdict,
  };
}

/**
 * Answer a question about a contract document.
 *
 * ========== Q&A GROUNDEDNESS (Criterion 6 from PRD § "What good looks like") ==========
 *
 * This function enforces document-grounded Q&A: answers are drawn ONLY from the contract
 * text, never fabricated or hallucinated.
 *
 * Answer contract rules:
 * 1. If the document answers the question: addressed = true, answer contains the response
 * 2. If the document does NOT answer the question: addressed = false, answer explains that
 *    the contract does not address the topic
 * 3. NEVER answer a question that the document does not address
 * 4. If possible, include groundedIn (a citation to the relevant section or clause)
 * 5. Answers may paraphrase but must be traceable to document text
 *
 * Why it matters: Groundedness builds trust. Users must be able to verify answers against
 * the contract. If Redline makes up an answer, credibility is destroyed.
 *
 * See also: ADR 0001 "Citation Integrity" (docs/adr/0001-citation-integrity.md)
 *
 * @param documentText - The full contract text
 * @param question - The user's question about the contract
 * @param modelBoundary - The model boundary implementation to call
 * @returns Answer with groundedness validation
 */
export async function answerFromDocument(
  documentText: string,
  question: string,
  modelBoundary: ModelBoundary
): Promise<Answer> {
  if (!documentText || documentText.trim().length === 0) {
    throw new Error('Document text is required');
  }
  if (!question || question.trim().length === 0) {
    throw new Error('Question is required');
  }

  return modelBoundary.answerFromDocument({ documentText, question });
}
