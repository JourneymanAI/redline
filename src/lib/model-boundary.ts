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

export class OpenRouterBoundary implements ModelBoundary {
  private apiKey: string;
  private modelSlug: string;

  constructor(apiKey: string, modelSlug: string) {
    if (!apiKey || !modelSlug) {
      throw new Error('OpenRouter API key and model slug are required');
    }
    this.apiKey = apiKey;
    this.modelSlug = modelSlug;
  }

  async analyzeContract(input: {
    documentText: string;
    redLines: string[];
    governingLawState: string | 'unknown' | 'non-us';
    operatingState: string | 'unknown';
  }): Promise<Analysis> {
    const prompt = `Analyze this contract for risk clauses. Return JSON with: summary, flags (array of {clauseType, sourceSentence (verbatim from document), severity: "Blocker"|"Push"|"Note", counterOffer, confidenceMarker: "clear"|"our-read"|"unclear-get-help", reason, isRedLineTrigger: boolean, jurisdictionSensitive: boolean}), alsoSeen (array of {clauseType, description}), verdict {kind: "flags"|"clean", notesCount?: number}.

Contract:
${input.documentText}

Red lines: ${input.redLines.join(', ') || 'none'}
Governing law: ${input.governingLawState}
Operating state: ${input.operatingState}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.modelSlug,
        messages: [{ role: 'user', content: prompt }],
      }),
      keepalive: false,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenRouter');
    }

    let jsonString = content;
    if (content.includes('```')) {
      jsonString = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    }

    // Extract JSON object
    const firstBrace = jsonString.indexOf('{');
    if (firstBrace !== -1) {
      let braceCount = 0;
      let jsonEnd = -1;
      for (let i = firstBrace; i < jsonString.length; i++) {
        if (jsonString[i] === '{') braceCount++;
        if (jsonString[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }
      if (jsonEnd !== -1) {
        jsonString = jsonString.substring(firstBrace, jsonEnd);
      }
    }

    const parsed = JSON.parse(jsonString) as Analysis;
    return parsed;
  }

  async answerFromDocument(input: {
    documentText: string;
    question: string;
  }): Promise<Answer> {
    const prompt = `Answer this question based ONLY on the contract text. Return JSON with: {answer: string, groundedIn?: string (exact quote from document), addressed: boolean}.

Contract:
${input.documentText}

Question: ${input.question}

If the document doesn't address the question, set addressed: false and explain that in the answer field.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.modelSlug,
        messages: [{ role: 'user', content: prompt }],
      }),
      keepalive: false,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenRouter');
    }

    let jsonString = content;
    if (content.includes('```')) {
      jsonString = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    }

    // Extract JSON object
    const firstBrace = jsonString.indexOf('{');
    if (firstBrace !== -1) {
      let braceCount = 0;
      let jsonEnd = -1;
      for (let i = firstBrace; i < jsonString.length; i++) {
        if (jsonString[i] === '{') braceCount++;
        if (jsonString[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }
      if (jsonEnd !== -1) {
        jsonString = jsonString.substring(firstBrace, jsonEnd);
      }
    }

    const parsed = JSON.parse(jsonString) as Answer;
    return parsed;
  }
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
