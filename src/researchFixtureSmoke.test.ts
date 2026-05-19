import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  projectPluginCapabilityProjections,
  validateProjectConfig,
  type NexusProjectConfig,
} from "dev-nexus";
import { devNexusResearchDevNexusPluginConfig } from "./devNexusResearchPlugin.js";
import {
  createDevNexusResearchSetupStatusFromProjectConfig,
  devNexusResearchProjectExtensionKey,
  devNexusResearchSetupOptionsFromProjectConfig,
  devNexusResearchWorkerBriefing,
} from "./researchSetup.js";

interface DevNexusResearchFixtureExtension {
  materialPolicy: {
    networkAccess: boolean;
    privateMaterial: boolean;
    allowedMaterialBoundaries: string[];
  };
}

interface FixtureSourceManifest {
  materialPolicy: {
    networkAccess: boolean;
    privateMaterial: boolean;
    allowedMaterialBoundaries: string[];
  };
  sources: Array<{
    id: string;
    materialBoundary: string;
    path: string;
    citationKey: string;
  }>;
}

const fixtureRoot = resolve(process.cwd(), "fixtures/synthetic-research-project");

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadFixtureProjectConfig(): NexusProjectConfig {
  return validateProjectConfig(readJson(join(fixtureRoot, "dev-nexus.project.json")));
}

function fixtureResearchExtension(config: NexusProjectConfig): DevNexusResearchFixtureExtension {
  const extension = config.extensions?.[devNexusResearchProjectExtensionKey];
  expect(extension).toBeDefined();
  return extension as unknown as DevNexusResearchFixtureExtension;
}

function noOptionalTools(): Record<string, boolean> {
  return {
    latexmk: false,
    pdflatex: false,
    xelatex: false,
    lualatex: false,
    tectonic: false,
    bibtex: false,
    biber: false,
    chktex: false,
    pandoc: false,
    zotero: false,
    obsidian: false,
  };
}

describe("synthetic research project fixture", () => {
  it("validates as a DevNexus project and enables DevNexus-Research", () => {
    const config = loadFixtureProjectConfig();
    const plugin = config.plugins?.find((candidate) => candidate.id === "dev-nexus-research");
    const packagedPlugin = devNexusResearchDevNexusPluginConfig();

    expect(config).toMatchObject({
      id: "synthetic-research-project",
      name: "Synthetic Research Project",
    });
    expect(plugin).toMatchObject({
      id: packagedPlugin.id,
      name: packagedPlugin.name,
      version: packagedPlugin.version,
      enabled: true,
    });
    expect(
      devNexusResearchSetupOptionsFromProjectConfig(config).artifacts?.paths?.["latex-manuscript-root"],
    ).toBe("paper/main.tex");
    expect(projectPluginCapabilityProjections({ plugins: [packagedPlugin] })[0]).toMatchObject({
      pluginId: "dev-nexus-research",
      capabilityCount: packagedPlugin.capabilities.length,
    });
  });

  it("contains only synthetic or public-open material", () => {
    const config = loadFixtureProjectConfig();
    const extension = fixtureResearchExtension(config);
    const manifest = readJson(
      join(fixtureRoot, ".dev-nexus/research/source-manifest.json"),
    ) as FixtureSourceManifest;

    expect(extension.materialPolicy).toEqual({
      networkAccess: false,
      privateMaterial: false,
      allowedMaterialBoundaries: ["synthetic", "public-open"],
    });
    expect(manifest.materialPolicy).toEqual(extension.materialPolicy);
    expect(manifest.sources.length).toBeGreaterThan(0);
    for (const source of manifest.sources) {
      expect(extension.materialPolicy.allowedMaterialBoundaries).toContain(source.materialBoundary);
      expect(existsSync(join(fixtureRoot, source.path)), `${source.path} should exist`).toBe(true);
      expect(source.citationKey).toMatch(/^synthetic2026/);
    }
  });

  it("includes a minimal LaTeX manuscript root and bibliography file", () => {
    const manuscript = readFileSync(join(fixtureRoot, "paper/main.tex"), "utf8");
    const bibliography = readFileSync(join(fixtureRoot, "paper/references.bib"), "utf8");

    expect(manuscript).toContain("\\documentclass{article}");
    expect(manuscript).toContain("\\bibliography{references}");
    expect(manuscript).toContain("\\cite{synthetic2026method}");
    expect(bibliography).toContain("@misc{synthetic2026method");
    expect(bibliography).toContain("@misc{synthetic2026related");
  });

  it("renders setup and worker briefing in no-network no-LaTeX baseline mode", () => {
    const config = loadFixtureProjectConfig();
    const setupOptions = devNexusResearchSetupOptionsFromProjectConfig(config);
    const status = createDevNexusResearchSetupStatusFromProjectConfig(config, {
      commandPresence: noOptionalTools(),
    });
    const briefing = devNexusResearchWorkerBriefing(status);

    expect(setupOptions.requireLocalLatexCompilation).toBe(false);
    expect(setupOptions.externalIndexProfiles).toEqual([]);
    expect(status.ready).toBe(true);
    expect(status.baselineMode).toEqual({
      noNetwork: true,
      noLatex: true,
      noZotero: true,
    });
    expect(status.blockers).toEqual([]);
    expect(status.latex.manuscriptRoot).toBe("paper/main.tex");
    expect(status.latex.bibliographyFiles).toEqual(["paper/references.bib"]);
    expect(status.latex.localCompilation).toMatchObject({
      required: false,
      available: false,
      availableTools: [],
    });
    expect(status.artifacts.find((artifact) => artifact.id === "research-brief")?.path).toBe(
      ".dev-nexus/research/research-brief.md",
    );
    expect(briefing).toContain("Research setup readiness: ready.");
    expect(briefing).toContain("Baseline mode: no-network, no-LaTeX, no-Zotero.");
    expect(briefing).toContain("- LaTeX Manuscript Root: paper/main.tex");
    expect(briefing).toContain("- Bibliography files: paper/references.bib");
  });
});
