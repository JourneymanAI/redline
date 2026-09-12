import { describe, it, expect } from 'vitest';
import { analyzeContract } from '@/lib/analysis';
import { fixtureResponses } from '@/lib/fixture-responses';
import type { ModelBoundary, Answer, Analysis, Flag } from '@/lib/model-boundary';
import { TestModelBoundary } from '@/lib/model-boundary';

/**
 * Red-Lines Effect Tests (Evaluation Criterion 8)
 *
 * ADR 0003: "A clause becomes a flag when either:
 * (1) it creates serious downside (severity-based), OR
 * (2) it crosses one of the signer's declared red lines"
 *
 * Red line matching:
 * - Case-insensitive substring match
 * - Matches against both clauseType and reason
 * - When a match is found, isRedLineTrigger = true
 *
 * Tests verify:
 * 1. Red line matches set isRedLineTrigger = true
 * 2. Non-matching red lines don't affect existing flags
 * 3. Red lines work with multiple clauses
 * 4. Substring matching is case-insensitive
 * 5. Empty red lines array works correctly
 * 6. Blocker clauses stay flagged regardless of red lines
 */

describe('Red-Lines Effect (Criterion 8)', () => {
  // Helper: create test model boundary with red-lines matching logic
  const createTestModelBoundary = (contractText: string, analysisResponse: Analysis): TestModelBoundary => {
    const contractKey = `analyze:${contractText.substring(0, 50)}`;
    return new TestModelBoundary({
      [contractKey]: { analysis: analysisResponse },
    });
  };

  describe('Red-Line Matching: Basic Cases', () => {
    it('should flag a clause when red line matches clauseType', async () => {
      const contractText = 'test contract with personal guarantee clause.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test contract with personal guarantee clause.',
            counterOffer: 'Remove it',
            confidenceMarker: 'clear' as const,
            reason: 'Exposes you to personal liability.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal guarantee'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      expect(result.flags).toHaveLength(1);
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });

    it('should flag a clause when red line matches reason', async () => {
      const contractText = 'test liability clause present here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'uncapped-indemnification',
            severity: 'Blocker' as const,
            sourceSentence: 'test liability clause present here.',
            counterOffer: 'Cap it at annual fees',
            confidenceMarker: 'clear' as const,
            reason: 'Creates unlimited liability exposure.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['unlimited liability'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      expect(result.flags).toHaveLength(1);
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });

    it('should match red lines case-insensitively', async () => {
      const contractText = 'test Personal Guarantee clause here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test Personal Guarantee clause here.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability risk.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['PERSONAL GUARANTEE'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });
  });

  describe('Red-Line Matching: Non-Matching Cases', () => {
    it('should not flag a clause when red line does not match', async () => {
      const contractText = 'test assignment clause present here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'ip-assignment',
            severity: 'Push' as const,
            sourceSentence: 'test assignment clause present here.',
            counterOffer: 'Clarify ownership',
            confidenceMarker: 'clear' as const,
            reason: 'Vendor retains all IP.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal guarantee', 'unlimited liability'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      expect(result.flags).toHaveLength(1);
      expect(result.flags[0].isRedLineTrigger).toBe(false);
    });

    it('should handle empty red lines array', async () => {
      const contractText = 'test guarantee present in contract.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test guarantee present in contract.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Exposes you personally.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: [],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      expect(result.flags[0].isRedLineTrigger).toBe(false);
    });
  });

  describe('Red-Line Matching: Multiple Clauses', () => {
    it('should match red lines against multiple flags independently', async () => {
      const contractText = 'Clause 1. Clause 2. Clause 3.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'Clause 1.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'ip-assignment',
            severity: 'Push' as const,
            sourceSentence: 'Clause 2.',
            counterOffer: 'Clarify',
            confidenceMarker: 'clear' as const,
            reason: 'Vendor owns all IP.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'unlimited-liability',
            severity: 'Blocker' as const,
            sourceSentence: 'Clause 3.',
            counterOffer: 'Cap it',
            confidenceMarker: 'clear' as const,
            reason: 'Unlimited exposure.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal', 'unlimited'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // Should match on personal and unlimited, but not IP
      expect(result.flags[0].isRedLineTrigger).toBe(true); // personal-guarantee matches "personal"
      expect(result.flags[1].isRedLineTrigger).toBe(false); // ip-assignment doesn't match
      expect(result.flags[2].isRedLineTrigger).toBe(true); // unlimited-liability matches "unlimited"
    });

    it('should handle multiple red lines matching a single clause', async () => {
      const contractText = 'Personal guarantee with unlimited scope.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'Personal guarantee with unlimited scope.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Creates personal and unlimited liability.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal', 'unlimited'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // Should match because at least one red line matches
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });
  });

  describe('Red-Line Matching: Substring Matching', () => {
    it('should match red line as substring in clauseType', async () => {
      const contractText = 'test clause is present here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'unilateral-termination-without-kill-fee',
            severity: 'Push' as const,
            sourceSentence: 'test clause is present here.',
            counterOffer: 'Make it mutual',
            confidenceMarker: 'clear' as const,
            reason: 'One-sided termination.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['termination'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // "termination" is a substring of "unilateral-termination-without-kill-fee"
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });

    it('should match red line as substring in reason', async () => {
      const contractText = 'test clause is present here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'confidentiality-overreach',
            severity: 'Note' as const,
            sourceSentence: 'test clause is present here.',
            counterOffer: 'Restrict it',
            confidenceMarker: 'clear' as const,
            reason: 'Information can be shared without consent.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['without consent'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // "without consent" is substring in reason
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });
  });

  describe('Red-Line Matching: Severity Preservation', () => {
    it('should preserve Blocker severity even without red line match', async () => {
      const contractText = 'test clause is present here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test clause is present here.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['something-else'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // Blocker should stay Blocker (severity not changed by red line)
      expect(result.flags[0].severity).toBe('Blocker');
      expect(result.flags[0].isRedLineTrigger).toBe(false);
    });

    it('should combine red-line trigger with existing severity', async () => {
      const contractText = 'test and red line trigger present.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test and red line trigger present.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // Both Blocker severity AND red-line trigger should be true
      expect(result.flags[0].severity).toBe('Blocker');
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });
  });

  describe('Red-Line Matching: Fixture Integration', () => {
    it('should apply red lines to contract-with-clauses fixture', async () => {
      const contractText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").

1. PERSONAL GUARANTEE

The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client's obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof. The signatory agrees that Vendor may pursue claims against the signatory personally and may do so without first exhausting remedies against Client.

2. ENTIRE AGREEMENT

This Agreement, including any applicable SOW, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, and agreements.`;

      const fixtureData = fixtureResponses['contract-with-clauses']();
      const fixtureKey = `analyze:${contractText.substring(0, 50)}`;
      const testBoundary = new TestModelBoundary({
        [fixtureKey]: { analysis: fixtureData },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // The personal-guarantee flag should be marked as red-line trigger
      const personalGuaranteeFlag = result.flags.find(
        (f) => f.clauseType === 'personal-guarantee'
      );
      expect(personalGuaranteeFlag).toBeDefined();
      expect(personalGuaranteeFlag?.isRedLineTrigger).toBe(true);
    });

    it('should apply multiple red lines to fixture', async () => {
      const contractText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").

1. PERSONAL GUARANTEE

The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client's obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof. The signatory agrees that Vendor may pursue claims against the signatory personally and may do so without first exhausting remedies against Client.

2. INDEMNIFICATION

This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.

3. TERMINATION

Vendor may terminate this Agreement at any time upon thirty (30) days' written notice to Client, with or without cause.`;

      const fixtureData = fixtureResponses['contract-with-clauses']();
      const fixtureKey = `analyze:${contractText.substring(0, 50)}`;
      const testBoundary = new TestModelBoundary({
        [fixtureKey]: { analysis: fixtureData },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal', 'unlimited', 'termination'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // Check that appropriate flags match red lines
      const flagsWithRedLineMatch = result.flags.filter((f) => f.isRedLineTrigger);
      expect(flagsWithRedLineMatch.length).toBeGreaterThan(0);

      // personal-guarantee should match "personal"
      const personalFlag = result.flags.find((f) => f.clauseType === 'personal-guarantee');
      expect(personalFlag?.isRedLineTrigger).toBe(true);

      // uncapped-indemnification should match "unlimited"
      const indemnificationFlag = result.flags.find((f) => f.clauseType === 'uncapped-indemnification');
      expect(indemnificationFlag?.isRedLineTrigger).toBe(true);

      // unilateral-termination should match "termination"
      const terminationFlag = result.flags.find((f) => f.clauseType === 'unilateral-termination-without-kill-fee');
      expect(terminationFlag?.isRedLineTrigger).toBe(true);
    });

    it('should not create false red-line triggers on clean fixture', async () => {
      const cleanContractText = `SOFTWARE SERVICES AGREEMENT

This is a clean contract.`;

      const fixtureData = fixtureResponses['contract-clean']();
      const fixtureKey = `analyze:${cleanContractText.substring(0, 50)}`;
      const testBoundary = new TestModelBoundary({
        [fixtureKey]: { analysis: fixtureData },
      });

      const result = await analyzeContract(
        {
          documentText: cleanContractText,
          redLines: ['anything'],
          governingLawState: 'Colorado',
          operatingState: 'Michigan',
        },
        testBoundary
      );

      // Clean fixture has no flags, so nothing to match
      expect(result.flags).toHaveLength(0);
    });
  });

  describe('Red-Line Matching: Edge Cases', () => {
    it('should handle partial word matches in red line', async () => {
      const contractText = 'test ends in clause.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'unilateral-termination-without-kill-fee',
            severity: 'Push' as const,
            sourceSentence: 'test ends in clause.',
            counterOffer: 'Make mutual',
            confidenceMarker: 'clear' as const,
            reason: 'Vendor can terminate anytime.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['termination'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // "termination" is a substring of "unilateral-termination-without-kill-fee"
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });

    it('should handle special characters in red line', async () => {
      const contractText = 'test hyphenated clause here.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test hyphenated clause here.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Bad clause.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal-guarantee'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      // Should match with hyphen
      expect(result.flags[0].isRedLineTrigger).toBe(true);
    });

    it('should preserve all other flag properties when setting isRedLineTrigger', async () => {
      const contractText = 'test problematic clause present.';

      const testBoundary = createTestModelBoundary(contractText, {
        summary: 'Test parties',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'test problematic clause present.',
            counterOffer: 'Remove this specific clause',
            confidenceMarker: 'our-read' as const,
            reason: 'Exposes you to personal liability.',
            isRedLineTrigger: false,
            jurisdictionSensitive: true,
          },
        ],
        alsoSeen: [
          {
            clauseType: 'related-clause',
            description: 'Another thing to watch',
          },
        ],
        verdict: { kind: 'flags' as const },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: ['personal'],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        testBoundary
      );

      const flag = result.flags[0];
      // All other properties should be preserved
      expect(flag.clauseType).toBe('personal-guarantee');
      expect(flag.severity).toBe('Blocker');
      expect(flag.counterOffer).toBe('Remove this specific clause');
      expect(flag.confidenceMarker).toBe('our-read');
      expect(flag.reason).toBe('Exposes you to personal liability.');
      expect(flag.jurisdictionSensitive).toBe(true);
      // Only isRedLineTrigger should be updated
      expect(flag.isRedLineTrigger).toBe(true);
      // alsoSeen should be preserved
      expect(result.alsoSeen).toHaveLength(1);
    });
  });
});
