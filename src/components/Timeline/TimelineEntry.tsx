import { motion } from "framer-motion";
import type { ExperienceEntry } from "../../data/experience";
import type { Lang } from "../../hooks/useLanguage";

interface Props {
  entry: ExperienceEntry;
  lang: Lang;
  presentLabel: string;
  index: number;
}

export function TimelineEntry({ entry, lang, index }: Props) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`relative md:w-[calc(50%-2rem)] ${isLeft ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8 md:text-left"}`}
    >
      {/* Dot on timeline */}
      <div
        className={`hidden md:block absolute top-4 w-3 h-3 rounded-full border-2 border-primary bg-background ${
          isLeft ? "-right-[1.65rem]" : "-left-[1.65rem]"
        }`}
        style={{ boxShadow: "0 0 10px color-mix(in srgb, var(--color-primary) 60%, transparent)" }}
      />

      <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors duration-200">
        <div
          className="flex items-center gap-2 mb-1 md:justify-end"
          style={{ flexDirection: isLeft ? "row-reverse" : "row" }}
        >
          <span className="text-xs font-mono text-secondary">{entry.type === "work" ? "◈" : "◇"}</span>
          <span className="text-xs font-mono text-muted">{entry.period[lang]}</span>
        </div>
        <h3 className="font-display font-bold text-foreground text-base leading-snug">{entry.title[lang]}</h3>
        <p className="font-mono text-xs text-primary mt-0.5">{entry.org}</p>
        <p className="text-sm text-muted mt-2 leading-relaxed font-body">{entry.description[lang]}</p>
      </div>
    </motion.div>
  );
}
