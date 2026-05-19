import {
  devNexusResearchArsSkillProvenanceBySkillId,
  type DevNexusResearchSkillOrigin,
  type DevNexusResearchSkillProvenance,
} from "./researchSkillProvenance.js";

export const devNexusResearchSkillIds = [
  "deep-research",
  "academic-paper",
  "academic-paper-reviewer",
  "academic-pipeline",
  "research-workflow-router",
  "research-question-scope",
  "literature-review",
  "paper-planning",
  "latex-paper-authoring",
  "manuscript-review",
  "citation-claim-integrity",
  "revision-matrix-planning",
  "research-artifact-handoff",
] as const;

export type DevNexusResearchSkillId = (typeof devNexusResearchSkillIds)[number];

export interface DevNexusResearchSkillRecord {
  id: DevNexusResearchSkillId;
  title: string;
  description: string;
  sourcePath: `skills/${DevNexusResearchSkillId}/SKILL.md`;
  origin: DevNexusResearchSkillOrigin;
  provenance?: DevNexusResearchSkillProvenance;
  mutationMode: "routing" | "planning" | "read_only" | "scoped_mutation" | "artifact_mutation";
  artifactInputs: string[];
  artifactOutputs: string[];
  humanCheckpoints: string[];
}

function arsProvenance(skillId: DevNexusResearchSkillId): DevNexusResearchSkillProvenance {
  const provenance = devNexusResearchArsSkillProvenanceBySkillId(skillId);
  if (!provenance) {
    throw new Error(`Missing ARS provenance for ${skillId}`);
  }

  return provenance;
}

