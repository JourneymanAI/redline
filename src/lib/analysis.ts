import {
  Analysis,
  Flag,
  ModelBoundary,
  ConfidenceMarker,
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

  // Verify citation integrity: every flag's sourceSentence must be a verbatim substring
  const verifiedFlags = analysis.flags.filter((flag) => {
    const isSubstring = documentText.includes(flag.sourceSentence);
    if (!isSubstring) {
      console.warn(
        `Citation integrity check failed for flag: ${flag.clauseType}. Source sentence not found in document.`
      );
    }
    return isSubstring;
  });

  // Determine verdict: if no Blocker or Push flags exist, verdict is "clean"
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
