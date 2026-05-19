---
name: citation-claim-integrity
description: Use to check whether claims, citations, sources, and bibliography state align.
---

# Citation Claim Integrity

Use this skill for evidence checks, citation gap analysis, claim-register
review, and provenance warnings.

## Allowed Mutation Mode

Read-only. Do not rewrite claims, citations, bibliography entries, or source
manifest records. Produce warnings and route approved fixes to revision or
LaTeX authoring.

## Artifact Inputs

- Claim register
- Source manifest
- Bibliography state
- Manuscript root or section text
- User-provided source excerpts when available

## Workflow

1. Enumerate claims in scope and map them to cited keys or source manifest
   entries.
2. Label each claim as supported, partially supported, unsupported, ambiguous,
   or unchecked.
3. Detect missing bibliography keys, orphaned citations, and source-provenance
   gaps.
4. Report warnings with location, evidence reference, and recommended action.

## Artifact Outputs

- Claim support warning list
- Citation gap list
- Integrity report
- Follow-up revision candidates

## Source Support

Only mark support when the cited source or user-supplied excerpt actually
supports the claim as written. Do not infer support from a title alone. Do not
invent source details or citation keys.

## Human Checkpoints

The human researcher decides whether flagged claims should be revised, removed,
further supported, or left with an explicit limitation.
