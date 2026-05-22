# DevNexus-Research

DevNexus-Research is a research-oriented DevNexus plugin package.

The plugin should make DevNexus useful for academic research, paper writing,
LaTeX manuscript support, review, revision, citation integrity, and
reproducible research handoff without making DevNexus core specific to
academia.

The GitHub source home is
[`Evref-BL/DevNexus-Research`](https://github.com/Evref-BL/DevNexus-Research):
`git@github.com:Evref-BL/DevNexus-Research.git`.

```ts
import { devNexusResearchDevNexusPluginConfig } from "@evref-bl/dev-nexus-research";

const plugin = devNexusResearchDevNexusPluginConfig();
```

Add the returned plugin config to a DevNexus project's `plugins` list. The
package is licensed as `CC-BY-NC-4.0` so Research can include adapted
ARS-derived skills as automatic bundled workflow content while DevNexus core
remains a separate, opt-in loader of curated plugins. The package currently
exports a minimal research capability config, original DevNexus-Research
skills, and adapted ARS-derived skills with explicit provenance. It also
models baseline research
artifact conventions and optional setup readiness for LaTeX, document export,
bibliography, corpus, external index, and external skill surfaces. LaTeX
support includes manuscript-root, bibliography-file, figure-path, table-path,
and build-report conventions while keeping local compilation optional.
Baseline skill availability does not require a user-provided ARS checkout.
The package now records a provider-native ARS integration preference: Claude
Code targets should use the upstream `academic-research-skills` plugin as-is,
Codex targets should prefer the `academic-research-suite` skill from
`Imbad0202/academic-research-skills-codex`, and the bundled ARS-derived
DevNexus-Research skills remain the fallback when no native or shim package is
available.

The package ships a synthetic fixture project at
`fixtures/synthetic-research-project/`. The fixture enables the plugin,
declares research artifact paths, includes synthetic source artifacts plus a
minimal LaTeX manuscript and bibliography, and verifies the no-network,
no-LaTeX, no-Zotero baseline.

Projects can place setup input under `extensions.dev-nexus-research`; the
package exports helpers to extract setup options and render setup status from
that DevNexus project extension.

Current state:

- The repository is an alpha implementation package.
- In DevNexus-managed projects, this repository should be checked out as a
  component source root such as `components/dev-nexus-research`.
- DevNexus is a package dependency and the generic host for loading the plugin.
- Plugin-owned skills live in this repository, with GitHub home
  `Evref-BL/DevNexus-Research`.
- The skill source tree lives under `skills/<skill>/SKILL.md` and is exported
  through the package registry.
- Research artifact conventions and setup status helpers are exported by the
  package and work in a no-network, no-LaTeX, no-Zotero baseline.
- LaTeX authoring support includes scoped mutation policy, citation-key and
  label checks, build-log diagnosis, and setup readiness summaries.
- DevNexus-Research is `CC-BY-NC-4.0`; ARS-derived skill vendoring/adaptation
  is approved for this package when attribution, upstream source path,
  commit/hash tracking, modification notes, license text/link, and no
  endorsement language are preserved.
- Adapted ARS-derived skills are bundled for `deep-research`,
  `academic-paper`, `academic-paper-reviewer`, and `academic-pipeline`.
- ARS attribution and provenance ship in each derived skill,
  `skills/ARS-PROVENANCE.json`, `NOTICE.md`, and typed package exports.
- The package no longer exposes checkout-based ARS non-skill surfaces.
  Commands, hooks, scripts/adapters, schemas/contracts, templates, examples,
  fixtures, tests, and references should be consumed through provider-native
  ARS packages when available. DevNexus-Research owns fallback skills and
  future shims for providers without a native package.
- A typed provider integration registry records Claude Code native plugin,
  Codex native skill-suite, planned OpenCode shim, and bundled fallback
  behavior with license and no-endorsement metadata.
- A synthetic research project fixture is included for smoke testing setup
  status, worker briefing, artifact paths, and minimal LaTeX authoring paths
  without private material or external services.
- Setup helpers can load artifact paths, local LaTeX compilation requirements,
  and external index profiles from a DevNexus project extension.
- Packaged installs include the README-referenced docs in `docs/`.
- Package metadata is configured for public npm publication under
  `@evref-bl/dev-nexus-research`.
- The license posture is materialized as `CC-BY-NC-4.0`, making the package
  free and noncommercial rather than commercial-safe or OSI-open-source.

Packaged planning and integration docs:

- `docs/dev-nexus-domain-plugin-setup-prd.md`
- `docs/dev-nexus-research-plugin-implementation-prd.md`
- `docs/ars-integration-inventory.md`
- `docs/ars-provider-native-integration-investigation.md`
