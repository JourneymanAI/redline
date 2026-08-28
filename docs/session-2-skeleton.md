# Session 2 — the skeleton (1 page)

**Build the harness and the brief. No product code.**
Harness = an environment where an agent can build *unattended*: safe (every change
reversible) and repeatable (bound by written rules it reads on its own).
Brief = what to build and how you'll know it's good — with decisions in it.
Research runs in parallel the whole time. Code starts Session 4.

---

## The flow

| # | Step | Produces | Why in one line |
|---|---|---|---|
| 0 | Verify the tooling works | confidence | fail fast, while there's time to fix it |
| 1 | Bounded, sourced research agents, in parallel | `research/*` + `summary.md` (disconfirming section first) | idea is a hypothesis; caps force convergence; no source, no finding |
| 2 | Version control + remote, immediately | repo, `.gitignore` before first commit, pushed URL | reversibility is what makes unattended building sane |
| 3 | Standing-instructions file (`CLAUDE.md`) | settled decisions, scope boundary, rules, file pointers | unwatched builds drift; length lowers rule-following, so keep it minimal |
| 4 | First constraining decision as an ADR | `docs/adr/0001` — Decision / Alternatives / Why / Consequences | repo memory travels; one honest Consequences section rules out several later calls |
| 5 | Adopt tooling on need, configure to a shared baseline | installed packs, agent config, hand-written commit msg | plugins load every session; install when needed, not when first heard |
| 6 | Codify a twice-done process as a skill | `~/.claude/skills/<name>/` + an eval | the description *is* the trigger; "check before it writes" makes it portable |
| 7 | Read disconfirming research first, then interview yourself into a brief | `PRD.md`, `CONTEXT.md` | a model's brief decides nothing; a PM's names losers; "what good looks like" becomes the eval suite |
| 8 | Carry forward | spec, 2nd skill, product API key | brief→spec is mechanical; a subscription is for you, an API key is for your product |

---

## Principles to carry to any build

- Harness before product — build the conditions for building, not the thing.
- Reversibility is the licence to delegate.
- Every line must earn its place — cut what wouldn't change the build if removed.
- Context length has a correctness cost, not just a token cost — point at files, don't paste them.
- Repo memory (project must remember) vs. auto-memory (how you work).
- Hook = must happen every time, deterministic. Skill = needs judgement. Don't swap them.
- Read what contradicts you before what flatters you.
- A brief with no losers is a model's brief.
- Commit messages carry the why; the diff already shows the what.

---

**Walk out with:** pushed repo + harness (`CLAUDE.md`, ADR, agent config, one skill) +
brief (`PRD.md` with testable success criteria) + research (`summary.md`).
Laptop dies overnight → nothing lost.

*Expanded version with the full "why" per step: `session-2-distilled.md`.*
