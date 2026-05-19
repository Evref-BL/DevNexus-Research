import { spawnSync } from "node:child_process";
import type { NexusProjectConfig } from "dev-nexus";
import {
  type DevNexusResearchArtifactConfig,
  type DevNexusResearchArtifactId,
  devNexusResearchArtifactIds,
  resolveDevNexusResearchArtifactConventions,
} from "./researchArtifacts.js";

export type DevNexusResearchSetupCategory =
  | "artifacts"
  | "latex"
  | "document_export"
  | "bibliography"
  | "corpus"
  | "external_index"
  | "external_skill";

export type DevNexusResearchSetupItemStatus = "present" | "configured" | "optional_missing" | "required_missing";

export interface DevNexusResearchSetupItem {
  category: DevNexusResearchSetupCategory;
  id: string;
  label: string;
  status: DevNexusResearchSetupItemStatus;
  required: boolean;
  path?: string;
  command?: string;
  note?: string;
}

export interface DevNexusResearchLatexReadiness {
  manuscriptRoot: string;
  bibliographyFiles: string[];
  figurePaths: string[];
  tablePaths: string[];
  buildReportPath: string;
  localCompilation: {
    required: boolean;
    available: boolean;
    availableTools: string[];
    missingOptionalTools: string[];
  };
  citationTools: {
    available: boolean;
    availableTools: string[];
  };
  lint: {
    available: boolean;
    availableTools: string[];
  };
}

export interface DevNexusResearchExternalProfileConfig {
  id: string;
  label?: string;
  configured?: boolean;
  required?: boolean;
}

export interface DevNexusResearchSetupOptions {
  artifacts?: DevNexusResearchArtifactConfig;
  commandPresence?: Record<string, boolean>;
  requiredArtifactIds?: string[];
  requireLocalLatexCompilation?: boolean;
  requiredLatexTools?: string[];
  requiredDocumentExportTools?: string[];
  requiredBibliographyTools?: string[];
  requiredCorpusAdapters?: string[];
  documentExportTools?: string[];
  bibliographyTools?: string[];
  corpusAdapters?: string[];
  externalIndexProfiles?: DevNexusResearchExternalProfileConfig[];
  externalSkills?: DevNexusResearchExternalProfileConfig[];
  externalSkillAvailability?: Record<string, boolean>;
  requiredExternalSkillIds?: string[];
}

export const devNexusResearchProjectExtensionKey = "dev-nexus-research";

export interface DevNexusResearchProjectExtensionConfig {
  artifacts?: DevNexusResearchArtifactConfig;
  setup?: DevNexusResearchSetupOptions;
}

export interface DevNexusResearchSetupStatus {
  ready: boolean;
  baselineMode: {
    noNetwork: boolean;
    noLatex: boolean;
    noZotero: boolean;
  };
  latex: DevNexusResearchLatexReadiness;
  artifacts: DevNexusResearchSetupItem[];
  tools: DevNexusResearchSetupItem[];
  external: DevNexusResearchSetupItem[];
  blockers: string[];
  warnings: string[];
}

const latexTools = ["latexmk", "pdflatex", "xelatex", "lualatex", "tectonic", "bibtex", "biber", "chktex"];
const latexCompilationTools = ["latexmk", "pdflatex", "xelatex", "lualatex", "tectonic"];
const latexCitationTools = ["bibtex", "biber"];
const latexLintTools = ["chktex"];
const defaultDocumentExportTools = ["pandoc"];
const defaultBibliographyTools = ["zotero"];
const defaultCorpusAdapters = ["zotero", "obsidian"];

function quoteShellArg(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function commandExists(command: string, commandPresence?: Record<string, boolean>): boolean {
  if (commandPresence && command in commandPresence) {
    return commandPresence[command] === true;
  }

  const result = spawnSync("sh", ["-lc", `command -v ${quoteShellArg(command)}`], {
    stdio: "ignore",
  });
  return result.status === 0;
}

function setupItemStatus(present: boolean, required: boolean): DevNexusResearchSetupItemStatus {
  if (present) {
    return "present";
  }

  return required ? "required_missing" : "optional_missing";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const strings = value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  return strings.length === value.length ? strings : undefined;
}

function optionalBooleanRecord(value: unknown): Record<string, boolean> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const record: Record<string, boolean> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "boolean") {
      record[key] = entry;
    }
  }

  return Object.keys(record).length > 0 ? record : undefined;
}

