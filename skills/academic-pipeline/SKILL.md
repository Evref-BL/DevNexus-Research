---
name: academic-pipeline
description: ARS-derived academic pipeline orchestrator for research-to-paper workflows, integrity gates, review, revision, and handoff in DevNexus-Research.
metadata:
  origin: academic-research-skills
  relationship: adapted-from
  upstream_repository: https://github.com/Imbad0202/academic-research-skills
  upstream_source_path: academic-pipeline/SKILL.md
  upstream_commit: af09cf54c1db55cb10148e0f11db94c389f8214d
  upstream_content_sha256: cce007ae745b44b4bea69e331a51b07eacecf4cf234c29875387bc38266d0579
  upstream_author: Cheng-I Wu
  upstream_license: CC-BY-NC-4.0
  license_url: https://creativecommons.org/licenses/by-nc/4.0/
  modification_notes: Adapted into a self-contained DevNexus-Research pipeline skill that dispatches bundled skills and records DevNexus artifacts instead of relying on an external ARS checkout.
  no_endorsement: DevNexus-Research does not imply endorsement by Cheng-I Wu or by Academic Research Skills.
---

# Academic Pipeline

Use this ARS-derived skill when the user wants an end-to-end research to paper
workflow. It orchestrates bundled DevNexus-Research skills and records durable
state in DevNexus artifacts. It does not require an external ARS checkout.

## Allowed Mutation Mode

Routing and artifact mutation. You may update pipeline state, handoff notes,
review packages, revision matrices, and artifact readiness records. Dispatch
manuscript edits only through an approved paper-writing or LaTeX authoring
scope.

## Artifact Inputs

- Research brief
- Source manifest
- Material passport
- Claim register
- LaTeX manuscript root and bibliography files
- Review package
- Revision matrix
- Export decision

## Artifact Outputs

- Pipeline stage note
- Skill dispatch recommendation
- Integrity checkpoint list
- Review and revision handoff
- Final artifact inventory

## Source Support

The pipeline does not invent research content. It routes work, checks
readiness, and enforces evidence and human checkpoints. Substantive research
claims must come from source-backed artifacts or explicitly marked user input.

## Human Checkpoints

Require user confirmation before moving between major stages: research scope,
paper plan, manuscript drafting, integrity check, review, revision, re-review,
and final export. Do not silently continue across a stage boundary that changes
research direction or manuscript text.

## Workflow

1. Detect the user's current stage: research, planning, drafting, integrity
   check, review, revision, re-review, finalization, or handoff.
2. Check whether required artifacts exist and name missing blockers.
3. Dispatch bundled skills:
   - `deep-research` for research and evidence synthesis
   - `academic-paper` for writing and revision
   - `academic-paper-reviewer` for review and re-review
   - `citation-claim-integrity` for support checks
   - `research-artifact-handoff` for final transfer
4. Record stage decisions in artifacts or work items.
5. Keep optional tools optional unless the project configuration marks them
   required.

## ARS Provenance And License

Adapted from Academic Research Skills `academic-pipeline/SKILL.md` by
Cheng-I Wu, upstream commit `af09cf54c1db55cb10148e0f11db94c389f8214d`,
source SHA-256
`cce007ae745b44b4bea69e331a51b07eacecf4cf234c29875387bc38266d0579`,
licensed `CC-BY-NC-4.0`. This adaptation is for DevNexus-Research packaging,
artifact conventions, and bundled baseline availability. No endorsement by the
upstream author or project is implied.
