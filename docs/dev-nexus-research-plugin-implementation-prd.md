# DevNexus-Research Plugin Implementation Product Requirements Document (PRD)

## Problem

DevNexus can coordinate software work, but agent orchestration is also useful
for academic research, paper writing, review, revision, citation integrity, and
reproducible handoff. DevNexus-Research should prove that DevNexus can support
research as a non-engineering domain without making DevNexus core academic,
citation, or LaTeX aware.

The plugin must assist research and paper writing while preserving the human
researcher as decision owner. It should help organize sources, claims,
bibliography state, LaTeX manuscripts, reviews, revisions, optional corpus
adapters, optional export tooling, and integrity checks. It should not become an
autonomous paper-writing system.

## Goals

- Create DevNexus-Research as a standalone DevNexus project and plugin package.
- Make the plugin's goal clear: assist academic research and research-paper
  writing, including LaTeX-based paper workflows.
- Keep DevNexus as a dependency component.
- Provide DevNexus-Research skills automatically, including approved
  ARS-derived skills where useful.
- Keep plugin-owned skills in the DevNexus-Research source repository, with
  provider-compatible `skills/<skill>/SKILL.md` source files.
- Vendor or adapt useful Academic Research Skills (ARS) skill material under
  the approved `CC-BY-NC-4.0` Research license posture.
- Prefer provider-native ARS packages when the active agent supports them:
  Claude Code uses the upstream ARS plugin, Codex uses the Codex ARS suite
  skill, and other providers use DevNexus-Research shims or fallback skills.
- Preserve ARS attribution, upstream source path, commit/hash tracking,
  modification notes, license text/link, and no implied endorsement.
- Offer a no-network baseline mode and a no-LaTeX baseline mode.
- Treat LaTeX support as first-class but optional: missing TeX tools should
  block only workflows that require local compilation.
- Make research artifacts durable and inspectable.
- Make human checkpoints explicit.
- License DevNexus-Research as a free noncommercial `CC-BY-NC-4.0` plugin.
- Keep DevNexus core commercial-safe by treating Research as an opt-in curated
  plugin, not a core dependency or bundled core asset.

## Non-Goals

- Do not implement inside the DevNexus dogfood project.
- Do not copy or adapt ARS material outside the approved `CC-BY-NC-4.0`
  DevNexus-Research license posture.
- Do not add research-specific behavior to DevNexus core.
- Do not make DevNexus core hard-depend on DevNexus-Research or bundle its
  `CC-BY-NC-4.0` content.
- Do not require Pandoc, Tectonic, TeX Live, Zotero, external APIs, or
  cross-model verification for baseline use.
- Do not hide artificial intelligence assistance or bypass venue disclosure
  requirements.
- Do not silently mutate a source manifest, bibliography, or manuscript while
  performing review or integrity checks.

## Source Home And Skill Ownership

Plugin-owned research skills live in this DevNexus-Research repository.
They may include original DevNexus-Research guidance and approved ARS-derived
adaptations under `CC-BY-NC-4.0`. The GitHub source home follows the
sibling DevNexus plugin pattern used by DevNexus-Pharo and
DevNexus-TypeScript:

- repository: `Evref-BL/DevNexus-Research`
- remote URL: `git@github.com:Evref-BL/DevNexus-Research.git`
- normal DevNexus source root:
  `components/dev-nexus-research`

The DevNexus project should reference this checkout with
`sourceRoot: "componentsRoot:dev-nexus-research"`. Implementation should keep
the repository as the durable source of truth for:

- package metadata and exported plugin capability config
- original and approved ARS-derived skill source files
- tests proving the exported capabilities and skill registry
- artifact conventions and fixture projects

ARS repositories remain upstream provenance references:

- `https://github.com/Imbad0202/academic-research-skills`
- `https://github.com/Imbad0202/academic-research-skills-codex`

Those repositories are upstream sources for approved ARS-derived skills and
provider-native package integration. DevNexus-Research must track upstream
path, commit, hash, license, attribution, and modification notes for any
vendored or adapted material. The integration inventory in
`docs/ars-integration-inventory.md` records the approved fallback skill
integration boundary. `docs/ars-provider-native-integration-investigation.md`
records why ARS commands, hooks, scripts, adapters, schemas/contracts,
templates, examples, tests, and references should be consumed through
provider-native packages instead of arbitrary checkout paths.

## Users

- A computer scientist writing a paper, grant, thesis chapter, or literature
  review.
- A researcher who needs Socratic scoping before writing.
- A researcher writing or maintaining a LaTeX manuscript with BibTeX or Biber
  bibliography files.
