export type EntryType = "work" | "education";

export interface ExperienceEntry {
  id: string;
  type: EntryType;
  title: { es: string; en: string };
  org: string;
  period: { es: string; en: string };
  description: { es: string; en: string };
}

export const experience: ExperienceEntry[] = [
  {
    id: "amalgama",
    type: "work",
    title: { es: "Ingeniero Full Stack", en: "Full Stack Engineer" },
    org: "The Amalgama",
    period: { es: "Agosto 2024 – Actualidad", en: "August 2024 – Present" },
    description: {
      es: "Desarrollo full stack de webapp (Opex Fit) con mantenimiento de arquitectura cloud.",
      en: "Full stack development of web app (Opex Fit) with cloud architecture maintenance.",
    },
  },
  {
    id: "uba-physics",
    type: "work",
    title: { es: "Animaciones de Física @ UBATIC (UBA)", en: "Physics Animations @ UBATIC (UBA)" },
    org: "Universidad de Buenos Aires",
    period: { es: "Actualidad", en: "Present" },
    description: {
      es: "Diseño y desarrollo de animaciones para la materia Física I de la Facultad de Ingeniería. Escenas 3D, modelos matemáticos resueltos numéricamente y animaciones dinámicas parametrizadas por el usuario.",
      en: "Design & development of animations for the Physics I course at the Faculty of Engineering. 3D scenes, numerically solved mathematical models and user-parameterized dynamic animations.",
    },
  },
  {
    id: "citep-vr",
    type: "work",
    title: { es: "Desarrollo VR @ CITEP (UBA)", en: "VR Development @ CITEP (UBA)" },
    org: "Universidad de Buenos Aires",
    period: { es: "Marzo 2023 – Septiembre 2023", en: "March 2023 – September 2023" },
    description: {
      es: "Diseño y desarrollo freelance de apps web VR interactivas con Three.js, para uso en cursos universitarios.",
      en: "Freelance design & development of interactive VR web apps using Three.js, intended for university courses.",
    },
  },
  {
    id: "ypf",
    type: "work",
    title: { es: "Proyecto Raspadita @ YPF", en: "Scratchcard Project @ YPF" },
    org: "YPF",
    period: { es: "2022", en: "2022" },
    description: {
      es: "Desarrollo de una raspadita digital interactiva con WebGL para campaña de marketing de YPF.",
      en: "Development of an interactive digital scratchcard with WebGL for a YPF marketing campaign.",
    },
  },
  {
    id: "mercadolibre",
    type: "work",
    title: { es: "Ingeniero de Software", en: "Software Engineer" },
    org: "Mercado Libre",
    period: { es: "2020 – 2022", en: "2020 – 2022" },
    description: {
      es: "Desarrollo backend de servicios de alta escala en la plataforma de e-commerce más grande de Latinoamérica.",
      en: "Backend development of high-scale services on the largest e-commerce platform in Latin America.",
    },
  },
  {
    id: "uba-degree",
    type: "education",
    title: { es: "Licenciatura en Ciencias de la Computación", en: "Computer Science Degree" },
    org: "Universidad de Buenos Aires (UBA)",
    period: { es: "2012 – En curso", en: "2012 – In progress" },
    description: {
      es: "Facultad de Ciencias Exactas y Naturales.",
      en: "Faculty of Exact and Natural Sciences.",
    },
  },
];
