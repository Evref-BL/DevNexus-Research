export const devNexusResearchLicense = "CC-BY-NC-4.0";
export const devNexusResearchLicenseTextPath = "LICENSE";
export const devNexusResearchLicenseUrl = "https://creativecommons.org/licenses/by-nc/4.0/";
export const devNexusResearchArsUpstreamRepositoryUrl =
  "https://github.com/Imbad0202/academic-research-skills";
export const devNexusResearchArsUpstreamCommit = "af09cf54c1db55cb10148e0f11db94c389f8214d";
export const devNexusResearchArsUpstreamAuthor = "Cheng-I Wu";
export const devNexusResearchArsNoEndorsementNotice =
  "DevNexus-Research does not imply endorsement by Cheng-I Wu or by the upstream Academic Research Skills project.";

export type DevNexusResearchSkillOrigin = "devnexus-original" | "ars-derived";

export type DevNexusResearchSkillProvenanceRelationship = "verbatim-vendored" | "adapted-from";

export interface DevNexusResearchSkillProvenance {
  skillId: string;
  origin: "academic-research-skills";
  relationship: DevNexusResearchSkillProvenanceRelationship;
  upstreamRepositoryUrl: string;
  upstreamSourcePath: string;
  upstreamCommit: string;
  upstreamContentSha256: string;
  upstreamAuthor: string;
  upstreamLicense: typeof devNexusResearchLicense;
  upstreamLicenseTextPath: typeof devNexusResearchLicenseTextPath;
  upstreamLicenseUrl: typeof devNexusResearchLicenseUrl;
  modificationNotes: string;
  noEndorsementNotice: string;
}

function arsSkillProvenance(
  skillId: string,
  upstreamSourcePath: string,
  upstreamContentSha256: string,
  modificationNotes: string,
): DevNexusResearchSkillProvenance {
  return {
    skillId,
    origin: "academic-research-skills",
    relationship: "adapted-from",
    upstreamRepositoryUrl: devNexusResearchArsUpstreamRepositoryUrl,
    upstreamSourcePath,
    upstreamCommit: devNexusResearchArsUpstreamCommit,
    upstreamContentSha256,
    upstreamAuthor: devNexusResearchArsUpstreamAuthor,
    upstreamLicense: devNexusResearchLicense,
    upstreamLicenseTextPath: devNexusResearchLicenseTextPath,
    upstreamLicenseUrl: devNexusResearchLicenseUrl,
    modificationNotes,
    noEndorsementNotice: devNexusResearchArsNoEndorsementNotice,
  };
}

export const devNexusResearchArsSkillProvenance = [
  arsSkillProvenance(
    "deep-research",
    "deep-research/SKILL.md",
    "527f7500420bc4872bd9a64f40e9b036ee825dc3a60eca49d6cdb7a1a06ef39d",
    "Adapted into a self-contained DevNexus-Research skill with DevNexus artifact names, human checkpoints, and no dependency on external ARS reference files.",
  ),
  arsSkillProvenance(
    "academic-paper",
    "academic-paper/SKILL.md",
    "2578aaf434336672071558ac2a5872fe998e48f7c610510723f3b7ec78fe3aae",
    "Adapted into a self-contained DevNexus-Research paper-writing skill with LaTeX artifact conventions and no dependency on external ARS reference files.",
  ),
  arsSkillProvenance(
    "academic-paper-reviewer",
    "academic-paper-reviewer/SKILL.md",
    "7b594fdd5812e5d80ce094c420f14aa5e0759fe12567adea1c4d8edad7e71a36",
    "Adapted into a self-contained DevNexus-Research review skill with read-only review posture and DevNexus review-package outputs.",
  ),
  arsSkillProvenance(
    "academic-pipeline",
    "academic-pipeline/SKILL.md",
    "cce007ae745b44b4bea69e331a51b07eacecf4cf234c29875387bc38266d0579",
    "Adapted into a self-contained DevNexus-Research pipeline skill that dispatches bundled skills and records DevNexus artifacts instead of relying on an external ARS checkout.",
  ),
] as const satisfies readonly DevNexusResearchSkillProvenance[];

export function devNexusResearchArsSkillProvenanceBySkillId(
  skillId: string,
): DevNexusResearchSkillProvenance | undefined {
  return devNexusResearchArsSkillProvenance.find((provenance) => provenance.skillId === skillId);
}
