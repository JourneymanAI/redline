# 1. Every flag cites its source sentence

Status: Accepted — 2026-08-28

## Decision

Every risk flag Redline produces carries the exact sentence from the uploaded
document it is based on, shown verbatim beside the flag. If the pipeline cannot
attach a real source sentence, the flag is a bug and is withheld — not shown
unquoted, not shown with an approximate reference.

## Alternatives

- Let the model describe each risk in its own words, quoting nothing. Simplest,
  reads well, but no line of the output can be checked against the contract.
- Cite by location only (page, section, "paragraph 12"). Cheaper, but the reader
  still has to find and read the text, and locators drift on re-parse.
- Quote a paraphrase or a wide range. Looks like a citation without being one;
  lets the model smooth over what the contract actually says.

## Why

The output is only worth something if the reader can trust it without a lawyer.
A verbatim quote lets them check it on the spot: read the sentence, judge whether
our reading is fair, forward it to someone else unchanged. It also bounds the
model — a claim with no supporting sentence in the document cannot be dressed up
as a finding. This is the wedge the free-LLM and cheap-summary tools do not give.

## Consequences

- Parsing must preserve sentence boundaries, exact characters, and a stable
  offset into the stored text. Character-changing cleanup is out (so is OCR).
- The analysis step returns a source span per flag; a verification step confirms
  each span exists verbatim in the stored text before anything renders.
- Tests assert the quoted text is a substring of the document — "a flag was
  produced" is not a passing test.
- Flags that cannot be grounded are dropped, so recall can suffer; that is the
  accepted price of zero un-checkable claims.
- Counter-offers and the question box inherit the rule: they cite document text too.
