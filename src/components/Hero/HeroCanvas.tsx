import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !containerRef.current) return;

    let p5Instance: { remove: () => void } | null = null;

    const load = async () => {
      const p5 = (await import("p5")).default;

      p5Instance = new p5((p: InstanceType<typeof p5>) => {
        const particles: Array<{
          x: number; y: number; vx: number; vy: number; r: number; alpha: number
        }> = [];
        const COUNT = 80;

        p.setup = () => {
          const canvas = p.createCanvas(
            containerRef.current!.offsetWidth,
            containerRef.current!.offsetHeight,
          );
          canvas.parent(containerRef.current!);
          p.colorMode(p.HSB, 360, 100, 100, 100);

          for (let i = 0; i < COUNT; i++) {
            particles.push({
              x: p.random(p.width),
              y: p.random(p.height),
              vx: p.random(-0.3, 0.3),
              vy: p.random(-0.6, -0.1),
              r: p.random(1.5, 4),
              alpha: p.random(20, 60),
            });
          }
        };

        p.draw = () => {
          p.clear();
          particles.forEach(pt => {
            // Magenta-ish hue: ~310–330
            const hue = 315 + p.sin(p.frameCount * 0.005 + pt.x) * 15;
            p.noStroke();
            p.fill(hue, 55, 90, pt.alpha);
            p.circle(pt.x, pt.y, pt.r * 2);

            pt.x += pt.vx + p.noise(pt.x * 0.003, pt.y * 0.003, p.frameCount * 0.002) * 0.6 - 0.3;
            pt.y += pt.vy;

            if (pt.y < -10) {
              pt.y = p.height + 10;
              pt.x = p.random(p.width);
            }
            if (pt.x < -10) pt.x = p.width + 10;
            if (pt.x > p.width + 10) pt.x = -10;
          });
        };

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
          }
        };
      });
    };

    const timer = setTimeout(load, 400);
    return () => {
      clearTimeout(timer);
      p5Instance?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}
