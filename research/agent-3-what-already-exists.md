# Agent 3 — What Already Exists

Scope note: The contract-review market splits cleanly into two camps. (1) Enterprise / law-firm / in-house legal AI (Spellbook, LegalOn, LawGeex, Robin AI, Luminance, Kira, Ironclad, ContractPodAi, Lexion, Loio, ClauseBuddy) — priced per-seat in the thousands-to-tens-of-thousands per year, built around "playbooks" the customer configures, sold to people who already know contract law. (2) Consumer / prosumer explainers (ToS;DR, Detangle.ai, Genie AI free tier, DoNotPay, ad hoc ChatGPT/Claude) — cheap or free, aimed at non-lawyers, far thinner on the "ranked risky clauses + drafted counter-offer + doc-grounded Q&A" combination Redline proposes. Redline's hypothesis lives almost entirely in camp 2, which is sparsely populated and has a credibility problem (DoNotPay).

## Products

### Spellbook
- **What it does:** AI contract drafting and first-pass review inside Microsoft Word; suggests redlines, drafts clause language from "positions"/market data, and auto-enforces customer-defined playbooks.
- **Who it targets:** Enterprise legal and in-house counsel; law firms doing commercial work. Not consumer-facing.
- **Pricing:** Not public — custom quote based on team size, usage, and contract length. Third-party estimates: ~$20–40/user/mo entry, ~$179/user/mo mid-tier, enterprise higher. Anchored around annual per-seat contracts.
- **Most common complaint:** "The AI sometimes glitches and is prone to making mistakes, requiring vigilance to catch errors"; formatting inconsistency in output; custom (opaque) pricing and no full contract-lifecycle management. (Source: G2 reviews summary + Lawyerist review)
- **Source URL(s):** https://www.g2.com/products/spellbook/reviews ; https://www.hyperstart.com/blog/spellbook-pricing/ ; https://lawyerist.com/reviews/artificial-intelligence-in-law-firms/spellbook-review-artificial-intelligence-for-lawyers/

### LegalOn (LegalOn Technologies)
- **What it does:** AI contract review in Word against pre-built, attorney-vetted playbooks; flags deviations, suggests approved alternative language, plus an AI assistant.
- **Who it targets:** In-house legal teams (esp. small in-house teams); enterprise legal. Has an "Individual" plan aimed at solo attorneys, still priced at law-firm levels.
- **Pricing:** Individual plan $550/month (unlimited reviews, AI assistant, full playbooks). Legal-team / enterprise is per-seat via sales; third-party estimates $30,000–$100,000+/year.
- **Most common complaint:** No way to have the AI reference more than one document at once, even though real customer contracts often span multiple documents (MSA + order form + exhibits). (Source: G2 reviews summary)
- **Source URL(s):** https://www.g2.com/products/legalon/reviews ; https://spellbook.com/learn/legalon-pricing ; https://softwarefinder.com/legal/legalon-ai-review

### LawGeex
- **What it does:** Automated pre-signature contract review against pre-configured legal policies; flags policy deviations and offers approved fallback language. Targets the first-pass review before human negotiation. Independently benchmarked at ~92% accuracy on NDAs/standard commercial contracts.
- **Who it targets:** Enterprise legal (F1000 — cited customers eBay, HP). No consumer or freelancer offering.
- **Pricing:** Not public — no free plan, demo on request. Third-party estimates: several thousand USD/year for midsize teams, $30K+/year typical enterprise implementation.
- **Most common complaint:** Heavy upfront configuration burden — "requires significant upfront effort to configure policies," review quality depends entirely on that config, and it is "not useful as a standalone tool without policy setup." (Source: Simular.ai tested roundup)
- **Source URL(s):** https://www.simular.ai/alternatives/ai-contract-review-tools ; https://www.capterra.com/p/170181/LawGeex/ ; https://www.lawgeex.com/

