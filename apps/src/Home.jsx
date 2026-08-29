import { Layout } from "./shared/Layout";
import { apps, appUrl } from "./shared/apps";

export function Home() {
  return (
    <Layout title="Apps" subtitle="Cosas para jugar un rato" showBack={false}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {apps.map((app) => (
          <li key={app.slug}>
            <a
              href={appUrl(app.slug)}
              className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
            >
              <span className="text-3xl">{app.emoji}</span>
              <h2 className="mt-3 text-lg font-medium">{app.title}</h2>
              <p className="mt-1 text-sm text-muted">{app.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
