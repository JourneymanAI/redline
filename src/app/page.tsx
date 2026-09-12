"use client";

import { useState } from "react";
import styles from "./page.module.css";

const SOURCE_SENTENCE =
  '"By executing this Agreement, the undersigned individual personally guarantees full payment of all fees owed by Customer hereunder."';

const COUNTER_OFFER =
  '"Strike this Section in its entirety; Customer’s obligations are limited to the entity executing this Agreement."';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      width="16"
      height="16"
      className={open ? `${styles.chev} ${styles.chevOpen}` : styles.chev}
      aria-hidden="true"
    >
      <path
        d="M6 3.5L11 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(COUNTER_OFFER).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function scrollToTeaser() {
    document.getElementById("teaser")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className={styles.page}>
      <div className={styles.wordmark}>REDLINE</div>

      <div className={styles.hero}>
        <h1 className={styles.headline}>The same sentence. Read two ways.</h1>
        <p className={styles.subhead}>
          Paste a contract, and every clause that works against you gets
          flagged, ranked, and traced back to the exact words it came from.
        </p>
      </div>

      <div className={styles.contrast}>
        <div className={styles.panel}>
          <div className={styles.panelLabel}>What the contract says</div>
          <p className={styles.before}>
            &ldquo;By executing this Agreement, the undersigned individual
            personally guarantees full payment of all fees owed by Customer
            hereunder.&rdquo;
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelLabel}>What Redline shows you</div>
          <div className={styles.after}>
            <button
              type="button"
              className={styles.row}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <span className={styles.sevLabel}>BLOCKER</span>
              <span className={styles.clauseCol}>
                <span className={styles.clause}>Personal guarantee</span>
                <span className={styles.why}>
                  Makes you personally liable for a business debt, not just
                  the company.
                </span>
              </span>
              <Chevron open={open} />
            </button>
            <div
              className={
                open
                  ? `${styles.detailClip} ${styles.detailClipOpen}`
                  : styles.detailClip
              }
            >
              <div className={styles.detailInner}>
                <div className={styles.detailContent}>
                  <div>
                    <div className={styles.detailHeading}>
                      Exact source sentence
                    </div>
                    <blockquote className={styles.quote}>
                      {SOURCE_SENTENCE}
                    </blockquote>
                  </div>
                  <div>
                    <div className={styles.detailHeading}>Counter-offer</div>
                    <p className={styles.counter}>{COUNTER_OFFER}</p>
                    <button
                      type="button"
                      className={
                        copied
                          ? `${styles.copyBtn} ${styles.copyBtnCopied}`
                          : styles.copyBtn
                      }
                      onClick={handleCopy}
                    >
                      {copied ? "Copied" : "Copy counter-offer"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ctaRow}>
        <button type="button" className={styles.cta} onClick={scrollToTeaser}>
          See your first contract reviewed
        </button>
      </div>

      <div className={styles.teaser} id="teaser">
        <div className={styles.teaserLabel}>This is one row of five.</div>
        <div className={styles.teaserBoard}>
          <div className={styles.teaserRow}>
            <span className={`${styles.teaserSev} ${styles.teaserSevPush}`}>
              PUSH
            </span>
            <span className={styles.teaserClause}>
              One-sided limitation of liability
            </span>
          </div>
          <div className={styles.teaserRow}>
            <span className={`${styles.teaserSev} ${styles.teaserSevNote}`}>
              NOTE
            </span>
            <span className={styles.teaserClause}>
              Governing law: Delaware
            </span>
          </div>
        </div>
        <p className={styles.footnote}>
          This contract is synthetic: built to show how Redline reads a
          document, not a real submission. Redline is pre-launch, so no
          analysis runs on this page yet.
        </p>
      </div>
    </main>
  );
}