- A reviewer or advisor organizing manuscript critique.
- A DevNexus plugin author using research as the first non-engineering plugin
  domain.
- A coordinator agent preparing research work items and handoffs.

## User Stories

- As a researcher, I can create a DevNexus project for a paper and see
  research-specific phases and artifacts.
- As a researcher with a vague topic, I can run a scoping workflow to refine a
  research question and method assumptions.
- As an author, I can maintain a source manifest, bibliography file, and claim
  register that agents use as evidence state.
- As a LaTeX author, I can ask for help planning a paper structure, editing a
  section, checking labels and citations, and diagnosing compile logs without
  giving up authorship control.
- As a reviewer, I can run read-only critique and generate a revision matrix.
- As a coordinator, I can check optional research tooling before assigning
  citation, LaTeX export, source-corpus, or bibliography tasks.
- As a user, I get the approved ARS-derived research skills from the
  DevNexus-Research package without providing a separate ARS checkout.
- As a Claude Code or Codex user with a provider-native ARS package available,
  DevNexus-Research guides the project toward that package before falling back
  to simplified bundled skill adaptations.

## Product Model

DevNexus-Research should be a plugin package with these capability categories:

- Projected skills:
  - `deep-research`
  - `academic-paper`
  - `academic-paper-reviewer`
  - `academic-pipeline`
  - `research-workflow-router`
  - `research-question-scope`
  - `literature-review`
  - `paper-planning`
  - `latex-paper-authoring`
  - `manuscript-review`
  - `citation-claim-integrity`
  - `revision-matrix-planning`
  - `research-artifact-handoff`
- Worker briefing fragments:
  - human checkpoint and authorship policy
  - evidence and claim-support policy
  - source provenance policy
  - LaTeX manuscript mutation policy
  - venue disclosure policy
- Setup checks:
  - baseline plugin readiness
  - optional LaTeX toolchain readiness
  - optional document export tools
- optional bibliography or corpus adapters
- optional external index/API profiles
- optional external skill availability
- Artifact conventions:
  - research brief
  - source manifest
  - material passport
  - claim register
  - LaTeX manuscript root
  - bibliography state
  - LaTeX build report
  - review package
  - revision matrix
  - export decision

The first plugin slice should use generic DevNexus capability kinds:
`projected_skill`, `setup_obligation`, `environment_hint`,
`agent_affordance`, `worker_context_fragment`, and
`worker_briefing_fragment`. Live Model Context Protocol (MCP) services are a
later optional layer.

## Skill Pack

The skill pack should include original DevNexus-Research skills plus approved
ARS-derived adaptations. Skill files should live in a stable
provider-compatible shape:

- `skills/deep-research/SKILL.md`
- `skills/academic-paper/SKILL.md`
- `skills/academic-paper-reviewer/SKILL.md`
- `skills/academic-pipeline/SKILL.md`
- `skills/research-workflow-router/SKILL.md`
- `skills/research-question-scope/SKILL.md`
- `skills/literature-review/SKILL.md`
- `skills/paper-planning/SKILL.md`
- `skills/latex-paper-authoring/SKILL.md`
- `skills/manuscript-review/SKILL.md`
- `skills/citation-claim-integrity/SKILL.md`
- `skills/revision-matrix-planning/SKILL.md`
- `skills/research-artifact-handoff/SKILL.md`

Each skill should:

- route to project-owned artifacts instead of relying on chat memory
- state its allowed mutation mode
- require source support for claims
- keep human checkpoint decisions explicit
- include provenance metadata when it is ARS-derived
- include tests or fixtures proving the package registry exports the expected
  skill ids

`research-workflow-router` should be the main entrypoint. It should select a
workflow based on the user's current task, then point to the relevant narrower
skill and artifacts.

## LaTeX Support

LaTeX support should help authors manage paper structure and local build
readiness without making TeX tools mandatory for baseline use.

First-class LaTeX workflows:

- identify the manuscript root, bibliography files, figures, and style files
- plan sections, claims, figures, tables, related work, and limitations
- edit or draft only within a user-authorized manuscript scope
- check citation keys, labels, references, figure/table references, and common
  venue constraints
- summarize LaTeX build logs and separate source errors from missing tools
- produce a build report artifact with unresolved warnings
- support BibTeX and Biber readiness checks without requiring Zotero

Optional setup checks should detect common tools by command presence only:

- `latexmk`
- `pdflatex`
- `xelatex`
- `lualatex`
- `tectonic`
- `bibtex`
- `biber`
- `chktex`

