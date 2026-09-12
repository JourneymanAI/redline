# 12: Q&A module

**What to build:** Implement `answerFromDocument({ documentText, question })`
against the model boundary (test double for now): answers are grounded only
in the document text; when the document doesn't cover the question,
`addressed` is `false` and the answer says so plainly; where possible,
`groundedIn` points at the relevant text. Reject drift into post-signature
questions ("how do I get out"), staying inside pre-signature framing. Wire a
question box into the result screen.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] A question whose answer isn't in the fixture returns `addressed: false`
      and an answer stating the document doesn't address it, with no
      fabricated specifics
- [ ] A question answerable from the fixture returns `groundedIn` pointing at
      real fixture text
- [ ] A post-signature-framed question is declined/redirected rather than
      answered
- [ ] The result screen exposes a working question box wired to this seam
