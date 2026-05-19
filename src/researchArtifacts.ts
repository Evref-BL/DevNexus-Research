export const devNexusResearchArtifactIds = [
  "research-brief",
  "source-manifest",
  "material-passport",
  "claim-register",
  "latex-manuscript-root",
  "latex-bibliography-files",
  "latex-figure-paths",
  "latex-table-paths",
  "bibliography-state",
  "latex-build-report",
  "review-package",
  "revision-matrix",
  "export-decision",
] as const;

export type DevNexusResearchArtifactId = (typeof devNexusResearchArtifactIds)[number];

export type DevNexusResearchArtifactKind =
  | "brief"
  | "manifest"
  | "passport"
  | "register"
  | "manuscript"
  | "bibliography"
  | "asset_index"
  | "report"
  | "review"
  | "revision"
  | "decision";

export type DevNexusResearchArtifactPathScope = "research_artifact" | "project_source";

export interface DevNexusResearchArtifactConvention {
  id: DevNexusResearchArtifactId;
  title: string;
  kind: DevNexusResearchArtifactKind;
  description: string;
  defaultPath: string;
  pathScope: DevNexusResearchArtifactPathScope;
  requiredForBaseline: boolean;
  mutableByDefault: boolean;
}

export interface DevNexusResearchResolvedArtifactConvention extends DevNexusResearchArtifactConvention {
  path: string;
  configured: boolean;
}

export interface DevNexusResearchArtifactConfig {
  artifactRoot?: string;
  paths?: Partial<Record<DevNexusResearchArtifactId, string>>;
}

export const devNexusResearchDefaultArtifactRoot = ".dev-nexus/research";

export const devNexusResearchArtifactConventions: DevNexusResearchArtifactConvention[] = [
  {
    id: "research-brief",
    title: "Research Brief",
    kind: "brief",
    description: "Human-approved research question, scope, constraints, and current decision state.",
    defaultPath: "research-brief.md",
    pathScope: "research_artifact",
    requiredForBaseline: true,
    mutableByDefault: true,
  },
  {
    id: "source-manifest",
    title: "Source Manifest",
    kind: "manifest",
    description: "Structured source inventory with provenance, access notes, and inclusion decisions.",
    defaultPath: "source-manifest.json",
    pathScope: "research_artifact",
    requiredForBaseline: true,
    mutableByDefault: true,
  },
  {
    id: "material-passport",
    title: "Material Passport",
    kind: "passport",
    description: "Boundary record for datasets, excerpts, private material, permissions, and reuse limits.",
    defaultPath: "material-passport.json",
    pathScope: "research_artifact",
    requiredForBaseline: false,
    mutableByDefault: true,
  },
  {
    id: "claim-register",
    title: "Claim Register",
    kind: "register",
    description: "Traceable claim list with evidence state, source links, and unresolved support gaps.",
    defaultPath: "claim-register.json",
    pathScope: "research_artifact",
    requiredForBaseline: true,
    mutableByDefault: true,
  },
  {
    id: "latex-manuscript-root",
    title: "LaTeX Manuscript Root",
    kind: "manuscript",
    description: "Primary LaTeX entrypoint for scoped paper authoring and build-log diagnosis.",
    defaultPath: "paper/main.tex",
    pathScope: "project_source",
    requiredForBaseline: false,
    mutableByDefault: false,
  },
  {
    id: "latex-bibliography-files",
    title: "LaTeX Bibliography Files",
    kind: "bibliography",
    description: "Primary BibTeX or BibLaTeX file path used for citation-key checks and build readiness.",
    defaultPath: "paper/references.bib",
    pathScope: "project_source",
    requiredForBaseline: false,
    mutableByDefault: false,
  },
  {
    id: "latex-figure-paths",
    title: "LaTeX Figure Paths",
    kind: "asset_index",
    description: "Default figure directory or path index used when checking figure references and manuscript assets.",
    defaultPath: "paper/figures",
    pathScope: "project_source",
    requiredForBaseline: false,
    mutableByDefault: false,
  },
  {
    id: "latex-table-paths",
    title: "LaTeX Table Paths",
    kind: "asset_index",
    description: "Default table directory or path index used when checking table references and manuscript assets.",
    defaultPath: "paper/tables",
    pathScope: "project_source",
    requiredForBaseline: false,
    mutableByDefault: false,
  },
  {
    id: "bibliography-state",
    title: "Bibliography State",
    kind: "bibliography",
    description: "Bibliography files, citation-key status, and BibTeX or Biber readiness notes.",
    defaultPath: "bibliography-state.json",
    pathScope: "research_artifact",
    requiredForBaseline: false,
    mutableByDefault: true,
  },
  {
    id: "latex-build-report",
    title: "LaTeX Build Report",
    kind: "report",
    description: "Latest build command, available tools, unresolved warnings, and missing-tool notes.",
    defaultPath: "latex-build-report.md",
    pathScope: "research_artifact",
    requiredForBaseline: false,
    mutableByDefault: true,
  },
  {
    id: "review-package",
    title: "Review Package",
    kind: "review",
    description: "Read-only manuscript critique, reviewer risks, and author decision prompts.",
    defaultPath: "review-package.md",
    pathScope: "research_artifact",
    requiredForBaseline: false,
    mutableByDefault: true,
  },
  {
    id: "revision-matrix",
    title: "Revision Matrix",
    kind: "revision",
    description: "Traceable review responses, accepted changes, rejected suggestions, and open decisions.",
    defaultPath: "revision-matrix.md",
    pathScope: "research_artifact",
    requiredForBaseline: false,
    mutableByDefault: true,
  },
  {
    id: "export-decision",
    title: "Export Decision",
    kind: "decision",
    description: "Human-approved sharing, submission, disclosure, and export readiness decision.",
    defaultPath: "export-decision.md",
    pathScope: "research_artifact",
    requiredForBaseline: false,
    mutableByDefault: true,
  },
];

function cleanPathPart(part: string): string {
  return part.replace(/^\/+|\/+$/g, "");
}

function joinRelativePath(root: string, path: string): string {
  if (path.startsWith("/") || path.startsWith("./") || path.startsWith("../")) {
    return path;
  }

  const cleanedRoot = cleanPathPart(root);
  if (cleanedRoot.length === 0) {
    return path;
  }

  return `${cleanedRoot}/${cleanPathPart(path)}`;
}

export function resolveDevNexusResearchArtifactConventions(
  config: DevNexusResearchArtifactConfig = {},
): DevNexusResearchResolvedArtifactConvention[] {
  const artifactRoot = config.artifactRoot ?? devNexusResearchDefaultArtifactRoot;
  const pathOverrides = config.paths ?? {};

  return devNexusResearchArtifactConventions.map((convention) => {
    const configuredPath = pathOverrides[convention.id];
    const rootRelativePath =
      convention.pathScope === "project_source"
        ? convention.defaultPath
        : joinRelativePath(artifactRoot, convention.defaultPath);

    return {
      ...convention,
      path: configuredPath ?? rootRelativePath,
      configured: configuredPath !== undefined,
    };
  });
}
