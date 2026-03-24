import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";

export function Sidebar() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, t, toggle: toggleLang } = useLanguage();

  const links = [
    { href: "#projects", label: t.nav.projects },
    { href: "#experience", label: t.nav.experience },
    { href: "#skills", label: t.nav.skills },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[300px] border-r border-border flex flex-col p-10 bg-background z-10 overflow-y-auto">
      <div className="flex-1">
        {/* Name */}
        <div className="font-display font-bold text-[1.6rem] leading-[1.1] text-foreground mb-1">
          Juan Manuel
          <br />
          <span className="text-primary">Lambre</span>
        </div>

        {/* Role */}
        <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-secondary mt-2 mb-8">{t.hero.role}</p>

        {/* Bio */}
        <div className="flex flex-col gap-2 mb-8 pl-4 border-l-2 border-primary">
          {t.about.bio.map((p, i) => (
            <p key={i} className="text-[0.85rem] leading-[1.7] text-muted">
              {p}
            </p>
          ))}
        </div>

        {/* Nav */}
        <ul className="flex flex-col gap-1 mb-10">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center gap-3 font-mono text-[0.75rem] text-muted hover:text-primary px-3 py-2 rounded-md hover:bg-primary/8 transition-all duration-150 group"
              >
                <span className="w-[5px] h-[5px] rounded-full bg-border group-hover:bg-primary transition-colors shrink-0" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: social links + toggles */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/juanmalambre"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] tracking-[0.1em] text-muted hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:juanmlambre@gmail.com"
            className="font-mono text-[0.65rem] tracking-[0.1em] text-muted hover:text-primary transition-colors"
          >
            Email
          </a>
          <a
            href="oldies/cv/en/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] tracking-[0.1em] text-muted hover:text-primary transition-colors"
          >
            CV
          </a>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="font-mono text-[0.65rem] text-muted hover:text-primary border border-border hover:border-primary px-2 py-1 rounded transition-all"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="font-mono text-[0.65rem] text-muted hover:text-primary border border-border hover:border-primary px-2 py-1 rounded transition-all"
          >
            {theme === "dark" ? "○ dark" : "● light"}
          </button>
        </div>
      </div>
    </aside>
  );
}
