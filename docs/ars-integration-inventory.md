# Academic Research Skills Integration Inventory

Inspected upstream repository:

- Repository: `https://github.com/Imbad0202/academic-research-skills`
- Inspected HEAD: `af09cf54c1db55cb10148e0f11db94c389f8214d`
- Local inspection checkout:
  `/Users/gabriel.darbord/dev-nexus/sources/academic-research-skills`
- Upstream license observed in repository metadata: `CC-BY-NC-4.0`
- Upstream author/copyright holder: Cheng-I Wu

DevNexus-Research uses ARS as product inspiration and, after the 2026-05-19
policy decision, directly bundles adapted ARS-derived research skills under
the DevNexus-Research `CC-BY-NC-4.0` license posture.

## Approved Integration Boundary

Allowed:

- distribute DevNexus-Research as `CC-BY-NC-4.0`/noncommercial
- adapt ARS-derived skills into `skills/<skill>/SKILL.md`
- make baseline skill availability automatic, with no user-provided ARS
  checkout required
- preserve per-skill attribution, upstream repository URL, upstream source
  path, upstream commit, source content hash, modification notes, license
  text/link, and no implied endorsement
- keep DevNexus core separately licensed and limited to opt-in plugin loading

Not part of this integration:

- user-configured ARS checkout detection
- vendoring ARS scripts, schemas, templates, examples, docs, tests, or other
  non-skill assets directly into the DevNexus-Research fallback baseline
- implying endorsement by Cheng-I Wu or by the upstream Academic Research
  Skills project
- presenting DevNexus-Research as commercial-safe or OSI-open-source while it
  contains ARS-derived `CC-BY-NC-4.0` material

Provider-native ARS packages are a separate integration path, not a
user-checkout bridge. Claude Code targets should use the upstream ARS plugin
as-is, and Codex targets should prefer the Codex-native ARS suite package.
Those provider packages may expose commands, hooks, scripts, schemas,
contracts, templates, examples, tests, and references through their native
runtime shape.

## Bundled ARS-Derived Skills

The package includes adapted, self-contained versions of these upstream skill
entrypoints:

| DevNexus-Research skill | Upstream source path | Upstream content SHA-256 |
| --- | --- | --- |
| `deep-research` | `deep-research/SKILL.md` | `527f7500420bc4872bd9a64f40e9b036ee825dc3a60eca49d6cdb7a1a06ef39d` |
| `academic-paper` | `academic-paper/SKILL.md` | `2578aaf434336672071558ac2a5872fe998e48f7c610510723f3b7ec78fe3aae` |
| `academic-paper-reviewer` | `academic-paper-reviewer/SKILL.md` | `7b594fdd5812e5d80ce094c420f14aa5e0759fe12567adea1c4d8edad7e71a36` |
| `academic-pipeline` | `academic-pipeline/SKILL.md` | `cce007ae745b44b4bea69e331a51b07eacecf4cf234c29875387bc38266d0579` |

Each adapted skill is designed to work from DevNexus-Research artifacts and
does not reference external ARS reference files or a checkout path.

## Provenance Packaging

Required attribution and provenance are recorded in three places:

- per-skill `SKILL.md` frontmatter and the `## ARS Provenance And License`
  section
- `skills/ARS-PROVENANCE.json`
- typed package exports from `src/researchSkillProvenance.ts`

The package also includes:

- `LICENSE`: full `CC-BY-NC-4.0` license text
- `NOTICE.md`: ARS attribution, upstream URL, inspected commit, license link,
  modification posture, and no-endorsement notice

## Non-Skill Upstream Surfaces

The ARS repository contains useful commands, scripts, adapters, shared
contracts, schemas, hooks, templates, examples, and fixtures. Those surfaces
are intentionally not vendored into the DevNexus-Research fallback baseline.
They should be consumed through provider-native ARS packages when the active
agent supports them:

- Claude Code: `Imbad0202/academic-research-skills`, installed as a native
  Claude plugin.
- Codex: `Imbad0202/academic-research-skills-codex`, using the
  `academic-research-suite` skill.
- OpenCode and other providers: future provider shims should follow the Codex
  suite pattern rather than requiring an arbitrary user checkout.

Future work can add original DevNexus-Research implementations or provider
shims, with the same license, attribution, provenance, and no-endorsement
requirements.
