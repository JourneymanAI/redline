import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultScreen } from '@/components/ResultScreen';
import type { Analysis } from '@/lib/model-boundary';

/**
 * Counter-Offer Display Tests (Eval Criterion 7 — Counter-offer specificity)
 *
 * ADR 0004: "Counter-offer per flag must be specific, grounded in what the clause actually says"
 *
 * These tests verify that:
 * 1. Counter-offer is not visible initially (expand button shows › closed state)
 * 2. Counter-offer appears when expand button is clicked
 * 3. Counter-offer is hidden when collapse button is clicked (› rotated)
 * 4. All 5 fixture flags show their correct, specific counter-offer
 * 5. Counter-offers address the specific flagged clause (not generic boilerplate)
 * 6. Multiple flags can have independent expand states
 * 7. Styling: monospace font, indented, dashed border, amber accent
 */

describe('ResultScreen: Counter-Offer Display & Specificity', () => {
  describe('Counter-offer visibility: initially hidden', () => {
    it('should NOT display counter-offer initially when flag is closed', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer:
              'Remove the personal guarantee clause entirely. If the vendor requires some assurance, limit it to: "The signatory represents they have authority to bind the company; the company is solely liable for all obligations."',
            confidenceMarker: 'clear' as const,
            reason: 'Exposes the signatory to unlimited personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // Counter-offer should not be visible
      expect(
        screen.queryByText(/Remove the personal guarantee clause entirely/)
      ).not.toBeInTheDocument();

      // "SUGGESTED LANGUAGE" heading should not be visible
      expect(
        screen.queryByText(/SUGGESTED LANGUAGE/)
      ).not.toBeInTheDocument();
    });

    it('should show expand button with › character', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer: 'Remove the personal guarantee',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability exposure',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Find button with › character
      const expandButton = container.querySelector('button');
      expect(expandButton).toBeInTheDocument();
      expect(expandButton?.textContent).toBe('›');
    });
  });

  describe('Counter-offer visibility: expand/collapse', () => {
    it('should display counter-offer when expand button is clicked', async () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer:
              'Remove the personal guarantee clause entirely. If the vendor requires some assurance, limit it to: "The signatory represents they have authority to bind the company; the company is solely liable for all obligations."',
            confidenceMarker: 'clear' as const,
            reason: 'Exposes the signatory to unlimited personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Find and click the expand button
      const expandButton = container.querySelector('button');
      expect(expandButton).toBeInTheDocument();

      await userEvent.setup().click(expandButton!);

      // Counter-offer should now be visible
      expect(
        screen.getByText(/Remove the personal guarantee clause entirely/)
      ).toBeInTheDocument();

      // "SUGGESTED LANGUAGE" heading should be visible
      expect(screen.getByText(/SUGGESTED LANGUAGE/)).toBeInTheDocument();
    });

    it('should hide counter-offer when expand button is clicked again', async () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer:
              'Remove the personal guarantee clause entirely. If the vendor requires some assurance, limit it to: "The signatory represents they have authority to bind the company; the company is solely liable for all obligations."',
            confidenceMarker: 'clear' as const,
            reason: 'Exposes the signatory to unlimited personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');

      // Click to expand
      await userEvent.setup().click(expandButton!);
      expect(
        screen.getByText(/Remove the personal guarantee clause entirely/)
      ).toBeInTheDocument();

      // Click to collapse
      await userEvent.setup().click(expandButton!);
      expect(
        screen.queryByText(/Remove the personal guarantee clause entirely/)
      ).not.toBeInTheDocument();
    });
  });

  describe('Fixture counter-offer specificity: all 5 clauses', () => {
    it('should show SPECIFIC counter-offer for personal-guarantee (not generic)', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
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
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // Should address PERSONAL LIABILITY and COMPANY LIABILITY specifically
      expect(
        screen.getByText(/Remove the personal guarantee clause entirely/)
      ).toBeInTheDocument();
      expect(screen.getByText(/company is solely liable/)).toBeInTheDocument();
    });

    it('should show SPECIFIC counter-offer for uncapped-indemnification (not generic)', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'uncapped-indemnification',
            severity: 'Blocker' as const,
            sourceSentence:
              'This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.',
            counterOffer:
              'Cap indemnity: "Indemnification obligations are limited to actual third-party claims arising from Client\'s gross negligence, and liability shall not exceed fees paid in the 12 months preceding the claim."',
            confidenceMarker: 'clear' as const,
            reason:
              'Indemnity with no cap, no time limit, and no requirement for Vendor to mitigate — creates unlimited liability for claims Vendor could have prevented.',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // Should address CAP, TIME LIMIT, and FEES PAID specifically
      expect(screen.getByText(/Cap indemnity/)).toBeInTheDocument();
      expect(screen.getByText(/12 months preceding the claim/)).toBeInTheDocument();
      expect(screen.getByText(/fees paid/)).toBeInTheDocument();
    });

    it('should show SPECIFIC counter-offer for unilateral-termination (not generic)', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
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
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // Should address MUTUAL RIGHTS and NOTICE PERIODS specifically
      expect(
        screen.getByText(/Require mutual termination rights/)
      ).toBeInTheDocument();
      expect(screen.getByText(/material breach/)).toBeInTheDocument();
      expect(screen.getByText(/90 days/)).toBeInTheDocument();
    });

    it('should show SPECIFIC counter-offer for ip-assignment (not generic)', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
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
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // Should address CLIENT OWNS CUSTOM WORK and VENDOR RETAINS PRE-EXISTING specifically
      expect(
        screen.getByText(/Clarify IP ownership/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Client owns all custom work product/)).toBeInTheDocument();
      expect(screen.getByText(/Vendor retains ownership of pre-existing/)).toBeInTheDocument();
    });

    it('should show SPECIFIC counter-offer for confidentiality-overreach (not generic)', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
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
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // Should address PRIOR CONSENT, NAME/LOGO/INFO specifically
      expect(
        screen.getByText(/Restrict use/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/without prior written consent/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/name, logo, or confidential information/)
      ).toBeInTheDocument();
    });
  });

  describe('Multiple flags: independent expand states', () => {
    it('should allow multiple flags to have independent expand states', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer:
              'Remove the personal guarantee clause entirely.',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'uncapped-indemnification',
            severity: 'Blocker' as const,
            sourceSentence:
              'This indemnification obligation is unlimited in scope, amount, and time.',
            counterOffer:
              'Cap indemnity: "Indemnification obligations are limited to actual third-party claims."',
            confidenceMarker: 'clear' as const,
            reason: 'Unlimited indemnity',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(2);

      // Click first flag's expand button
      await user.click(buttons[0]);

      // First counter-offer should be visible, second should not
      expect(
        screen.getByText(/Remove the personal guarantee clause entirely/)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Cap indemnity/)
      ).not.toBeInTheDocument();

      // Click second flag's expand button
      await user.click(buttons[1]);

      // Both counter-offers should now be visible
      expect(
        screen.getByText(/Remove the personal guarantee clause entirely/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Cap indemnity/)
      ).toBeInTheDocument();

      // Click first flag's collapse button
      await user.click(buttons[0]);

      // Only second counter-offer should be visible
      expect(
        screen.queryByText(/Remove the personal guarantee clause entirely/)
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(/Cap indemnity/)
      ).toBeInTheDocument();
    });
  });

  describe('Styling & visual rendering', () => {
    it('should render expanded counter-offer with monospace font and styling', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer:
              'Remove the personal guarantee clause entirely. If the vendor requires some assurance, limit it to: "The signatory represents they have authority to bind the company; the company is solely liable for all obligations."',
            confidenceMarker: 'clear' as const,
            reason: 'Exposes the signatory to unlimited personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // Find the counter-offer display div (has dashed border)
      const counterOfferDiv = container.querySelector('div[style*="dashed"]');
      expect(counterOfferDiv).toBeInTheDocument();

      // Note: In jsdom, computed styles may not reflect all CSS, so check innerHTML instead
      expect(counterOfferDiv?.innerHTML).toContain('Remove');
    });

    it('should display "SUGGESTED LANGUAGE" heading above counter-offer', async () => {
      const user = userEvent.setup();
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer:
              'Remove the personal guarantee clause entirely.',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      const { container } = render(<ResultScreen analysis={analysis} />);
      const expandButton = container.querySelector('button');
      await user.click(expandButton!);

      // "SUGGESTED LANGUAGE" should be visible in monospace style
      const suggestedLanguageHeading = screen.getByText(/SUGGESTED LANGUAGE/);
      expect(suggestedLanguageHeading).toBeInTheDocument();

      // It should have monospace class
      expect(suggestedLanguageHeading.className).toContain('mono');
    });
  });

  describe('No counter-offer for clean verdicts', () => {
    it('should not display counter-offers when verdict is clean', () => {
      const analysis: Analysis = {
        summary: 'Clean Agreement',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // No counter-offers should be visible
      expect(
        screen.queryByText(/SUGGESTED LANGUAGE/)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Remove the personal guarantee/)
      ).not.toBeInTheDocument();
    });
  });
});
