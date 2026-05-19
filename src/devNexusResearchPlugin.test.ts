import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { projectPluginCapabilityProjections, projectPluginWorkerFragments } from "dev-nexus";
import {
  devNexusResearchArsCodexRepositoryUrl,
  devNexusResearchArsIntegrationPlanForProvider,
  devNexusResearchArsProviderIntegrations,
} from "./arsProviderIntegrations.js";
import {
  devNexusResearchDevNexusPluginConfig,
  devNexusResearchPluginCapabilities,
  devNexusResearchPluginId,
  devNexusResearchPluginName,
  devNexusResearchPluginVersion,
} from "./devNexusResearchPlugin.js";
import {
  devNexusResearchArsNoEndorsementNotice,
  devNexusResearchArsSkillProvenance,
  devNexusResearchArsUpstreamCommit,
  devNexusResearchArsUpstreamRepositoryUrl,
  devNexusResearchLicense,
  devNexusResearchLicenseTextPath,
  devNexusResearchLicenseUrl,
} from "./researchSkillProvenance.js";
import {
  devNexusResearchSkillById,
  devNexusResearchSkillIds,
  devNexusResearchSkills,
} from "./researchSkills.js";

describe("DevNexus Research plugin", () => {
  it("declares a stable initial plugin identity", () => {
    expect(devNexusResearchDevNexusPluginConfig()).toEqual({
      id: devNexusResearchPluginId,
      name: devNexusResearchPluginName,
      version: devNexusResearchPluginVersion,
      enabled: true,
      capabilities: devNexusResearchPluginCapabilities,
    });
  });

  it("is accepted by DevNexus plugin projection helpers", () => {
    const [projection] = projectPluginCapabilityProjections({
      plugins: [devNexusResearchDevNexusPluginConfig()],
    });

    expect(projection).toMatchObject({
      pluginId: "dev-nexus-research",
      pluginName: "DevNexus Research",
      version: "0.1.0-alpha.0",
      capabilityCount: devNexusResearchPluginCapabilities.length,
    });
    expect(projection.capabilities.map((capability) => capability.kind)).toContain("projected_skill");
    expect(projection.capabilities.map((capability) => capability.kind)).toContain("setup_obligation");
    expect(projection.capabilities.map((capability) => capability.kind)).toContain("environment_hint");
    expect(projection.capabilities.map((capability) => capability.kind)).toContain("agent_affordance");
    expect(projection.capabilities.map((capability) => capability.kind)).toContain("worker_briefing_fragment");
  });

  it("projects all bundled research skills", () => {
    const [projection] = projectPluginCapabilityProjections({
      plugins: [devNexusResearchDevNexusPluginConfig()],
    });
    const skillCapabilities = projection.capabilities.filter(
      (capability) => capability.kind === "projected_skill",
    );

    expect(skillCapabilities.map((capability) => capability.skillId)).toEqual([...devNexusResearchSkillIds]);
    expect(skillCapabilities.every((capability) => capability.targetAgents.includes("codex"))).toBe(true);
  });

  it("projects research worker briefing fragments", () => {
    const fragments = projectPluginWorkerFragments({
      plugins: [devNexusResearchDevNexusPluginConfig()],
    });

    expect(fragments.context.map((fragment) => fragment.id)).toEqual(["context:research-artifacts"]);
    expect(fragments.briefing.map((fragment) => fragment.id)).toEqual(expect.arrayContaining([
      "briefing:ars-provider-native-first",
      "briefing:ars-derived-skill-provenance",
      "briefing:evidence-and-claims",
      "briefing:human-checkpoints",
      "briefing:latex-mutation-policy",
      "briefing:source-provenance",
    ]));
    expect(fragments.briefing).toHaveLength(6);
  });

  it("records provider-native ARS integration preferences before fallback skills", () => {
    const claudePlan = devNexusResearchArsIntegrationPlanForProvider("claude");
    const codexPlan = devNexusResearchArsIntegrationPlanForProvider("codex");
    const opencodePlan = devNexusResearchArsIntegrationPlanForProvider("opencode");
    const manualPlan = devNexusResearchArsIntegrationPlanForProvider("manual");

    expect(claudePlan.map((integration) => integration.id)).toEqual([
      "ars-claude-native-plugin",
      "dev-nexus-research-ars-bundled-fallback",
    ]);
    expect(claudePlan[0]).toMatchObject({
      kind: "provider_native_plugin",
      nativePluginName: "academic-research-skills",
      sourceRepositoryUrl: devNexusResearchArsUpstreamRepositoryUrl,
      requiresUserProvidedCheckout: false,
    });
    expect(claudePlan[0].installCommands).toEqual([
      "/plugin marketplace add Imbad0202/academic-research-skills",
      "/plugin install academic-research-skills",
    ]);

    expect(codexPlan.map((integration) => integration.id)).toEqual([
      "ars-codex-suite-skill",
      "dev-nexus-research-ars-bundled-fallback",
    ]);
    expect(codexPlan[0]).toMatchObject({
      kind: "provider_native_skill_suite",
      nativeSkillId: "academic-research-suite",
      sourceRepositoryUrl: devNexusResearchArsCodexRepositoryUrl,
      requiresUserProvidedCheckout: false,
    });

    expect(opencodePlan.map((integration) => integration.id)).toEqual([
      "dev-nexus-research-ars-bundled-fallback",
    ]);
    expect(manualPlan.map((integration) => integration.id)).toEqual([
      "dev-nexus-research-ars-bundled-fallback",
    ]);
    expect(devNexusResearchArsProviderIntegrations.find((integration) => integration.id === "ars-opencode-shim-planned"))
      .toMatchObject({
        kind: "provider_shim_planned",
        status: "planned",
      });

    for (const integration of devNexusResearchArsProviderIntegrations) {
      expect(integration.license).toBe(devNexusResearchLicense);
      expect(integration.licenseUrl).toBe(devNexusResearchLicenseUrl);
      expect(integration.noEndorsementNotice).toBe(devNexusResearchArsNoEndorsementNotice);
    }
  });

  it("exports skill registry records that match the source tree", () => {
    expect(devNexusResearchSkills.map((skill) => skill.id)).toEqual([...devNexusResearchSkillIds]);

    for (const skill of devNexusResearchSkills) {
      const skillPath = resolve(process.cwd(), skill.sourcePath);
      expect(existsSync(skillPath), `${skill.sourcePath} should exist`).toBe(true);

      const body = readFileSync(skillPath, "utf8");
      expect(body).toContain(`name: ${skill.id}`);
      expect(body).toContain("## Allowed Mutation Mode");
      expect(body).toContain("## Artifact Inputs");
      expect(body).toContain("## Artifact Outputs");
      expect(body).toContain("## Source Support");
      expect(body).toContain("## Human Checkpoints");
    }
  });

  it("records required provenance for bundled ARS-derived skills", () => {
    const arsSkills = devNexusResearchSkills.filter((skill) => skill.origin === "ars-derived");

    expect(arsSkills.map((skill) => skill.id)).toEqual([
      "deep-research",
      "academic-paper",
      "academic-paper-reviewer",
      "academic-pipeline",
    ]);
    expect(devNexusResearchArsSkillProvenance.map((provenance) => provenance.skillId)).toEqual(
      arsSkills.map((skill) => skill.id),
    );

    for (const skill of arsSkills) {
      expect(skill.provenance).toMatchObject({
        skillId: skill.id,
        origin: "academic-research-skills",
        relationship: "adapted-from",
        upstreamRepositoryUrl: devNexusResearchArsUpstreamRepositoryUrl,
        upstreamCommit: devNexusResearchArsUpstreamCommit,
        upstreamAuthor: "Cheng-I Wu",
        upstreamLicense: devNexusResearchLicense,
        upstreamLicenseTextPath: devNexusResearchLicenseTextPath,
        upstreamLicenseUrl: devNexusResearchLicenseUrl,
        noEndorsementNotice: devNexusResearchArsNoEndorsementNotice,
      });
      expect(skill.provenance?.upstreamSourcePath).toBe(`${skill.id}/SKILL.md`);
      expect(skill.provenance?.upstreamContentSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(skill.provenance?.modificationNotes).toContain("Adapted into a self-contained DevNexus-Research");

      const body = readFileSync(resolve(process.cwd(), skill.sourcePath), "utf8");
      expect(body).toContain("origin: academic-research-skills");
      expect(body).toContain(`upstream_source_path: ${skill.provenance?.upstreamSourcePath}`);
      expect(body).toContain(`upstream_commit: ${skill.provenance?.upstreamCommit}`);
      expect(body).toContain(`upstream_content_sha256: ${skill.provenance?.upstreamContentSha256}`);
      expect(body).toContain(`modification_notes: ${skill.provenance?.modificationNotes}`);
      expect(body).toContain("## ARS Provenance And License");
      expect(body).toContain("No endorsement by the");
    }
  });

  it("does not expose external ARS checkout support for the baseline package", () => {
    const capabilityIds = devNexusResearchPluginCapabilities.map((capability) => capability.id);
    const variables = devNexusResearchPluginCapabilities.flatMap((capability) =>
      "variable" in capability ? [capability.variable] : [],
    );

    expect(capabilityIds).not.toContain("env:external-ars-checkout");
    expect(capabilityIds).not.toContain("affordance:external-ars-interop");
    expect(variables).not.toContain("DEV_NEXUS_RESEARCH_ARS_CHECKOUT");
  });

  it("ships README-referenced docs in the package allowlist", () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as {
      files?: string[];
      license?: string;
    };
    const licenseText = readFileSync(resolve(process.cwd(), "LICENSE"), "utf8");
    const noticeText = readFileSync(resolve(process.cwd(), "NOTICE.md"), "utf8");
    const normalizedNoticeText = noticeText.replace(/\s+/g, " ");

    expect(packageJson.license).toBe("CC-BY-NC-4.0");
    expect(packageJson.files).toContain("docs");
    expect(packageJson.files).toContain("LICENSE");
    expect(packageJson.files).toContain("NOTICE.md");
    expect(packageJson.files).toContain("skills");
    expect(existsSync(resolve(process.cwd(), "LICENSE"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "NOTICE.md"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "skills/ARS-PROVENANCE.json"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "docs/dev-nexus-domain-plugin-setup-prd.md"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "docs/dev-nexus-research-plugin-implementation-prd.md"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "docs/ars-integration-inventory.md"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "docs/ars-provider-native-integration-investigation.md"))).toBe(true);
    expect(licenseText).toContain("DevNexus-Research package copyright (c) 2026 Evref-BL");
    expect(licenseText).toContain("Portions adapted from Academic Research Skills are copyright (c) Cheng-I Wu");
    expect(licenseText.split("\n")[0]).not.toContain("Cheng-I Wu");
    expect(noticeText).toContain("## DevNexus-Research Package Ownership");
    expect(normalizedNoticeText).toContain(
      "does not make Cheng-I Wu the owner of the DevNexus-Research package as a whole",
    );
  });

  it("keeps LaTeX authoring guidance explicit about scoped mutation checks", () => {
    const latexSkill = devNexusResearchSkillById("latex-paper-authoring");
    const body = readFileSync(resolve(process.cwd(), latexSkill.sourcePath), "utf8");

    expect(body).toContain("## Citation And Label Checks");
    expect(body).toContain("## Build Log Diagnosis");
    expect(body).toContain("get explicit human approval for that scope");
    expect(latexSkill.artifactInputs).toContain("LaTeX bibliography files");
    expect(latexSkill.artifactInputs).toContain("LaTeX figure paths");
    expect(latexSkill.artifactInputs).toContain("LaTeX table paths");
  });
});
