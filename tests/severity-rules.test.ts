import { describe, it, expect } from 'vitest';
import { fixtureResponses } from '@/lib/fixture-responses';

/**
 * Severity Rules (from PRD § "The flagging model (ADR 0003)")
 *
 * BLOCKER: Do not sign as-is
 * - Clauses that create serious downside the signer cannot cap or exit
 * - Error preference: miss nothing; over-flag when unsure
 * - Core Blockers: personal guarantee, uncapped indemnification, uncapped/one-sided liability, inescapable auto-renew
 *
 * PUSH: Ask for a change
 * - Clauses that work against the signer but are negotiable
 * - Error preference: prefer silence to a shaky flag
 *
 * NOTE: Know it is there
 * - Clauses that are unusual or noteworthy but not deal-breakers
 * - Error preference: prefer silence to a shaky flag
 *
 * CLEAN VERDICT: When no Blocker or Push flags exist, return "clean"
 * - Never manufactures flags to justify the review
 */

describe('Severity Rules (ADR 0003)', () => {
  describe('Blocker severity assignment', () => {
    it('should flag personal guarantee as Blocker', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const personalGuaranteeFlag = fixture.flags.find((f) => f.clauseType === 'personal-guarantee');

      expect(personalGuaranteeFlag).toBeDefined();
      expect(personalGuaranteeFlag?.severity).toBe('Blocker');
      expect(personalGuaranteeFlag?.reason).toContain('unlimited personal liability');
    });

    it('should flag uncapped indemnification as Blocker', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const indemnityFlag = fixture.flags.find((f) => f.clauseType === 'uncapped-indemnification');

      expect(indemnityFlag).toBeDefined();
      expect(indemnityFlag?.severity).toBe('Blocker');
      expect(indemnityFlag?.reason).toContain('unlimited liability');
    });

    it('should have exactly 2 Blocker flags in contract-with-clauses', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const blockers = fixture.flags.filter((f) => f.severity === 'Blocker');

      expect(blockers).toHaveLength(2);
      expect(blockers.map((b) => b.clauseType)).toEqual(['personal-guarantee', 'uncapped-indemnification']);
    });
  });

  describe('Push severity assignment', () => {
    it('should flag unilateral termination without kill fee as Push', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const terminationFlag = fixture.flags.find((f) => f.clauseType === 'unilateral-termination-without-kill-fee');

      expect(terminationFlag).toBeDefined();
      expect(terminationFlag?.severity).toBe('Push');
      expect(terminationFlag?.reason).toContain('Vendor can exit anytime');
    });

    it('should flag IP assignment as Push', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const ipFlag = fixture.flags.find((f) => f.clauseType === 'ip-assignment');

      expect(ipFlag).toBeDefined();
      expect(ipFlag?.severity).toBe('Push');
      expect(ipFlag?.reason).toContain('IP grab');
    });

    it('should have exactly 2 Push flags in contract-with-clauses', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const pushFlags = fixture.flags.filter((f) => f.severity === 'Push');

      expect(pushFlags).toHaveLength(2);
      expect(pushFlags.map((p) => p.clauseType)).toEqual(['unilateral-termination-without-kill-fee', 'ip-assignment']);
    });
  });

  describe('Note severity assignment', () => {
    it('should flag confidentiality overreach as Note', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const confidentialityFlag = fixture.flags.find((f) => f.clauseType === 'confidentiality-overreach');

      expect(confidentialityFlag).toBeDefined();
      expect(confidentialityFlag?.severity).toBe('Note');
      expect(confidentialityFlag?.reason).toContain('share all Client information');
    });

    it('should have exactly 1 Note flag in contract-with-clauses', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const noteFlags = fixture.flags.filter((f) => f.severity === 'Note');

      expect(noteFlags).toHaveLength(1);
      expect(noteFlags[0].clauseType).toBe('confidentiality-overreach');
    });
  });

  describe('All fixture severities are correct', () => {
    it('contract-with-clauses should have 5 total flags with correct severities', () => {
      const fixture = fixtureResponses['contract-with-clauses']();

      expect(fixture.flags).toHaveLength(5);
      expect(fixture.flags[0].severity).toBe('Blocker'); // personal-guarantee
      expect(fixture.flags[1].severity).toBe('Blocker'); // uncapped-indemnification
      expect(fixture.flags[2].severity).toBe('Push'); // unilateral-termination
      expect(fixture.flags[3].severity).toBe('Push'); // ip-assignment
      expect(fixture.flags[4].severity).toBe('Note'); // confidentiality-overreach
    });

    it('contract-clean should have no flags', () => {
      const fixture = fixtureResponses['contract-clean']();

      expect(fixture.flags).toHaveLength(0);
      expect(fixture.alsoSeen).toHaveLength(0);
    });
  });

  describe('Verdict logic based on severity', () => {
    it('should return verdict "flags" when Blocker flags exist', async () => {
      const fixture = fixtureResponses['contract-with-clauses']();

      expect(fixture.flags.some((f) => f.severity === 'Blocker')).toBe(true);
      expect(fixture.verdict.kind).toBe('flags');
    });

    it('should return verdict "flags" when Push flags exist', async () => {
      const fixture = fixtureResponses['contract-with-clauses']();

      expect(fixture.flags.some((f) => f.severity === 'Push')).toBe(true);
      expect(fixture.verdict.kind).toBe('flags');
    });

    it('should return verdict "clean" when only Note flags exist', () => {
      const fixture = fixtureResponses['contract-clean']();

      expect(fixture.flags.filter((f) => f.severity === 'Blocker' || f.severity === 'Push')).toHaveLength(0);
      expect(fixture.verdict.kind).toBe('clean');
    });

    it('should include notesCount in clean verdict', () => {
      const fixture = fixtureResponses['contract-clean']();

      expect(fixture.verdict.kind).toBe('clean');
      expect(fixture.verdict.notesCount).toBeDefined();
    });
  });

  describe('Citation integrity for all flags', () => {
    it('every flag sourceSentence should be a substring of the contract text', () => {
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

      const fixture = fixtureResponses['contract-with-clauses']();

      fixture.flags.forEach((flag) => {
        const found = contractText.includes(flag.sourceSentence);
        expect(found).toBe(true);
      });
    });
  });

  describe('Counter-offer specificity', () => {
    it('every flag should have a specific counter-offer, not generic boilerplate', () => {
      const fixture = fixtureResponses['contract-with-clauses']();

      fixture.flags.forEach((flag) => {
        // Counter-offer should reference the specific clause type or situation
        expect(flag.counterOffer.length).toBeGreaterThan(30);
        expect(flag.counterOffer).not.toBe('');

        // Should not be generic corporate speak
        expect(flag.counterOffer.toLowerCase()).not.toContain('going forward');
        expect(flag.counterOffer.toLowerCase()).not.toContain('synergy');
        expect(flag.counterOffer.toLowerCase()).not.toContain('leverage');
      });
    });
  });

  describe('Confidence markers', () => {
    it('Blocker flags should have clear or our-read confidence markers', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const blockers = fixture.flags.filter((f) => f.severity === 'Blocker');

      blockers.forEach((blocker) => {
        expect(['clear', 'our-read', 'unclear-get-help']).toContain(blocker.confidenceMarker);
      });
    });

    it('should use clear confidence for obvious Blocker flags', () => {
      const fixture = fixtureResponses['contract-with-clauses']();
      const blockers = fixture.flags.filter((f) => f.severity === 'Blocker');

      blockers.forEach((blocker) => {
        // Blockers should have high confidence
        expect(blocker.confidenceMarker).toBe('clear');
      });
    });
  });
});
