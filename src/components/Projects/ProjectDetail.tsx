import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../../data/projects";
import type { Lang } from "../../hooks/useLanguage";

interface Props {
  project: Project | null
  lang: Lang
  labels: { liveDemo: string; sourceCode: string; close: string }
  onClose: () => void
}

export function ProjectDetail({ project, lang, labels, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 z-50 bg-surface border border-border rounded-2xl overflow-hidden flex flex-col"
            style={{ boxShadow: "0 0 60px color-mix(in srgb, var(--color-primary) 20%, transparent)" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border shrink-0">
              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-display font-bold text-2xl md:text-3xl text-foreground"
                >
                  {project.title[lang]}
                </motion.h2>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-2 py-0.5 rounded-full border border-secondary/30 text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label={labels.close}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted hover:text-primary hover:border-primary transition-colors ml-4"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
              <p className="text-muted font-body leading-relaxed">
                {project.longDescription[lang]}
              </p>

              {/* Links */}
              <div className="flex gap-3 flex-wrap">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm px-5 py-2 rounded-full bg-primary text-white hover:opacity-90 transition-opacity"
                  >
                    {labels.liveDemo} ↗
                  </a>
                )}
                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm px-5 py-2 rounded-full border border-border text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    {labels.sourceCode}
                  </a>
                )}
              </div>

              {/* Iframe embed */}
              {project.iframeEmbeddable && project.liveUrl && (
                <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border border-border">
                  <iframe
                    src={project.liveUrl}
                    title={project.title[lang]}
                    className="w-full h-full min-h-[400px]"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
