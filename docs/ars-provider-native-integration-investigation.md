# ARS Provider-Native Integration Investigation

Date: 2026-05-19

## Summary

The previous local-14 implementation made DevNexus-Research self-contained by
bundling simplified ARS-derived skill adaptations. That is useful as a fallback,
but it is not the best long-term integration model for the full ARS surface.

ARS already has provider-native distributions:

- Claude Code: `Imbad0202/academic-research-skills`
- Codex: `Imbad0202/academic-research-skills-codex`

DevNexus should stay generic. If the active project agent is compatible with an
available provider-native package, DevNexus-Research should prefer that native
package and verify or guide installation. DevNexus-Research should provide shims
only for providers that do not have a native ARS-compatible package.

Implementation note: this package now exports
`devNexusResearchArsProviderIntegrations` as the typed source of truth for the
Claude Code native plugin, Codex native suite skill, planned OpenCode shim, and
bundled fallback behavior. DevNexus core still needs a generic agent package
capability before this can become a first-class projected capability.

## Inspected Sources

Claude Code ARS checkout:

- Path: `/Users/gabriel.darbord/dev-nexus/sources/academic-research-skills`
- Commit: `af09cf54c1db55cb10148e0f11db94c389f8214d`
- Plugin version observed in `.claude-plugin/plugin.json`: `3.9.4`
- License: `CC-BY-NC-4.0`

Codex ARS repository:

- Repository: `https://github.com/Imbad0202/academic-research-skills-codex`
- Inspected HEAD: `900238ce1b04109bc3e11a4849f4be55122e5301`
- Package version: `0.1.8`
- Vendored upstream ARS commit recorded by its manifest:
  `96b82e82142dc95f117595c207d3e150b078e411`
- License: `CC-BY-NC-4.0`

## Useful ARS Surfaces

Claude Code ARS includes:

- `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` for native
  plugin metadata.
- Four top-level workflow skills exposed through `skills/` symlinks:
  `deep-research`, `academic-paper`, `academic-paper-reviewer`, and
  `academic-pipeline`.
- Ten `/ars-*` slash command prompt recipes with Claude model routing hints:
  `/ars-plan`, `/ars-outline`, `/ars-abstract`, `/ars-lit-review`,
  `/ars-citation-check`, `/ars-disclosure`, `/ars-format-convert`,
  `/ars-revision-coach`, `/ars-revision`, and `/ars-full`.
- A `SessionStart` hook that injects available ARS command and agent context.
- Plugin agent symlinks for `synthesis_agent`, `research_architect_agent`, and
  `report_compiler_agent`.
- A large support surface of workflow agents, references, templates, examples,
  shared contracts, schemas, validators, adapters, and tests.

The Codex ARS package includes the same broad runtime value in a Codex-native
shape:

- one root Codex skill: `skills/academic-research-suite/SKILL.md`
- a single-suite router that loads only the relevant vendored workflow files
- `ars-*` alias routing for Claude-style commands
- vendored agents, references, templates, shared schemas/contracts, scripts,
  docs, tests, and examples
- explicit runtime mapping from Claude Code concepts to Codex behavior
- explicit inactive-script notes for upstream scripts that require
  Claude-specific inputs

## Architectural Implication

The best integration order is:

1. Native provider plugin when available and compatible.
2. Provider-native shim package when available, such as ARS Codex.
3. DevNexus-Research fallback skills only when no native or shim package is
   available.

For Claude Code, DevNexus-Research should not replicate ARS commands, hooks, or
skill layout. It should declare that the native Claude plugin is the preferred
runtime surface and help setup verify or guide:

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

For Codex, DevNexus-Research should not rely only on the current four simplified
adaptations. The upstream Codex package already solves the fuller shim problem
as a single `academic-research-suite` skill. DevNexus-Research should either
project or guide installation of that skill, while keeping license/provenance
visible.

For OpenCode and other providers, DevNexus-Research should provide a future
shim that follows the Codex package pattern: one provider-native router plus
vendored ARS resources, with provider-specific runtime mappings and inactive
upstream surface notes.

## DevNexus Core Gap

DevNexus core currently supports generic plugin capability records such as
`projected_skill`, `mcp_server`, `setup_obligation`, `environment_hint`,
`agent_affordance`, `dependency_projection`, and worker fragments. It does not
yet have a provider-neutral capability kind for "use this native agent package
as-is when the active agent target supports it."

A generic capability is needed, tentatively:

```json
{
  "kind": "agent_package",
  "id": "ars-claude-plugin",
  "provider": "claude",
  "pluginName": "academic-research-skills",
  "sourceRepository": "https://github.com/Imbad0202/academic-research-skills",
  "installCommands": [
    "/plugin marketplace add Imbad0202/academic-research-skills",
    "/plugin install academic-research-skills"
  ],
  "license": "CC-BY-NC-4.0",
  "required": false
}
```

This should be core-generic and provider-neutral. Provider adapters decide how
to inspect, install, or guide native package setup for Claude Code, Codex,
OpenCode, manual, or custom targets.

## Recommended DevNexus-Research Direction

- Keep the four current adapted ARS-derived skills as a minimal fallback
  baseline for providers without a compatible native ARS package.
- Keep provider integration metadata in this package so setup and worker
  briefing can prefer native ARS surfaces without making DevNexus core
  research-specific.
- Add provider-native integration metadata for Claude Code ARS once DevNexus
  core can represent agent packages as first-class capabilities.
- Add Codex integration that prefers `academic-research-suite` from
  `Imbad0202/academic-research-skills-codex` over the simplified fallback
  skills when Codex is the active provider.
- Treat ARS commands as native Claude commands or Codex aliases, not generic
  DevNexus commands.
- Treat ARS hooks as native Claude hook metadata. Do not port them into Codex
  unless a Codex hook mechanism is explicitly available and approved.
- Treat ARS scripts/adapters/schemas/contracts as optional provider package
  resources, not DevNexus core behavior. When exposed, they should be tied to
  the native package's provenance and local setup status.
- Preserve package license and no-endorsement posture for every path.

## Why This Changes The Earlier Boundary

The earlier local-14 boundary removed checkout-based ARS non-skill support from
DevNexus-Research because requiring a user checkout was the wrong baseline. The
investigation shows a better model: do not ask users for an arbitrary checkout,
but do use official provider-native ARS distributions when the active agent
supports them.

That keeps DevNexus generic while letting DevNexus-Research benefit from ARS
commands, hooks, agents, references, templates, schemas, validators, and
adapters through the right runtime packaging.