### Robin AI
- **What it does:** AI contract review, drafting, and negotiation assistant (Word add-in + platform); summarizes contracts, flags key risks, suggests edits, improves consistency. Described by users as "a skilled paralegal."
- **Who it targets:** Mostly small-business and mid-market legal teams (G2: ~72% small-business reviewers), scaling to enterprise.
- **Pricing:** Freemium entry; report/low tier reported near $5,000/year; typical annual deals ~$30,000–$50,000; large enterprise $40,000–$80,000. (Third-party estimates; not officially published.)
- **Most common complaint:** "It often misunderstands the phrasing of legal theory" — accuracy concerns on nuanced legal language. (Source: G2 reviews / pros-and-cons)
- **Source URL(s):** https://www.g2.com/products/robin-2025-07-08/reviews ; https://www.g2.com/products/robin-2025-07-08/reviews?qs=pros-and-cons ; https://juro.com/alternatives/robin-ai

### Genie AI
- **What it does:** AI legal assistant for drafting, reviewing, and negotiating contracts; 500+ templates, docx editor, PDF import, AI Q&A, and a "risk review" document that flags loopholes and suggests stronger clause wording. Has a genuinely usable free tier.
- **Who it targets:** Individuals, founders, and small teams without in-house legal — closest of the paid tools to Redline's target. Also sells up to enterprise.
- **Pricing:** Free plan $0/mo (full AI Document Toolkit, Q&A, review/editing, 500+ templates, no card required). Pro $75/mo (unlimited docs, 1M AI tokens, multi-doc "Legal Brain," playbooks). Enterprise from $600/mo.
- **Most common complaint:** From reviews — "a little costly for startups to afford" and "free trials are severely limited" once you move past the base free toolkit; some reviewers want more depth. (Source: Trustpilot / G2 / Capterra review summaries)
- **Source URL(s):** https://www.genieai.co/pricing ; https://www.trustpilot.com/review/genieai.co ; https://www.g2.com/products/genieai/reviews ; https://www.capterra.com/p/10003121/Genie-AI/reviews/

