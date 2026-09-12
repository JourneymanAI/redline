export type ConfidenceMarker = 'clear' | 'our-read' | 'unclear-get-help';

export interface Flag {
  clauseType: string;
  sourceSentence: string;
  severity: 'Blocker' | 'Push' | 'Note';
  counterOffer: string;
  confidenceMarker: ConfidenceMarker;
  reason: string;
  isRedLineTrigger: boolean;
  jurisdictionSensitive: boolean;
}

export interface Verdict {
  kind: 'flags' | 'clean';
  notesCount?: number;
}

export interface Analysis {
  summary: string;
  flags: Flag[];
  alsoSeen: Array<{ clauseType: string; description: string }>;
  verdict: Verdict;
}

export interface Answer {
  answer: string;
  groundedIn?: string;
  addressed: boolean;
}

export interface ModelBoundary {
  analyzeContract(input: {
    documentText: string;
    redLines: string[];
    governingLawState: string | 'unknown' | 'non-us';
    operatingState: string | 'unknown';
  }): Promise<Analysis>;

  answerFromDocument(input: {
    documentText: string;
    question: string;
  }): Promise<Answer>;
}

interface RecordedResponse {
  analysis?: Analysis;
  answer?: Answer;
}

interface FixtureMapping {
  [fixtureKey: string]: RecordedResponse;
}

export class TestModelBoundary implements ModelBoundary {
  private fixtures: FixtureMapping;

  constructor(fixtures: FixtureMapping = {}) {
    this.fixtures = fixtures;
  }

  async analyzeContract(input: {
    documentText: string;
    redLines: string[];
    governingLawState: string | 'unknown' | 'non-us';
    operatingState: string | 'unknown';
  }): Promise<Analysis> {
    const key = `analyze:${input.documentText.substring(0, 50)}`;
    const recorded = this.fixtures[key]?.analysis;
    if (!recorded) {
      throw new Error(
        `No recorded response for fixture key: ${key}. Available keys: ${Object.keys(this.fixtures).join(', ')}`
      );
    }

    // ADR 0003: Red-lines effect
    // A clause becomes a flag (or gets escalated) when either:
    // (1) it creates serious downside (normal flagging logic), OR
    // (2) it crosses one of the signer's declared red lines (redLines)
    //
    // Red-line matching: Case-insensitive substring match of each red line
    // against both the flag's clauseType and reason. If a match is found,
    // set isRedLineTrigger = true.
    //
    // This allows users to declare non-negotiables (e.g., "personal guarantee",
    // "unlimited liability") and have any clause crossing those lines highlighted
    // with "Triggers your red line" in the UI.
    const flagsWithRedLines = recorded.flags.map((flag) => {
      const flagLower = JSON.stringify(flag).toLowerCase();
      const redLineMatched = input.redLines.some((redLine) =>
        flagLower.includes(redLine.toLowerCase())
      );
      return {
        ...flag,
        isRedLineTrigger: redLineMatched,
      };
    });

    return {
      ...recorded,
      flags: flagsWithRedLines,
    };
  }

  async answerFromDocument(input: {
    documentText: string;
    question: string;
  }): Promise<Answer> {
    // Try exact key match first (new key format)
    const exactKey = `answer:${input.documentText.substring(0, 30)}:${input.question.substring(0, 30)}`;
    const recordedExact = this.fixtures[exactKey]?.answer;
    if (recordedExact) {
      return recordedExact;
    }

    // Try legacy key format for backward compatibility
    const legacyKey = `${input.documentText.substring(0, 50)}:${input.question.substring(0, 50)}`;
    const recordedLegacy = this.fixtures[legacyKey]?.answer;
    if (recordedLegacy) {
      return recordedLegacy;
    }

    throw new Error(
      `No recorded response for fixture key: ${exactKey}. Available keys: ${Object.keys(this.fixtures).join(', ')}`
    );
  }
}
