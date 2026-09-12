"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function NewReview() {
  const [documentText, setDocumentText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentText(e.target.value);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = () => {
    const trimmed = documentText.trim();
    if (!trimmed) {
      setError("Please paste a contract document to continue.");
      return;
    }
    setSuccess(true);
    setError("");
    // TODO: Next step will send documentText to analysis
  };

  const handleClear = () => {
    setDocumentText("");
    setError("");
    setSuccess(false);
  };

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
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {success && documentText.trim() && (
            <div className={styles.success}>
              Contract captured ({documentText.trim().length} characters). Ready
              to analyze.
            </div>
          )}

          <div className={styles.notice}>
            <strong>What Redline sees:</strong> Only the text you paste. No
            attachments, no embedded images, no linked documents. If your
            contract references schedules or exhibits, paste those too.
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              Analyze contract
            </button>
            {documentText && (
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
