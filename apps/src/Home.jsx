import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Layout } from "./shared/Layout";
import { apps, appUrl } from "./shared/apps";

export function Home() {
  return (
    <Layout title="Apps" showBack={false}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {apps.map((app) => (
          <li key={app.slug} className="relative">
            <a
              href={appUrl(app.slug)}
              className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
            >
              <span className="text-3xl">{app.emoji}</span>
              <h2 className="mt-3 text-lg font-medium">{app.title}</h2>
              <p className="mt-1 text-sm text-muted">{app.description}</p>
            </a>
            <a
              href={appUrl(app.slug)}
              download={`${app.slug}.html`}
              title="Descargar para usar sin conexión"
              aria-label={`Descargar ${app.title} para usar sin conexión`}
              className="absolute top-4 right-4 rounded-lg p-2 text-muted hover:bg-background hover:text-primary"
            >
              <ArrowDownTrayIcon className="size-5" />
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
