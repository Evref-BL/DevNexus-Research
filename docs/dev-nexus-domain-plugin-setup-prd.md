# DevNexus Domain Plugin Setup Product Requirements Document (PRD)

## Problem

DevNexus setup is currently strongest for engineering projects with source
roots, worktrees, trackers, verification commands, and publication policy.
Domain plugins such as DevNexus-Pharo and DevNexus-TypeScript already prove
that setup can project skills and tooling, but the user experience still reads
like a developer platform.

Academic Research Skills (ARS) shows a mature domain-package setup model for
Claude Code. It separates a minimum viable setup from optional capabilities,
offers several installation paths for different runtimes, explains exact skill
discovery shape, exposes optional environment flags, and treats document
export, corpus adapters, cross-model checks, and desktop/web runtime support as
capability layers rather than mandatory prerequisites.

DevNexus should apply that setup philosophy generically so future domain
plugins can give users a simple starting path while still supporting richer
tooling when available.

## Goals

- Make domain-plugin setup feel simple for first use.
- Separate minimum viable setup from optional capability setup.
- Let plugins declare setup methods, provider compatibility, optional tools,
  update policy, and expected skill/package discovery shape.
- Let DevNexus setup status report what is ready, missing, optional, stale, or
  incompatible for a domain plugin.
- Support provider-specific install surfaces without hard-coding one provider
  into DevNexus core.
- Keep setup operations explicit and reversible.
- Keep DevNexus core generic while plugin packages own domain-specific
  requirements.

## Non-Goals

- Do not add ARS-specific concepts to DevNexus core.
- Do not build a universal plugin marketplace in the first slice.
- Do not require every plugin to support every provider.
- Do not install external tools or copy external skill content silently.
- Do not make optional capabilities block baseline project use.

## Source Lessons From ARS

The ARS README currently recommends Claude Code plugin installation using
Claude's `/plugin marketplace add` and `/plugin install` commands, then points
users to a first command such as `/ars-plan`. The setup guide expands this into
a minimum viable setup, optional output tooling, corpus adapters, optional
cross-model verification, and multiple install methods.

Specific design lessons:

- Minimum viable setup should be first-class. ARS can run in a simpler Markdown
  mode without all document-export tooling.
- Optional tools should be additive readiness checks, not hidden assumptions.
  ARS treats Pandoc for DOCX, Tectonic and fonts for PDF, corpus adapters, and
  cross-model verification as opt-in layers.
- Setup methods differ by runtime. ARS distinguishes Claude Code plugin,
  project skills, global skills, standalone repo use, Claude Cowork desktop,
  and claude.ai project knowledge import.
- Native provider packages should be used directly when possible. A Claude Code
  project can use the ARS plugin as-is; a Codex project can use the ARS Codex
  suite skill. DevNexus core should represent that generically instead of
  learning ARS-specific behavior.
- Discovery shape matters. ARS explicitly warns that skills must appear at the
  provider's expected `skills/<skill>/SKILL.md` shape, not nested one level too
  deep.
- Auto-update and manual update are setup concerns. ARS recommends enabling
  plugin auto-update and documents how manual update differs from marketplace
  source-list refresh.
- Web/project knowledge access is not the same as agentic skill execution. ARS
  treats claude.ai GitHub project import as read/citation access, not active
  skill routing.
- Optional environment flags should be discoverable, scoped, and off by
  default.

## User Stories

- As a new DevNexus user, I can enable a domain plugin and get a minimum useful
  setup without reading every optional integration path.
- As a domain plugin author, I can declare setup methods and optional
  capabilities without changing DevNexus core.
- As a coordinator agent, I can see whether a plugin is baseline-ready and
  which optional capabilities are unavailable.
- As a user on Codex, Claude Code, or another provider, I can see which setup
  path applies to my active agent target.
- As a maintainer, I can distinguish installed plugin version, available update,
  and stale generated provider support.

## Product Model

DevNexus should add a generic domain-plugin setup model with these concepts:

- Baseline readiness: the smallest setup that makes the plugin usable.
- Optional capability: a tool, API profile, adapter, export path, or provider
  feature that enhances the plugin but is not required.
- Installation method: provider/runtime-specific instructions or automation for
  making plugin skills and tools available.
- Agent package: a provider-native package that should be used as-is
  when the active provider supports it, with license and update metadata.
- Discovery shape: expected paths and manifests for skills, commands, MCP
  servers, adapters, and support assets.
- Update policy: fixed, manual, auto-update, or project-pinned.
- Runtime semantics: whether a provider offers active skill execution, read-only
  knowledge retrieval, local shell execution, subagent/task dispatch, or
  document export.

## User-Facing Surfaces

### Setup Plan

`dev-nexus setup plan` should be able to render plugin setup as:

- baseline required steps
- optional capability steps
- provider-specific branches
- manual steps versus safe automated steps
- commands that users can run themselves
- expected files, directories, and generated support state

### Setup Check

`dev-nexus setup check` should report:

- active agent target
- installed plugin package or source checkout
- skill discovery status
- MCP server availability, if any
- optional tool readiness
- API profile presence by name, never secret value
- stale generated provider support
- unsupported runtime caveats
- update status when known

### Worker Context

Generated worker context should summarize:

- baseline plugin readiness
- optional capabilities available to this worker
- unavailable optional capabilities and what workflows they affect
- relevant domain artifact paths
- provider/runtime limitations

## Implementation Decisions

- Keep the setup model provider-neutral in DevNexus core.
- Plugins declare setup capability records; provider adapters render them for
  Codex, Claude Code, manual, or future targets.
- Provider-native agent packages need a generic capability record so DevNexus
  can say "use this package as-is for this provider" without domain-specific
  code.
- DevNexus distinguishes "readable knowledge dependency" from "active skill
  execution dependency".
- Setup checks never mutate external provider state.
- Package install, plugin install, or external skill copy remains a separate
  explicit setup action.
- Optional capabilities should produce warnings or unavailable statuses, not
  failed setup, unless the project marks them required.

## Testing Decisions

- Test a plugin with baseline-only setup.
- Test optional tools present, missing, and explicitly required.
- Test provider-specific setup rendering for Codex and Claude-style targets
  using fake providers.
- Test skill discovery path validation and nested-folder mistakes.
- Test update-policy reporting with mocked installed/current versions.
- Test stale generated support detection without deleting files.

## Acceptance Criteria

- A domain plugin can declare baseline setup and optional capabilities without
  DevNexus core knowing the domain.
- Setup plan and setup check can render plugin setup methods by active agent
  target.
- Missing optional tools produce precise nonblocking output.
- Runtime differences are visible in setup output.
- Worker context reports only capabilities relevant to the active target and
  task.

## References

- Academic Research Skills README:
  https://github.com/Imbad0202/academic-research-skills
- ARS setup guide:
  https://github.com/Imbad0202/academic-research-skills/blob/main/docs/SETUP.md
- ARS architecture:
  https://github.com/Imbad0202/academic-research-skills/blob/main/docs/ARCHITECTURE.md
