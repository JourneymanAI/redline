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
    return recorded;
  }

  async answerFromDocument(input: {
    documentText: string;
    question: string;
  }): Promise<Answer> {
    const key = `answer:${input.documentText.substring(0, 30)}:${input.question.substring(0, 30)}`;
    const recorded = this.fixtures[key]?.answer;
    if (!recorded) {
      throw new Error(
        `No recorded response for fixture key: ${key}. Available keys: ${Object.keys(this.fixtures).join(', ')}`
      );
    }
    return recorded;
  }
}
