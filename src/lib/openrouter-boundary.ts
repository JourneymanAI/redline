import { ModelBoundary, Analysis, Answer } from './model-boundary';

interface OpenRouterMessage {
  role: 'user' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenRouterBoundary implements ModelBoundary {
  private modelSlug: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.modelSlug = process.env.OPENROUTER_MODEL || '';
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.io/api/v1';

    if (!this.modelSlug) {
      throw new Error(
        'OPENROUTER_MODEL environment variable is not set. Cannot initialize OpenRouter boundary.'
      );
    }
    if (!this.apiKey) {
      throw new Error(
        'OPENROUTER_API_KEY environment variable is not set. Cannot initialize OpenRouter boundary.'
      );
    }
  }

  async analyzeContract(input: {
    documentText: string;
    redLines: string[];
    governingLawState: string | 'unknown' | 'non-us';
    operatingState: string | 'unknown';
  }): Promise<Analysis> {
    const { documentText, redLines, governingLawState, operatingState } = input;

    const systemPrompt = this.buildAnalysisSystemPrompt(redLines, governingLawState, operatingState);
    const userPrompt = this.buildAnalysisUserPrompt(documentText);

    const response = await this.callOpenRouter(systemPrompt, userPrompt);
    const analysis = this.parseAnalysisResponse(response);

    return analysis;
  }

  async answerFromDocument(input: {
    documentText: string;
    question: string;
  }): Promise<Answer> {
    const { documentText, question } = input;

    const systemPrompt =
      'You are a contract analysis assistant. Answer questions about the provided contract text. If the document does not address the question, explicitly state: "The document does not address this." Answer in JSON format: { "answer": "...", "addressed": true/false, "groundedIn": "relevant quote or null" }';
    const userPrompt = `Contract text:\n\n${documentText}\n\nQuestion: ${question}`;

    const response = await this.callOpenRouter(systemPrompt, userPrompt);
    const answer = this.parseAnswerResponse(response);

    return answer;
  }

  private buildAnalysisSystemPrompt(
    redLines: string[],
    governingLawState: string | 'unknown' | 'non-us',
    operatingState: string | 'unknown'
  ): string {
    let prompt = `You are an expert contract analyst. Analyze the provided contract and return a JSON object with the following structure:

{
  "summary": "plain-English summary of the contract, naming parties, term, and the signer's core obligation",
  "flags": [
    {
      "clauseType": "e.g., personal-guarantee",
      "severity": "Blocker | Push | Note",
      "sourceSentence": "exact verbatim sentence from the contract",
      "counterOffer": "specific replacement language or negotiation suggestion",
      "confidenceMarker": "clear | our-read | unclear-get-help",
      "reason": "why this clause is problematic",
      "isRedLineTrigger": true/false,
      "jurisdictionSensitive": true/false
    }
  ],
  "alsoSeen": [
    { "clauseType": "...", "description": "..." }
  ],
  "verdict": { "kind": "flags" | "clean" }
}

**Clause Types to Check For:**
IP assignment, auto-renewal, vague scope / unlimited revisions, unilateral termination without kill fee, uncapped indemnification, one-sided liability cap, forced arbitration, non-compete, fee escalator, personal guarantee, unilateral amendment, confidentiality overreach, joint-and-several liability, restrictive cancellation method, governing law.

**Severity Rules:**
- Blocker: Do not sign as-is. Creates serious uncapped/large downside, loss of core IP, or inescapable lock-in.
- Push: Ask for a change. Negotiable; signable if they refuse depends on leverage.
- Note: Worth knowing, not worth a fight.

**Citation Requirement:**
Every sourceSentence MUST be a verbatim substring of the contract text. No paraphrasing. No approximations.`;

    if (redLines && redLines.length > 0) {
      prompt += `\n\n**User's Red Lines (non-negotiables):**\nAny clause crossing these lines should be flagged even if standard:\n${redLines.join('\n')}`;
    }

    if (governingLawState !== 'unknown') {
      if (governingLawState === 'non-us') {
        prompt += `\n\n**Note:** This contract is governed by non-US law. Mark all jurisdiction-sensitive clauses as uncertain.`;
      } else {
        prompt +=
          `\n\n**Governing Law:** The contract is governed by ${governingLawState} law. Adjust severity on jurisdiction-sensitive clauses (non-competes, forced arbitration, liquidated damages) based on ${governingLawState}'s enforceability rules.`;
      }
    }

    if (operatingState !== 'unknown' && operatingState !== 'non-us') {
      prompt +=
        `\n\n**Business Location:** The signer operates in ${operatingState}. Consider ${operatingState}-specific protections when evaluating jurisdiction-sensitive clauses.`;
    }

    return prompt;
  }

  private buildAnalysisUserPrompt(documentText: string): string {
    return `Please analyze the following contract:\n\n${documentText}`;
  }

  private async callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://redline.example.com',
        'X-Title': 'Redline Contract Analyzer',
      },
      body: JSON.stringify({
        model: this.modelSlug,
        messages,
        temperature: 0.2,
        max_tokens: 4000,
        provider: {
          order: ['fireworks'],
          allow_fallbacks: false,
          require_parameters: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0].message.content;
  }

  private parseAnalysisResponse(response: string): Analysis {
    type FlagInput = Record<string, unknown>;
    type AlsoSeenInput = Record<string, unknown>;

    try {
      // Extract JSON from response (may contain markdown code blocks)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      return {
        summary: (parsed.summary as string) || '',
        flags: ((parsed.flags as FlagInput[]) || []).map((f) => ({
          clauseType: f.clauseType as string,
          severity: f.severity as 'Blocker' | 'Push' | 'Note',
          sourceSentence: f.sourceSentence as string,
          counterOffer: f.counterOffer as string,
          confidenceMarker: f.confidenceMarker as 'clear' | 'our-read' | 'unclear-get-help',
          reason: f.reason as string,
          isRedLineTrigger: (f.isRedLineTrigger as boolean) || false,
          jurisdictionSensitive: (f.jurisdictionSensitive as boolean) || false,
        })),
        alsoSeen: ((parsed.alsoSeen as AlsoSeenInput[]) || []).map((a) => ({
          clauseType: a.clauseType as string,
          description: a.description as string,
        })),
        verdict: (parsed.verdict as { kind: 'flags' | 'clean' }) || { kind: 'clean' as const },
      };
    } catch (e) {
      throw new Error(`Failed to parse OpenRouter response: ${e}`);
    }
  }

  private parseAnswerResponse(response: string): Answer {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      return {
        answer: (parsed.answer as string) || '',
        groundedIn: parsed.groundedIn as string | undefined,
        addressed: (parsed.addressed as boolean) !== false,
      };
    } catch (e) {
      throw new Error(`Failed to parse OpenRouter answer response: ${e}`);
    }
  }
}
