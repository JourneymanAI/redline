'use client';

import { Analysis } from '@/lib/model-boundary';

interface ResultScreenProps {
  analysis: Analysis;
}

export function ResultScreen({ analysis }: ResultScreenProps) {
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
            You're probably fine.
          </h1>
          <p className="text-dimmed">
            No Blocker or Push issues found. {analysis.verdict.notesCount} note
            {analysis.verdict.notesCount !== 1 ? 's' : ''} below for awareness.
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
              <div
                key={idx}
                style={{
                  borderBottom: '1px solid var(--housing-seam)',
                  padding: '16px 0',
                  display: 'grid',
                  gridTemplateColumns: '84px 1fr 300px 40px',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                {/* Severity */}
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

                {/* Quote preview */}
                <div style={{ fontSize: '13px', color: 'var(--worn-card-stock)' }}>
                  "{flag.sourceSentence.substring(0, 80)}..."
                </div>

                {/* Expand toggle */}
                <button
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    color: 'var(--split-flap-cream)',
                  }}
                >
                  ›
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Also Seen Section */}
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
