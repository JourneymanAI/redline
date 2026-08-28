# Session 2, distilled — the shape under the script

The student handbook is an execution script: every command, in run order. This doc pulls
the *shape* out of it — what each step is for, what it produces, and why it's done that
way — written so it transfers to any build, not just Redline. The Redline handbook is the
worked example in the right-hand column.

---

## The one-sentence shape

**Session 2 builds two things and zero product code:**

1. **The harness** — the environment that makes an AI agent building *unattended* both
   *safe* (every change reversible) and *repeatable* (the agent is bound by written rules
   it reads on its own).
2. **The brief** — the document that says what to build and how you'll know it's any good,
   with actual decisions in it.

Evidence-gathering runs the whole time in a separate window. Product code starts in
Session 4. You spend this session making it safe and worthwhile to let the machine build
later.

**What you walk out with:** a pushed repo + a harness (`CLAUDE.md`, one ADR, agent config,
one custom skill) + a brief (`PRD.md` with a testable "what good looks like") + research
(`summary.md`). If the laptop dies overnight, you've lost nothing.

---

## The skeleton — the generalized flow

Eight steps. Each is **Goal / Produces / Why**, then the Redline instance.

### 0 — Verify the tooling before you depend on it
- **Goal:** know your environment actually works before anything rides on it.
- **Produces:** nothing but confidence (and an early cry for help if it's broken).
- **Why:** a tool that fails halfway through a build costs you the build. Failing on
  minute one, while there's still time and people around to fix it, costs you nothing.
- **Redline:** run `claude`, confirm it starts and you're logged in, `/exit`. If it
  doesn't start, post in the thread immediately instead of waiting.

### 1 — Launch bounded, sourced research agents in parallel
- **Goal:** anchor the idea in real evidence before you commit to a solution.
- **Produces:** one file per agent under `research/`, then a `summary.md` whose first
  section is *what contradicts the hypothesis*.
- **Why:**
  - A product idea is a *shape*, a hypothesis — not a validated product. You write the
    brief against evidence, not against your own assumption.
  - **Bounds force convergence.** Hard caps (e.g. 12 searches, 15 pages, stop at 8 sourced
    findings) stop an agent from spiralling. "More is not better" is stated outright.
  - **Sourced or dropped.** Every finding carries a URL. No source, no finding. No
    speculating to fill gaps — the agent says what it couldn't find.
  - **Isolated outputs.** Each agent writes only to its own file, no code, no shared
    state — so nothing contaminates anything else and you can run them at once.
  - **Parallel fits the time box.** Four agents at once finish inside the session; one at
    a time is the fallback when the parallel run stalls.
- **Redline:** four agents on Sonnet — who has this pain / what clause types burn people /
  what already exists / who would pay — then `research/summary.md`, ending with "anything
  that contradicts my hypothesis; if the evidence doesn't support building this, say so."

### 2 — Put it under version control and a remote, immediately
- **Goal:** make every later change reversible, and produce a deliverable in its own right.
- **Produces:** a git repo, a `.gitignore` written *before* the first commit, a reviewed
  list of what's about to be committed, and a pushed GitHub repo with a URL.
- **Why:**
  - You cannot safely let an agent make big changes to code you can't roll back. The repo
    *is* the thing that makes unattended building sane.
  - `.gitignore` comes first because a secret is public the instant it's pushed and then
    has to be rotated — you don't get to un-push it.
  - You eyeball the file list before committing so nothing sensitive slips in. If a push
    is rejected, you hand the exact error to the agent rather than fixing it by hand.
- **Redline:** `gh` CLI installed and `gh auth login` run *by you* (it asks interactive
  questions the agent can't answer). Then the agent writes `.gitignore`, shows the file
  list, commits, and runs `gh repo create redline --public --source=. --push`.

### 3 — Write the standing-instructions file (`CLAUDE.md`)
- **Goal:** give the agent the rules it needs every session, without being told each time.
- **Produces:** a short file holding settled decisions, the scope boundary, standing rules
  phrased as *do this*, and one-line pointers to the research and the brief.
- **Why:**
  - An unattended build drifts. This file is the guardrail it reads on its own at the
    start of every session.
  - **Inclusion test, applied to every line:** "would leaving this out cause a mistake?"
    If not, cut it. Only things the agent could not work out by reading the repo belong.
  - **Keep it short** — the handbook says under 60 lines, and that an overlong file
    *measurably reduces how reliably any of the rules get followed*. Length has a
    correctness cost, not just a token cost.
  - **Naming a file in a sentence beats `@importing` it.** "The research lives in
    `research/summary.md`, read it before deciding what to build" costs one line and gets
    opened only when it matters. An `@` import loads at launch exactly like pasting the
    whole file.
  - After the draft, you *cut* two or three more lines. "The cutting is the part that
    matters and it is the part everyone skips."
- **Redline:** a 60-line-max `CLAUDE.md` — settled stack, scope with explicit exclusions
  (payments, billing, OCR, sharing), rules like "state only what the document says," and
  pointers to `research/summary.md` and `PRD.md`.

### 4 — Record the first constraining decision as an ADR
- **Goal:** preserve the *reasoning* behind a decision that will shape everything downstream.
- **Produces:** `docs/adr/0001-*.md` in four short sections — Decision, Alternatives, Why,
  Consequences.
- **Why:**
  - Repo memory travels: it survives a clone, moves to another machine, is shared with
    anyone on the project. Machine-local auto-memory does none of that. Anything the
    *project* must remember goes in the repo.
  - **The Consequences section does the work.** One decision, followed honestly, rules out
    several others. Redline's "every flag cites its exact source sentence" also rules out
    scanned documents, paraphrased summaries, and any model careless about copying text
    back — three product decisions out of one.
  - **Why** is written as what a reader of the output can go and verify for themselves —
    not as a preference.
- **Redline:** `0001-every-flag-cites-its-source.md`, including "let the model describe
  risks in its own words" as the rejected alternative.

### 5 — Adopt shared tooling only when you need it, then configure to a common baseline
- **Goal:** get the benefit of what others built better, without paying for it constantly.
- **Produces:** installed packs, a `docs/agents/` config telling the pack where issues and
  decisions live, and a hand-written commit message.
- **Why:**
  - Every plugin's skills are read at the start of every session — "you pay for them
    constantly and use them rarely." So install a thing when you need it, not when you
    first hear about it. (The design and writing packs wait until Session 3 for exactly
    this reason.)
  - Configure to one shared answer set so results stay comparable across the cohort/team.
  - **The commit message is hand-written**, not guessed. "The diff already shows what
    changed. The message is the only place you get to say why." Imperative summary line,
    no full stop, blank line, then the why — legible to you in six weeks with the session
    forgotten.
- **Redline:** install `mattpocock-skills` and `skill-creator`; run the setup
  conversation answering "Local markdown / keep default labels / accept"; commit with the
  supplied why-focused message.

### 6 — Codify a twice-done process as your own skill (design → build → eval)
- **Goal:** turn something you've done twice and expect to do again into a reliable,
  portable trigger.
- **Produces:** a skill under `~/.claude/skills/<name>/` (personal, not project-bound) and
  an eval of when it fires.
- **Why:**
  - "Something earns being a skill when you have done it twice and expect to do it again."
    First check you don't already have one — two skills competing for the same request
    makes both fire less reliably.
  - **Design first** (interview yourself on what it should and shouldn't do, what it
    refuses to write, how it behaves when the expected folders are missing), **then build**,
    **then eval**.
  - **"Look before it writes" makes it portable.** A skill that assumes a folder layout
    works in one repo. A skill that checks what exists works everywhere — your next
    project won't have these folders.
  - **The description is the trigger, not documentation.** You eval it specifically for
    where it fires when it shouldn't and where it fails to fire when it should. "A skill
    that does the right thing at the wrong moment is worse than no skill, because you stop
    trusting it."
- **Redline:** build `/flush` — reads the conversation at session end and files whatever
  is durable into the repo; proposes `CLAUDE.md` changes rather than making them; never
  writes a credential; writes nothing when nothing durable happened.

### 7 — Read the research (disconfirming part first), then get interviewed into a brief
- **Goal:** convert evidence plus your own judgement into a document that makes calls.
- **Produces:** `PRD.md`, a `CONTEXT.md` of agreed vocabulary, and any further ADRs.
- **Why:**
  - **Read what contradicts the idea before what agrees with it** — "you will believe the
    agreeable parts whether or not they are true." What you're checking is narrow: is the
    pain real, is it sharp enough that someone would go find a tool, is there a specific
    version existing tools handle badly.
  - **A model's brief is comprehensive, balanced, and decides nothing** — every option
    listed, none chosen, no losers. **A PM's brief makes calls someone could disagree
    with** and names who is worse off for each one. So the interview forces choices you
    can't have both ways and makes you say what you're giving up.
  - **Say where the evidence is thin.** A brief that admits what it doesn't know is worth
    more than one that papers over it.
  - **"What good looks like" is the most important section you write** — stated
    specifically enough that someone else could test against it, because the eval suite in
    Session 5 is built directly from it.
- **Redline:** `grill-with-docs` over `summary.md` + `CLAUDE.md` + ADR 0001 — three rounds,
  ten questions, each with a recommended answer — then write `PRD.md` with sections for
  who it's for, the problem (with a sourced quote), the numbered first version, what good
  looks like, the red lines, the calls made and what was given up, what's excluded, and
  what the research couldn't tell you.

### 8 — Carry-forward (homework)
- **Goal:** keep the pipeline moving into the next session; separate your infrastructure
  from the product's.
- **Produces:** a spec (`/to-spec` on the brief — pure synthesis, no interview), a second
  custom skill built with the same three steps, and a funded OpenRouter account.
- **Why:** the spec is mechanical once the brief is good enough. And "a subscription is
  for you" in a chat window; "an API key is for your product" running on a server with
  nobody watching — two different things that people conflate.

---

## Cross-cutting principles

The rules worth carrying to every build, stated once and project-agnostic.

- **Harness before product.** The session builds the *conditions* for building, not the
  thing. Jumping straight to the thing is where the value leaks.
- **Reversibility is the licence to delegate.** Repo + remote + standing instructions +
  ADRs are what make "let the agent run unattended" a sane sentence instead of a reckless
  one.
- **Every line must earn its place.** `CLAUDE.md`, ADRs, the brief, commit messages — test
  each line with "would removing it change what gets built, or how someone would judge
  it?" If not, cut it. The cutting is the step everyone skips.
- **Context length has a reliability cost, not only a token cost.** Longer instruction
  files get followed less reliably. Point at files in a plain sentence; don't paste them.
- **Repo memory vs. auto-memory.** What the *project* must remember goes in the repo — it
  survives a clone and travels to any machine. How *you* personally work can stay in
  machine-local auto-memory and personal skills.
- **Hook vs. skill.** A hook is for what must happen *every time*, regardless of what the
  model decides — a deterministic shell command. A skill is for what needs judgement.
  Getting this backwards is one of the most common mistakes in specifying AI automation.
- **The description is the trigger.** For any skill, *when it fires* matters as much as
  what it does. Eval the description for false fires and misses before you rely on it.
- **Disconfirming evidence first.** Structurally debias yourself: read the part that
  contradicts you before the part that flatters you.
- **A brief with no losers is a model's brief.** Judgement shows up as naming what you
  chose against and who is worse off for it.
- **Commit messages carry the why.** The diff already shows the what. Summary line in the
  imperative, blank line, then the why — still legible to you in six weeks, in an
  interview, having forgotten the session entirely.

---

## Applying this to any build

| Redline artifact | The general thing it is |
|---|---|
| Four research agents + `summary.md` | bounded, sourced evidence gathering before committing to a solution |
| `redline` git repo + GitHub push | the reversibility guarantee that lets an agent build unattended |
| `CLAUDE.md` | the minimal always-loaded rule file that keeps an unwatched build in bounds |
| `docs/adr/0001` | portable, travelling reasoning behind a decision that constrains everything after it |
| `mattpocock-skills` / `skill-creator` + `docs/agents/` | adopted tooling, installed on need, configured to a shared baseline |
| `/flush` skill | a repeated process codified once, portable because it checks before it writes |
| `PRD.md` + its "what good looks like" | the judgement-bearing brief; its success criteria become the eval suite |
| OpenRouter key | product infrastructure, kept separate from your personal subscription |
