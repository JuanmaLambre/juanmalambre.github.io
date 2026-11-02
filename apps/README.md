# apps

React + Vite + Tailwind (plain JavaScript, no TypeScript). It is a project of its own,
separate from the main site: install and build it from this folder.

```bash
nvm use      # Node 26, see .nvmrc
yarn install
yarn dev      # http://localhost:5173/apps/
yarn build    # writes index.html + assets/ and one self-contained folder per app right here
yarn lint
yarn test    # node --test, sólo la lógica (sin DOM)
```

The build is served as part of GitHub Pages under `/apps/`, so Vite's `base` is
`/apps/`. `yarn build` (`scripts/build.js`) builds each page on its own and writes it
where Pages serves it — what gets committed is that output. Each app's JS, CSS and
favicon are inlined, so `<slug>/index.html` is a single file that also works downloaded.
The home page is a regular build: `index.html` plus its files in `assets/`.

Import workers with `?worker&inline` (`import MyWorker from "./worker.js?worker&inline"`):
`new Worker(new URL(...))` would load a separate file, which browsers refuse from `file://`.

## Adding an app

1. Create `src/my-app/` with an `index.html` (copy an existing one and change the
   `<title>`), a `main.jsx` and the component.
2. Add it to `src/shared/apps.js` so it shows up on the home page.

No need to touch the build config: `scripts/build.js` treats any folder under `src/`
with an `index.html` as a page, and the build emits `/apps/my-app/index.html`.

## Structure

```
src/
  index.html, main.jsx, Home.jsx   → /apps/
  candado/                         → /apps/candado/ (adivinar un número con pistas)
  codigo-secreto/                  → /apps/codigo-secreto/
  hacemos-numeros/                 → /apps/hacemos-numeros/ (dividir la cuenta, en localStorage)
  truco/                           → /apps/truco/ (anotador, puntos en localStorage)
  shared/                          Layout, app catalog, mount helper, seeded random
  styles/index.css                 Tailwind + color tokens
```
