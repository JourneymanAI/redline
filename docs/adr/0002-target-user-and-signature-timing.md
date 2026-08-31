# 2. v1 serves the repeat-signing small business, pre-signature

Status: Accepted — 2026-08-28

## Decision

Redline v1 is for **small-business owners and founders** who review inbound
vendor, customer, and contractor contracts (MSAs, SOWs, NDAs, SaaS terms) as a
recurring part of running the business. It analyses a contract **before it is
signed**: the question it answers is "should I sign this, and what do I push
back on?"

The default output assumes a **been-burned semi-professional** reader — someone
who knows what an indemnity clause or a liability cap is and wants a fast,
specific read on whether *this* one is unusual and how badly it cuts against
them. It does not teach basic legal vocabulary from scratch.

Explicitly **not served in v1**:

- **Freelancers.** The pain is real and visible, but willingness to pay
  ($10–$50) cannot support the product without an ad-funded or free-with-upsell
  model, which we are not building. This is a deliberate non-goal, not an
  omission — the brief must name it.
- **Renters and consumer terms-of-service.** Near-zero willingness to pay.
- **Post-signature review** ("what did I already agree to, what are my exits").
  A different product with a different output. Most of the pain in the research
  is here, and we are still walking away from it in v1.

## Alternatives

- **Employees reviewing a severance or offer letter.** Highest willingness to
  pay per document ($350–$1,000) with a built-in deadline, but a once-in-years
  event: no repeat use, so the document library and the red-lines list — half
  the committed feature set — are dead weight, and acquisition only works in the
  narrow window when the document lands.
- **Freelancers as primary.** Largest audience and sharpest pain, but unit
  economics are negative at OpenRouter analysis cost against $10–$50 WTP.
- **Serve pre- and post-signature both.** Two output modes and two pipelines in
  v1; splits focus before the core analysis is proven.
- **Design for the novice signer.** Broader appeal, but slower output and copy
  aimed at people who, per the research, are not the ones who pay.

## Why

The product already committed in `CLAUDE.md` — a document library, and an
editable red-lines list that *drives* the analysis — is a repeat-use product.
Only a user who signs contracts regularly builds a red-lines list worth having
or a library worth searching. The small-business owner is that user, is
underserved (incumbents target corporate legal teams; DoNotPay burned the
consumer segment), and pays enough to cover model cost. Pre-signature is where
that user has leverage and a reason to pay before the damage, and it is the only
framing in which the drafted-counter-offer feature makes sense.

## Consequences

- Retention, not single-session success, is the metric that matters: the
  red-lines list and library only accrue value with repeat use, so onboarding
  must get a user to their first real contract fast.
- The counter-offer feature is load-bearing, not optional — it is the
  pre-signature user's main reason to act.
- The Q&A box stays inside the pre-signature framing; "can I get out of this?"
  is an out-of-scope answer.
- Product copy and in-product explanations assume domain vocabulary. A
  glossary-level "what is indemnification" mode is a later decision, not a v1
  gap to apologise for.
