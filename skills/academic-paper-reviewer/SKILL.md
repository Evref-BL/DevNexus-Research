---
name: academic-paper-reviewer
description: ARS-derived manuscript review skill for multi-perspective academic critique, methodology review, revision risk analysis, and re-review in DevNexus-Research.
metadata:
  origin: academic-research-skills
  relationship: adapted-from
  upstream_repository: https://github.com/Imbad0202/academic-research-skills
  upstream_source_path: academic-paper-reviewer/SKILL.md
  upstream_commit: af09cf54c1db55cb10148e0f11db94c389f8214d
  upstream_content_sha256: 7b594fdd5812e5d80ce094c420f14aa5e0759fe12567adea1c4d8edad7e71a36
  upstream_author: Cheng-I Wu
  upstream_license: CC-BY-NC-4.0
  license_url: https://creativecommons.org/licenses/by-nc/4.0/
  modification_notes: Adapted into a self-contained DevNexus-Research review skill with read-only review posture and DevNexus review-package outputs.
  no_endorsement: DevNexus-Research does not imply endorsement by Cheng-I Wu or by Academic Research Skills.
---

# Academic Paper Reviewer

Use this ARS-derived skill when the user asks for peer review, manuscript
critique, referee-style feedback, methodology review, re-review, or revision
risk analysis. It is bundled with DevNexus-Research and does not require an
external ARS checkout.

## Allowed Mutation Mode

Read only. Do not edit manuscripts or research artifacts from this skill unless
the user explicitly asks you to record review findings into a review package or
revision matrix.

## Artifact Inputs

- Manuscript root or draft export
- Research brief
- Source manifest
- Claim register
- Bibliography state
- Prior review package or revision matrix for re-review

## Artifact Outputs

- Review package
- Editorial decision rationale
- Methodology and evidence-risk notes
- Revision candidates
- Re-review verification notes

## Source Support

Treat review claims as accountable judgments. Cite manuscript locations,
artifact entries, source-manifest records, or bibliography keys where relevant.
Distinguish observed problems from reviewer preferences and from issues that
need human disciplinary judgment.

## Human Checkpoints

Ask whether the user wants a full review, quick assessment, methodology focus,
guided review, or re-review. The user decides which critiques become revision
tasks and which reviewer perspectives are out of scope.

## Workflow

1. Identify field, paper type, method, maturity, and review goal.
2. Review from multiple perspectives: editor fit, methodology, domain
   contribution, cross-disciplinary relevance, and strongest counterargument.
3. Separate blocking issues from optional improvements.
4. Flag unsupported claims, citation risks, missing limitations, and unclear
   contribution framing.
5. Produce a review package with severity, evidence, and suggested next action.
6. For re-review, compare changes against the revision matrix instead of
   restarting from a blank review.

## ARS Provenance And License

Adapted from Academic Research Skills `academic-paper-reviewer/SKILL.md` by
Cheng-I Wu, upstream commit `af09cf54c1db55cb10148e0f11db94c389f8214d`,
source SHA-256
`7b594fdd5812e5d80ce094c420f14aa5e0759fe12567adea1c4d8edad7e71a36`,
licensed `CC-BY-NC-4.0`. This adaptation is for DevNexus-Research packaging,
artifact conventions, and bundled baseline availability. No endorsement by the
upstream author or project is implied.
