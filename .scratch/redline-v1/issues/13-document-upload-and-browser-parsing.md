# 13: Document upload & browser-side parsing

**What to build:** Convert an uploaded PDF or DOCX to text entirely in the
browser — the file itself is never sent to the server or stored. Show the
signer the extracted text before analysis runs so they can confirm or fix it.
Support pasting several related documents together as one text. Display the
standing notice that Redline reads only the text it's given, not attachments
or documents referenced but not pasted.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Uploading a PDF or DOCX produces extracted text shown to the signer
      before analysis starts, with no network request carrying the original
      file
- [ ] The signer can edit the extracted text before running analysis
- [ ] Multiple pasted documents can be combined into one analysis
- [ ] The "reads only what you gave it" notice is shown
- [ ] Unit tests cover PDF and DOCX parsing against known-input fixtures
