---
name: latex-paper-authoring
description: Use to draft, edit, inspect, or diagnose LaTeX manuscripts in an approved scope.
---

# LaTeX Paper Authoring

Use this skill when the user asks for help with LaTeX paper text, structure,
citations, labels, figures, tables, or build-log diagnosis.

## Allowed Mutation Mode

Scoped manuscript mutation. Build-log diagnosis, root discovery, citation
checks, and label checks are read-only by default. Before editing manuscript
source, identify the exact root, file, section, environment, or label range and
get explicit human approval for that scope.

## Artifact Inputs

- LaTeX manuscript root
- LaTeX bibliography files or bibliography state
- LaTeX figure and table paths
- Claim register
- Source manifest
- LaTeX build report or compiler log when diagnosing builds
- Venue or style constraints when relevant

## Workflow

1. Identify the work mode: planning, drafting, editing, citation-key checking,
   label checking, figure/table reference checking, or build-log diagnosis.
2. Discover the manuscript root before source edits. Prefer configured artifact
   paths, then `\documentclass`, `\input`, `\include`, bibliography commands,
   and build-log paths.
3. Build an edit map for the approved scope: root file, included files,
   section heading, environment, labels, citation keys, bibliography files,
   figures, tables, and style files touched by the task.
4. For drafting or editing, ask for approval when the requested mutation scope
   is ambiguous. Preserve citation keys, labels, macros, package choices, and
   venue style constraints unless the user asks for a deliberate change.
5. Make the smallest useful scoped patch or produce a read-only diagnosis.
6. Record unresolved warnings, unsupported claims, missing citations, and
   build-tool gaps in the build report or handoff notes.

## Citation And Label Checks

- Extract citation keys from `\cite...{...}`, bibliography commands, and
  configured `.bib` files when available.
- Do not invent citation keys. Mark missing keys or unsupported claims rather
  than silently substituting sources.
- Check `\label`, `\ref`, `\eqref`, figure, table, section, theorem, and
  appendix references within the approved scope.
- Treat broad bibliography rewrites and global key renames as separate
  mutation requests requiring explicit approval.

## Build Log Diagnosis

- Separate missing local tools from LaTeX source errors.
- Identify the failing command, engine, bibliography backend, first actionable
  error, repeated warnings, missing files, overfull boxes when relevant, and
  unresolved references or citations.
- Prefer a build report update over manuscript edits unless the user asks for
  a source patch and approves the patch scope.

## Artifact Outputs

- Scoped manuscript patch or draft text
- Citation and label notes
- LaTeX build diagnosis
- Build report updates or unresolved warning list

## Source Support

Do not add factual claims without source support from the claim register,
source manifest, bibliography keys, or user-provided material. Do not invent
citation keys. Mark missing citations and unsupported claims explicitly.

## Human Checkpoints

The human researcher approves the edit scope before mutation and reviews final
manuscript text before submission, sharing, or publication.
