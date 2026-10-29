// Single source of truth for the app catalog: feeds the home page and the links
// between pages. The `slug` must match the folder name inside src/.
export const apps = [
  {
    slug: "truco",
    title: "Truco",
    description: "Anotador con fósforos hasta 30: quince malas y quince buenas.",
    emoji: "🧉",
  },
  {
    slug: "codigo-secreto",
    title: "Código Secreto",
    description: "Tablero configurable para el Código Secreto.",
    emoji: "🃏",
  },
  {
    slug: "hacemos-numeros",
    title: "Hacemos números",
    description: "Dividir la cuenta en partes iguales, con gastos que se reparten sólo entre algunos.",
    emoji: "🧾",
  },
  {
    slug: "candado",
    title: "Candado",
    description: "Deducí el número secreto a partir de pistas. Partidas nuevas siempre, con solución única.",
    emoji: "🔐",
  },
];

export const appUrl = (slug) => `${import.meta.env.BASE_URL}${slug}/`;
export const homeUrl = () => import.meta.env.BASE_URL;
