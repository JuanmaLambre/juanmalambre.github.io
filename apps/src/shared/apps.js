// Single source of truth for the app catalog: feeds the home page and the links
// between pages. The `slug` must match the folder name inside src/.
export const apps = [
  {
    slug: "codigo-secreto",
    title: "Código Secreto",
    description: "Tablero de 5x5 al azar: 9 casilleros para el que empieza, 8 para el otro.",
    emoji: "🃏",
  },
  {
    slug: "tricount",
    title: "Tricount",
    description: "Gastos compartidos de un grupo: quién debe cuánto y a quién para quedar a mano.",
    emoji: "🧾",
  },
  {
    slug: "truco",
    title: "Truco",
    description: "Anotador con fósforos hasta 30: quince malas y quince buenas.",
    emoji: "🧉",
  },
];

export const appUrl = (slug) => `${import.meta.env.BASE_URL}${slug}/`;
export const homeUrl = () => import.meta.env.BASE_URL;