Missing tools are nonblocking unless the project config marks local LaTeX
compilation as required.

## Project Shape

This project remains the owning project for the plugin:

- `dev-nexus-research` is the primary component, checked out under
  `components/dev-nexus-research`.
- `dev-nexus` is a dependency component.
- Work items are local to this project until a GitHub tracker is explicitly
  configured.
- Implementation worktrees are prepared from this project.
- DevNexus dogfood can later consume the plugin, but should not own its
  planning or implementation.

## Implementation Plan

1. Scaffold package metadata, source entrypoint, test harness, and check
   command.
2. Add canonical skill-source layout and tests for expected skill ids.
3. Export a minimal DevNexus plugin capability config with projected research
   skills, setup obligations, environment hints, and worker briefing fragments.
4. Add original skill shells and router guidance.
5. Add artifact conventions and setup-check reporting.
6. Add LaTeX manuscript and build-readiness conventions.
7. Add approved ARS-derived skills as bundled DevNexus-Research skill files
   with attribution, upstream path, commit/hash, modification notes,
   license text/link, and no-endorsement language.
8. Remove checkout-based ARS command, script, schema, contract, and diagnostic
   support from the package baseline.
9. Record provider-native ARS integration metadata for Claude Code, Codex,
   planned OpenCode shim behavior, and bundled fallback behavior.
10. Add a synthetic research-project smoke fixture with a minimal LaTeX paper.
11. Add optional provider/API integrations only after the baseline is stable.

## Implementation Decisions

- The baseline must run without external network or paid API calls.
- The baseline must run without a local LaTeX installation.
- Optional tools are reported as capabilities, not assumed.
- Source/corpus adapters should write structured manifests and rejection logs.
- Review mode is read-only unless the user explicitly enters revision.
- Claim and citation checks should produce structured warnings rather than
  silently rewriting evidence.
- LaTeX authoring support must distinguish planning, read-only review, scoped
  edits, and build-log diagnosis.
- Human checkpoints should be recorded in project artifacts or work items.
- ARS skill integration should be automatic from bundled or adapted
  DevNexus-Research package content under `CC-BY-NC-4.0`.
- ARS commands, hooks, scripts, adapters, schemas/contracts, templates,
  examples, fixtures, tests, and references should be consumed through
  provider-native ARS packages when available. They are not vendored into the
  simplified DevNexus-Research fallback baseline.
- DevNexus core may expose curated-plugin discovery/install/load metadata for
  DevNexus-Research, but Research must remain opt-in from core.
- DevNexus core should grow a generic agent package capability
  before DevNexus-Research exposes native ARS packages as first-class projected
  capabilities.

## Testing Decisions

- Test plugin capability projection with fake active agent targets.
- Test skill registry export against the `skills/<skill>/SKILL.md` source tree.
- Test setup status when optional LaTeX tools are unavailable.
- Test setup status when optional bibliography/corpus tools are unavailable.
- Test artifact path configuration and generated worker briefing.
- Test optional external skill detection with present and missing fixtures.
- Test ARS-derived skill provenance metadata, license/notice packaging,
  projected skill ids, and no-endorsement wording.
- Test no-network synthetic research project smoke.
- Test a synthetic LaTeX manuscript fixture without requiring actual PDF
  compilation.
- Test that DevNexus core does not import research-specific modules.

## Acceptance Criteria

- The project can build a minimal DevNexus-Research plugin package.
- The package exposes a stable skill source tree in the DevNexus-Research
  repository.
- DevNexus can read the plugin capability config from a fixture project.
- Worker context can show research workflow readiness, artifact paths, LaTeX
  readiness, and human checkpoint policy.
- Optional integrations are visible but nonblocking, except that
  DevNexus-Research's bundled research skills are baseline package content.
- A synthetic research project can exercise setup and context generation.
- A synthetic LaTeX paper fixture can exercise manuscript-root and bibliography
  conventions without requiring PDF output.
- Approved ARS-derived skill content is bundled or adapted with required
  attribution, upstream source path, commit/hash, license, and modification
  metadata. Non-skill ARS surfaces are absent unless separately approved.

## References

- Academic Research Skills README:
  https://github.com/Imbad0202/academic-research-skills
- ARS setup guide:
  https://github.com/Imbad0202/academic-research-skills/blob/main/docs/SETUP.md
- Academic Research Skills for Codex:
  https://github.com/Imbad0202/academic-research-skills-codex
- ARS Codex adapter entrypoint:
  https://github.com/Imbad0202/academic-research-skills-codex/blob/main/skills/academic-research-suite/SKILL.md
