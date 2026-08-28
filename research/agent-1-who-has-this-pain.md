# Agent 1 — Who Has This Pain

Scope note: Reddit was fully inaccessible to my fetch tool (every reddit.com / old.reddit.com
fetch returned "unable to fetch"), and Avvo / Justia blocked fetches with HTTP 403. Where I could
not read a full thread body, I have used the poster's own verbatim question title (Avvo/Justia) or
verbatim forum-comment text captured via the Hacker News Algolia API. Findings that rest on
secondary reporting rather than a first-person quote are labeled as such.

## Findings

### Finding 1: Engineer asked to sign a 12-month non-compete covering an entire industry
- **Verbatim quote:** "I'm supposed to sign a non-compete that effectively covers all software development/data engineering/AI/devops (and probably much more) for any company in or job serving the financial industry for 12 months." ... "I'm mostly worried about other employers being scared off."
- **Who / context:** A tech employee (username "Newnqsecret") posting on Blind about a non-compete they were being required to sign; worried it would make them effectively unemployable in their sector.
- **Clause / term involved:** Non-compete (overbroad scope + 12-month duration).
- **Source URL:** https://www.teamblind.com/post/asked-to-sign-a-broad-non-compete-in-ny-s0ydaw27
- **Date / recency:** Dec 2, 2019

### Finding 2: Developer signed a very broad IP-assignment clause "unchallenged" under job-loss pressure
- **Verbatim quote:** "Yeah my contract is very wide in my opinion, given there is always some level of overlap when developing software. Unfortunaly I signed it unchallenged when needing employment during the pandemic :("
- **Who / context:** A software developer (HN user "jackfruit2") in a Hacker News thread about IP-assignment / invention-assignment clauses, expressing regret about not negotiating.
- **Clause / term involved:** IP / invention assignment (broad "anything you create" language).
- **Source URL:** https://news.ycombinator.com/item?id=32875425
- **Date / recency:** Sept 2022 (HN comment 32875425)

