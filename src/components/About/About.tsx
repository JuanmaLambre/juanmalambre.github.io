import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";
import profilePic from "../../assets/profile.jpeg";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="lg:hidden px-6">
      <div className="max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-9"
        >
          {/* Profile photo placeholder */}
          <div className="shrink-0">
            <div className="w-full rounded-2xl bg-surface border border-border flex items-center justify-center overflow-hidden glow-primary">
              <img src={profilePic} />
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <h1 className="font-display font-extrabold text-4xl leading-none tracking-tight text-foreground">
              {"Juan Manuel "}
              <span
                className="text-primary"
                style={{ textShadow: "0 0 40px color-mix(in srgb, var(--color-primary) 50%, transparent)" }}
              >
                Lambre
              </span>
            </h1>

            {/* Bio */}
            <div>
              {t.about.bio.map((p) => (
                <p className="text-lg text-muted leading-relaxed font-body mb-2">{p}</p>
              ))}

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
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