export const devNexusResearchSkills: DevNexusResearchSkillRecord[] = [
  {
    id: "deep-research",
    title: "Deep Research",
    description:
      "ARS-derived skill for research scoping, literature search planning, evidence synthesis, fact-checking, and systematic review work.",
    sourcePath: "skills/deep-research/SKILL.md",
    origin: "ars-derived",
    provenance: arsProvenance("deep-research"),
    mutationMode: "artifact_mutation",
    artifactInputs: [
      "research brief",
      "source manifest",
      "material passport",
      "claim register",
      "bibliography state",
    ],
    artifactOutputs: [
      "scoped research question",
      "literature search strategy",
      "evidence synthesis notes",
      "claim-support gaps",
    ],
    humanCheckpoints: ["approve research scope, method boundaries, and inclusion criteria"],
  },
  {
    id: "academic-paper",
    title: "Academic Paper",
    description:
      "ARS-derived skill for academic paper planning, drafting, revision, disclosure, citation checking, and LaTeX-oriented manuscript work.",
    sourcePath: "skills/academic-paper/SKILL.md",
    origin: "ars-derived",
    provenance: arsProvenance("academic-paper"),
    mutationMode: "scoped_mutation",
    artifactInputs: [
      "research brief",
      "source manifest",
      "claim register",
      "LaTeX manuscript root",
      "LaTeX bibliography files",
      "venue constraints",
    ],
    artifactOutputs: [
      "paper outline",
      "scoped manuscript patch",
      "citation-key warnings",
      "revision plan",
      "disclosure notes",
    ],
    humanCheckpoints: ["approve contribution claim, target venue assumptions, and manuscript mutation scope"],
  },
  {
    id: "academic-paper-reviewer",
    title: "Academic Paper Reviewer",
    description:
      "ARS-derived skill for multi-perspective manuscript critique, methodology review, revision-risk analysis, and re-review.",
    sourcePath: "skills/academic-paper-reviewer/SKILL.md",
    origin: "ars-derived",
    provenance: arsProvenance("academic-paper-reviewer"),
    mutationMode: "read_only",
    artifactInputs: ["manuscript root or draft export", "research brief", "source manifest", "claim register"],
    artifactOutputs: ["review package", "editorial decision rationale", "methodology risks", "revision candidates"],
    humanCheckpoints: ["choose which critiques become revision tasks"],
  },
  {
    id: "academic-pipeline",
    title: "Academic Pipeline",
    description:
      "ARS-derived orchestrator for research-to-paper workflows, integrity gates, review, revision, and handoff.",
    sourcePath: "skills/academic-pipeline/SKILL.md",
    origin: "ars-derived",
    provenance: arsProvenance("academic-pipeline"),
    mutationMode: "artifact_mutation",
    artifactInputs: [
      "research brief",
      "source manifest",
      "claim register",
      "LaTeX manuscript root",
      "review package",
      "revision matrix",
    ],
    artifactOutputs: ["pipeline stage note", "skill dispatch recommendation", "integrity checkpoint list"],
    humanCheckpoints: ["approve each major transition between research, writing, review, revision, and export"],
  },
  {
    id: "research-workflow-router",
    title: "Research Workflow Router",
    description: "Selects the right research workflow and artifact set for the user's current research task.",
    sourcePath: "skills/research-workflow-router/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "routing",
    artifactInputs: ["research brief", "source manifest", "claim register", "manuscript root"],
    artifactOutputs: ["workflow selection note", "next skill recommendation", "artifact readiness notes"],
    humanCheckpoints: ["confirm workflow choice before changing project artifacts"],
  },
  {
    id: "research-question-scope",
    title: "Research Question Scope",
    description: "Turns a vague research direction into scoped questions, assumptions, and decision points.",
    sourcePath: "skills/research-question-scope/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "planning",
    artifactInputs: ["research brief", "method notes", "known constraints"],
    artifactOutputs: ["scoped question set", "assumption list", "method checkpoint"],
    humanCheckpoints: ["approve final question and method boundaries"],
  },
  {
    id: "literature-review",
    title: "Literature Review",
    description: "Organizes source-backed literature review work around manifests, evidence gaps, and synthesis.",
    sourcePath: "skills/literature-review/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "artifact_mutation",
    artifactInputs: ["source manifest", "bibliography state", "research brief"],
    artifactOutputs: ["literature synthesis notes", "source gap list", "candidate claim support"],
    humanCheckpoints: ["approve source inclusion and exclusion decisions"],
  },
  {
    id: "paper-planning",
    title: "Paper Planning",
    description: "Plans a research paper structure, argument flow, contribution framing, and artifact-backed sections.",
    sourcePath: "skills/paper-planning/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "planning",
    artifactInputs: ["research brief", "claim register", "source manifest", "venue constraints"],
    artifactOutputs: ["paper outline", "section intent map", "claim placement plan"],
    humanCheckpoints: ["approve thesis, contribution framing, and outline"],
  },
  {
    id: "latex-paper-authoring",
    title: "LaTeX Paper Authoring",
    description: "Helps draft, edit, and diagnose LaTeX manuscripts within explicit user-authorized scopes.",
    sourcePath: "skills/latex-paper-authoring/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "scoped_mutation",
    artifactInputs: [
      "LaTeX manuscript root",
      "LaTeX bibliography files",
      "LaTeX figure paths",
      "LaTeX table paths",
      "bibliography state",
      "claim register",
      "LaTeX build report",
    ],
    artifactOutputs: ["scoped manuscript patch", "citation and label notes", "build diagnosis", "build report update"],
    humanCheckpoints: ["approve manuscript scope before edits and review final text before use"],
  },
  {
    id: "manuscript-review",
    title: "Manuscript Review",
    description: "Provides read-only critique of manuscripts, structure, argument support, and reviewer risks.",
    sourcePath: "skills/manuscript-review/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "read_only",
    artifactInputs: ["manuscript root or draft export", "research brief", "claim register", "source manifest"],
    artifactOutputs: ["review package", "risk list", "revision candidates"],
    humanCheckpoints: ["decide which critiques become revision work"],
  },
  {
    id: "citation-claim-integrity",
    title: "Citation Claim Integrity",
    description: "Checks whether claims are supported by cited sources and records unresolved evidence risks.",
    sourcePath: "skills/citation-claim-integrity/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "read_only",
    artifactInputs: ["claim register", "source manifest", "bibliography state", "manuscript root"],
    artifactOutputs: ["claim support warnings", "citation gap list", "integrity report"],
    humanCheckpoints: ["decide whether to revise, remove, or further support flagged claims"],
  },
  {
    id: "revision-matrix-planning",
    title: "Revision Matrix Planning",
    description: "Converts review feedback into traceable revisions, owner decisions, and response planning.",
    sourcePath: "skills/revision-matrix-planning/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "artifact_mutation",
    artifactInputs: ["review package", "manuscript root", "claim register", "decision notes"],
    artifactOutputs: ["revision matrix", "response plan", "change-risk notes"],
    humanCheckpoints: ["approve response stance and manuscript mutation plan"],
  },
  {
    id: "research-artifact-handoff",
    title: "Research Artifact Handoff",
    description: "Packages research state for another agent or human with provenance, blockers, and next actions.",
    sourcePath: "skills/research-artifact-handoff/SKILL.md",
    origin: "devnexus-original",
    mutationMode: "artifact_mutation",
    artifactInputs: ["research brief", "source manifest", "claim register", "review package", "revision matrix"],
    artifactOutputs: ["handoff summary", "artifact inventory", "open blocker list"],
    humanCheckpoints: ["confirm what can be shared and what remains private or unresolved"],
  },
];

export function devNexusResearchSkillById(id: DevNexusResearchSkillId): DevNexusResearchSkillRecord {
  return devNexusResearchSkills.find((skill) => skill.id === id)!;
}
