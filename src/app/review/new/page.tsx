"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { ResultScreen } from "@/components/ResultScreen";
import { QASection } from "@/components/QASection";
import { analyzeContract, answerFromDocument } from "@/lib/analysis";
import { getFixtureResponse, getFixtureQAResponse } from "@/lib/fixture-responses";
import { TestModelBoundary } from "@/lib/model-boundary";
import { Analysis, Answer } from "@/lib/model-boundary";

// All 50 US states in alphabetical order
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export default function NewReview() {
  const [documentText, setDocumentText] = useState<string>("");
  const [redLines, setRedLines] = useState<string[]>([]);
  const [redLineInput, setRedLineInput] = useState<string>("");
  const [governingLawState, setGoverningLawState] = useState<string>("unknown");
  const [operatingState, setOperatingState] = useState<string>("unknown");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [testBoundary, setTestBoundary] = useState<TestModelBoundary | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentText(e.target.value);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async () => {
    const trimmed = documentText.trim();
    if (!trimmed) {
      setError("Please paste a contract document to continue.");
      return;
    }

    // Validate that jurisdiction fields are selected
    if (governingLawState === "unknown") {
      setError("Please select a governing law state to continue.");
      return;
    }

    if (operatingState === "unknown") {
      setError("Please select an operating state to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Get fixture response
      const fixtureAnalysis = getFixtureResponse(trimmed);

      // Create test model boundary with fixture data
      const fixtureMapping: { [key: string]: { analysis?: Analysis } } = {
        [`analyze:${trimmed.substring(0, 50)}`]: { analysis: fixtureAnalysis },
      };

      const newTestBoundary = new TestModelBoundary(fixtureMapping);

      // Call analyzeContract with test boundary, passing selected jurisdiction states
      const result = await analyzeContract(
        {
          documentText: trimmed,
          redLines,
          governingLawState,
          operatingState,
        },
        newTestBoundary
      );

      setAnalysis(result);
      setTestBoundary(newTestBoundary);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze contract";
      setError(errorMessage);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDocumentText("");
    setRedLines([]);
    setRedLineInput("");
    setError("");
    setSuccess(false);
    setAnalysis(null);
    setTestBoundary(null);
  };

  const handleAnswerQuestion = async (question: string): Promise<Answer> => {
    if (!testBoundary || !documentText) {
      throw new Error("Document or test boundary not available");
    }
    return answerFromDocument(documentText, question, testBoundary);
  };

  const handleAddRedLine = () => {
    const trimmed = redLineInput.trim();
    if (!trimmed) return;
    if (!redLines.includes(trimmed)) {
      setRedLines([...redLines, trimmed]);
    }
    setRedLineInput("");
  };

  const handleRemoveRedLine = (index: number) => {
    setRedLines(redLines.filter((_, i) => i !== index));
  };

  const handleRedLineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedLineInput(e.target.value);
  };

  const handleRedLineKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRedLine();
    }
  };

  if (analysis) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <ResultScreen analysis={analysis} />
          <QASection documentText={documentText} onAnswer={handleAnswerQuestion} />
          <div className={styles.actions} style={{ marginTop: "44px" }}>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
            >
              Analyze another contract
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Paste your contract</h1>
          <p className={styles.description}>
            Paste the full contract text. Redline reads only what you give it.
          </p>
        </header>

        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="contract-input" className={styles.label}>
              Contract text
            </label>
            <textarea
              id="contract-input"
              className={styles.textarea}
              value={documentText}
              onChange={handleTextChange}
              placeholder="Paste your contract text here. You can paste multiple documents. They'll be combined into one."
              rows={12}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="red-lines-input" className={styles.label}>
              Red lines (non-negotiables) — optional
            </label>
            <p className={styles.description} style={{ fontSize: '13px', marginBottom: '8px' }}>
              Add phrases from this contract that you won't accept. Redline will flag any clause that crosses these lines.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                id="red-lines-input"
                type="text"
                className={styles.textarea}
                value={redLineInput}
                onChange={handleRedLineInputChange}
                onKeyPress={handleRedLineKeyPress}
                placeholder="e.g., personal guarantee, unlimited liability"
                disabled={loading}
                style={{ padding: '8px 12px', minHeight: 'auto' }}
              />
              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleAddRedLine}
                disabled={loading || !redLineInput.trim()}
                style={{ padding: '8px 16px', minHeight: 'auto', whiteSpace: 'nowrap' }}
              >
                Add
              </button>
            </div>
            {redLines.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {redLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--delayed-amber)',
                      color: 'var(--terminal-night)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <span>{line}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRedLine(idx)}
                      disabled={loading}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: 'var(--terminal-night)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0 4px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {success && documentText.trim() && !analysis && (
            <div className={styles.success}>
              Contract captured ({documentText.trim().length} characters). Ready
              to analyze.
            </div>
          )}

          <div className={styles.notice}>
            <strong>What Redline sees:</strong> Only the text you paste — no
            attachments, images, or linked documents. If your contract
            references schedules or exhibits, include those too.
          </div>

          {/* Jurisdiction-sensitive flags vary by state law. Select your states for accurate guidance. */}
          <div className={styles.stateSelectsGroup}>
            <div className={styles.stateSelect}>
              <label htmlFor="governing-law-state" className={styles.label}>
                Governing law state <span className={styles.required}>*</span>
              </label>
              <select
                id="governing-law-state"
                className={styles.select}
                value={governingLawState}
                onChange={(e) => setGoverningLawState(e.target.value)}
                disabled={loading}
              >
                <option value="unknown">Unknown</option>
                <option value="non-us">Non-US</option>
                <optgroup label="United States">
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className={styles.stateSelect}>
              <label htmlFor="operating-state" className={styles.label}>
                Operating state <span className={styles.required}>*</span>
              </label>
              <select
                id="operating-state"
                className={styles.select}
                value={operatingState}
                onChange={(e) => setOperatingState(e.target.value)}
                disabled={loading}
              >
                <option value="unknown">Unknown</option>
                <option value="non-us">Non-US</option>
                <optgroup label="United States">
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze contract"}
            </button>
            {documentText && !loading && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {documentText && (
          <div className={styles.info}>
            <span className={styles.infoLabel}>Characters pasted:</span>
            <span className={styles.infoValue}>{documentText.length}</span>
          </div>
        )}
      </div>
    </main>
  );
}
