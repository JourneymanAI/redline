# 15: Red-lines editor & durable storage

**What to build:** A durable, editable red-lines list per signer, backed by
the persistence from ticket 01 and feeding the effect built in ticket 11. A
signer can add, edit, or remove red lines at any time. A first-time signer
with none can still run a full analysis, with a light (non-blocking) prompt to
add some.

**Blocked by:** 11, 01

**Status:** ready-for-agent

- [ ] Red lines persist to the signer's account and survive a reload
- [ ] Add/edit/remove all work from the editor UI
- [ ] A signer with zero red lines gets a complete analysis plus a light
      prompt, never a block
