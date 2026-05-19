---
name: deep-research
description: ARS-derived deep research skill for guided scoping, literature review, evidence synthesis, fact-checking, and systematic review work inside DevNexus-Research projects.
metadata:
  origin: academic-research-skills
  relationship: adapted-from
  upstream_repository: https://github.com/Imbad0202/academic-research-skills
  upstream_source_path: deep-research/SKILL.md
  upstream_commit: af09cf54c1db55cb10148e0f11db94c389f8214d
  upstream_content_sha256: 527f7500420bc4872bd9a64f40e9b036ee825dc3a60eca49d6cdb7a1a06ef39d
  upstream_author: Cheng-I Wu
  upstream_license: CC-BY-NC-4.0
  license_url: https://creativecommons.org/licenses/by-nc/4.0/
  modification_notes: Adapted into a self-contained DevNexus-Research skill with DevNexus artifact names, human checkpoints, and no dependency on external ARS reference files.
  no_endorsement: DevNexus-Research does not imply endorsement by Cheng-I Wu or by Academic Research Skills.
---

# Deep Research

Use this ARS-derived skill when the user needs research scoping, literature
search planning, evidence synthesis, fact-checking, or a systematic review.
It is bundled with DevNexus-Research; do not require a user-provided ARS
checkout.

## Allowed Mutation Mode

Artifact mutation. You may update research artifacts such as the research
brief, source manifest, material passport, claim register, and handoff notes
when the user has approved the research scope. Do not edit manuscript text from
this skill.

## Artifact Inputs

- Research brief
- Source manifest
- Material passport
- Claim register
- Bibliography state
- User-provided source notes or constraints

## Artifact Outputs

- Scoped research question and method assumptions
- Literature-search strategy
- Source inclusion/exclusion notes
- Evidence synthesis notes
- Claim-support gaps and fact-check warnings
- Systematic-review or PRISMA planning notes when requested

## Source Support

Tie every substantive synthesis claim to a source-manifest entry, bibliography
key, quoted user-provided material, or an explicit "unsupported" warning. Do
not invent citations, papers, datasets, venues, DOIs, or effect sizes. Separate
source discovery plans from verified source facts.

## Human Checkpoints

Ask for human confirmation before locking the research question, method
boundary, inclusion/exclusion criteria, or any claim that changes the direction
of the project. Keep the user responsible for interpretation and final
research decisions.

## Workflow

1. Classify the request as guided scoping, quick brief, literature review,
   fact-check, systematic review, paper review for evidence quality, or full
   research synthesis.
2. Inspect available DevNexus-Research artifacts before starting new work.
3. If the user has a vague topic, use Socratic questioning before producing a
   report.
4. If the user has a clear question, produce a search plan and evidence matrix.
5. Record uncertainty, source gaps, and follow-up checks as artifact entries.
6. Hand off writing tasks to `academic-paper` or `paper-planning`; hand off
   review tasks to `academic-paper-reviewer`.

## ARS Provenance And License

Adapted from Academic Research Skills `deep-research/SKILL.md` by Cheng-I Wu,
upstream commit `af09cf54c1db55cb10148e0f11db94c389f8214d`, source SHA-256
`527f7500420bc4872bd9a64f40e9b036ee825dc3a60eca49d6cdb7a1a06ef39d`,
licensed `CC-BY-NC-4.0`. This adaptation is for DevNexus-Research packaging,
artifact conventions, and bundled baseline availability. No endorsement by the
upstream author or project is implied.
