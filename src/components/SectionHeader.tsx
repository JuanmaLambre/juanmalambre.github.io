import { motion } from "framer-motion";

export function SectionHeader({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 mb-10"
    >
      <h2 className="font-display font-bold text-[1.5rem] sm:text-[1.8rem] text-foreground">{title}</h2>
      <div className="h-px flex-1 bg-border" />
    </motion.div>
  );
}
