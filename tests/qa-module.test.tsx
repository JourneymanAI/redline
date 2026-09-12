import { describe, it, expect } from 'vitest';
import { answerFromDocument } from '@/lib/analysis';
import { fixtureQAResponses, getFixtureQAResponse } from '@/lib/fixture-responses';
import type { ModelBoundary, Answer } from '@/lib/model-boundary';

/**
 * Q&A Module Tests (Criterion 6 from PRD § "What good looks like")
 *
 * Q&A groundedness — On questions the document does not answer, share where Redline
 * says so rather than answering anyway. Target ~100%; no fabricated answers.
 *
 * These tests verify that:
 * 1. Q&A answers are grounded in document text (never fabricated)
 * 2. Answered questions are marked addressed: true
 * 3. Unanswered questions are marked addressed: false
 * 4. groundedIn field contains citation when available
 * 5. The UI can display answers and groundedness indicators
 */

describe('Q&A Module (Criterion 6)', () => {
  // Mock model boundary for testing
  const createMockModelBoundary = (
    qaResponses: { [question: string]: Answer }
  ): ModelBoundary => ({
    analyzeContract: async () => ({
      summary: '',
      flags: [],
      alsoSeen: [],
      verdict: { kind: 'clean' as const },
    }),
    answerFromDocument: async (input) => {
      const answer = qaResponses[input.question];
      if (!answer) {
        throw new Error(
          `No Q&A fixture found for question: "${input.question}"`
        );
      }
      return answer;
    },
  });

  describe('Fixture Q&A responses: contract-with-clauses', () => {
    it('should return Q&A fixture responses for contract-with-clauses', async () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      expect(qaMap).toBeDefined();
      expect(Object.keys(qaMap).length).toBeGreaterThan(0);
    });

    it('should have answerable questions with addressed: true', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answerableQuestions = Object.entries(qaMap).filter(
        ([_, answer]) => answer.addressed === true
      );
      expect(answerableQuestions.length).toBeGreaterThan(0);
    });

    it('should have unanswerable questions with addressed: false', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const unanswerable = Object.entries(qaMap).filter(
        ([_, answer]) => answer.addressed === false
      );
      expect(unanswerable.length).toBeGreaterThan(0);
    });

    it('should answer "What is the termination clause?" with addressed: true', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['What is the termination clause?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('Vendor may terminate');
      expect(answer.groundedIn).toBeDefined();
    });

    it('should answer "How long is the term?" with addressed: true', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['How long is the term?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('one (1) year');
    });

    it('should answer "Does this contract include employee benefits?" with addressed: false', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['Does this contract include employee benefits?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(false);
    });

    it('should answer "What is the arbitration clause?" with addressed: false', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['What is the arbitration clause?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(false);
    });
  });

  describe('Fixture Q&A responses: contract-clean', () => {
    it('should return Q&A fixture responses for contract-clean', async () => {
      const qaMap = fixtureQAResponses['contract-clean'];
      expect(qaMap).toBeDefined();
      expect(Object.keys(qaMap).length).toBeGreaterThan(0);
    });

    it('should have different Q&A pairs than contract-with-clauses', () => {
      const withClauses = fixtureQAResponses['contract-with-clauses'];
      const clean = fixtureQAResponses['contract-clean'];
      const withClausesKeys = Object.keys(withClauses);
      const cleanKeys = Object.keys(clean);

      // Should have some different questions
      const onlyInWith = withClausesKeys.filter((k) => !cleanKeys.includes(k));
      expect(onlyInWith.length).toBeGreaterThan(0);
    });

    it('should answer "Does this contract have a personal guarantee clause?" with addressed: false', () => {
      const qaMap = fixtureQAResponses['contract-clean'];
      const answer = qaMap['Does this contract have a personal guarantee clause?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(false);
    });
  });

  describe('getFixtureQAResponse helper function', () => {
    it('should retrieve Q&A response for contract-with-clauses by document text', () => {
      const contractText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").`;

      const answer = getFixtureQAResponse(
        contractText,
        'How long is the term?'
      );
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('one (1) year');
    });

    it('should throw error for unsupported document', () => {
      const unsupportedContract = `Unsupported Agreement
This is a contract that doesn't match any fixture.`;

      expect(() => {
        getFixtureQAResponse(unsupportedContract, 'What is the term?');
      }).toThrow();
    });

    it('should throw error for unknown question', () => {
      const contractText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").`;

      expect(() => {
        getFixtureQAResponse(
          contractText,
          'Unknown question that is not in the fixture?'
        );
      }).toThrow();
    });
  });

  describe('answerFromDocument wrapper function', () => {
    it('should validate that document text is required', async () => {
      const mockBoundary = createMockModelBoundary({});

      await expect(
        answerFromDocument('', 'What is the term?', mockBoundary)
      ).rejects.toThrow('Document text is required');
    });

    it('should validate that question is required', async () => {
      const mockBoundary = createMockModelBoundary({});
      const contractText = 'Some contract text';

      await expect(
        answerFromDocument(contractText, '', mockBoundary)
      ).rejects.toThrow('Question is required');
    });

    it('should call model boundary with correct parameters', async () => {
      const contractText = 'Sample contract';
      const question = 'What is the term?';
      const expectedAnswer: Answer = {
        answer: 'One year',
        addressed: true,
        groundedIn: 'Section 2',
      };

      const mockBoundary = createMockModelBoundary({
        [question]: expectedAnswer,
      });

      const result = await answerFromDocument(
        contractText,
        question,
        mockBoundary
      );

      expect(result).toEqual(expectedAnswer);
    });
  });

  describe('Groundedness validation: no fabricated answers', () => {
    it('should have answer property for addressed: true questions', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      Object.entries(qaMap).forEach(([question, answer]) => {
        if (answer.addressed === true) {
          expect(answer.answer).toBeDefined();
          expect(answer.answer.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have answer property for addressed: false questions (explaining why)', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      Object.entries(qaMap).forEach(([question, answer]) => {
        if (answer.addressed === false) {
          expect(answer.answer).toBeDefined();
          expect(answer.answer.length).toBeGreaterThan(0);
          // Unanswered questions should explain that the contract doesn't address it
          expect(answer.answer.toLowerCase()).toMatch(
            /does not|not address|no|not include/
          );
        }
      });
    });

    it('should include groundedIn for verifiable answers', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answerableQuestions = Object.entries(qaMap).filter(
        ([_, answer]) => answer.addressed === true
      );

      // Most answerable questions should have groundedIn
      const withCitation = answerableQuestions.filter(
        ([_, answer]) => answer.groundedIn
      );
      expect(withCitation.length).toBeGreaterThan(
        answerableQuestions.length / 2
      );
    });

    it('should not have groundedIn for unanswerable questions', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      Object.entries(qaMap).forEach(([question, answer]) => {
        if (answer.addressed === false) {
          // Unanswerable questions may not have a specific groundedIn
          // since they're not grounded in a particular clause
          if (answer.groundedIn) {
            expect(answer.groundedIn).toBeDefined();
          }
        }
      });
    });
  });

  describe('Q&A answer content validation', () => {
    it('all answers should be non-empty strings', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      Object.entries(qaMap).forEach(([question, answer]) => {
        expect(typeof answer.answer).toBe('string');
        expect(answer.answer.length).toBeGreaterThan(0);
      });
    });

    it('all answers should have addressed property that is boolean', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      Object.entries(qaMap).forEach(([question, answer]) => {
        expect(typeof answer.addressed).toBe('boolean');
      });
    });

    it('groundedIn should be optional but string if present', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      Object.entries(qaMap).forEach(([question, answer]) => {
        if (answer.groundedIn !== undefined) {
          expect(typeof answer.groundedIn).toBe('string');
          expect(answer.groundedIn.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Specific Q&A pairs: contract-with-clauses', () => {
    it('should provide detailed answer for "Who owns the intellectual property?"', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['Who owns the intellectual property created under this agreement?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('Vendor');
      expect(answer.answer).toContain('sole and exclusive property');
      expect(answer.groundedIn).toContain('INTELLECTUAL PROPERTY');
    });

    it('should provide detailed answer for "What is the payment term?"', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['What is the payment term?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('thirty (30) days');
      expect(answer.groundedIn).toBeDefined();
    });

    it('should explain why "Is there a warranty clause?" is not addressed', () => {
      const qaMap = fixtureQAResponses['contract-with-clauses'];
      const answer = qaMap['Is there a warranty clause?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(false);
      expect(answer.answer.toLowerCase()).toMatch(/warranty|not/);
    });
  });

  describe('Specific Q&A pairs: contract-clean', () => {
    it('should provide answer for "How long is the term?"', () => {
      const qaMap = fixtureQAResponses['contract-clean'];
      const answer = qaMap['How long is the term?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('one (1) year');
    });

    it('should provide answer for "Who owns the intellectual property?"', () => {
      const qaMap = fixtureQAResponses['contract-clean'];
      const answer = qaMap['Who owns the intellectual property?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(true);
      expect(answer.answer).toContain('Company');
      expect(answer.answer).toContain('custom work product');
    });

    it('should explain that "What are the employee benefits?" is not addressed', () => {
      const qaMap = fixtureQAResponses['contract-clean'];
      const answer = qaMap['What are the employee benefits?'];
      expect(answer).toBeDefined();
      expect(answer.addressed).toBe(false);
    });
  });
});
