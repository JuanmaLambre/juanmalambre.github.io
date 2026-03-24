import { motion } from "framer-motion";
import type { Project } from "../../data/projects";
import type { Lang } from "../../hooks/useLanguage";

interface Props {
  project: Project
  lang: Lang
  viewLabel: string
  onOpen: (slug: string) => void
  index: number
}

export function ProjectCard({ project, lang, viewLabel, onOpen, index }: Props) {
  return (
    <motion.article
      onClick={() => onOpen(project.slug)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="bg-surface border border-border rounded-xl p-5 cursor-pointer hover:border-primary/50 transition-all duration-200 group"
      style={{ boxShadow: "0 0 0 transparent", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 30px color-mix(in srgb, var(--color-primary) 10%, transparent)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
      }}
    >
      <p className="font-mono text-[0.6rem] text-secondary mb-1">
        {String(index + 1).padStart(2, "0")}
      </p>

      <h3 className="font-display font-bold text-[1rem] text-foreground mb-1 leading-snug">
        {project.title[lang]}
      </h3>

      <p className="text-[0.8rem] text-muted leading-[1.5] mb-4">
        {project.description[lang]}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="font-mono text-[0.6rem] text-secondary border border-secondary/25 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <span className="font-mono text-[0.7rem] text-primary group-hover:underline">
        {viewLabel} →
      </span>
    </motion.article>
  );
}
