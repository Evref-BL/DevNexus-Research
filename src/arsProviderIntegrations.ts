import {
  devNexusResearchArsNoEndorsementNotice,
  devNexusResearchArsUpstreamCommit,
  devNexusResearchArsUpstreamRepositoryUrl,
  devNexusResearchLicense,
  devNexusResearchLicenseTextPath,
  devNexusResearchLicenseUrl,
} from "./researchSkillProvenance.js";

export type DevNexusResearchAgentProvider = "claude" | "codex" | "opencode" | "manual" | "custom";

export type DevNexusResearchArsIntegrationKind =
  | "provider_native_plugin"
  | "provider_native_skill_suite"
  | "provider_shim_planned"
  | "bundled_fallback";

export type DevNexusResearchArsIntegrationStatus = "available" | "planned" | "bundled";

export type DevNexusResearchArsSurface =
  | "skills"
  | "commands"
  | "hooks"
  | "agents"
  | "scripts"
  | "adapters"
  | "schemas"
  | "contracts"
  | "templates"
  | "examples"
  | "tests"
  | "references";

export interface DevNexusResearchArsProviderIntegration {
  id: string;
  provider: DevNexusResearchAgentProvider;
  providerLabel: string;
  kind: DevNexusResearchArsIntegrationKind;
  status: DevNexusResearchArsIntegrationStatus;
  priority: number;
  name: string;
  sourceRepositoryUrl: string;
  license: typeof devNexusResearchLicense;
  licenseTextPath: typeof devNexusResearchLicenseTextPath;
  licenseUrl: typeof devNexusResearchLicenseUrl;
  upstreamAuthor: "Cheng-I Wu" | "DevNexus-Research";
  noEndorsementNotice: typeof devNexusResearchArsNoEndorsementNotice;
  requiresUserProvidedCheckout: false;
  baselineDependency: "provider-install" | "none";
  installCommands: readonly string[];
  nativePluginName?: string;
  nativeSkillId?: string;
  observedVersion?: string;
  inspectedCommit?: string;
  upstreamArsCommit?: string;
  surfaces: readonly DevNexusResearchArsSurface[];
  notes: readonly string[];
}

export const devNexusResearchArsCodexRepositoryUrl =
  "https://github.com/Imbad0202/academic-research-skills-codex";
export const devNexusResearchArsCodexInspectedCommit =
  "900238ce1b04109bc3e11a4849f4be55122e5301";
export const devNexusResearchArsCodexObservedVersion = "0.1.8";
export const devNexusResearchArsCodexUpstreamArsCommit =
  "96b82e82142dc95f117595c207d3e150b078e411";

const broadArsSurfaces = [
  "skills",
  "commands",
  "hooks",
  "agents",
  "scripts",
  "adapters",
  "schemas",
  "contracts",
  "templates",
  "examples",
  "tests",
  "references",
] as const satisfies readonly DevNexusResearchArsSurface[];

