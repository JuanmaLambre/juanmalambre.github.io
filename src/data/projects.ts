export interface Project {
  slug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  longDescription: { es: string; en: string };
  tags: string[];
  thumbnail: string;
  liveUrl?: string;
  sourceUrl?: string;
  iframeEmbeddable: boolean;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "uba-physics",
    title: { es: "Animaciones de Física (UBA)", en: "Physics Animations (UBA)" },
    description: {
      es: "Simulaciones físicas interactivas 3D para cursos universitarios.",
      en: "Interactive 3D physics simulations for university courses.",
    },
    longDescription: {
      es: "Conjunto de animaciones interactivas para la materia Física I de la Facultad de Ingeniería de la UBA. Incluye un sistema de resorte-masa, laboratorio de micro-biología en VR, cúpula geodésica y herramientas de topografía. Desarrolladas con Three.js y modelos matemáticos resueltos numéricamente.",
      en: "A set of interactive animations for the Physics I course at UBA's Faculty of Engineering. Includes a spring-mass system, VR micro-biology laboratory, geodesic dome, and surveying tools. Built with Three.js and numerically solved mathematical models.",
    },
    tags: ["Three.js", "WebGL", "VR", "Matemática", "JavaScript"],
    thumbnail: "/thumbnails/uba-physics.png",
    liveUrl: "oldies/uba/resorte/index.html",
    iframeEmbeddable: true,
  },
  {
    slug: "kaleidoscope",
    title: { es: "Caleidoscopio", en: "Kaleidoscope" },
    description: {
      es: "Caleidoscopio generativo en tiempo real con canvas.",
      en: "Real-time generative kaleidoscope using canvas.",
    },
    longDescription: {
      es: "Visualización generativa que crea patrones caleidoscópicos en tiempo real usando el API Canvas del navegador. El usuario puede interactuar con el patrón en movimiento.",
      en: "Generative visualization that creates real-time kaleidoscopic patterns using the browser's Canvas API. Users can interact with the moving pattern.",
    },
    tags: ["Canvas API", "JavaScript", "Arte generativo"],
    thumbnail: "/thumbnails/kaleidoscope.png",
    liveUrl: "oldies/kaleidoscope/index.html",
    iframeEmbeddable: true,
  },
  {
    slug: "raspadita",
    title: { es: "Raspadita Digital (YPF)", en: "Digital Scratchcard (YPF)" },
    description: {
      es: "Raspadita WebGL para campaña de marketing de YPF.",
      en: "WebGL scratchcard for a YPF marketing campaign.",
    },
    longDescription: {
      es: "Raspadita digital interactiva desarrollada para una campaña de marketing de YPF. Implementada con WebGL para una experiencia fluida y de alto rendimiento en dispositivos móviles y escritorio.",
      en: "Interactive digital scratchcard developed for a YPF marketing campaign. Implemented with WebGL for a smooth, high-performance experience on both mobile and desktop.",
    },
    tags: ["WebGL", "JavaScript", "Canvas", "Marketing"],
    thumbnail: "/thumbnails/raspadita.png",
    liveUrl: "oldies/raspadita-v2/index.html",
    iframeEmbeddable: true,
  },
];
