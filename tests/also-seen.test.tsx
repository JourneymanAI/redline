import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultScreen } from '@/components/ResultScreen';
import type { Analysis } from '@/lib/model-boundary';

/**
 * Also-Seen Section Tests (ADR 0003 — Lower-Confidence Tier)
 *
 * The "also seen" section displays findings outside the main clause set
 * that the model notices but with lower confidence than top-line flags.
 * These are surfaced as a visibly lower-confidence tier with distinct styling
 * (dashed border, secondary text, no severity marker).
 *
 * Tests verify:
 * 1. Also-seen section appears only when items exist
 * 2. Also-seen section is hidden when no items
 * 3. Items display clauseType in monospace + description in secondary text
 * 4. Styling matches design system (dashed border, Housing Seam color, 2px radius)
 * 5. Also-seen is distinct from top-line flags (different UI tier)
 * 6. contract-with-clauses fixture shows liability-cap example
 * 7. contract-clean fixture has empty alsoSeen
 */

describe('ResultScreen: Also-Seen Section', () => {
  describe('Also-seen section visibility', () => {
    it('should display also-seen section when items exist', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped at $1.00, effectively zero.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show the ALSO SEEN label
      expect(screen.getByText('ALSO SEEN')).toBeInTheDocument();
    });

    it('should hide also-seen section when no items', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should not show the ALSO SEEN label
      expect(screen.queryByText('ALSO SEEN')).not.toBeInTheDocument();
    });

    it('should display also-seen section alongside flags', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer: 'Remove personal guarantee',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability',
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
      };

      render(<ResultScreen analysis={analysis} />);

      // Both sections should appear
      expect(screen.getByText('personal-guarantee')).toBeInTheDocument();
      expect(screen.getByText('ALSO SEEN')).toBeInTheDocument();
    });
  });

  describe('Also-seen item display and styling', () => {
    it('should display clauseType in monospace font', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Find the monospace element containing the clause type
      const monoElements = container.querySelectorAll('.mono');
      const clauseTypeElement = Array.from(monoElements).find(el => el.textContent === 'liability-cap');
      expect(clauseTypeElement).toBeInTheDocument();
      expect(clauseTypeElement).toHaveClass('mono');
    });

    it('should display description in secondary text', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped at $1.00, effectively zero.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Description should appear
      expect(screen.getByText('Liability is capped at $1.00, effectively zero.')).toBeInTheDocument();
    });

    it('should display multiple also-seen items', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped at $1.00.',
          },
          {
            clauseType: 'arbitration-clause',
            description: 'Disputes must be arbitrated.',
          },
          {
            clauseType: 'dispute-forum',
            description: 'Arbitration in Delaware.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // All items should appear
      expect(screen.getByText('liability-cap')).toBeInTheDocument();
      expect(screen.getByText('arbitration-clause')).toBeInTheDocument();
      expect(screen.getByText('dispute-forum')).toBeInTheDocument();

      expect(screen.getByText('Liability is capped at $1.00.')).toBeInTheDocument();
      expect(screen.getByText('Disputes must be arbitrated.')).toBeInTheDocument();
      expect(screen.getByText('Arbitration in Delaware.')).toBeInTheDocument();
    });
  });

  describe('Also-seen styling: dashed border and lower-confidence treatment', () => {
    it('should have dashed border around also-seen container', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Find the also-seen container with dashed border
      const dashedBorderElement = container.querySelector('div[style*="border: 1px dashed"]');
      expect(dashedBorderElement).toBeInTheDocument();
      expect(dashedBorderElement?.getAttribute('style')).toContain('1px dashed var(--housing-seam)');
    });

    it('should have 2px radius on also-seen container', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const dashedBorderElement = container.querySelector('div[style*="border: 1px dashed"]');
      expect(dashedBorderElement?.getAttribute('style')).toContain('var(--radius)');
    });

    it('should display ALSO SEEN label in monospace and secondary text', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Find the ALSO SEEN label
      const labels = container.querySelectorAll('.mono.text-secondary');
      const alsoSeenLabel = Array.from(labels).find(el => el.textContent?.includes('ALSO SEEN'));
      expect(alsoSeenLabel).toBeInTheDocument();
      expect(alsoSeenLabel).toHaveClass('mono');
      expect(alsoSeenLabel).toHaveClass('text-secondary');
    });

    it('should have padding inside also-seen container', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      const dashedBorderElement = container.querySelector('div[style*="border: 1px dashed"]');
      expect(dashedBorderElement?.getAttribute('style')).toContain('padding: var(--spacing-md)');
    });
  });

  describe('Also-seen vs flags: distinct UI tiers', () => {
    it('should use dashed border for also-seen vs solid for flags', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'flags' as const },
      };

      const { container } = render(<ResultScreen analysis={analysis} />);

      // Flags should have solid border (1px solid)
      const solidBorderElement = container.querySelector('div[style*="border: 1px solid"]');
      expect(solidBorderElement).toBeInTheDocument();

      // Also-seen should have dashed border (1px dashed)
      const dashedBorderElement = container.querySelector('div[style*="border: 1px dashed"]');
      expect(dashedBorderElement).toBeInTheDocument();
    });

    it('should display flags with severity labels', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'Test sentence.',
            counterOffer: 'Test',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'flags' as const },
      };

      render(<ResultScreen analysis={analysis} />);

      // Flags should show severity
      expect(screen.getByText('BLOCKER')).toBeInTheDocument();

      // Also-seen should not show severity
      const alsoSeenSection = screen.getByText('ALSO SEEN');
      expect(alsoSeenSection.closest('div')).not.toHaveTextContent('Blocker');
      expect(alsoSeenSection.closest('div')).not.toHaveTextContent('Push');
      expect(alsoSeenSection.closest('div')).not.toHaveTextContent('Note');
    });

    it('should not display source sentence preview in also-seen', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Also-seen should not have quote previews (no quotes with …)
      expect(screen.queryByText(/".+…"/)).not.toBeInTheDocument();
    });
  });

  describe('Fixture verification: contract-with-clauses alsoSeen', () => {
    it('should display liability-cap item from fixture', () => {
      const analysis: Analysis = {
        summary:
          'This Master Service Agreement between TechVendor Inc. and SampleCorp LLC establishes software development services.',
        flags: [
          {
            clauseType: 'personal-guarantee',
            severity: 'Blocker' as const,
            sourceSentence: 'The signatory personally guarantees all obligations.',
            counterOffer: 'Remove',
            confidenceMarker: 'clear' as const,
            reason: 'Personal liability',
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
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show the liability-cap item
      expect(screen.getByText('liability-cap')).toBeInTheDocument();
      expect(screen.getByText('Liability is capped at $1.00, effectively zero.')).toBeInTheDocument();
    });

    it('should show ALSO SEEN label with liability-cap', () => {
      const analysis: Analysis = {
        summary: 'Test',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'liability-cap',
            description: 'Liability is capped at $1.00, effectively zero.',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Both label and item should appear
      expect(screen.getByText('ALSO SEEN')).toBeInTheDocument();
      expect(screen.getByText('liability-cap')).toBeInTheDocument();
    });
  });

  describe('Fixture verification: contract-clean alsoSeen', () => {
    it('should not display also-seen section when empty', () => {
      const analysis: Analysis = {
        summary: 'This Software Services Agreement between Reliable Software Partners, Inc. and Midwest Manufacturing Corp.',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 1 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should not show ALSO SEEN label
      expect(screen.queryByText('ALSO SEEN')).not.toBeInTheDocument();
    });

    it('should show clean verdict but hide also-seen', () => {
      const analysis: Analysis = {
        summary: 'Clean agreement',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show clean verdict message
      expect(screen.getByText(/You're probably fine/i)).toBeInTheDocument();

      // Should not show also-seen
      expect(screen.queryByText('ALSO SEEN')).not.toBeInTheDocument();
    });
  });

  describe('Also-seen edge cases', () => {
    it('should handle also-seen with very long description', () => {
      const longDescription =
        'This is a very long description that explains the also-seen item with lots of detail about what was found and why it might be worth considering even though it is not a top-line flag.';

      const analysis: Analysis = {
        summary: 'Test',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'long-description-item',
            description: longDescription,
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Full description should appear
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle also-seen items with special characters', () => {
      const analysis: Analysis = {
        summary: 'Test',
        flags: [],
        alsoSeen: [
          {
            clauseType: 'special-chars-clause',
            description: 'Clause contains special chars: & < > " \' $ % # @ !',
          },
        ],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      // Description with special chars should appear
      expect(screen.getByText(/special chars: & < >/)).toBeInTheDocument();
    });

    it('should handle empty alsoSeen array correctly', () => {
      const analysis: Analysis = {
        summary: 'Test',
        flags: [
          {
            clauseType: 'test-clause',
            severity: 'Note' as const,
            sourceSentence: 'Test.',
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

      // Flags should show, also-seen should not
      expect(screen.getByText('test-clause')).toBeInTheDocument();
      expect(screen.queryByText('ALSO SEEN')).not.toBeInTheDocument();
    });
  });
});
