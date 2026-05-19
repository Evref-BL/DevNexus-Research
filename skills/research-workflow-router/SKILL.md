---
name: research-workflow-router
description: Use to route research tasks to the right DevNexus-Research workflow and artifacts.
---

# Research Workflow Router

Use this skill first when the user asks for research help and the right mode is
not already explicit. Keep the decision grounded in the project artifacts, then
route to a narrower DevNexus-Research skill.

## Allowed Mutation Mode

Routing only. Do not edit manuscripts, bibliographies, source manifests, claim
registers, review packages, or revision matrices from this skill. If an
artifact is missing, report the gap and name the next skill or work item.

## Artifact Inputs

- Research brief or current research goal
- Source manifest and bibliography state when available
- Claim register when claims already exist
- LaTeX manuscript root when paper text exists
- Review package or revision matrix when the user is responding to feedback

## Workflow

1. Identify the user's immediate intent: scope, find and synthesize sources,
   plan a paper, draft or edit LaTeX, review a manuscript, check claims,
   plan revisions, or hand off state.
2. Check which durable artifacts exist and which are only in chat.
3. Select one primary skill and, if useful, one follow-up skill.
4. State the selected mode, allowed mutation level, required artifacts, and
   human checkpoint before any downstream mutation.

## Artifact Outputs

- Workflow selection note
- Recommended next skill
- Artifact readiness notes
- Blockers or missing artifact list

## Source Support

Do not infer source support from memory. If the selected workflow depends on
sources, require source manifest entries, bibliography keys, or explicit
user-provided material before treating a claim as supported.

## Human Checkpoints

Ask for confirmation before moving from routing into any workflow that mutates
project artifacts or manuscript text. The human researcher owns the research
question, methods, authorship, and final publication decisions.