### Detangle.ai
- **What it does:** AI that produces a 1–2 paragraph plain-English summary of any legal document, plus a "Favor Scale" showing which party the agreement favors, and highlights of important clauses / potential issues. Explicitly a comprehension aid, not advice. This is the single closest analog to Redline's "tell me what I'm signing" core — but it stops at summary + favor score; no ranked-by-severity clause list with source sentence, no drafted counter-offers, no document-grounded Q&A box.
- **Who it targets:** Individuals / non-lawyers — job seekers reviewing an employment contract, consumers reviewing terms, small business. Explicitly consumer-facing.
- **Pricing:** Pay-per-document, no subscription: roughly $19–$199 per document depending on document length; all features included at every tier. (Source: AI Review Guys review; not confirmed on Detangle's own site — see "What I could not find.")
- **Most common complaint:** Reviewers stress it "doesn't replace legal advice entirely" and that unclear or incomplete uploaded documents produce inaccurate analysis. Thin independent review corpus overall (no G2/Capterra/Trustpilot presence found) — hard to gauge real user sentiment. (Source: AI Review Guys)
- **Source URL(s):** https://aireviewguys.com/detangle-ai-review/ ; https://aitoptools.com/tool/detangle-ai/ ; https://serp.ai/products/detangle.ai/reviews/

### DoNotPay ("robot lawyer")
- **What it does:** Consumer subscription chatbot marketed to "sue anyone," generate legal documents, cancel subscriptions, fight fees, and — among many features — analyze/handle agreements. Positioned as an AI substitute for a lawyer.
- **Who it targets:** Consumers. Exactly Redline's demographic — which makes its regulatory history a cautionary tale for any consumer legal-AI product.
- **Pricing:** Consumer subscription historically ~$36 billed every 2 months (~$18/mo equivalent); the FTC matter covers subscribers from 2021–2023.
- **Most common complaint:** Regulatory, not review-driven: the FTC charged that the "AI lawyer" did not perform like a human lawyer, was never tested against one, and used no attorneys to check accuracy. Finalized Feb 2025 — DoNotPay pays $193,000, is barred from unsubstantiated "AI lawyer" claims, and must notify past subscribers. Separately settled a class action alleging it "is not actually a robot, a lawyer, nor a law firm."
- **Source URL(s):** https://www.ftc.gov/news-events/news/press-releases/2025/02/ftc-finalizes-order-donotpay-prohibits-deceptive-ai-lawyer-claims-imposes-monetary-relief-requires ; https://www.abajournal.com/news/article/robot-lawyer-website-donotpay-settles-ftc-claims-it-couldnt-deliver-on-promises

### Terms of Service; Didn't Read (ToS;DR — tosdr.org)
- **What it does:** Community/volunteer project that reads the Terms of Service and privacy policies of major websites and grades them A (best) to E (worst), with plain-language "points" tagged positive / negative / blocker / neutral. Delivered via website and a browser extension (Chrome, Edge, Safari, Firefox, Opera) that shows the grade in the toolbar and warns on first visit to a badly rated site. Free and open source.
- **Who it targets:** Consumers / general web users. Adjacent to Redline's "what am I agreeing to" promise, but only for a fixed catalog of well-known online services — not arbitrary contracts, leases, or freelance agreements a user uploads.
- **Pricing:** Free (donation-funded, volunteer-curated).
- **Most common complaint:** Structural, not a review complaint: coverage is limited to services volunteers have curated, ratings can lag current terms, and many sites show no rating at all. No per-document / upload-your-own capability. (Source: Wikipedia overview; GitHub project)
- **Source URL(s):** https://en.wikipedia.org/wiki/Terms_of_Service;_Didn%27t_Read ; https://github.com/tosdr/browser-extensions ; https://tosdr.org

### Ad hoc ChatGPT / Claude (general-purpose LLM, no legal wrapper)
- **What it does:** Users paste or upload a contract/lease/TOS and ask for a summary, risk flags, or negotiation points. This is the de facto default tool for Redline's target user today and the real competitor to beat — zero cost, already in hand.
- **Who it targets:** Everyone; disproportionately freelancers and consumers who will not pay a lawyer.
- **Pricing:** Free tier, or ~$20/mo for ChatGPT Plus / Claude Pro.
- **Most common complaint:** (a) Hallucination — confident, plausible, wrong output, not solved by newer models; (b) confidentiality — uploading a client contract to a third-party model can itself breach a confidentiality clause, "a real and immediate concern for freelancers"; (c) no legal playbook / no grounding, so accuracy is unreliable without specialized setup. Consensus in legal-industry commentary: fine for a first-pass read or plain-English summary, not for reliance.
- **Source URL(s):** https://www.legartis.ai/blog/claude-ai-contract-review ; https://theceolegalloft.com/can-chatgpt-review-my-contract/ ; https://www.ookulli.com/blog/can-i-use-ai

## Where the existing tools are weak (patterns across complaints)

1. **Accuracy / hallucination is the #1 complaint at every tier.** Spellbook "glitches and makes mistakes," Robin AI "misunderstands legal phrasing," raw ChatGPT/Claude hallucinate, DoNotPay was penalized by the FTC for it. Nobody has solved "trust the output without a lawyer checking it." Any consumer tool must over-invest in citing the exact source sentence (which Redline's hypothesis does) and in honest confidence signaling.
2. **The enterprise tools are gated behind playbook configuration.** LawGeex, LegalOn, Spellbook all require the customer to encode their negotiating positions first. A consumer/freelancer has no playbook and no time to build one — so these tools are structurally unavailable to Redline's user even if price were no object.
3. **Opaque, high pricing.** Spellbook, LawGeex, Robin AI, LegalOn enterprise = "contact sales," real numbers $5K–$100K/year. Even the "individual" options (LegalOn $550/mo, Genie Pro $75/mo) are priced for someone billing clients, not someone signing one lease.
4. **Multi-document blindness.** LegalOn specifically criticized for not reading MSA + order form + exhibits together. Redline should assume a "contract" is often a bundle.
5. **Summary without action.** Detangle.ai and ToS;DR tell you the deal is bad but don't hand you language to fix it. The drafted counter-offer per clause is a genuine gap in the consumer-facing set.
6. **Credibility / regulatory risk for consumer legal AI.** DoNotPay is the cautionary precedent: overclaiming "replaces a lawyer" invites FTC action. Redline's framing ("tells you what you're signing," not "legal advice") is the safer lane, and disclaimers/scope limits are a product requirement, not a footnote.
7. **Thin, un-vetted consumer options.** The genuinely consumer-priced tools (Detangle.ai) have almost no independent review footprint — no G2/Capterra/Trustpilot presence — so users have little basis for trust.

## Whitespace relevant to Redline's hypothesis (consumer/freelancer-facing, cheap, explain-what-I'm-signing)

- **No single tool bundles all four of Redline's pillars for a non-lawyer:** (1) plain-English summary, (2) risky clauses ranked by severity *with the exact source sentence*, (3) a drafted counter-offer per clause, (4) a Q&A box answering only from the document. Detangle.ai does ~1 and part of 2. Genie AI's risk-review does part of 2 and 3 but is priced/positioned for founders. ToS;DR does a fixed-catalog version of 1. The combination is open.
- **Price point is unoccupied.** Between "free but generic/unreliable" (ChatGPT) and "$75–$550/mo" (Genie Pro, LegalOn Individual) there is room for a per-document or low monthly consumer price (Detangle's $19–$199/doc is the only comparable, and it's barely marketed).
- **Document-grounded Q&A ("answer only from this document") is essentially absent** from the consumer-facing set and directly attacks the hallucination complaint that plagues every incumbent.
- **"Exact source sentence" citation as a trust mechanism** is under-used even in enterprise tools and would be a differentiator for a skeptical consumer audience.
- **Specific under-served signer segments:** tenants reviewing residential leases, freelancers reviewing client MSAs/SOWs, small businesses signing vendor SaaS terms. The incumbents explicitly target corporate legal; DoNotPay burned consumer trust; nobody owns "the person about to sign."
- **Counter-offer drafting for individuals** — turning "this clause is bad" into "paste this instead" — is offered by enterprise redlining tools but not in a cheap consumer package.

## What I could not find

- **Confirmed first-party pricing for Detangle.ai.** The $19–$199-per-document figure comes from a third-party review (aireviewguys.com); detangle.ai returned HTTP 403 to automated fetch and I did not verify tiers on the vendor site.
- **Real published pricing for Spellbook, LawGeex, Robin AI, and LegalOn enterprise.** All are "contact sales." Every dollar figure for these is a third-party estimate (hyperstart, spellbook.com/learn, simular.ai, juro.com), not vendor-confirmed, and ranges are wide.
- **Current DoNotPay subscription price** (the ~$36/2-months figure is from the FTC-era coverage; today's pricing not verified).
- **Did not profile (budget cap reached at 8+ findings):** Luminance, Kira Systems (now Litera), Ironclad, ContractPodAi, Lexion (acquired by Docusign), Loio, ClauseBuddy, Rocket Lawyer / LegalZoom attorney-review add-ons. All are enterprise or law-firm oriented except Rocket Lawyer/LegalZoom, which offer human-attorney review as a paid add-on rather than AI clause analysis — worth a dedicated look in a follow-up as the "human alternative" price anchor for consumers.
- **App-store review sentiment** for any consumer mobile app in this space — none of these tools surfaced a notable iOS/Android app with a review corpus.
- **Direct Reddit threads** from freelancers/tenants describing their current workaround — search surfaced legal-industry blog commentary rather than first-person user threads.

## Search log

Web searches (9 of 12 cap):
1. "Spellbook contract review AI pricing G2 reviews complaints"
2. "LegalOn contract review software pricing reviews complaints"
3. "DoNotPay contract analyze lawsuit FTC complaints reviews"
4. "Genie AI contract review free pricing reviews Trustpilot"
5. "\"Terms of Service Didn't Read\" tosdr.org how it works browser extension"
6. "Detangle.ai contract summary consumer pricing review"
7. "LawGeex AI contract review pricing enterprise complaints reviews"
8. "Robin AI contract review pricing G2 reviews complaints"
9. "Reddit using ChatGPT or Claude to review lease or freelance contract risks"

Pages read (2 of 15 cap; 1 additional fetch failed):
1. https://detangle.ai — attempted, HTTP 403 Forbidden (not read)
2. https://aireviewguys.com/detangle-ai-review/ — read: Detangle pricing ($19–$199/document, no subscription) and criticisms
(Remaining product/pricing/complaint detail drawn from the search-result summaries above, each carrying its own source URL.)