function optionalExternalProfiles(value: unknown): DevNexusResearchExternalProfileConfig[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const profiles = value.flatMap((entry): DevNexusResearchExternalProfileConfig[] => {
    if (!isRecord(entry) || typeof entry.id !== "string" || entry.id.length === 0) {
      return [];
    }

    return [
      {
        id: entry.id,
        ...(typeof entry.label === "string" ? { label: entry.label } : {}),
        ...(typeof entry.configured === "boolean" ? { configured: entry.configured } : {}),
        ...(typeof entry.required === "boolean" ? { required: entry.required } : {}),
      },
    ];
  });

  return profiles;
}

function optionalArtifactConfig(value: unknown): DevNexusResearchArtifactConfig | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const artifactRoot = optionalString(value.artifactRoot);
  const pathsRecord = isRecord(value.paths) ? value.paths : undefined;
  const paths: Partial<Record<DevNexusResearchArtifactId, string>> = {};
  if (pathsRecord) {
    for (const artifactId of devNexusResearchArtifactIds) {
      const configuredPath = optionalString(pathsRecord[artifactId]);
      if (configuredPath) {
        paths[artifactId] = configuredPath;
      }
    }
  }

  return {
    ...(artifactRoot ? { artifactRoot } : {}),
    ...(Object.keys(paths).length > 0 ? { paths } : {}),
  };
}

function mergeSetupOptions(
  base: DevNexusResearchSetupOptions,
  override: DevNexusResearchSetupOptions,
): DevNexusResearchSetupOptions {
  return {
    ...base,
    ...override,
    artifacts: override.artifacts ?? base.artifacts,
    commandPresence: override.commandPresence ?? base.commandPresence,
    externalIndexProfiles: override.externalIndexProfiles ?? base.externalIndexProfiles,
    externalSkills: override.externalSkills ?? base.externalSkills,
    externalSkillAvailability: override.externalSkillAvailability ?? base.externalSkillAvailability,
  };
}

function requiredSet(values: readonly string[] | undefined): Set<string> {
  return new Set(values ?? []);
}

function toolItems(
  category: DevNexusResearchSetupCategory,
  commands: readonly string[],
  requiredCommands: Set<string>,
  commandPresence?: Record<string, boolean>,
): DevNexusResearchSetupItem[] {
  return commands.map((command) => {
    const required = requiredCommands.has(command);
    const present = commandExists(command, commandPresence);
    return {
      category,
      id: command,
      label: command,
      command,
      status: setupItemStatus(present, required),
      required,
    };
  });
}

function artifactPath(
  artifacts: readonly DevNexusResearchSetupItem[],
  artifactId: DevNexusResearchArtifactId,
): string {
  return artifacts.find((artifact) => artifact.id === artifactId)?.path ?? "";
}

function availableToolIds(
  tools: readonly DevNexusResearchSetupItem[],
  toolIds: readonly string[],
): string[] {
  return tools
    .filter((tool) => toolIds.includes(tool.id) && tool.status === "present")
    .map((tool) => tool.id);
}

export function devNexusResearchProjectExtensionConfig(
  config: Pick<NexusProjectConfig, "extensions">,
): DevNexusResearchProjectExtensionConfig {
  const extension = config.extensions?.[devNexusResearchProjectExtensionKey];
  if (!isRecord(extension)) {
    return {};
  }

  const artifacts = optionalArtifactConfig(extension.artifacts);
  const setupRecord = isRecord(extension.setup) ? extension.setup : {};
  const setup: DevNexusResearchSetupOptions = {};
  const requireLocalLatexCompilation = optionalBoolean(setupRecord.requireLocalLatexCompilation);

  const stringArrayKeys = [
    "requiredArtifactIds",
    "requiredLatexTools",
    "requiredDocumentExportTools",
    "requiredBibliographyTools",
    "requiredCorpusAdapters",
    "documentExportTools",
    "bibliographyTools",
    "corpusAdapters",
    "requiredExternalSkillIds",
  ] as const;
  for (const key of stringArrayKeys) {
    const value = optionalStringArray(setupRecord[key]);
    if (value) {
      setup[key] = value;
    }
  }

  if (artifacts) {
    setup.artifacts = artifacts;
  }
  if (requireLocalLatexCompilation !== undefined) {
    setup.requireLocalLatexCompilation = requireLocalLatexCompilation;
  }
  const externalIndexProfiles = optionalExternalProfiles(setupRecord.externalIndexProfiles);
  if (externalIndexProfiles) {
    setup.externalIndexProfiles = externalIndexProfiles;
  }
  const externalSkills = optionalExternalProfiles(setupRecord.externalSkills);
  if (externalSkills) {
    setup.externalSkills = externalSkills;
  }
  const externalSkillAvailability = optionalBooleanRecord(setupRecord.externalSkillAvailability);
  if (externalSkillAvailability) {
    setup.externalSkillAvailability = externalSkillAvailability;
  }

  return {
    ...(artifacts ? { artifacts } : {}),
    setup,
  };
}

