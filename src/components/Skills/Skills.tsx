import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";
import { skills } from "../../data/skills";
import { SectionHeader } from "../SectionHeader";

export function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills" className="mb-20">
      <SectionHeader title={t.skills.title} />

      <motion.div
        className="grid grid-cols-3 gap-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.name}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
            className="flex items-center gap-2 font-mono text-[0.72rem] text-muted px-3 py-2 border border-border rounded-md hover:text-primary hover:border-primary/40 transition-all duration-150 cursor-default"
          >
            <span className="w-1 h-1 rounded-full bg-secondary shrink-0" />
            {skill.name}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
