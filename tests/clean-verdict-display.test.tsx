import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultScreen } from '@/components/ResultScreen';
import type { Analysis } from '@/lib/model-boundary';

/**
 * Clean Verdict Display Tests (Criterion 3 — UI verification)
 *
 * The ResultScreen component displays the verdict message based on verdict.kind:
 *
 * For verdict.kind = 'clean':
 * - Heading: "You're probably fine."
 * - Body: "No Blocker or Push issues found. N note(s) below."
 * - Correct grammar: "1 note" vs "N notes"
 *
 * For verdict.kind = 'flags':
 * - Body: "N issue(s) found"
 * - Correct grammar: "1 issue" vs "N issues"
 *
 * These tests verify:
 * 1. Clean verdict message is displayed correctly
 * 2. Note count grammar is correct (1 vs many)
 * 3. Flag verdict message is displayed correctly
 * 4. Issue count grammar is correct (1 vs many)
 * 5. Edge cases (zero issues/notes)
 */

describe('ResultScreen: Clean Verdict Display', () => {
  describe('Clean Verdict: Zero Notes', () => {
    it('should display "You\'re probably fine." for clean verdict with no notes', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 0 },
      };

      render(<ResultScreen analysis={analysis} />);

      expect(screen.getByText(/You're probably fine/)).toBeInTheDocument();
      expect(
        screen.getByText(/No Blocker or Push issues found/)
      ).toBeInTheDocument();
      expect(screen.getByText(/0 notes/)).toBeInTheDocument();
    });
  });

  describe('Clean Verdict: Single Note', () => {
    it('should display "1 note" (singular) for clean verdict with one note', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'test-note',
            severity: 'Note',
            sourceSentence: 'This is a note flag.',
            counterOffer: 'Test counter',
            confidenceMarker: 'clear',
            reason: 'Test reason',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 1 },
      };

      render(<ResultScreen analysis={analysis} />);

      expect(screen.getByText(/You're probably fine/)).toBeInTheDocument();
      expect(
        screen.getByText(/No Blocker or Push issues found/)
      ).toBeInTheDocument();
      // Should show "1 note" (singular)
      expect(screen.getByText(/1 note[^s]/)).toBeInTheDocument();
    });
  });

  describe('Clean Verdict: Multiple Notes', () => {
    it('should display "3 notes" (plural) for clean verdict with multiple notes', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'note-1',
            severity: 'Note',
            sourceSentence: 'This is note one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note-2',
            severity: 'Note',
            sourceSentence: 'This is note two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note-3',
            severity: 'Note',
            sourceSentence: 'This is note three.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 3 },
      };

      render(<ResultScreen analysis={analysis} />);

      expect(screen.getByText(/You're probably fine/)).toBeInTheDocument();
      expect(
        screen.getByText(/No Blocker or Push issues found/)
      ).toBeInTheDocument();
      // Should show "3 notes" (plural)
      expect(screen.getByText(/3 notes/)).toBeInTheDocument();
    });

    it('should display "2 notes" (plural) for clean verdict with 2 notes', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'note-1',
            severity: 'Note',
            sourceSentence: 'Note one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note-2',
            severity: 'Note',
            sourceSentence: 'Note two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 2 },
      };

      render(<ResultScreen analysis={analysis} />);

      expect(screen.getByText(/You're probably fine/)).toBeInTheDocument();
      expect(screen.getByText(/2 notes/)).toBeInTheDocument();
    });
  });

  describe('Flags Verdict: Issue Count Grammar', () => {
    it('should display "1 issue" (singular) for flags verdict with one flag', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'blocker-1',
            severity: 'Blocker',
            sourceSentence: 'This is a blocker.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show "1 issue" (singular, not "issues")
      expect(screen.getByText(/1 issue[^s]/)).toBeInTheDocument();
    });

    it('should display "2 issues" (plural) for flags verdict with two flags', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'blocker-1',
            severity: 'Blocker',
            sourceSentence: 'Blocker one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'push-1',
            severity: 'Push',
            sourceSentence: 'Push one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show "2 issues" (plural)
      expect(screen.getByText(/2 issues/)).toBeInTheDocument();
    });

    it('should display "5 issues" (plural) for flags verdict with many flags', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'blocker-1',
            severity: 'Blocker',
            sourceSentence: 'Blocker one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'blocker-2',
            severity: 'Blocker',
            sourceSentence: 'Blocker two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'push-1',
            severity: 'Push',
            sourceSentence: 'Push one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'push-2',
            severity: 'Push',
            sourceSentence: 'Push two.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
          {
            clauseType: 'note-1',
            severity: 'Note',
            sourceSentence: 'Note one.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'flags' },
      };

      render(<ResultScreen analysis={analysis} />);

      // Should show "5 issues" (plural)
      expect(screen.getByText(/5 issues/)).toBeInTheDocument();
    });
  });

  describe('Clean Verdict: Display Order', () => {
    it('should display "You\'re probably fine." heading before the notes message', () => {
      const analysis: Analysis = {
        summary: 'Test Agreement',
        flags: [
          {
            clauseType: 'note-1',
            severity: 'Note',
            sourceSentence: 'This is a note.',
            counterOffer: 'Test',
            confidenceMarker: 'clear',
            reason: 'Test',
            isRedLineTrigger: false,
            jurisdictionSensitive: false,
          },
        ],
        alsoSeen: [],
        verdict: { kind: 'clean', notesCount: 1 },
      };

      render(<ResultScreen analysis={analysis} />);

      // The heading should appear (as h1)
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/You're probably fine/);

      // The message should appear below
      expect(screen.getByText(/No Blocker or Push issues found/)).toBeInTheDocument();
    });
  });
});