export function devNexusResearchSetupOptionsFromProjectConfig(
  config: Pick<NexusProjectConfig, "extensions">,
): DevNexusResearchSetupOptions {
  return devNexusResearchProjectExtensionConfig(config).setup ?? {};
}

export function createDevNexusResearchSetupStatusFromProjectConfig(
  config: Pick<NexusProjectConfig, "extensions">,
  options: DevNexusResearchSetupOptions = {},
): DevNexusResearchSetupStatus {
  return createDevNexusResearchSetupStatus(
    mergeSetupOptions(devNexusResearchSetupOptionsFromProjectConfig(config), options),
  );
}

export function createDevNexusResearchSetupStatus(
  options: DevNexusResearchSetupOptions = {},
): DevNexusResearchSetupStatus {
  const requiredArtifactIds = requiredSet(options.requiredArtifactIds);
  const resolvedArtifacts = resolveDevNexusResearchArtifactConventions(options.artifacts);
  const artifacts = resolvedArtifacts.map((artifact) => {
    const required = artifact.requiredForBaseline || requiredArtifactIds.has(artifact.id);
    return {
      category: "artifacts" as const,
      id: artifact.id,
      label: artifact.title,
      path: artifact.path,
      status: "configured" as const,
      required,
      note: artifact.mutableByDefault
        ? "Artifact can be updated by approved workflows."
        : "Mutation requires explicit scope.",
    };
  });

  const requiredLatexTools = new Set(options.requiredLatexTools ?? []);

  const latexToolItems = toolItems("latex", latexTools, requiredLatexTools, options.commandPresence);
  const localLatexCompilationAvailable = latexToolItems.some(
    (item) => latexCompilationTools.includes(item.id) && item.status === "present",
  );
  const localLatexCompilationItem: DevNexusResearchSetupItem[] = options.requireLocalLatexCompilation
    ? [
        {
          category: "latex",
          id: "local-latex-compilation",
          label: "Local LaTeX compilation",
          status: localLatexCompilationAvailable ? "present" : "required_missing",
          required: true,
          note: "At least one LaTeX compiler or latexmk must be available when local compilation is required.",
        },
      ]
    : [];

  const tools = [
    ...latexToolItems,
    ...localLatexCompilationItem,
    ...toolItems(
      "document_export",
      options.documentExportTools ?? defaultDocumentExportTools,
      requiredSet(options.requiredDocumentExportTools),
      options.commandPresence,
    ),
    ...toolItems(
      "bibliography",
      options.bibliographyTools ?? defaultBibliographyTools,
      requiredSet(options.requiredBibliographyTools),
      options.commandPresence,
    ),
    ...toolItems(
      "corpus",
      options.corpusAdapters ?? defaultCorpusAdapters,
      requiredSet(options.requiredCorpusAdapters),
      options.commandPresence,
    ),
  ];

  const availableCompilationTools = availableToolIds(tools, latexCompilationTools);
  const availableCitationTools = availableToolIds(tools, latexCitationTools);
  const availableLintTools = availableToolIds(tools, latexLintTools);
  const missingOptionalLatexTools = latexToolItems
    .filter((item) => item.status === "optional_missing")
    .map((item) => item.id);

  const externalSkillRequirements = requiredSet(options.requiredExternalSkillIds);
  const availableExternalSkills = options.externalSkillAvailability ?? {};
  const externalSkillIds = new Set([
    ...Object.keys(availableExternalSkills),
    ...(options.externalSkills ?? []).map((skill) => skill.id),
    ...externalSkillRequirements,
  ]);
  const externalSkillLabels = new Map(
    (options.externalSkills ?? []).map((skill) => [skill.id, skill.label ?? skill.id]),
  );
  const externalSkills = [...externalSkillIds].sort().map((skillId) => {
    const configured =
      availableExternalSkills[skillId] === true || (options.externalSkills ?? []).some((skill) => skill.id === skillId);
    const required = externalSkillRequirements.has(skillId);
    return {
      category: "external_skill" as const,
      id: skillId,
      label: externalSkillLabels.get(skillId) ?? skillId,
      status: configured ? ("configured" as const) : setupItemStatus(false, required),
      required,
      note: "External skill availability is advisory; DevNexus-Research owns its baseline skill source.",
    };
  });

  const externalIndexProfiles = (options.externalIndexProfiles ?? []).map((profile) => {
    const configured = profile.configured === true;
    const required = profile.required === true;
    return {
      category: "external_index" as const,
      id: profile.id,
      label: profile.label ?? profile.id,
      status: configured ? ("configured" as const) : setupItemStatus(false, required),
      required,
      note: "External index/API profiles are optional and should not be used in no-network baseline mode.",
    };
  });

  const external = [...externalSkills, ...externalIndexProfiles];
  const allItems = [...artifacts, ...tools, ...external];
  const blockers = allItems
    .filter((item) => item.status === "required_missing")
    .map((item) => `${item.label} is required but missing.`);
  const warnings = allItems
    .filter((item) => item.status === "optional_missing")
    .map((item) => `${item.label} is optional and not available.`);
  const anyLatexToolPresent = tools.some((item) => item.category === "latex" && item.status === "present");
  const anyNetworkProfileConfigured = externalIndexProfiles.some((item) => item.status === "configured");
  const zoteroPresent = tools.some((item) => item.id === "zotero" && item.status === "present");

  return {
    ready: blockers.length === 0,
    baselineMode: {
      noNetwork: !anyNetworkProfileConfigured,
      noLatex: !anyLatexToolPresent,
      noZotero: !zoteroPresent,
    },
    latex: {
      manuscriptRoot: artifactPath(artifacts, "latex-manuscript-root"),
      bibliographyFiles: [artifactPath(artifacts, "latex-bibliography-files")],
      figurePaths: [artifactPath(artifacts, "latex-figure-paths")],
      tablePaths: [artifactPath(artifacts, "latex-table-paths")],
      buildReportPath: artifactPath(artifacts, "latex-build-report"),
      localCompilation: {
        required: options.requireLocalLatexCompilation === true,
        available: availableCompilationTools.length > 0,
        availableTools: availableCompilationTools,
        missingOptionalTools: missingOptionalLatexTools,
      },
      citationTools: {
        available: availableCitationTools.length > 0,
        availableTools: availableCitationTools,
      },
      lint: {
        available: availableLintTools.length > 0,
        availableTools: availableLintTools,
      },
    },
    artifacts,
    tools,
    external,
    blockers,
    warnings,
  };
}

