new p5((s) => {
  const { cos, sin } = Math;
  const paused = new URLSearchParams(window.location.search).get("paused") != null;

  let d = 39;
  let n = 1.95;

  s.setup = function () {
    const canvas = document.getElementById("maurer-canvas");
    if (!canvas) return;

    const { clientWidth: width, clientHeight: height } = canvas;
    s.createCanvas(width, height, "2d", canvas);

    s.noFill();
  };

  s.draw = function () {
    if (paused) {
      n = 6;
      d = 71;
    }

    s.translate(s.width / 2, s.height / 2);
    s.background(0);

    s.beginShape();
    for (let i = 0; i <= 360; i += 1) {
      const k = i * d;

      const r = ((s.height * 0.9) / 2) * sin(s.radians(n * k));
      const theta = s.radians(k);

      s.stroke(0, 255, 255, 150);

      const x = r * cos(theta);
      const y = r * sin(theta);
      s.vertex(x, y);
    }
    s.endShape();

    n += 0.000051;

    if (paused) s.noLoop();
  };
});