export const devNexusResearchArsProviderIntegrations = [
  {
    id: "ars-claude-native-plugin",
    provider: "claude",
    providerLabel: "Claude Code",
    kind: "provider_native_plugin",
    status: "available",
    priority: 10,
    name: "Academic Research Skills Claude Code plugin",
    sourceRepositoryUrl: devNexusResearchArsUpstreamRepositoryUrl,
    license: devNexusResearchLicense,
    licenseTextPath: devNexusResearchLicenseTextPath,
    licenseUrl: devNexusResearchLicenseUrl,
    upstreamAuthor: "Cheng-I Wu",
    noEndorsementNotice: devNexusResearchArsNoEndorsementNotice,
    requiresUserProvidedCheckout: false,
    baselineDependency: "provider-install",
    installCommands: [
      "/plugin marketplace add Imbad0202/academic-research-skills",
      "/plugin install academic-research-skills",
    ],
    nativePluginName: "academic-research-skills",
    observedVersion: "3.9.4",
    inspectedCommit: devNexusResearchArsUpstreamCommit,
    upstreamArsCommit: devNexusResearchArsUpstreamCommit,
    surfaces: broadArsSurfaces,
    notes: [
      "Use this provider-native plugin as-is for Claude Code targets instead of projecting DevNexus-Research fallback adaptations.",
      "ARS commands and hooks remain native Claude Code plugin surfaces.",
    ],
  },
  {
    id: "ars-codex-suite-skill",
    provider: "codex",
    providerLabel: "Codex",
    kind: "provider_native_skill_suite",
    status: "available",
    priority: 10,
    name: "Academic Research Skills Codex suite",
    sourceRepositoryUrl: devNexusResearchArsCodexRepositoryUrl,
    license: devNexusResearchLicense,
    licenseTextPath: devNexusResearchLicenseTextPath,
    licenseUrl: devNexusResearchLicenseUrl,
    upstreamAuthor: "Cheng-I Wu",
    noEndorsementNotice: devNexusResearchArsNoEndorsementNotice,
    requiresUserProvidedCheckout: false,
    baselineDependency: "provider-install",
    installCommands: [
      "Install the Codex skill package from Imbad0202/academic-research-skills-codex when Codex skill installation is available.",
    ],
    nativeSkillId: "academic-research-suite",
    observedVersion: devNexusResearchArsCodexObservedVersion,
    inspectedCommit: devNexusResearchArsCodexInspectedCommit,
    upstreamArsCommit: devNexusResearchArsCodexUpstreamArsCommit,
    surfaces: broadArsSurfaces,
    notes: [
      "Prefer the Codex-native academic-research-suite skill over the simplified bundled fallback skills.",
      "The Codex package maps Claude-oriented commands, agents, and script notes into Codex skill behavior.",
    ],
  },
  {
    id: "ars-opencode-shim-planned",
    provider: "opencode",
    providerLabel: "OpenCode",
    kind: "provider_shim_planned",
    status: "planned",
    priority: 20,
    name: "Academic Research Skills OpenCode shim",
    sourceRepositoryUrl: devNexusResearchArsUpstreamRepositoryUrl,
    license: devNexusResearchLicense,
    licenseTextPath: devNexusResearchLicenseTextPath,
    licenseUrl: devNexusResearchLicenseUrl,
    upstreamAuthor: "Cheng-I Wu",
    noEndorsementNotice: devNexusResearchArsNoEndorsementNotice,
    requiresUserProvidedCheckout: false,
    baselineDependency: "none",
    installCommands: [],
    inspectedCommit: devNexusResearchArsUpstreamCommit,
    upstreamArsCommit: devNexusResearchArsUpstreamCommit,
    surfaces: broadArsSurfaces,
    notes: [
      "No inspected OpenCode-native ARS package is available yet.",
      "Future work should follow the Codex suite pattern: provider-native router, vendored resources, and explicit inactive-surface notes.",
    ],
  },
  {
    id: "dev-nexus-research-ars-bundled-fallback",
    provider: "manual",
    providerLabel: "Fallback providers",
    kind: "bundled_fallback",
    status: "bundled",
    priority: 100,
    name: "DevNexus-Research bundled ARS-derived fallback skills",
    sourceRepositoryUrl: devNexusResearchArsUpstreamRepositoryUrl,
    license: devNexusResearchLicense,
    licenseTextPath: devNexusResearchLicenseTextPath,
    licenseUrl: devNexusResearchLicenseUrl,
    upstreamAuthor: "Cheng-I Wu",
    noEndorsementNotice: devNexusResearchArsNoEndorsementNotice,
    requiresUserProvidedCheckout: false,
    baselineDependency: "none",
    installCommands: [],
    inspectedCommit: devNexusResearchArsUpstreamCommit,
    upstreamArsCommit: devNexusResearchArsUpstreamCommit,
    surfaces: ["skills"],
    notes: [
      "Use only when no compatible provider-native ARS package or shim is installed.",
      "This fallback currently includes simplified adapted skills for deep-research, academic-paper, academic-paper-reviewer, and academic-pipeline.",
    ],
  },
] as const satisfies readonly DevNexusResearchArsProviderIntegration[];

export function devNexusResearchArsProviderIntegrationsForProvider(
  provider: DevNexusResearchAgentProvider,
): DevNexusResearchArsProviderIntegration[] {
  return devNexusResearchArsProviderIntegrations
    .filter((integration) => integration.provider === provider)
    .sort((left, right) => left.priority - right.priority);
}

export function devNexusResearchAvailableArsProviderIntegrationsForProvider(
  provider: DevNexusResearchAgentProvider,
): DevNexusResearchArsProviderIntegration[] {
  return devNexusResearchArsProviderIntegrationsForProvider(provider).filter(
    (integration) => integration.status !== "planned",
  );
}

export function devNexusResearchArsIntegrationPlanForProvider(
  provider: DevNexusResearchAgentProvider,
): DevNexusResearchArsProviderIntegration[] {
  const providerIntegrations = devNexusResearchAvailableArsProviderIntegrationsForProvider(provider);
  const fallback = devNexusResearchArsProviderIntegrations.find(
    (integration) => integration.kind === "bundled_fallback",
  );

  if (fallback && providerIntegrations.some((integration) => integration.id === fallback.id)) {
    return providerIntegrations;
  }

  return fallback ? [...providerIntegrations, fallback] : providerIntegrations;
}
