import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { projects } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { SectionHeader } from "../SectionHeader";

export function ProjectsGrid() {
  const { lang, t } = useLanguage();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openProject = projects.find(p => p.slug === openSlug) ?? null;

  return (
    <section id="projects" className="mb-20">
      <SectionHeader title={t.projects.title} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            lang={lang}
            viewLabel={t.projects.viewProject}
            onOpen={setOpenSlug}
            index={i}
          />
        ))}
      </div>

      <ProjectDetail
        project={openProject}
        lang={lang}
        labels={{
          liveDemo: t.projects.liveDemo,
          sourceCode: t.projects.sourceCode,
          close: t.projects.close,
        }}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}
