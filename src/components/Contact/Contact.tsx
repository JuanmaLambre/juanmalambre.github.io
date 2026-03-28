import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";
import { SectionHeader } from "../SectionHeader";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="mb-16">
      <SectionHeader title={t.nav.contact} />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="font-display font-bold text-[1.5rem] sm:text-[2rem] leading-tight text-foreground mb-4"
      >
        {t.contact.title.split(" ").map((word, i, arr) =>
          i === arr.length - 1
            ? <span key={i} className="text-primary">{word} </span>
            : <span key={i}>{word} </span>
        )}
      </motion.p>

      <motion.a
        href={`mailto:${t.contact.email}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="font-mono text-[0.9rem] text-secondary hover:text-primary border-b border-secondary hover:border-primary pb-px transition-colors"
      >
        {t.contact.email}
      </motion.a>
    </section>
  );
}