export function devNexusResearchWorkerBriefing(status: DevNexusResearchSetupStatus): string {
  const artifactLines = status.artifacts.map((artifact) => `- ${artifact.label}: ${artifact.path}`).join("\n");
  const baselineModes = [
    status.baselineMode.noNetwork ? "no-network" : "network-profile-configured",
    status.baselineMode.noLatex ? "no-LaTeX" : "LaTeX-tools-detected",
    status.baselineMode.noZotero ? "no-Zotero" : "Zotero-available",
  ].join(", ");

  const readiness = status.ready ? "ready" : "blocked";
  const localCompilation = status.latex.localCompilation.available
    ? `available via ${status.latex.localCompilation.availableTools.join(", ")}`
    : status.latex.localCompilation.required
      ? "required but unavailable"
      : "optional and unavailable";
  const citationReadiness = status.latex.citationTools.available
    ? `available via ${status.latex.citationTools.availableTools.join(", ")}`
    : "optional and unavailable";
  const lintReadiness = status.latex.lint.available
    ? `available via ${status.latex.lint.availableTools.join(", ")}`
    : "optional and unavailable";
  const latexLines = [
    `- Manuscript root: ${status.latex.manuscriptRoot}`,
    `- Bibliography files: ${status.latex.bibliographyFiles.join(", ")}`,
    `- Figure paths: ${status.latex.figurePaths.join(", ")}`,
    `- Table paths: ${status.latex.tablePaths.join(", ")}`,
    `- Build report: ${status.latex.buildReportPath}`,
  ].join("\n");
  const blockerLines =
    status.blockers.length > 0 ? `\n\nBlockers:\n${status.blockers.map((blocker) => `- ${blocker}`).join("\n")}` : "";

  return [
    `Research setup readiness: ${readiness}.`,
    `Baseline mode: ${baselineModes}.`,
    `LaTeX readiness: local compilation ${localCompilation}; citation tools ${citationReadiness}; lint ${lintReadiness}.`,
    "",
    "Artifact paths:",
    artifactLines,
    "",
    "LaTeX paths:",
    latexLines,
    blockerLines.trimEnd(),
  ]
    .filter((part) => part.length > 0)
    .join("\n");
}
