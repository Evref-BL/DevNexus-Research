import type { NexusPluginCapabilityRecord, NexusProjectPluginConfig } from "dev-nexus";
import { devNexusResearchArsCodexRepositoryUrl } from "./arsProviderIntegrations.js";
import {
  devNexusResearchArsNoEndorsementNotice,
  devNexusResearchArsUpstreamCommit,
  devNexusResearchLicense,
  devNexusResearchLicenseUrl,
} from "./researchSkillProvenance.js";
import { devNexusResearchSkills } from "./researchSkills.js";

export const devNexusResearchPluginId = "dev-nexus-research";
export const devNexusResearchPluginName = "DevNexus Research";
export const devNexusResearchPluginVersion = "0.1.0-alpha.0";

function paragraph(...sentences: string[]): string {
  return sentences.join(" ");
}

export const devNexusResearchPluginCapabilities: NexusPluginCapabilityRecord[] = [
  ...devNexusResearchSkills.map(
    (skill): NexusPluginCapabilityRecord => ({
      kind: "projected_skill",
      id: `skill:${skill.id}`,
      skillId: skill.id,
      description: skill.description,
      targetAgents: ["codex"],
    }),
  ),
  {
    kind: "setup_obligation",
    id: "setup:baseline-artifacts",
    description: paragraph(
      "Research projects should declare artifact locations for the research brief, source manifest,",
      "claim register, and handoff notes before assigning evidence-sensitive work.",
    ),
    required: false,
  },
  {
    kind: "setup_obligation",
    id: "setup:optional-latex-toolchain",
    description: paragraph(
      "Local LaTeX compilation tools are optional; report missing TeX, BibTeX, Biber,",
      "and lint tools as capability gaps unless the project requires local PDF builds.",
    ),
    required: false,
  },
  {
    kind: "environment_hint",
    id: "env:research-artifact-root",
    variable: "DEV_NEXUS_RESEARCH_ARTIFACT_ROOT",
    valueHint: ".dev-nexus/research",
    required: false,
  },
  {
    kind: "environment_hint",
    id: "env:latex-manuscript-root",
    variable: "DEV_NEXUS_RESEARCH_LATEX_ROOT",
    valueHint: "paper/main.tex",
    required: false,
  },
  {
    kind: "environment_hint",
    id: "env:latex-bibliography-files",
    variable: "DEV_NEXUS_RESEARCH_LATEX_BIBLIOGRAPHY_FILES",
    valueHint: "paper/references.bib",
    required: false,
  },
  {
    kind: "environment_hint",
    id: "env:latex-figure-paths",
    variable: "DEV_NEXUS_RESEARCH_LATEX_FIGURE_PATHS",
    valueHint: "paper/figures",
    required: false,
  },
  {
    kind: "environment_hint",
    id: "env:latex-table-paths",
    variable: "DEV_NEXUS_RESEARCH_LATEX_TABLE_PATHS",
    valueHint: "paper/tables",
    required: false,
  },
  {
    kind: "agent_affordance",
    id: "affordance:research-workflow-routing",
    description: paragraph(
      "Use the research workflow router before choosing paper planning, literature review,",
      "LaTeX authoring, review, revision, or handoff mode.",
    ),
  },
  {
    kind: "agent_affordance",
    id: "affordance:read-only-integrity-checks",
    description: paragraph(
      "Treat citation, claim-support, and manuscript review work as read-only until the user",
      "explicitly approves a revision or manuscript edit scope.",
    ),
  },
  {
    kind: "agent_affordance",
    id: "affordance:bundled-ars-derived-skills",
    description: paragraph(
      "Use bundled ARS-derived skills directly for the Research baseline without requiring an external ARS checkout,",
      "and preserve attribution, modification notes, license, and no-endorsement language when discussing provenance.",
    ),
  },
  {
    kind: "agent_affordance",
    id: "affordance:ars-provider-native-first",
    description: paragraph(
      "Prefer provider-native ARS surfaces when the active agent supports them: Claude Code should use the",
      "academic-research-skills plugin as-is, Codex should prefer the academic-research-suite skill package,",
      "and bundled DevNexus-Research ARS-derived skills are the fallback when no native or shim package is available.",
    ),
  },
  {
    kind: "worker_briefing_fragment",
    id: "briefing:ars-provider-native-first",
    title: "ARS Provider-Native Preference",
    provenance: "dev-nexus-research package",
    body: paragraph(
      "DevNexus-Research keeps DevNexus core generic by preferring provider-native ARS packages when available.",
      "For Claude Code targets, use the native Academic Research Skills plugin from Imbad0202/academic-research-skills as-is.",
      `For Codex targets, prefer the Codex-native academic-research-suite package from ${devNexusResearchArsCodexRepositoryUrl}.`,
      "For OpenCode and other providers, use provider-specific shims when they exist; otherwise use the bundled ARS-derived fallback skills.",
      "All ARS-derived or ARS-distributed surfaces remain under CC-BY-NC-4.0 attribution and no-endorsement rules.",
    ),
  },
  {
    kind: "worker_briefing_fragment",
    id: "briefing:ars-derived-skill-provenance",
    title: "ARS-Derived Skill Provenance",
    provenance: "dev-nexus-research package",
    body: paragraph(
      `DevNexus-Research is distributed as ${devNexusResearchLicense} (${devNexusResearchLicenseUrl}).`,
      "The bundled deep-research, academic-paper, academic-paper-reviewer, and academic-pipeline skills are adapted from Academic Research Skills.",
      `Upstream commit: ${devNexusResearchArsUpstreamCommit}.`,
      "Preserve per-skill upstream source path, source hash, original author, modification notes, license text/link, and no-endorsement notices from the package provenance table.",
      devNexusResearchArsNoEndorsementNotice,
    ),
  },
  {
    kind: "worker_context_fragment",
    id: "context:research-artifacts",
    title: "DevNexus-Research Artifacts",
    provenance: "dev-nexus-research package",
    body: paragraph(
      "Prefer durable project artifacts over chat memory: research brief, source manifest,",
      "material passport, claim register, LaTeX manuscript root, bibliography files,",
      "figure paths, table paths, bibliography state, build report, review package,",
      "revision matrix, and handoff notes.",
    ),
  },
  {
    kind: "worker_briefing_fragment",
    id: "briefing:human-checkpoints",
    title: "Research Human Checkpoints",
    provenance: "dev-nexus-research package",
    body: paragraph(
      "Keep the human researcher responsible for research questions, method choices, interpretation,",
      "authorship, venue disclosure, and final manuscript text.",
      "Record decisions in artifacts or work items before downstream mutation.",
    ),
  },
  {
    kind: "worker_briefing_fragment",
    id: "briefing:evidence-and-claims",
    title: "Evidence And Claim Support",
    provenance: "dev-nexus-research package",
    body: paragraph(
      "Do not present unsupported claims as established facts.",
      "Tie substantive claims to source manifest entries, bibliography keys,",
      "or explicit user-provided evidence, and report gaps as warnings instead of silently fabricating support.",
    ),
  },
  {
    kind: "worker_briefing_fragment",
    id: "briefing:source-provenance",
    title: "Source Provenance",
    provenance: "dev-nexus-research package",
    body: paragraph(
      "Preserve provenance for sources, summaries, datasets, excerpts, and generated review notes.",
      "Distinguish user-provided material, public sources, derived synthesis,",
      "and optional external tool output.",
    ),
  },
  {
    kind: "worker_briefing_fragment",
    id: "briefing:latex-mutation-policy",
    title: "LaTeX Manuscript Mutation Policy",
    provenance: "dev-nexus-research package",
    body: paragraph(
      "Before editing a LaTeX manuscript, identify the root file, bibliography files,",
      "and requested section scope.",
      "Make scoped patches only after explicit approval, preserve citation keys and labels,",
      "and separate build-log diagnosis from source edits.",
    ),
  },
];

export function devNexusResearchDevNexusPluginConfig(): NexusProjectPluginConfig {
  return {
    id: devNexusResearchPluginId,
    name: devNexusResearchPluginName,
    version: devNexusResearchPluginVersion,
    enabled: true,
    capabilities: devNexusResearchPluginCapabilities,
  };
}
