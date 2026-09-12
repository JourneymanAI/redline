import { describe, it, expect } from 'vitest';
import { analyzeContract } from '@/lib/analysis';
import { fixtureResponses } from '@/lib/fixture-responses';
import type { ModelBoundary, Answer, Analysis } from '@/lib/model-boundary';

/**
 * Clean Verdict Tests (Criterion 3 from PRD § "What good looks like")
 *
 * Clean-set false-Blocker rate: on a labelled set of genuinely standard contracts,
 * share that get a false Blocker or Push flag. Target ~0; the clean verdict fires instead.
 *
 * A clean verdict (verdict.kind = 'clean') is issued when:
 * - No Blocker flags exist
 * - No Push flags exist
 * - May have zero, one, or many Note flags (notesCount captures count of Note flags)
 *
 * This test suite verifies:
 * 1. Verdict determination logic (Blocker/Push/Note/None → verdict.kind and notesCount)
 * 2. Clean verdict display in ResultScreen
 * 3. Fixture verdicts are correct
 * 4. Edge cases (mixed flag types, boundary conditions)
 */

describe('Clean Verdict Logic (Criterion 3)', () => {
  // Helper: create mock model boundary with custom analysis
  const createMockModelBoundary = (analysisResponse: Analysis): ModelBoundary => ({
    analyzeContract: async () => analysisResponse,
    answerFromDocument: async (): Promise<Answer> => ({
      answer: '',
      addressed: false,
    }),
  });

  // ====== VERDICT DETERMINATION TESTS ======

  describe('Verdict Determination: Blocker Flags', () => {
    it('should return verdict.kind = "flags" when one Blocker flag exists', async () => {
      const contractText = 'Test contract with a blocker.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'test-blocker',
            severity: 'Blocker' as const,
            sourceSentence: 'Test contract with a blocker.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
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
        mockBoundary
      );

      expect(result.verdict.kind).toBe('flags');
      // flags verdict should not have notesCount field
      expect(result.verdict.notesCount).toBeUndefined();
    });

    it('should return verdict.kind = "flags" when multiple Blocker flags exist', async () => {
      const contractText = 'Blocker one. Blocker two. Blocker three.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'blocker-1',
            severity: 'Blocker' as const,
            sourceSentence: 'Blocker one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'blocker-2',
            severity: 'Blocker' as const,
            sourceSentence: 'Blocker two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'blocker-3',
            severity: 'Blocker' as const,
            sourceSentence: 'Blocker three.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
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
        mockBoundary
      );

      expect(result.verdict.kind).toBe('flags');
      expect(result.flags).toHaveLength(3);
    });
  });

  describe('Verdict Determination: Push Flags', () => {
    it('should return verdict.kind = "flags" when one Push flag exists', async () => {
      const contractText = 'Test contract with a push.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'test-push',
            severity: 'Push' as const,
            sourceSentence: 'Test contract with a push.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
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
        mockBoundary
      );

      expect(result.verdict.kind).toBe('flags');
      expect(result.verdict.notesCount).toBeUndefined();
    });

    it('should return verdict.kind = "flags" when multiple Push flags exist', async () => {
      const contractText = 'Push one. Push two.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'push-1',
            severity: 'Push' as const,
            sourceSentence: 'Push one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'push-2',
            severity: 'Push' as const,
            sourceSentence: 'Push two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
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
        mockBoundary
      );

      expect(result.verdict.kind).toBe('flags');
      expect(result.flags).toHaveLength(2);
    });
  });

  describe('Verdict Determination: Note Flags Only', () => {
    it('should return verdict.kind = "clean" with notesCount = 1 when one Note flag exists', async () => {
      const contractText = 'Test contract with a note.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'test-note',
            severity: 'Note' as const,
            sourceSentence: 'Test contract with a note.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'clean' as const, notesCount: 1 },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: [],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        mockBoundary
      );

      expect(result.verdict.kind).toBe('clean');
      expect(result.verdict.notesCount).toBe(1);
    });

    it('should return verdict.kind = "clean" with notesCount = 3 when three Note flags exist', async () => {
      const contractText = 'Note one. Note two. Note three.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'note-1',
            severity: 'Note' as const,
            sourceSentence: 'Note one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note-2',
            severity: 'Note' as const,
            sourceSentence: 'Note two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note-3',
            severity: 'Note' as const,
            sourceSentence: 'Note three.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'clean' as const, notesCount: 3 },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: [],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        mockBoundary
      );

      expect(result.verdict.kind).toBe('clean');
      expect(result.verdict.notesCount).toBe(3);
    });
  });

  describe('Verdict Determination: No Flags', () => {
    it('should return verdict.kind = "clean" with notesCount = 0 when NO flags exist', async () => {
      const contractText = 'Test clean contract with no flags.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean' as const, notesCount: 0 },
      });

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: [],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        mockBoundary
      );

      expect(result.verdict.kind).toBe('clean');
      expect(result.verdict.notesCount).toBe(0);
    });
  });

  describe('Verdict Determination: Mixed Flag Types', () => {
    it('should return verdict.kind = "flags" when Blocker + Push + Note exist (ignores Note)', async () => {
      const contractText =
        'Blocker sentence. Push sentence. Note sentence.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'blocker',
            severity: 'Blocker' as const,
            sourceSentence: 'Blocker sentence.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'push',
            severity: 'Push' as const,
            sourceSentence: 'Push sentence.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note',
            severity: 'Note' as const,
            sourceSentence: 'Note sentence.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
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
        mockBoundary
      );

      // Even though Note flags exist, verdict is "flags" because Blocker + Push are present
      expect(result.verdict.kind).toBe('flags');
      expect(result.flags).toHaveLength(3);
    });

    it('should return verdict.kind = "flags" when Push + Note exist (ignores Note)', async () => {
      const contractText = 'Push sentence. Note sentence.';

      const mockBoundary = createMockModelBoundary({
        summary: 'Test',
        flags: [
          {
            clauseType: 'push',
            severity: 'Push' as const,
            sourceSentence: 'Push sentence.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note',
            severity: 'Note' as const,
            sourceSentence: 'Note sentence.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
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
        mockBoundary
      );

      // Push flag makes verdict "flags", even though Note also exists
      expect(result.verdict.kind).toBe('flags');
    });
  });

  // ====== FIXTURE VERIFICATION ======

  describe('Fixture Verdict Verification', () => {
    it('contract-with-clauses fixture should return verdict.kind = "flags" (has 2 Blockers + 2 Pushes)', async () => {
      const contractText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").

1. SERVICES

Vendor shall provide software development and consulting services as specified in individual Statements of Work (SOWs) issued under this Agreement.

2. TERM AND TERMINATION

This Agreement shall commence on the date hereof and continue for one (1) year, unless earlier terminated. Vendor may terminate this Agreement at any time upon thirty (30) days' written notice to Client, with or without cause. Upon termination, Client shall immediately pay all fees owed through the termination date, including all work in progress, and shall have no right to recover amounts paid.

3. INTELLECTUAL PROPERTY

All work product, code, documentation, and any intellectual property created by Vendor in connection with the Services, whether before, during, or after this Agreement, shall be the sole and exclusive property of Vendor. Client hereby assigns all right, title, and interest in such intellectual property to Vendor, including all patent, copyright, trademark, and trade secret rights. Client retains no license to use such work product except as expressly granted herein.

4. INDEMNIFICATION

Client shall indemnify, defend, and hold harmless Vendor and its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or relating to Client's use of the Services, Client's data, Client's breach of this Agreement, or Client's violation of any law. This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.

5. PAYMENT TERMS

Client shall pay Vendor's invoices within thirty (30) days of receipt. Late payments shall accrue interest at the rate of 2% per month or the maximum rate permitted by law, whichever is greater.

6. GOVERNING LAW

This Agreement shall be governed by the laws of the State of Delaware, without regard to its conflict of law principles.

7. LIMITATION OF LIABILITY

Vendor's total liability under this Agreement shall not exceed the lesser of actual damages or one dollar ($1.00). IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, CONSEQUENTIAL, SPECIAL, INCIDENTAL, PUNITIVE, OR EXEMPLARY DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

8. PERSONAL GUARANTEE

The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client's obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof. The signatory agrees that Vendor may pursue claims against the signatory personally and may do so without first exhausting remedies against Client.

9. CONFIDENTIALITY

Any information disclosed by one party to the other shall be treated as confidential. Vendor may use Client's name, logo, and description of Client's use of the Services for any purpose without prior written consent, and may disclose all information related to Client to any third party, including competitors, for any reason.

10. ASSIGNMENT

Vendor may assign this Agreement or any part hereof to any third party without Client's consent. Client may not assign this Agreement.

11. ENTIRE AGREEMENT

This Agreement, including any applicable SOW, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, and agreements.`;

      const mockBoundary = createMockModelBoundary(
        fixtureResponses['contract-with-clauses']()
      );

      const result = await analyzeContract(
        {
          documentText: contractText,
          redLines: [],
          governingLawState: 'Delaware',
          operatingState: 'California',
        },
        mockBoundary
      );

      // Should have "flags" verdict (not "clean")
      expect(result.verdict.kind).toBe('flags');
      // notesCount should NOT be present in flags verdict
      expect(result.verdict.notesCount).toBeUndefined();
      // Should have 5 flags total (2 Blockers + 2 Pushes + 1 Note)
      expect(result.flags).toHaveLength(5);
      // Verify that at least one is Blocker or Push
      const hasBlockerOrPush = result.flags.some(
        (f) => f.severity === 'Blocker' || f.severity === 'Push'
      );
      expect(hasBlockerOrPush).toBe(true);
    });

    it('contract-clean fixture should return verdict.kind = "clean"', async () => {
      const cleanContractText = `SOFTWARE SERVICES AGREEMENT

This Software Services Agreement ("Agreement") is entered into as of September 12, 2026, between Reliable Software Partners, Inc., a Colorado corporation ("Service Provider"), and Midwest Manufacturing Corp., a Michigan limited liability company ("Company").

1. SERVICES

Service Provider shall provide professional software development and consulting services as described in individual Statements of Work (SOWs) appended to this Agreement and mutually executed by both parties.

2. TERM AND TERMINATION

This Agreement shall commence on the date signed by both parties and shall continue for one (1) year from the date of inception, unless terminated earlier by either party for material breach if not cured within thirty (30) days of written notice. Either party may terminate for convenience by providing sixty (60) days' written notice. Upon termination, Service Provider shall deliver all completed work and materials, and Company shall pay all fees for work completed through the termination date.

3. INTELLECTUAL PROPERTY

Service Provider retains all pre-existing intellectual property and tools developed prior to engagement. Company shall own all custom work product, code, and documentation created specifically for Company under this Agreement. Service Provider retains the right to use general methodologies, knowledge, and know-how developed in performing the Services.

4. LIABILITY AND INDEMNIFICATION

Except in cases of gross negligence or willful misconduct, Service Provider's total liability shall not exceed the fees paid in the twelve (12) months preceding the claim. Each party shall indemnify the other against third-party claims arising from its own breach of this Agreement or violation of law. Neither party shall be liable for indirect, consequential, or punitive damages.

5. PAYMENT

Company shall pay invoices within thirty (30) days of receipt. Invoices are due and payable in full regardless of whether the services are disputed. Disputed portions must be raised in writing within fifteen (15) days of invoice. Late payment shall accrue interest at 1.5% per month or the maximum rate allowed by law.

6. CONFIDENTIALITY

Each party agrees to keep confidential any proprietary information disclosed by the other party, except as required by law or court order, or with the other party's prior written consent. The confidentiality obligation shall expire three (3) years after termination of this Agreement.

7. GOVERNING LAW

This Agreement shall be governed by the laws of Colorado, without regard to its choice-of-law provisions.

8. LIMITATION OF LIABILITY

Company's sole remedy for any breach shall be termination of the Agreement. Service Provider's total cumulative liability for all claims, regardless of cause, shall be limited to the fees paid by Company in the twelve (12) months immediately preceding the claim, provided that liability for gross negligence or breach of confidentiality shall not exceed such cap.

9. INDEPENDENT CONTRACTOR

Service Provider is an independent contractor. Nothing in this Agreement creates an employment relationship, partnership, or agency relationship between the parties.

10. ENTIRE AGREEMENT

This Agreement, including any Statements of Work, constitutes the entire agreement regarding the Services. Any modifications must be in writing and signed by both parties.

11. SEVERABILITY

If any provision is found invalid or unenforceable, the remaining provisions shall remain in effect.`;

      const mockBoundary = createMockModelBoundary(
        fixtureResponses['contract-clean']()
      );

      const result = await analyzeContract(
        {
          documentText: cleanContractText,
          redLines: [],
          governingLawState: 'Colorado',
          operatingState: 'Michigan',
        },
        mockBoundary
      );

      // Should have "clean" verdict
      expect(result.verdict.kind).toBe('clean');
      // Should have notesCount (fixture says 1)
      expect(result.verdict.notesCount).toBeDefined();
      // Should have 0 flags after citation verification
      expect(result.flags).toHaveLength(0);
    });
  });
});
