import { motion } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLanguage } from "../../hooks/useLanguage";
import { HeroCanvas } from "./HeroCanvas";
import { CvDocument } from "../CvDocument";

export function Hero() {
  const { lang, t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      <HeroCanvas />

      {/* Radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent)",
        }}
      />

      <div className="relative z-10 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-mono text-sm text-secondary tracking-widest uppercase mb-4"
        >
          {t.hero.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="font-display font-extrabold text-[clamp(3rem,10vw,8rem)] leading-none tracking-tight text-foreground"
        >
          {"Juan Manuel "}
          <span
            className="text-primary"
            style={{ textShadow: "0 0 40px color-mix(in srgb, var(--color-primary) 50%, transparent)" }}
          >
            Lambre
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-6 text-xl text-muted font-body max-w-lg mx-auto"
        >
          {t.hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary text-primary font-body font-medium hover:bg-primary hover:text-white transition-all duration-200 glow-primary"
          >
            {t.hero.cta}
            <span className="text-lg">↓</span>
          </motion.a>

          <PDFDownloadLink document={<CvDocument lang={lang} />} fileName={`juan-manuel-lambre-cv-${lang}.pdf`}>
            {({ loading }) => (
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border text-muted font-body font-medium hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer"
              >
                {loading ? "..." : t.hero.downloadPdf}
                <span className="text-base">↓</span>
              </motion.span>
            )}
          </PDFDownloadLink>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-primary to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
