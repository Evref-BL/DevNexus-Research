import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  devNexusResearchArtifactIds,
  resolveDevNexusResearchArtifactConventions,
} from "../src/researchArtifacts.js";
import {
  createDevNexusResearchSetupStatus,
  createDevNexusResearchSetupStatusFromProjectConfig,
  devNexusResearchProjectExtensionKey,
  devNexusResearchSetupOptionsFromProjectConfig,
  devNexusResearchWorkerBriefing,
} from "../src/researchSetup.js";

describe("DevNexus Research artifact conventions", () => {
  it("renders all baseline artifact conventions with default paths", () => {
    const artifacts = resolveDevNexusResearchArtifactConventions();

    expect(artifacts.map((artifact) => artifact.id)).toEqual([...devNexusResearchArtifactIds]);
    expect(artifacts.find((artifact) => artifact.id === "research-brief")?.path).toBe(
      ".dev-nexus/research/research-brief.md",
    );
    expect(artifacts.find((artifact) => artifact.id === "latex-manuscript-root")?.path).toBe("paper/main.tex");
    expect(artifacts.find((artifact) => artifact.id === "latex-bibliography-files")?.path).toBe(
      "paper/references.bib",
    );
    expect(artifacts.find((artifact) => artifact.id === "latex-figure-paths")?.path).toBe("paper/figures");
    expect(artifacts.find((artifact) => artifact.id === "latex-table-paths")?.path).toBe("paper/tables");
    expect(artifacts.find((artifact) => artifact.id === "latex-build-report")?.path).toBe(
      ".dev-nexus/research/latex-build-report.md",
    );
    expect(artifacts.filter((artifact) => artifact.requiredForBaseline).map((artifact) => artifact.id)).toEqual([
      "research-brief",
      "source-manifest",
      "claim-register",
    ]);
  });

  it("supports artifact root and path overrides", () => {
    const artifacts = resolveDevNexusResearchArtifactConventions({
      artifactRoot: "research-state",
      paths: {
        "latex-manuscript-root": "manuscript/root.tex",
        "latex-bibliography-files": "manuscript/library.bib",
        "latex-figure-paths": "assets/figures",
        "latex-table-paths": "assets/tables",
        "source-manifest": "inputs/sources.json",
      },
    });

    expect(artifacts.find((artifact) => artifact.id === "research-brief")?.path).toBe(
      "research-state/research-brief.md",
    );
    expect(artifacts.find((artifact) => artifact.id === "source-manifest")?.path).toBe("inputs/sources.json");
    expect(artifacts.find((artifact) => artifact.id === "source-manifest")?.configured).toBe(true);
    expect(artifacts.find((artifact) => artifact.id === "latex-manuscript-root")?.path).toBe(
      "manuscript/root.tex",
    );
    expect(artifacts.find((artifact) => artifact.id === "latex-bibliography-files")?.path).toBe(
      "manuscript/library.bib",
    );
    expect(artifacts.find((artifact) => artifact.id === "latex-figure-paths")?.path).toBe("assets/figures");
    expect(artifacts.find((artifact) => artifact.id === "latex-table-paths")?.path).toBe("assets/tables");
  });
});

