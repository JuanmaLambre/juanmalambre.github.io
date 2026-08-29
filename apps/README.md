# apps

React + Vite + Tailwind (plain JavaScript, no TypeScript). It is a project of its own,
separate from the main site: install and build it from this folder.

```bash
yarn install
yarn dev      # http://localhost:5173/apps/
yarn build    # writes index.html, assets/ and one folder per app right here
yarn lint
```

The build is served as part of GitHub Pages under `/apps/`, so Vite's `base` is
`/apps/`. `yarn build` compiles into `dist/`, copies the result into this folder and
removes `dist/` — what gets committed is the output already sitting where Pages
serves it.

## Adding an app

1. Create `src/my-app/` with an `index.html` (copy an existing one and change the
   `<title>`), a `main.jsx` and the component.
2. Add it to `src/shared/apps.js` so it shows up on the home page.

No need to touch `vite.config.js`: it treats any folder under `src/` with an
`index.html` as a page, and the build emits `/apps/my-app/index.html`.

## Structure

```
src/
  index.html, main.jsx, Home.jsx   → /apps/
  codigo-secreto/                    → /apps/codigo-secreto/
  shared/                          Layout, app catalog, mount helper
  styles/index.css                 Tailwind + color tokens
```
