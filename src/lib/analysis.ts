import {
  Analysis,
  ModelBoundary,
  Verdict,
} from './model-boundary';

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

  // Determine verdict: if no Blocker or Push flags exist, verdict is "clean" (ADR 0003, 0004)
  // - "flags" verdict: one or more Blocker or Push flags exist → signer should take action
  // - "clean" verdict: only Note flags (or no flags) exist → contract is acceptable as-is
  // Per ADR 0004: "Never manufactures flags to justify the review"
  const hasBlockerOrPush = verifiedFlags.some(
    (f) => f.severity === 'Blocker' || f.severity === 'Push'
  );

  let verdict: Verdict;
  if (hasBlockerOrPush) {
    verdict = { kind: 'flags' };
  } else {
    const notesCount = verifiedFlags.filter((f) => f.severity === 'Note').length;
    verdict = { kind: 'clean', notesCount };
  }

  return {
    summary: analysis.summary,
    flags: verifiedFlags,
    alsoSeen: analysis.alsoSeen,
    verdict,
  };
}

export async function answerFromDocument(
  documentText: string,
  question: string,
  modelBoundary: ModelBoundary
) {
  if (!documentText || documentText.trim().length === 0) {
    throw new Error('Document text is required');
  }
  if (!question || question.trim().length === 0) {
    throw new Error('Question is required');
  }

  return modelBoundary.answerFromDocument({ documentText, question });
}
