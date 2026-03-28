export type SkillCategory = "frontend" | "backend" | "3d" | "tools";

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5; // 1 = básico, 5 = experto
  category: SkillCategory;
  pos: { x: number; y: number }; // posición en la nube (% del contenedor)
}

export const skills: Skill[] = [
  { name: "React",      level: 5, category: "frontend", pos: { x: 22, y: 28 } },
  { name: "JavaScript", level: 5, category: "frontend", pos: { x: 55, y: 65 } },
  { name: "TypeScript", level: 4, category: "frontend", pos: { x: 74, y: 20 } },
  { name: "Three.js",   level: 4, category: "3d",       pos: { x: 20, y: 70 } },
  { name: "Node.js",    level: 4, category: "backend",  pos: { x: 48, y: 85 } },
  { name: "p5.js",      level: 4, category: "3d",       pos: { x: 42, y: 12 } },
  { name: "GLSL",       level: 3, category: "3d",       pos: { x: 82, y: 48 } },
  { name: "Python",     level: 3, category: "backend",  pos: { x: 33, y: 48 } },
  { name: "PostgreSQL", level: 3, category: "backend",  pos: { x: 64, y: 34 } },
  { name: "Docker",     level: 2, category: "tools",    pos: { x: 10, y: 50 } },
  { name: "AWS",        level: 2, category: "backend",  pos: { x: 88, y: 76 } },
];
