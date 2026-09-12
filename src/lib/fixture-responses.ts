import type { Analysis } from './model-boundary';

export const fixtureResponses = {
  'contract-with-clauses': (): Analysis => ({
    summary:
      "This Master Service Agreement between TechVendor Inc. and SampleCorp LLC establishes software development services for one year. SampleCorp is on the hook to pay invoices within 30 days and comply with the vendor's intellectual property assignment.",
    flags: [
      {
        clauseType: 'personal-guarantee',
        severity: 'Blocker' as const,
        sourceSentence:
          'The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client\'s obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof.',
        counterOffer:
          'Remove the personal guarantee clause entirely. If the vendor requires some assurance, limit it to: "The signatory represents they have authority to bind the company; the company is solely liable for all obligations."',
        confidenceMarker: 'clear' as const,
        reason: 'Exposes the signatory to unlimited personal liability for all obligations, including for events beyond their control.',
        isRedLineTrigger: false,
        jurisdictionSensitive: false,
      },
      {
        clauseType: 'uncapped-indemnification',
        severity: 'Blocker' as const,
        sourceSentence:
          'This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.',
        counterOffer:
          'Cap indemnity: "Indemnification obligations are limited to actual third-party claims arising from Client\'s gross negligence, and liability shall not exceed fees paid in the 12 months preceding the claim."',
        confidenceMarker: 'clear' as const,
        reason: 'Indemnity with no cap, no time limit, and no requirement for Vendor to mitigate — creates unlimited liability for claims Vendor could have prevented.',
        isRedLineTrigger: false,
        jurisdictionSensitive: false,
      },
      {
        clauseType: 'unilateral-termination-without-kill-fee',
        severity: 'Push' as const,
        sourceSentence:
          'Vendor may terminate this Agreement at any time upon thirty (30) days\' written notice to Client, with or without cause.',
        counterOffer:
          'Require mutual termination rights: "Either party may terminate this Agreement only for material breach if not cured within 30 days\' written notice. For convenience, either party may terminate with 90 days\' notice."',
        confidenceMarker: 'clear' as const,
        reason:
          'Vendor can exit anytime without cause, leaving Client with unfinished work and no recourse for disrupted projects.',
        isRedLineTrigger: false,
        jurisdictionSensitive: false,
      },
      {
        clauseType: 'ip-assignment',
        severity: 'Push' as const,
        sourceSentence:
          'All work product, code, documentation, and any intellectual property created by Vendor in connection with the Services, whether before, during, or after this Agreement, shall be the sole and exclusive property of Vendor.',
        counterOffer:
          'Clarify IP ownership: "Client owns all custom work product created specifically for Client under this Agreement. Vendor retains ownership of pre-existing tools, methodologies, and knowledge used in performing the Services."',
        confidenceMarker: 'clear' as const,
        reason:
          'Vendor retains ownership of work created for Client, plus anything created "before or after" the agreement—a near-total IP grab.',
        isRedLineTrigger: false,
        jurisdictionSensitive: false,
      },
      {
        clauseType: 'confidentiality-overreach',
        severity: 'Note' as const,
        sourceSentence:
          'Vendor may use Client\'s name, logo, and description of Client\'s use of the Services for any purpose without prior written consent, and may disclose all information related to Client to any third party, including competitors, for any reason.',
        counterOffer:
          'Restrict use: "Neither party may use the other\'s name, logo, or confidential information without prior written consent, except to the extent required by law or as necessary to perform this Agreement."',
        confidenceMarker: 'our-read' as const,
        reason:
          'Vendor can share all Client information (including with competitors) and use Client\'s brand without permission.',
        isRedLineTrigger: false,
        jurisdictionSensitive: false,
      },
    ],
    alsoSeen: [
      {
        clauseType: 'liability-cap',
        description: 'Liability is capped at $1.00, effectively zero.',
      },
    ],
    verdict: { kind: 'flags' as const },
  }),

  'contract-clean': (): Analysis => ({
    summary:
      'This Software Services Agreement between Reliable Software Partners, Inc. and Midwest Manufacturing Corp. establishes professional development and consulting services for one year. Midwest Manufacturing is on the hook to pay invoices within 30 days.',
    flags: [],
    alsoSeen: [],
    verdict: { kind: 'clean' as const, notesCount: 1 },
  }),
};

export type FixtureName = keyof typeof fixtureResponses;

export function getFixtureResponse(documentText: string): Analysis {
  const head = documentText.substring(0, 300).toUpperCase();
  const full = documentText.toUpperCase();

  // Match by contract type
  if (head.includes('MASTER SERVICE AGREEMENT') && (head.includes('TECHVENDOR') || full.includes('SAMPLECHECKCORP'))) {
    return fixtureResponses['contract-with-clauses']();
  }
  if (
    head.includes('SOFTWARE SERVICES AGREEMENT') &&
    (full.includes('RELIABLE SOFTWARE') || full.includes('MIDWEST MANUFACTURING'))
  ) {
    return fixtureResponses['contract-clean']();
  }

  // Fallback: detect by company names
  if (full.includes('TECHVENDOR') && full.includes('SAMPLECHECKCORP')) {
    return fixtureResponses['contract-with-clauses']();
  }
  if (full.includes('RELIABLE SOFTWARE PARTNERS') && full.includes('MIDWEST')) {
    return fixtureResponses['contract-clean']();
  }

  throw new Error(
    `No fixture found. Use contract starting with "MASTER SERVICE AGREEMENT" (TechVendor/SampleCorp) or "SOFTWARE SERVICES AGREEMENT" (Reliable/Midwest).`
  );
}
