'use client';

import { useState } from 'react';
import { Analysis } from '@/lib/model-boundary';

interface ResultScreenProps {
  analysis: Analysis;
}

export function ResultScreen({ analysis }: ResultScreenProps) {
  // State management for counter-offer expand/collapse
  // ADR 0004: Counter-offer specificity — each counter-offer addresses the specific flagged clause
  // Eval criterion 7: Counter-offer must be specific (not generic boilerplate) on every flag
  const [expandedFlags, setExpandedFlags] = useState<Set<number>>(new Set());

  const toggleExpand = (idx: number) => {
    const newExpanded = new Set(expandedFlags);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedFlags(newExpanded);
  };

  return (
    <div className="container">
      {/* Summary Section */}
      <div
        style={{
          backgroundColor: 'var(--terminal-night-raised)',
          border: '1px solid var(--housing-seam)',
          borderRadius: 'var(--radius)',
          padding: '20px 22px',
          marginBottom: 'var(--spacing-lg)',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr auto',
          gap: '1px',
          gridAutoFlow: 'column',
        }}
      >
        {/* Parties */}
        <div>
          <div className="mono text-secondary" style={{ fontSize: '11px', fontWeight: 600 }}>
            PARTIES
          </div>
          <div style={{ marginTop: '8px', fontSize: '14px' }}>{analysis.summary}</div>
        </div>
      </div>

      {/* Verdict Section */}
      {analysis.verdict.kind === 'clean' ? (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ color: 'var(--split-flap-cream)', marginBottom: 'var(--spacing-md)' }}>
            You&apos;re probably fine.
          </h1>
          <p className="text-dimmed">
            No Blocker or Push issues found. {analysis.verdict.notesCount} note
            {analysis.verdict.notesCount !== 1 ? 's' : ''} below.
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <p className="text-secondary">
            {analysis.flags.length} issue{analysis.flags.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Flags List */}
      {analysis.flags.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xxl)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            {analysis.flags.map((flag, idx) => (
              <div key={idx}>
                <div
                  style={{
                    borderBottom: '1px solid var(--housing-seam)',
                    padding: '16px 0',
                    display: 'grid',
                    gridTemplateColumns: '84px 1fr 300px 40px',
                    gap: '16px',
                    alignItems: 'start',
                  }}
                >
                  {/* Severity & Confidence Marker */}
                  <div>
                    <span
                      className="mono"
                      style={{
                        fontWeight: 600,
                        fontSize: '11px',
                        color:
                          flag.severity === 'Blocker'
                            ? 'var(--gate-change-red)'
                            : flag.severity === 'Push'
                              ? 'var(--delayed-amber)'
                              : 'var(--split-flap-cream)',
                      }}
                    >
                      {flag.severity.toUpperCase()}
                    </span>
                    {/* Confidence Marker: Display below severity label
                        ADR 0004 — "The quote is stated plainly and never hedged; the severity and any 'broader than typical'
                        read carry an explicit confidence marker"

                        Visual strategy:
                        - 'clear': not displayed (standard/default confidence)
                        - 'our-read': secondary text, dimmed styling, label "OUR READ"
                        - 'unclear-get-help': warning color (delayed-amber), label "UNCLEAR — GET HELP"
                     */}
                    {flag.confidenceMarker !== 'clear' && (
                      <div
                        className="mono"
                        style={{
                          fontSize: '9px',
                          fontWeight: 500,
                          marginTop: '6px',
                          color:
                            flag.confidenceMarker === 'our-read'
                              ? 'var(--text-secondary)'
                              : flag.confidenceMarker === 'unclear-get-help'
                                ? 'var(--delayed-amber)'
                                : 'var(--text-secondary)',
                        }}
                      >
                        {flag.confidenceMarker === 'our-read' && 'OUR READ'}
                        {flag.confidenceMarker === 'unclear-get-help' && 'UNCLEAR — GET HELP'}
                      </div>
                    )}
                  </div>

                  {/* Clause Type & Why */}
                  <div>
                    <div className="mono" style={{ fontWeight: 500, fontSize: '15px' }}>
                      {flag.clauseType}
                    </div>
                    <div className="text-secondary" style={{ fontSize: '13px', marginTop: '4px' }}>
                      {flag.reason}
                    </div>
                    {flag.isRedLineTrigger && (
                      <div className="text-push" style={{ fontSize: '13px', marginTop: '4px' }}>
                        Triggers your red line
                      </div>
                    )}
                  </div>

                  {/* Quote preview
                    ===============
                    Display the first 80 characters of the source sentence from the contract.
                    The sourceSentence has already been verified as a verbatim substring of the
                    document (see analysis.ts citation integrity check).

                    Truncate to 80 chars to fit the grid column (300px). If the sentence is longer,
                    append … (ellipsis) to signal the user can expand for the full quote.

                    Why 80 chars? It's approximately the limit before the UI wraps on a 300px column
                    at 13px font size. At 300px width, ~80 characters + "…" fits cleanly without wrapping.
                  */}
                  <div style={{ fontSize: '13px', color: 'var(--worn-card-stock)' }}>
                    &quot;{flag.sourceSentence.substring(0, 80)}&hellip;&quot;
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => toggleExpand(idx)}
                    style={{
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      color: 'var(--split-flap-cream)',
                      cursor: 'pointer',
                      transform: expandedFlags.has(idx) ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    ›
                  </button>
                </div>

                {/* Counter-offer Display (Expanded) */}
                {expandedFlags.has(idx) && (
                  <div
                    style={{
                      backgroundColor: 'var(--terminal-night-raised)',
                      borderLeft: '2px dashed var(--housing-seam)',
                      borderRight: '2px dashed var(--housing-seam)',
                      borderBottom: '2px dashed var(--housing-seam)',
                      padding: '12px 16px',
                      marginTop: '0px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: '8px',
                      }}
                    >
                      SUGGESTED LANGUAGE
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: '12px',
                        color: 'var(--split-flap-cream)',
                        lineHeight: '1.5',
                        paddingLeft: '12px',
                        borderLeft: '2px solid var(--delayed-amber)',
                      }}
                    >
                      {flag.counterOffer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Also Seen Section
          ================
          ADR 0003: "Anything outside the main clause set that the model notices is
          surfaced as a lower-confidence 'also seen', never as a top-line flag."

          Also-seen items are findings the model detected but with lower confidence
          than top-line flags. They are visually distinct from flags via a dashed border
          (vs. solid) and no severity marker. This creates a visible two-tier system:
          - Top-line flags (solid border, severity label): high confidence
          - Also-seen (dashed border, no severity): lower confidence, informational

          Styling:
          - Dashed 1px Housing Seam border (vs. solid for flags)
          - 2px radius matching design system
          - Padding and spacing from DESIGN.md
          - "ALSO SEEN" label in monospace + secondary text
          - Items show clauseType (monospace) + description (secondary text)
      */}
      {analysis.alsoSeen.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xxl)' }}>
          <div style={{ border: '1px dashed var(--housing-seam)', borderRadius: 'var(--radius)', padding: 'var(--spacing-md)' }}>
            <div className="mono text-secondary" style={{ fontSize: '11px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              ALSO SEEN
            </div>
            {analysis.alsoSeen.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 'var(--spacing-sm)' }}>
                <div className="mono" style={{ fontSize: '15px' }}>
                  {item.clauseType}
                </div>
                <div className="text-secondary" style={{ fontSize: '13px' }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
