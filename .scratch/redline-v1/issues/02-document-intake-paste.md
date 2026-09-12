# 02: Document intake (paste)

**New 2026-09-11**, split out of what was ticket 02 ("walking skeleton"), so
this repo's ticket graph matches this course's prescribed check (Session 3):
"a document has to be parsed before anything can read it," as its own ticket
independent of and parallel to Auth (01) — neither blocks the other.

**What to build:** A signer pastes contract text into a text box. Support
combining several pasted documents into one text. Validate the pasted text is
non-empty and prepare it as the single `documentText` string every downstream
seam (`analyzeContract()`, `answerFromDocument()`) consumes. Display the
standing notice that Redline reads only the text it's given, not attachments
or documents referenced but not pasted. No analysis runs here — this ticket
only gets text ready to be analyzed.

**Blocked by:** None

**Status:** ready-for-agent

- [ ] A signer can paste text into a box and it's captured as `documentText`
- [ ] Multiple pasted documents can be combined into one `documentText`
- [ ] Pasting nothing (or whitespace only) is rejected before any downstream
      call, with a clear message
- [ ] The "reads only what you gave it" notice is shown
