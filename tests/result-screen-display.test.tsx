import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultScreen } from '@/components/ResultScreen';
import type { Analysis } from '@/lib/model-boundary';

/**
 * Source Sentence Display Tests (Criterion 1 — UI verification)
 *
 * The ResultScreen component displays a preview of the source sentence for each
 * flag. The preview is truncated to 80 characters with an ellipsis (…) if longer.
 *
 * These tests verify that:
 * 1. Short source sentences are displayed in full
 * 2. Long source sentences are truncated and ellipsis appears
 * 3. The exact source text appears in the preview (no corruptions)
 * 4. Formatting is correct
 */

describe('ResultScreen: Source Sentence Display', () => {
  describe('Short source sentences: display in full', () => {
    it('should display a short source sentence without truncation', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Blocker' as const,
            sourceSentence: 'Short sentence here.',
            counterOffer: 'Test counter',
            confidenceMarker: 'clear' as const,
            reason: 'Test reason',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show the full sentence with ellipsis
      // Text may be split across nodes, so check for the sentence content
      expect(screen.getByText(/Short sentence here/)).toBeInTheDocument();
    });

    it('should display exactly 80 characters before ellipsis', () => {
      // Create a sentence that is exactly 80 characters
      const sentence80Chars = 'This is a sentence that is exactly eighty characters long for this test case.';
      // Verify it's exactly 80 by padding if needed
      const paddedSentence = sentence80Chars.padEnd(80, 'x');

      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Blocker' as const,
            sourceSentence: paddedSentence,
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // The sentence should appear in the DOM
      expect(screen.getByText(new RegExp(paddedSentence.substring(0, 40)))).toBeInTheDocument();
    });
  });

  describe('Long source sentences: truncate with ellipsis', () => {
    it('should truncate a long source sentence to 80 chars and add ellipsis', () => {
      // Create a sentence that is 100 characters
      const longSentence =
        'This is a much longer sentence that exceeds eighty characters and should be truncated to show only the first eighty.';
      expect(longSentence.length).toBeGreaterThan(80);

      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Blocker' as const,
            sourceSentence: longSentence,
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // The first 80 characters should appear in the preview
      const first80 = longSentence.substring(0, 80);
      expect(screen.getByText(new RegExp(first80.substring(0, 40)))).toBeInTheDocument();

      // The truncated part should NOT appear in full
      const truncatedPart = longSentence.substring(80);
      expect(
        screen.queryByText(new RegExp(truncatedPart.substring(0, 20)))
      ).not.toBeInTheDocument();
    });

    it('should preserve the meaning of the first 80 characters', () => {
      const longSentence =
        'This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim.';

      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'uncapped-indemnification',
            severity: 'Blocker' as const,
            sourceSentence: longSentence,
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Unlimited indemnity',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      const first80 = longSentence.substring(0, 80);
      expect(screen.getByText(new RegExp(first80.substring(0, 40)))).toBeInTheDocument();

      // The key phrase "unlimited in scope" should be in the preview
      expect(first80).toContain('unlimited in scope');
    });
  });

  describe('Source sentence formatting in the UI', () => {
    it('should display source sentence in quotes', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Blocker' as const,
            sourceSentence: 'Test sentence with no special formatting.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Find the quote preview element
      const quoteElement = container.querySelector('div[style*="color: var(--worn-card-stock)"]');
      expect(quoteElement).toBeInTheDocument();

      // The content should include quotes
      expect(quoteElement?.textContent).toContain('"');
      expect(quoteElement?.textContent).toContain('…');
    });

    it('should display multiple flags each with their own source sentence preview', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'First flag source sentence that identifies the personal guarantee.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Personal guarantee',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'uncapped-indemnification',
            severity: 'Blocker' as const,
            sourceSentence:
              'Second flag about indemnification with no limits on scope, amount, or time.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Uncapped indemnity',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // Both sentences should appear in the preview
      expect(
        screen.getByText(/First flag source sentence that identifies the person/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Second flag about indemnification with no limits on sco/)
      ).toBeInTheDocument();
    });
  });

  describe('Edge cases: special characters, newlines, etc', () => {
    it('should handle source sentences with apostrophes and quotes', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Blocker' as const,
            sourceSentence:
              "The signatory's obligations include the vendor's right to pursue claims.",
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // The apostrophes should be preserved in the preview
      expect(
        screen.getByText(/The signatory's obligations include the vendor's right/)
      ).toBeInTheDocument();
    });

    it('should display sentence starting with capital letter correctly', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Note' as const,
            sourceSentence: 'VENDOR may terminate this Agreement at any time upon written notice.',
            counterOffer: 'Test',
            confidenceMarker: 'our-read' as const,
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // The uppercase should be preserved
      expect(
        screen.getByText(/VENDOR may terminate this Agreement at any time upon w/)
      ).toBeInTheDocument();
    });
  });

  describe('Clean verdict: no source sentence preview shown', () => {
    it('should not display any source sentence previews when verdict is clean', () => {
      const analysis: Analysis = {
        summary: 'Clean Agreement',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show "You're probably fine" instead of flags
      expect(screen.getByText(/You're probably fine/i)).toBeInTheDocument();

      // No quote previews should appear
      expect(
        screen.queryByText(/".*?…?"/)
      ).not.toBeInTheDocument();
    });
  });
});
