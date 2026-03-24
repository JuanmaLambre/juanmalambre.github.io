import { useLanguage } from "../../hooks/useLanguage";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-6 border-t border-border text-center">
      <p className="font-mono text-xs text-muted">
        {t.footer.made}{" "}
        <span className="text-primary">♥</span>{" "}
        {t.footer.by}
      </p>
    </footer>
  );
}
