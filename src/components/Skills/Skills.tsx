import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";
import { skills } from "../../data/skills";
import { SectionHeader } from "../SectionHeader";

const SIZES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "0.75rem",
  2: "1rem",
  3: "1.3rem",
  4: "1.7rem",
  5: "2.2rem",
};

const OPACITIES: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 0.35,
  2: 0.5,
  3: 0.65,
  4: 0.82,
  5: 1,
};

export function Skills() {
  const { t } = useLanguage();

  const sortedSkills = skills.sort((a, b) => b.level - a.level);

  return (
    <section id="skills" className="mb-20">
      <SectionHeader title={t.skills.title} />

      {/* Mobile: tag list */}
      <div className="md:hidden flex flex-wrap gap-2 justify-center">
        {sortedSkills.map((skill) => (
          <span
            key={skill.name}
            className="font-mono text-sm text-muted px-3 py-1.5 rounded-full border border-border hover:text-primary hover:border-primary transition-colors cursor-default"
          >
            {skill.name}
          </span>
        ))}
      </div>

      {/* Desktop: word cloud */}
      <motion.div
        className="hidden md:block relative w-full"
        style={{ height: "220px" }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {skills.map((skill) => {
          const pos = skill.pos;
          return (
            <motion.span
              key={skill.name}
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                show: {
                  opacity: OPACITIES[skill.level],
                  scale: 1,
                  transition: { duration: 0.4 },
                },
              }}
              whileHover={{ opacity: 1 }}
              transformTemplate={(_v, generated) => `translate(-50%, -50%) ${generated}`}
              style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                fontSize: SIZES[skill.level],
              }}
              className="font-mono text-muted hover:text-primary transition-colors duration-150 cursor-default select-none whitespace-nowrap"
            >
              {skill.name}
            </motion.span>
          );
        })}
      </motion.div>
    </section>
  );
}
