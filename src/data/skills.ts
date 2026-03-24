export type SkillCategory = "frontend" | "backend" | "3d" | "tools";

export interface Skill {
  name: string;
  category: SkillCategory;
}

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "HTML / CSS", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  // 3D / Creative
  { name: "Three.js", category: "3d" },
  { name: "WebGL", category: "3d" },
  { name: "p5.js", category: "3d" },
  { name: "GLSL", category: "3d" },
  { name: "Arte generativo", category: "3d" },
  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "AWS", category: "backend" },
  // Tools
  { name: "Git", category: "tools" },
  { name: "Vite", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Figma", category: "tools" },
];