### Finding 3: Consumers discover a forced-arbitration / class-action waiver clause only after they are harmed
- **Verbatim quote:** "Except when a theme park ride malfunctions, maims and kills most of a family in a gruesome fashion. Of course then you cannot sue because you've agreed/signed an arbitration clause in the terms of service."
- **Who / context:** HN commenter "daemin" describing how a mandatory-arbitration clause hidden in a terms-of-service agreement (the reference is to the Disney/Disney+ wrongful-death arbitration controversy) strips consumers of the right to sue.
- **Clause / term involved:** Mandatory binding arbitration + class-action waiver in ToS / EULA.
- **Source URL:** https://news.ycombinator.com/item?id=26063535
- **Date / recency:** Feb 2021 (HN comment 26063535)
- **Supporting (secondary, fetch-tool paraphrase — not verbatim):** Same searches surfaced HN comments describing (a) Star Citizen "retroactively" applying a forced-arbitration clause to purchases made before the clause existed (user "gwern", https://news.ycombinator.com/item?id=39674234), (b) Roku bricking devices until users accepted new arbitration terms with only a 30-day mail-in opt-out (user "enragedcacti", https://news.ycombinator.com/item?id=26115168), and (c) SiriusXM imposing binding arbitration on trial subscriptions users say they never knowingly started (user "plorg", same thread).

### Finding 4: Gym / subscription members trapped by auto-renewal + "cancel only in person or by certified mail"
- **Verbatim quote:** "I've never had a gym membership that, by default, could be canceled via letter/fax/phone call."
- **Who / context:** HN commenter "ghshephard" describing the standard gym-contract pattern where auto-renewal is automatic but cancellation is deliberately hard, so members who miss the anniversary date get billed for another term. A second commenter in gym-contract threads ("joering2") calls membership-billing processors (ABC Financial) "a cancer on our society" for how hard they make cancellation.
- **Clause / term involved:** Auto-renewal / evergreen clause + restrictive cancellation method + minimum-term.
- **Source URL:** https://news.ycombinator.com/item?id=4436392 (ghshephard); https://news.ycombinator.com/item?id=17468970 (joering2)
- **Date / recency:** 2012 (4436392) and 2018 (17468970)
- **Supporting (secondary reporting — not an individual quote):** Search results describe an LA Fitness matter where the chain allegedly made cancellation "exceedingly hard" — in person or certified mail only, hiding cancellation forms, continuing to bill after banks blocked charges (https://www.signerbeware.com/auto-renewal-subscription-traps/ ; https://www.terms.law/2025/08/25/gym-coaching-and-subscription-scam-demand-letters-getting-out-of-predatory-contracts/).

### Finding 5: Tenants who missed a lease notice window and got auto-renewed or billed extra rent
- **Verbatim quotes (posters' own question titles on legal Q&A boards):**
  - "I forgot to give my landlord a 60 days notice? What should I do?"
  - "Lease i signed states 60 days notice required to move out. But i was informed of rent increase only 15 days before my lease ends"
  - "In Ohio, failure to give Tenant notice 60 days prior result in having to pay for another month?"
  - "Can I get out of the auto-renewed lease?"
- **Who / context:** Individual renters asking lawyers on Avvo and Justia Ask-A-Lawyer after a lease auto-renewal / notice-period clause bound them past their intended move-out. (Full question bodies were not retrievable — Avvo/Justia returned HTTP 403 — but the titles are the askers' own words.)
- **Clause / term involved:** Auto-renewal / evergreen lease clause + 60-day written-notice requirement; asymmetric notice for rent increases.
- **Source URL:** https://www.avvo.com/legal-answers/i-forgot-to-give-my-landlord-a-60-days-notice-what-1590989.html ; https://www.avvo.com/legal-answers/lease-i-signed-states-60-days-notice-required-to-m-2360366.html ; https://answers.justia.com/question/2024/04/05/in-ohio-failure-to-give-tenant-notice-60-1009210 ; https://www.avvo.com/legal-answers/can-i-get-out-of-the-auto-renewed-lease--1031131.html
- **Date / recency:** Justia question dated 2024-04-05; Avvo question dates not visible in results.

### Finding 6: Roommates on the hook for each other's rent/damage because they didn't understand "joint and several liability"
- **Verbatim quote (housing-counselor characterization of the recurring complaint, not a single tenant):** "A lot of tenants don't really understand joint and several liability." / "The landlord can pursue any or all tenants named on the lease for the full cost of repairs or damages ... even if that tenant wasn't responsible according to internal roommate agreements."
- **Who / context:** Tenant-resource / landlord-tenant education sites (Tenant Resource Center, Boston Pads, Nolo) describing the recurring pattern of renters who sign a shared lease, a roommate leaves or fails to pay, and the remaining tenant is legally liable for 100% of rent. I did not locate an individual first-person forum post with a quotable account (Reddit blocked).
- **Clause / term involved:** Joint and several liability clause in a multi-tenant lease.
- **Source URL:** https://www.tenantresourcecenter.org/joint_and_several_liability ; https://www.nolo.com/legal-encyclopedia/legal-liabilities-risks-of-sharing-apartment-house-with-roommates.html ; https://bostonpads.com/joint-and-several-liability/
- **Date / recency:** Not dated (evergreen resource pages), accessed Aug 2026.

### Finding 7: Small businesses locked into another year of a vendor/SaaS contract after missing the cancellation notice window
- **Verbatim quote (regulator, summarizing complaints it receives — not a single business owner):** "The Commission is increasingly hearing from small businesses locked into unwanted subscription-based services contracts." Vendor-contract advisories add: "Miss the window and you're locked in ... a missed 30-day notice window on a $50K contract means you're locked in for another year at whatever the vendor decides to charge."
- **Who / context:** Canada's Competition Bureau consumer alert plus B2B contract-management vendors describing the recurring small-business complaint: each vendor contract has its own auto-renewal date and 30-to-90-day notice period buried in the fine print, and missing one rolls the contract over. No individual first-person forum post captured (Reddit r/smallbusiness inaccessible).
- **Clause / term involved:** Auto-renewal / evergreen clause + advance-written-notice-to-cancel window in B2B service contracts.
- **Source URL:** https://www.canada.ca/en/competition-bureau/news/2018/04/what-you-dont-know-about-contracts-could-hurt-your-business.html ; https://liabilityscore.com/blog/vendor-contract-red-flags ; https://www.brm.ai/blog/the-hidden-risks-of-auto-renewals
- **Date / recency:** Competition Bureau alert 2018; vendor blogs undated, accessed Aug 2026.

### Finding 8: Freelancers who sign whatever the client sends without reading it, then get bitten
- **Verbatim quote:** "[I] signed whatever contracts clients sent me without really paying attention, hoping that every contract would lead to more (and higher-paying) work."
- **Who / context:** A freelancer quoted in a compilation of freelancer accounts about contract mistakes. The same body of freelance-contract writing repeatedly flags two clauses freelancers "skip most often and regret most frequently": the termination/kill-fee clause and "unlimited revisions." One cited example: "A freelancer on r/freelancing described working a single project for weeks because the client kept requesting small changes" under an unlimited-revisions clause. (I could not open the underlying Reddit thread to quote it directly.)
- **Clause / term involved:** Non-compete in client agreements; "unlimited revisions" / "revisions until client is satisfied"; missing kill-fee / termination clause.
- **Source URL:** https://blog.zoho.com/index.php/sign/blog/why-you-need-to-have-a-freelance-contract-agreement.html ; https://www.sitepoint.com/clauses-to-include-in-freelance-contract/ ; https://www.workcontractreview.com/blog/freelance-contract-red-flags
- **Date / recency:** Not clearly dated; accessed Aug 2026.

## What I could not find

- **No direct Reddit access at all.** Every fetch of reddit.com and old.reddit.com failed, and the
  US-only web-search tool would not return quotable body text from r/legaladvice, r/freelance,
  r/smallbusiness, r/personalfinance, r/Tenant, or r/LegalAdviceUK. The strongest first-person
  material almost certainly lives there and is not represented here in raw form.
- **Avvo and Justia bodies were blocked (HTTP 403).** I have real tenants' question *titles* with
  URLs and (for one) a date, but not the full narratives or the lawyers' answers.
- **No verbatim first-person quote captured for:** joint-and-several-liability harm (Finding 6),
  small-business vendor lock-in (Finding 7), or a freelancer describing a specific IP/non-compete
  lawsuit. Those findings rest on regulator summaries, education sites, or advisory content.
- **Twitter/X, Quora, and Blind beyond one thread:** not searched deeply — Blind returned only the
  single non-compete thread; X and Quora were not reachable within the search budget.
- **Open questions for later agents:** (1) How often do people say they *did* read the contract but
  didn't understand the clause, vs. never read it? (2) Which clause type generates the most acute,
  specific pain stories — arbitration, auto-renewal, non-compete, or IP assignment? Current evidence
  is spread thin across all four. (3) Dollar figures: almost none of the sources quantify what the
  missed clause actually cost the person.

## Search log

Web searches (10 of 12 budget used):
1. `reddit freelance "didn't read the contract" non-compete OR IP assignment clause burned`
2. `reddit lease auto-renewal clause "didn't notice" stuck another year`
3. `site:reddit.com r/legaladvice signed lease early termination fee "didn't realize"`
4. `site:reddit.com freelance non-compete "signed" regret "should have read"`
5. `tenant "joint and several liability" lease roommate left "on the hook" didn't understand`
6. `"auto-renewal" gym OR software OR service contract "buried in the fine print" charged consumer complaint`
7. `reddit smallbusiness "signed a contract" vendor auto-renew "locked in" "should have read the fine print"`
8. `tenant question "I signed the lease" "60 days notice" auto renewed now owe rent avvo OR justia`
9. `reddit r/Tenant "auto renewal clause" lease trapped another year "wish I had read"`
10. `freelancer "kill fee" OR "unlimited revisions" contract clause regret "I didn't catch"`

Pages fetched (15 of 15 budget used; several failed):
1. https://www.reddit.com/r/freelance/search/... — FAILED (unable to fetch)
2. https://www.reddit.com/r/legaladvice/search/... — FAILED (unable to fetch)
3. https://old.reddit.com/r/freelance/search/... — FAILED (unable to fetch)
4. https://www.teamblind.com/post/asked-to-sign-a-broad-non-compete-in-ny-s0ydaw27 — OK (Finding 1)
5. https://hn.algolia.com/api/v1/search?query=non-compete signed contract trapped&tags=comment — OK (MA garden-leave comment; not used)
6. https://hn.algolia.com/api/v1/search?query=contract auto-renew didn't read&tags=comment — OK (domain auto-renew comment 13667888; minor)
7. https://hn.algolia.com/api/v1/search?query=freelance contract IP assignment clause&tags=comment — OK (Finding 2, comment 32875425)
8. https://hn.algolia.com/api/v1/search?query=lease clause landlord security deposit surprise&tags=comment — OK but 0 hits
9. https://hn.algolia.com/api/v1/search?query=terms of service arbitration clause agreed&tags=comment — OK (Finding 3, comments 26063535 / 39674234 / 26115168)
10. https://hn.algolia.com/api/v1/search?query=gym membership cancel contract clause&tags=comment — OK (Finding 4, comments 4436392 / 17468970)
11. https://answers.justia.com/question/2024/04/05/in-ohio-failure-to-give-tenant-notice-60-1009210 — FAILED (HTTP 403)
12. https://www.avvo.com/legal-answers/i-forgot-to-give-my-landlord-a-60-days-notice-what-1590989.html — FAILED (HTTP 403)
13. https://hn.algolia.com/api/v1/search?query=SaaS contract auto-renew notice period locked in&tags=comment — OK but 0 hits
14. https://hn.algolia.com/api/v1/search?query=apartment lease early termination fee trapped&tags=comment — OK but 0 hits
15. https://hn.algolia.com/api/v1/search?query=non-compete clause sued quit job&tags=comment — OK but 0 hits
