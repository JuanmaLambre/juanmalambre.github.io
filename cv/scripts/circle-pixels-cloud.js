const NOISE_ZOOM = 0.1;
const GRID_DISCRETIZATION = 12;
const NOISE_THRESHOLD = 0.5; // -1 to 1
const SPEED = 1 / 2000;

new p5((s) => {
  const { PI, cos, sin } = Math;

  s.setup = function () {
    const canvas = document.getElementById("circle-cloud");
    const { clientWidth: width, clientHeight: height } = canvas;
    s.createCanvas(width, height, "2d", canvas);

    s.stroke(255);
    s.colorMode(s.RGB);
  };

  s.draw = function () {
    const { width, height, map, noise } = s;
    const t = s.millis() * SPEED;

    s.background(0);
    s.noStroke();

    for (let x = 0; x < width; x += GRID_DISCRETIZATION) {
      for (let y = 0; y < height; y += GRID_DISCRETIZATION) {
        // const circleRadius = GRID_DISCRETIZATION * (1 + Math.sin((t / 2) * 2 * PI) / 2);
        const circleRadius = GRID_DISCRETIZATION * (1 + sin(PI * (t - x / width)) / 2);

        const rNoise = noise(cos(t), x / NOISE_ZOOM, y / NOISE_ZOOM / 1000);
        if (rNoise > NOISE_THRESHOLD) {
          const alpha = map(rNoise, NOISE_THRESHOLD, 1, 0, 230);
          s.fill(200, 0, 120, alpha);
          s.circle(x, y, circleRadius);
        }

        const bNoise = noise(cos(t) + 100, x / NOISE_ZOOM, y / NOISE_ZOOM / 1000);
        if (bNoise > NOISE_THRESHOLD) {
          const alpha = map(bNoise, NOISE_THRESHOLD, 1, 0, 250);
          s.fill(0, 120, 200, alpha);
          s.circle(x, y, circleRadius);
        }

        const gNoise = noise(cos(t) + 200, x / NOISE_ZOOM, y / NOISE_ZOOM / 1000);
        if (gNoise > NOISE_THRESHOLD) {
          const alpha = map(gNoise, NOISE_THRESHOLD, 1, 0, 170);
          s.fill(0, 200, 0, alpha);
          s.circle(x, y, circleRadius);
        }
      }
    }

    if (paused) s.noLoop();
  };
});
