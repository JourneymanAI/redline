import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultScreen } from '@/components/ResultScreen';
import type { Analysis, Flag } from '@/lib/model-boundary';

/**
 * Confidence Marker Display Tests (Ticket 06)
 *
 * Tests two-register output: high-confidence (clear), lower-confidence (our-read),
 * and uncertain (unclear-get-help) flags are visually distinguished.
 *
 * ADR 0004: "The quote is stated plainly and never hedged; the severity and any
 * 'broader than typical' read carry an explicit confidence marker"
 */

const createTestAnalysis = (flags: Flag[]): Analysis => ({
  summary: 'Test agreement between Party A and Party B',
  flags,
  alsoSeen: [],
  verdict: { kind: 'flags' as const },
});

const createTestFlag = (overrides: Partial<Flag> = {}): Flag => ({
  clauseType: 'test-clause',
  severity: 'Blocker' as const,
  sourceSentence: 'Test clause text goes here.',
  counterOffer: 'Test counter offer.',
  confidenceMarker: 'clear' as const,
  reason: 'Test reason.',
  isRedLineTrigger: false,
  jurisdictionSensitive: false,
  ...overrides,
});

describe('Confidence Marker Display', () => {
  it('should not display confidence marker label for clear markers (default)', () => {
    const flag = createTestFlag({
      confidenceMarker: 'clear',
      clauseType: 'test-clause-clear',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    // Verify the flag is rendered
    expect(screen.getByText('test-clause-clear')).toBeInTheDocument();

    // Verify no confidence marker label is shown for 'clear'
    expect(screen.queryByText('CLEAR')).not.toBeInTheDocument();
  });

  it('should display OUR READ marker for our-read confidence', () => {
    const flag = createTestFlag({
      confidenceMarker: 'our-read',
      clauseType: 'test-interpretation-read',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    // Verify the flag is rendered
    expect(screen.getByText('test-interpretation-read')).toBeInTheDocument();

    // Verify OUR READ marker is displayed
    expect(screen.getByText('OUR READ')).toBeInTheDocument();
  });

  it('should display UNCLEAR — GET HELP marker for unclear-get-help confidence', () => {
    const flag = createTestFlag({
      confidenceMarker: 'unclear-get-help',
      clauseType: 'test-uncertain-clause',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    // Verify the flag is rendered
    expect(screen.getByText('test-uncertain-clause')).toBeInTheDocument();

    // Verify UNCLEAR — GET HELP marker is displayed
    expect(screen.getByText('UNCLEAR — GET HELP')).toBeInTheDocument();
  });

  it('should display all 5 fixture flags with correct confidence markers', () => {
    const flags: Flag[] = [
      createTestFlag({
        clauseType: 'personal-guarantee',
        confidenceMarker: 'clear',
        severity: 'Blocker',
      }),
      createTestFlag({
        clauseType: 'uncapped-indemnification',
        confidenceMarker: 'clear',
        severity: 'Blocker',
      }),
      createTestFlag({
        clauseType: 'unilateral-termination-without-kill-fee',
        confidenceMarker: 'clear',
        severity: 'Push',
      }),
      createTestFlag({
        clauseType: 'ip-assignment',
        confidenceMarker: 'clear',
        severity: 'Push',
      }),
      createTestFlag({
        clauseType: 'confidentiality-overreach',
        confidenceMarker: 'our-read',
        severity: 'Note',
      }),
    ];

    const analysis = createTestAnalysis(flags);
    render(<ResultScreen analysis={analysis} />);

    // Verify all 5 flags are rendered
    expect(screen.getByText('personal-guarantee')).toBeInTheDocument();
    expect(screen.getByText('uncapped-indemnification')).toBeInTheDocument();
    expect(screen.getByText('unilateral-termination-without-kill-fee')).toBeInTheDocument();
    expect(screen.getByText('ip-assignment')).toBeInTheDocument();
    expect(screen.getByText('confidentiality-overreach')).toBeInTheDocument();

    // Verify clear flags don't show labels
    const ourReadMarkers = screen.getAllByText('OUR READ');
    expect(ourReadMarkers).toHaveLength(1); // Only confidentiality-overreach

    // Verify no unclear markers
    expect(screen.queryByText('UNCLEAR — GET HELP')).not.toBeInTheDocument();
  });

  it('should display confidence markers for multiple lower-confidence flags', () => {
    const flags: Flag[] = [
      createTestFlag({
        clauseType: 'interpretation-1',
        confidenceMarker: 'our-read',
      }),
      createTestFlag({
        clauseType: 'interpretation-2',
        confidenceMarker: 'our-read',
      }),
      createTestFlag({
        clauseType: 'uncertain-clause',
        confidenceMarker: 'unclear-get-help',
      }),
    ];

    const analysis = createTestAnalysis(flags);
    render(<ResultScreen analysis={analysis} />);

    // Verify markers are displayed
    const ourReadMarkers = screen.getAllByText('OUR READ');
    expect(ourReadMarkers).toHaveLength(2);

    const unclearMarkers = screen.getAllByText('UNCLEAR — GET HELP');
    expect(unclearMarkers).toHaveLength(1);
  });

  it('should not break confidence marker display on long clause names', () => {
    const flag = createTestFlag({
      clauseType:
        'extremely-long-clause-type-that-might-cause-layout-issues-in-the-ui',
      confidenceMarker: 'our-read',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    // Verify the long clause name is rendered
    expect(
      screen.getByText('extremely-long-clause-type-that-might-cause-layout-issues-in-the-ui')
    ).toBeInTheDocument();

    // Verify OUR READ marker still displays
    expect(screen.getByText('OUR READ')).toBeInTheDocument();
  });

  it('should display confidence marker in correct visual order (below severity)', () => {
    const flag = createTestFlag({
      clauseType: 'test-ordering',
      severity: 'Blocker',
      confidenceMarker: 'our-read',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    // Find the severity label and marker label
    const severityLabel = screen.getByText('BLOCKER');
    const markerLabel = screen.getByText('OUR READ');

    // Verify both are in the document and the marker is in a separate div below
    expect(severityLabel).toBeInTheDocument();
    expect(markerLabel).toBeInTheDocument();

    // Verify they're in the same column (confidence marker is in a sibling div)
    const severityParent = severityLabel.parentElement;
    const markerParent = markerLabel.parentElement;

    expect(severityParent).toBe(markerParent);
  });

  it('should apply dimmed styling to OUR READ markers', () => {
    const flag = createTestFlag({
      clauseType: 'dimming-test',
      confidenceMarker: 'our-read',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    const markerLabel = screen.getByText('OUR READ');
    const markerDiv = markerLabel.closest('div');

    // Verify the marker has secondary text color (dimmed)
    expect(markerDiv).toHaveStyle({
      color: 'var(--text-secondary)',
    });
  });

  it('should apply warning styling to UNCLEAR — GET HELP markers', () => {
    const flag = createTestFlag({
      clauseType: 'warning-test',
      confidenceMarker: 'unclear-get-help',
    });
    const analysis = createTestAnalysis([flag]);

    render(<ResultScreen analysis={analysis} />);

    const markerLabel = screen.getByText('UNCLEAR — GET HELP');
    const markerDiv = markerLabel.closest('div');

    // Verify the marker has delayed-amber color (warning)
    expect(markerDiv).toHaveStyle({
      color: 'var(--delayed-amber)',
    });
  });
});
