import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-12"
        >
          {/* Profile photo placeholder */}
          <div className="shrink-0">
            <div className="w-36 h-36 rounded-2xl bg-surface border border-border flex items-center justify-center overflow-hidden glow-primary">
              <span className="font-display font-bold text-4xl text-primary">JML</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="font-display font-bold text-4xl text-foreground mb-6">{t.about.title}</h2>
            <p className="text-lg text-muted leading-relaxed font-body">{t.about.bio}</p>

            {/* Social links */}
            <div className="flex gap-4 mt-8">
              <a
                href="https://github.com/juanmalambre"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-secondary hover:text-primary transition-colors border border-border hover:border-primary px-4 py-2 rounded-full"
              >
                GitHub
              </a>
              <a
                href="mailto:juanmlambre@gmail.com"
                className="font-mono text-sm text-secondary hover:text-primary transition-colors border border-border hover:border-primary px-4 py-2 rounded-full"
              >
                Email
              </a>
              <a
                href="oldies/cv/en/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-secondary hover:text-primary transition-colors border border-border hover:border-primary px-4 py-2 rounded-full"
              >
                CV
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
