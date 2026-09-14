"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

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

type FlagRowProps = {
  severity: "BLOCKER" | "PUSH" | "NOTE";
  clause: string;
  why: string;
  sourceSentence: string;
  counterOffer: string;
  counterOfferLabel?: string;
  showCopy?: boolean;
};

function FlagRow({
  severity,
  clause,
  why,
  sourceSentence,
  counterOffer,
  counterOfferLabel = "Counter-offer",
  showCopy = true,
}: FlagRowProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(counterOffer).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const sevClass =
    severity === "BLOCKER"
      ? styles.sevLabel
      : severity === "PUSH"
        ? `${styles.sevLabel} ${styles.sevLabelPush}`
        : `${styles.sevLabel} ${styles.sevLabelNote}`;

  return (
    <div>
      <button
        type="button"
        className={styles.row}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={sevClass}>{severity}</span>
        <span className={styles.clauseCol}>
          <span className={styles.clause}>{clause}</span>
          <span className={styles.why}>{why}</span>
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
              <div className={styles.detailHeading}>Exact source sentence</div>
              <blockquote className={styles.quote}>
                &ldquo;{sourceSentence}&rdquo;
              </blockquote>
            </div>
            <div>
              <div className={styles.detailHeading}>{counterOfferLabel}</div>
              <p className={styles.counter}>
                {showCopy ? `“${counterOffer}”` : counterOffer}
              </p>
              {showCopy && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.nav}>
        <div className={styles.wordmark}>ReviewIt</div>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} href="/resources">
            Resources
          </Link>
          <Link className={styles.signIn} href="/login">
            Sign in
          </Link>
        </div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.headline}>Spot contract red flags in seconds</h1>
        <p className={styles.subhead}>
          For freelancers, contractors, and small business owners who sign agreements without legal counsel. Paste any contract and ReviewIt flags every clause that could hurt you—ranked by risk, traced to the exact words, ready to negotiate.
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
          <div className={styles.panelLabel}>What ReviewIt shows you</div>
          <div className={styles.after}>
            <FlagRow
              severity="BLOCKER"
              clause="Personal guarantee"
              why="Makes you personally liable for a business debt, not just the company."
              sourceSentence="By executing this Agreement, the undersigned individual personally guarantees full payment of all fees owed by Customer hereunder."
              counterOffer="Strike this Section in its entirety; Customer’s obligations are limited to the entity executing this Agreement."
            />
          </div>
        </div>
      </div>

      <div className={styles.ctaRow}>
        <Link className={styles.cta} href="/login?mode=signup">
          Create your account
        </Link>
      </div>

      <div className={styles.teaser} id="teaser">
        <div className={styles.teaserLabel}>
          Two more of the five flags this contract would surface:
        </div>
        <div className={styles.teaserBoard}>
          <FlagRow
            severity="PUSH"
            clause="One-sided limitation of liability"
            why="Leverage decides whether this is still signable if they refuse to change it."
            sourceSentence="In no event shall Provider's aggregate liability exceed the fees paid by Customer in the one (1) month preceding the event giving rise to the claim, and Provider shall have no liability for indirect, incidental, or consequential damages."
            counterOffer="Provider's aggregate liability shall not be less than twelve (12) months of fees paid, and the exclusion of indirect damages shall not apply to breaches of confidentiality or data-protection obligations."
          />
          <FlagRow
            severity="NOTE"
            clause="Governing law: Delaware"
            why="Worth knowing: sets the rules for everything else above."
            sourceSentence="This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law principles."
            counterOffer="Informational: this determines how every other clause is interpreted and enforced. No action needed on its own."
            counterOfferLabel="What to do"
            showCopy={false}
          />
        </div>
        <p className={styles.footnote}>
          This contract is synthetic: built to show how ReviewIt reads a
          document, not a real submission. ReviewIt is pre-launch: creating an
          account reserves your place, but pasting your own contract isn&apos;t
          live yet.
        </p>
      </div>
    </main>
  );
}
