import { homeUrl } from "./apps";

export function Layout({ title, subtitle, showBack = true, children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-baseline gap-4 px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          {showBack && (
            <a href={homeUrl()} className="ml-auto text-sm text-primary hover:underline">
              ← Volver
            </a>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
