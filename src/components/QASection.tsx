"use client";

import { useState } from "react";
import styles from "./QASection.module.css";
import { Answer } from "@/lib/model-boundary";

interface QASectionProps {
  documentText: string;
  onAnswer: (question: string) => Promise<Answer>;
}

export function QASection({ documentText: _, onAnswer }: QASectionProps) {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer(null);

    try {
      const result = await onAnswer(trimmedQuestion);
      setAnswer(result);
      setQuestion(""); // Clear input after successful answer
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to answer question";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.qaSection}>
      <div className={styles.qaContainer}>
        <h2 className={styles.heading}>Questions about this contract?</h2>
        <p className={styles.description}>
          Ask anything about the contract text above. Redline will answer based
          only on what&apos;s in the document.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g., What is the termination clause?"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError("");
              }}
              disabled={loading}
              aria-label="Question about contract"
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !question.trim()}
            >
              {loading ? "Answering..." : "Ask"}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </form>

        {answer && (
          <div className={styles.answerBox}>
            <div className={styles.answerContent}>
              <p className={styles.answerText}>{answer.answer}</p>

              {!answer.addressed && (
                <div className={styles.notAddressed}>
                  <strong>Note:</strong> This contract does not directly address
                  this topic. The answer above is based on the contract&apos;s scope.
                </div>
              )}

              {answer.groundedIn && (
                <div className={styles.citation}>
                  <strong>Citation:</strong> {answer.groundedIn}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