describe("DevNexus Research setup status", () => {
  it("reports no-network and no-LaTeX baseline mode without blocking optional missing tools", () => {
    const status = createDevNexusResearchSetupStatus({
      commandPresence: {
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
      },
    });

    expect(status.ready).toBe(true);
    expect(status.baselineMode).toEqual({
      noNetwork: true,
      noLatex: true,
      noZotero: true,
    });
    expect(status.blockers).toEqual([]);
    expect(status.warnings).toContain("latexmk is optional and not available.");
    expect(status.warnings).toContain("pandoc is optional and not available.");
    expect(status.latex.localCompilation).toMatchObject({
      required: false,
      available: false,
      availableTools: [],
    });
    expect(status.latex.citationTools.available).toBe(false);
    expect(status.latex.lint.available).toBe(false);
  });

  it("blocks only missing capabilities that the project marks required", () => {
    const status = createDevNexusResearchSetupStatus({
      commandPresence: {
        latexmk: false,
        pdflatex: false,
        xelatex: false,
        lualatex: false,
        tectonic: false,
        bibtex: true,
        biber: false,
        chktex: false,
        pandoc: false,
        zotero: false,
        obsidian: false,
      },
      requiredLatexTools: ["latexmk"],
      requiredDocumentExportTools: ["pandoc"],
      externalIndexProfiles: [{ id: "openalex", label: "OpenAlex", required: true }],
    });

    expect(status.ready).toBe(false);
    expect(status.blockers).toEqual([
      "latexmk is required but missing.",
      "pandoc is required but missing.",
      "OpenAlex is required but missing.",
    ]);
    expect(status.tools.find((item) => item.id === "bibtex")?.status).toBe("present");
  });

  it("requires local LaTeX compilation only when no compiler is available", () => {
    const missingCompilerStatus = createDevNexusResearchSetupStatus({
      commandPresence: {
        latexmk: false,
        pdflatex: false,
        xelatex: false,
        lualatex: false,
        tectonic: false,
      },
      requireLocalLatexCompilation: true,
    });
    const availableCompilerStatus = createDevNexusResearchSetupStatus({
      commandPresence: {
        latexmk: false,
        pdflatex: true,
        xelatex: false,
        lualatex: false,
        tectonic: false,
      },
      requireLocalLatexCompilation: true,
    });

    expect(missingCompilerStatus.blockers).toContain("Local LaTeX compilation is required but missing.");
    expect(availableCompilerStatus.blockers).not.toContain("Local LaTeX compilation is required but missing.");
    expect(availableCompilerStatus.latex.localCompilation).toMatchObject({
      required: true,
      available: true,
      availableTools: ["pdflatex"],
    });
  });

  it("renders synthetic LaTeX readiness paths from artifact conventions", () => {
    const status = createDevNexusResearchSetupStatus({
      artifacts: {
        artifactRoot: "research-state",
        paths: {
          "latex-manuscript-root": "paper/root.tex",
          "latex-bibliography-files": "paper/library.bib",
          "latex-figure-paths": "paper/img",
          "latex-table-paths": "paper/tables",
          "latex-build-report": "research-state/builds/latest-latex.md",
        },
      },
      commandPresence: {
        latexmk: true,
        pdflatex: false,
        xelatex: false,
        lualatex: false,
        tectonic: false,
        bibtex: false,
        biber: true,
        chktex: true,
      },
    });

    expect(status.latex).toMatchObject({
      manuscriptRoot: "paper/root.tex",
      bibliographyFiles: ["paper/library.bib"],
      figurePaths: ["paper/img"],
      tablePaths: ["paper/tables"],
      buildReportPath: "research-state/builds/latest-latex.md",
      localCompilation: {
        required: false,
        available: true,
        availableTools: ["latexmk"],
      },
      citationTools: {
        available: true,
        availableTools: ["biber"],
      },
      lint: {
        available: true,
        availableTools: ["chktex"],
      },
    });
  });

  it("reports configured external profiles and skills without requiring them by default", () => {
    const status = createDevNexusResearchSetupStatus({
      externalIndexProfiles: [{ id: "semantic-scholar", label: "Semantic Scholar", configured: true }],
      externalSkills: [{ id: "external-ars-suite", label: "External ARS Suite" }],
      requiredExternalSkillIds: ["required-external-reviewer"],
    });

    expect(status.external.find((item) => item.id === "semantic-scholar")?.status).toBe("configured");
    expect(status.external.find((item) => item.id === "external-ars-suite")?.status).toBe("configured");
    expect(status.blockers).toContain("required-external-reviewer is required but missing.");
  });

  it("detects commands from PATH without invoking shell syntax", () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "dev-nexus-research-setup-"));
    const executableName = process.platform === "win32" ? "latexmk.CMD" : "latexmk";
    const executablePath = join(tempDirectory, executableName);

    try {
      writeFileSync(executablePath, "");
      chmodSync(executablePath, 0o755);

      const status = createDevNexusResearchSetupStatus({
        commandSearchPath: tempDirectory,
        documentExportTools: ["pandoc; exit 0"],
        requiredDocumentExportTools: ["pandoc; exit 0"],
      });

      expect(status.tools.find((item) => item.id === "latexmk")?.status).toBe("present");
      expect(status.tools.find((item) => item.id === "pandoc; exit 0")?.status).toBe("required_missing");
      expect(status.blockers).toContain("pandoc; exit 0 is required but missing.");
    } finally {
      rmSync(tempDirectory, { recursive: true, force: true });
    }
  });

  it("ignores removed ARS checkout configuration surfaces", () => {
    const projectConfig = {
      extensions: {
        [devNexusResearchProjectExtensionKey]: {
          setup: {
            externalArs: {
              checkoutPath: "/tmp/academic-research-skills",
              required: true,
            },
          },
        },
      },
    };

    const setupOptions = devNexusResearchSetupOptionsFromProjectConfig(projectConfig);
    const status = createDevNexusResearchSetupStatusFromProjectConfig(projectConfig);

    expect(setupOptions).not.toHaveProperty("externalArs");
    expect(status.external.map((item) => item.category)).not.toContain("external_ars");
    expect(devNexusResearchWorkerBriefing(status)).not.toContain("External ARS");
  });

  it("renders a worker briefing with paths, readiness, and baseline mode", () => {
    const status = createDevNexusResearchSetupStatus({
      artifacts: {
        artifactRoot: "research-state",
        paths: {
          "latex-manuscript-root": "paper/main.tex",
        },
      },
      commandPresence: {
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
      },
    });

    expect(devNexusResearchWorkerBriefing(status)).toContain("Research setup readiness: ready.");
    expect(devNexusResearchWorkerBriefing(status)).toContain("Baseline mode: no-network, no-LaTeX, no-Zotero.");
    expect(devNexusResearchWorkerBriefing(status)).toContain(
      "LaTeX readiness: local compilation optional and unavailable; citation tools optional and unavailable; lint optional and unavailable.",
    );
    expect(devNexusResearchWorkerBriefing(status)).toContain("- Research Brief: research-state/research-brief.md");
    expect(devNexusResearchWorkerBriefing(status)).toContain("- LaTeX Manuscript Root: paper/main.tex");
    expect(devNexusResearchWorkerBriefing(status)).toContain("- Bibliography files: paper/references.bib");
    expect(devNexusResearchWorkerBriefing(status)).toContain("- Figure paths: paper/figures");
    expect(devNexusResearchWorkerBriefing(status)).toContain("- Table paths: paper/tables");
  });

  it("loads setup options from a DevNexus project extension", () => {
    const projectConfig = {
      extensions: {
        [devNexusResearchProjectExtensionKey]: {
          artifacts: {
            artifactRoot: "research-state",
            paths: {
              "latex-manuscript-root": "manuscript/main.tex",
              "latex-bibliography-files": "manuscript/references.bib",
            },
          },
          setup: {
            requireLocalLatexCompilation: true,
            externalIndexProfiles: [{ id: "openalex", label: "OpenAlex", configured: true }],
          },
        },
      },
    };
    const setupOptions = devNexusResearchSetupOptionsFromProjectConfig(projectConfig);
    const status = createDevNexusResearchSetupStatusFromProjectConfig(projectConfig, {
      commandPresence: {
        latexmk: true,
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
      },
    });

    expect(setupOptions).toMatchObject({
      requireLocalLatexCompilation: true,
      externalIndexProfiles: [{ id: "openalex", label: "OpenAlex", configured: true }],
    });
    expect(setupOptions.artifacts?.paths?.["latex-manuscript-root"]).toBe("manuscript/main.tex");
    expect(status.ready).toBe(true);
    expect(status.baselineMode.noNetwork).toBe(false);
    expect(status.latex).toMatchObject({
      manuscriptRoot: "manuscript/main.tex",
      bibliographyFiles: ["manuscript/references.bib"],
      localCompilation: {
        required: true,
        available: true,
        availableTools: ["latexmk"],
      },
    });
  });
});
