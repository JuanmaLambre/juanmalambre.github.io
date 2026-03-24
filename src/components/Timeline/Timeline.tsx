import { useLanguage } from "../../hooks/useLanguage";
import { experience } from "../../data/experience";
import { SectionHeader } from "../SectionHeader";
import { motion } from "framer-motion";

export function Timeline() {
  const { lang, t } = useLanguage();

  return (
    <section id="experience" className="mb-20">
      <SectionHeader title={t.experience.title} />

      <div className="flex flex-col">
        {experience.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex gap-6 relative pb-8"
          >
            {/* Left: dot + line */}
            <div className="flex flex-col items-center w-4 shrink-0 pt-[5px]">
              <div
                className="w-[10px] h-[10px] rounded-full border-2 border-primary bg-background shrink-0"
                style={{ boxShadow: "0 0 10px color-mix(in srgb, var(--color-primary) 50%, transparent)" }}
              />
              {i < experience.length - 1 && <div className="w-px flex-1 bg-border mt-[6px]" />}
            </div>

            {/* Right: content */}
            <div className="pb-2">
              <p className="font-mono text-[0.65rem] text-secondary mb-[3px]">{entry.period[lang]}</p>
              <p className="font-display font-bold text-[0.95rem] text-foreground">{entry.title[lang]}</p>
              <p className="font-mono text-[0.7rem] text-primary mb-2">{entry.org}</p>
              <p className="text-[0.82rem] text-muted leading-[1.55]">{entry.description[lang]}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
