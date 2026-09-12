"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { ResultScreen } from "@/components/ResultScreen";
import { analyzeContract } from "@/lib/analysis";
import { getFixtureResponse } from "@/lib/fixture-responses";
import { TestModelBoundary } from "@/lib/model-boundary";
import { Analysis } from "@/lib/model-boundary";

export default function NewReview() {
  const [documentText, setDocumentText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

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

      const testBoundary = new TestModelBoundary(fixtureMapping);

      // Call analyzeContract with test boundary
      const result = await analyzeContract(
        {
          documentText: trimmed,
          redLines: [],
          governingLawState: "unknown",
          operatingState: "unknown",
        },
        testBoundary
      );

      setAnalysis(result);
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
    setError("");
    setSuccess(false);
    setAnalysis(null);
  };

  if (analysis) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <ResultScreen analysis={analysis} />
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
