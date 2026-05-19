---
name: academic-paper
description: ARS-derived academic paper writing skill for planning, drafting, revising, citation checking, disclosure, and LaTeX-oriented manuscript work in DevNexus-Research.
metadata:
  origin: academic-research-skills
  relationship: adapted-from
  upstream_repository: https://github.com/Imbad0202/academic-research-skills
  upstream_source_path: academic-paper/SKILL.md
  upstream_commit: af09cf54c1db55cb10148e0f11db94c389f8214d
  upstream_content_sha256: 2578aaf434336672071558ac2a5872fe998e48f7c610510723f3b7ec78fe3aae
  upstream_author: Cheng-I Wu
  upstream_license: CC-BY-NC-4.0
  license_url: https://creativecommons.org/licenses/by-nc/4.0/
  modification_notes: Adapted into a self-contained DevNexus-Research paper-writing skill with LaTeX artifact conventions and no dependency on external ARS reference files.
  no_endorsement: DevNexus-Research does not imply endorsement by Cheng-I Wu or by Academic Research Skills.
---

# Academic Paper

Use this ARS-derived skill when the user wants to plan, draft, revise, format,
or check an academic paper. It is bundled with DevNexus-Research and works
without an external ARS checkout.

## Allowed Mutation Mode

Scoped mutation. You may edit paper-planning artifacts by default. You may edit
LaTeX manuscript files only after the user approves the exact file and section
scope. Keep build-log diagnosis separate from manuscript edits.

## Artifact Inputs

- Research brief
- Source manifest
- Claim register
- LaTeX manuscript root
- LaTeX bibliography files
- Figure and table paths
- Review package or revision matrix when available
- Venue, citation style, language, and disclosure constraints

## Artifact Outputs

- Paper outline and section intent map
- Draft section text or scoped manuscript patch
- Citation-key and claim-support warnings
- Revision plan
- Disclosure notes
- Export or formatting decision

## Source Support

Do not write unsupported claims into manuscript text. Every literature claim,
method claim, result interpretation, or venue-sensitive statement should map to
source-manifest entries, bibliography keys, or explicit user-provided evidence.
Mark unresolved support gaps before drafting around them.

## Human Checkpoints

Confirm the paper type, target audience, contribution claim, citation style,
and manuscript mutation scope. The user remains responsible for authorship,
interpretation, disclosure, and final submitted text.

## Workflow

1. Determine mode: plan, outline, draft, revision, revision coaching, abstract,
   literature-review paper, format conversion, citation check, or disclosure.
2. Read the relevant DevNexus-Research artifacts before drafting.
3. Build an argument map: research question, contribution, claims, evidence,
   limitations, and venue fit.
4. Draft or revise only the approved scope.
5. Check citation keys, labels, bibliography availability, and unsupported
   claims.
6. Record changes and unresolved risks in the revision matrix or handoff note.

## LaTeX Policy

Before editing LaTeX, identify the root file, bibliography file, figure/table
paths, target section, and intended build command. Preserve labels and citation
keys unless the user approves a coordinated rename.

## ARS Provenance And License

Adapted from Academic Research Skills `academic-paper/SKILL.md` by Cheng-I Wu,
upstream commit `af09cf54c1db55cb10148e0f11db94c389f8214d`, source SHA-256
`2578aaf434336672071558ac2a5872fe998e48f7c610510723f3b7ec78fe3aae`,
licensed `CC-BY-NC-4.0`. This adaptation is for DevNexus-Research packaging,
artifact conventions, and bundled baseline availability. No endorsement by the
upstream author or project is implied.
