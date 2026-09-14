import Navigation from "@/components/Navigation";
import styles from "./resources.module.css";

export const metadata = {
  title: "Contract Review Resources — ReviewIt",
  description:
    "Learn how to review contracts, spot red flags, and negotiate better terms.",
};

export default function ResourcesPage() {
  return (
    <>
      <Navigation />
      <main className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Contract Review Resources</h1>
          <p className={styles.subtitle}>
            Learn how to spot red flags, understand what to negotiate, and know
            when to bring in a lawyer.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.heading}>Quick Review Checklist</h2>
          <div className={styles.checklist}>
            <div className={styles.item}>
              <div className={styles.checkbox}>✓</div>
              <div>
                <div className={styles.itemTitle}>Read the whole thing</div>
                <p className={styles.itemDesc}>
                  Skim for section headers first. Then read every sentence that
                  affects money, time, or liability. Skip boilerplate only after
                  you know what it says.
                </p>
              </div>
            </div>

            <div className={styles.item}>
              <div className={styles.checkbox}>✓</div>
              <div>
                <div className={styles.itemTitle}>
                  Mark three types of clauses
                </div>
                <p className={styles.itemDesc}>
                  (1) What you&apos;re agreeing to do. (2) What they&apos;re
                  agreeing to do. (3) What happens if someone breaks it. You
                  need leverage on all three.
                </p>
              </div>
            </div>

            <div className={styles.item}>
              <div className={styles.checkbox}>✓</div>
              <div>
                <div className={styles.itemTitle}>Hunt for one-sided rules</div>
                <p className={styles.itemDesc}>
                  Does the contract favor them in payment, time, liability, or
                  exit? If yes, that&apos;s a negotiation point. If you
                  don&apos;t have leverage to change it, you need to know that
                  going in.
                </p>
              </div>
            </div>

            <div className={styles.item}>
              <div className={styles.checkbox}>✓</div>
              <div>
                <div className={styles.itemTitle}>
                  Clarify the money and the math
                </div>
                <p className={styles.itemDesc}>
                  What do you get paid, when, and what happens if the other side
                  doesn&apos;t pay? What deductions, clawbacks, or refund clauses
                  exist? The math needs to make sense.
                </p>
              </div>
            </div>

            <div className={styles.item}>
              <div className={styles.checkbox}>✓</div>
              <div>
                <div className={styles.itemTitle}>
                  Check the exit door and the liability ceiling
                </div>
                <p className={styles.itemDesc}>
                  How do you end this relationship? How much can they sue you
                  for? If you&apos;re personally liable for a company&apos;s
                  debt, you need to know before you sign.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Red Flags to Watch For</h2>
          <div className={styles.flags}>
            <div className={styles.flag}>
              <div className={styles.flagSeverity}>BLOCKER</div>
              <div>
                <div className={styles.flagTitle}>Personal guarantee</div>
                <p className={styles.flagDesc}>
                  You personally guarantee the company&apos;s debt. If the
                  company folds, they can come after your house, bank account,
                  everything. Negotiate this out unless you control the company.
                </p>
              </div>
            </div>

            <div className={styles.flag}>
              <div className={styles.flagSeverity}>BLOCKER</div>
              <div>
                <div className={styles.flagTitle}>Unlimited liability</div>
                <p className={styles.flagDesc}>
                  You can be sued for any amount. Most deals should cap your
                  liability at what you&apos;re being paid, or 12 months of
                  fees. Unlimited means you&apos;re taking all the risk.
                </p>
              </div>
            </div>

            <div className={styles.flag}>
              <div className={styles.flagSeverity}>BLOCKER</div>
              <div>
                <div className={styles.flagTitle}>IP assignment (all work)</div>
                <p className={styles.flagDesc}>
                  All intellectual property you create, including side projects,
                  belongs to them. This can trap you. Negotiate to exclude work
                  you do outside this engagement or before you started.
                </p>
              </div>
            </div>

            <div className={styles.flag}>
              <div className={styles.flagSeverity}>PUSH</div>
              <div>
                <div className={styles.flagTitle}>Non-compete clause</div>
                <p className={styles.flagDesc}>
                  You can&apos;t work for competitors for a set period after the
                  deal ends. Negotiate scope (who counts as a competitor?) and
                  duration (3 months, not 3 years).
                </p>
              </div>
            </div>

            <div className={styles.flag}>
              <div className={styles.flagSeverity}>PUSH</div>
              <div>
                <div className={styles.flagTitle}>
                  Sole discretion termination
                </div>
                <p className={styles.flagDesc}>
                  They can end the contract any time for any reason. If you need
                  income stability, push for notice period (30–90 days) and
                  severance.
                </p>
              </div>
            </div>

            <div className={styles.flag}>
              <div className={styles.flagSeverity}>NOTE</div>
              <div>
                <div className={styles.flagTitle}>Governing law</div>
                <p className={styles.flagDesc}>
                  Determines which state&apos;s or country&apos;s laws apply if
                  there&apos;s a dispute. Delaware and California law are
                  company-friendly. Your home state may be better for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>When to Get a Lawyer</h2>
          <div className={styles.escalation}>
            <p className={styles.escalationText}>
              <strong>Get legal help if:</strong>
            </p>
            <ul className={styles.list}>
              <li>The deal is worth more than 1 year of your income.</li>
              <li>
                You&apos;re guaranteeing debt or taking on personal liability.
              </li>
              <li>IP assignment or non-competes are a deal-breaker to negotiate.</li>
              <li>
                You don&apos;t understand a clause, even after reading it twice.
              </li>
              <li>
                The other side is a much bigger company with more negotiating
                power.
              </li>
            </ul>

            <p className={styles.escalationText}>
              <strong>You can probably negotiate alone if:</strong>
            </p>
            <ul className={styles.list}>
              <li>It&apos;s a short-term contract (under 1 year).</li>
              <li>The money is straightforward.</li>
              <li>You&apos;re negotiating with someone you know and trust.</li>
              <li>The red flags are clear and you have leverage.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Resources & Further Reading</h2>
          <div className={styles.resources}>
            <div className={styles.resource}>
              <div className={styles.resourceTitle}>Contractual Law Basics</div>
              <p className={styles.resourceDesc}>
                Understanding offer, acceptance, consideration, and what makes a
                contract binding.{" "}
                <a
                  href="https://www.investopedia.com/terms/c/contract.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Investopedia: Contract Definition
                </a>
              </p>
            </div>

            <div className={styles.resource}>
              <div className={styles.resourceTitle}>
                Freelancer Contract Template
              </div>
              <p className={styles.resourceDesc}>
                A starting point for independent contractors. Modify, don&apos;t
                copy-paste. Use ReviewIt to check it before you send it.{" "}
                <a
                  href="https://www.freelancewritersden.com/freelance-contract/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Freelance Writers Den: Contract Template
                </a>
              </p>
            </div>

            <div className={styles.resource}>
              <div className={styles.resourceTitle}>Finding Affordable Legal Help</div>
              <p className={styles.resourceDesc}>
                When you need a real lawyer but don&apos;t have a corporate
                budget.{" "}
                <a
                  href="https://www.lawhelp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LawHelp.org
                </a>{" "}
                and{" "}
                <a
                  href="https://www.nolo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nolo
                </a>
              </p>
            </div>

            <div className={styles.resource}>
              <div className={styles.resourceTitle}>
                State-Specific Contract Laws
              </div>
              <p className={styles.resourceDesc}>
                Non-competes, IP assignment, and liability limits vary by state.
                Check your state&apos;s specific rules before signing.{" "}
                <a
                  href="https://www.nolo.com/legal-encyclopedia/non-compete-agreements-enforceability-by-state"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nolo: Non-Compete Laws by State
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>How ReviewIt Helps</h2>
          <p className={styles.description}>
            ReviewIt runs a contract through an AI contract analyst that
            automatically flags high-risk clauses, shows you the exact words from
            the contract, and suggests language for counter-offers. It&apos;s not
            legal advice—it&apos;s a fast way to know what you&apos;re signing and
            what to push back on before you reach out to a lawyer or the other
            side.
          </p>
        </section>
      </main>
    </>
  );
}
